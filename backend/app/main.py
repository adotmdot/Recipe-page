from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, SessionLocal
from .models import Base, Recipe, User

from .schemas import (
    RecipeCreate,
    RecipeResponse,
    UserCreate,
    UserLogin,
    UserResponse
)

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    UploadFile,
    File
)

from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

from openai import OpenAI
from dotenv import load_dotenv

from passlib.context import CryptContext
from jose import jwt

import os
import re
import asyncio


load_dotenv()


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


SECRET_KEY = "supersecretkey"

ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


origins = [
    "http://localhost:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def hash_password(password: str):
    return pwd_context.hash(password[:72])


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(
        plain_password[:72],
        hashed_password
    )


@app.get("/")
def home():

    return {
        "message": "Charlene AI Recipes API Running"
    }


@app.get("/recipes", response_model=list[RecipeResponse])
def get_recipes(db: Session = Depends(get_db)):

    recipes = db.query(Recipe).all()

    return recipes


@app.post("/recipes", response_model=RecipeResponse)
def create_recipe(
    recipe: RecipeCreate,
    db: Session = Depends(get_db)
):

    new_recipe = Recipe(
        title=recipe.title,
        image=recipe.image,
        description=recipe.description,
        ingredients=recipe.ingredients,
        instructions=recipe.instructions,
        tips=recipe.tips
    )

    db.add(new_recipe)

    db.commit()

    db.refresh(new_recipe)

    return new_recipe


@app.put("/recipes/{recipe_id}", response_model=RecipeResponse)
def update_recipe(
    recipe_id: int,
    updated_recipe: RecipeCreate,
    db: Session = Depends(get_db)
):

    recipe = db.query(Recipe).filter(
        Recipe.id == recipe_id
    ).first()

    if not recipe:

        raise HTTPException(
            status_code=404,
            detail="Recipe not found"
        )

    recipe.title = updated_recipe.title
    recipe.image = updated_recipe.image
    recipe.description = updated_recipe.description
    recipe.ingredients = updated_recipe.ingredients
    recipe.instructions = updated_recipe.instructions
    recipe.tips = updated_recipe.tips

    db.commit()

    db.refresh(recipe)

    return recipe


@app.delete("/recipes/{recipe_id}")
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db)
):

    recipe = db.query(Recipe).filter(
        Recipe.id == recipe_id
    ).first()

    if not recipe:

        raise HTTPException(
            status_code=404,
            detail="Recipe not found"
        )

    db.delete(recipe)

    db.commit()

    return {
        "message": "Recipe deleted successfully"
    }


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    file_location = f"uploads/{file.filename}"

    with open(file_location, "wb") as buffer:

        buffer.write(await file.read())

    return {
        "image_url": f"https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/uploads/{file.filename}"
    }


@app.post("/generate-recipe")
async def generate_recipe(data: dict):

    ingredients = data.get("ingredients")

    prompt = f"""
Create a cooking recipe using these ingredients:
{ingredients}

Return the response EXACTLY in this format:

Recipe Name: [recipe title]

Description:
[short recipe description]

Ingredients:
- ingredient 1
- ingredient 2
- ingredient 3

Instructions:
1. Step one
2. Step two
3. Step three

Cooking Tips:
- tip 1
- tip 2

Cook Time:
[example: 25 minutes]

Difficulty:
[Easy, Medium, Hard]

Servings:
[example: 4 servings]

Calories:
[example: 450 calories]
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    recipe_text = response.choices[0].message.content

    title_match = re.search(
        r"Recipe Name:\s*(.*)",
        recipe_text
    )

    description_match = re.search(
        r"Description:\s*(.*?)\s*Ingredients:",
        recipe_text,
        re.DOTALL
    )

    ingredients_match = re.search(
        r"Ingredients:\s*(.*?)\s*Instructions:",
        recipe_text,
        re.DOTALL
    )

    instructions_match = re.search(
        r"Instructions:\s*(.*?)\s*Cooking Tips:",
        recipe_text,
        re.DOTALL
    )

    tips_match = re.search(
        r"Cooking Tips:\s*(.*?)\s*Cook Time:",
        recipe_text,
        re.DOTALL
    )

    cook_time_match = re.search(
        r"Cook Time:\s*(.*)",
        recipe_text
    )

    difficulty_match = re.search(
        r"Difficulty:\s*(.*)",
        recipe_text
    )

    servings_match = re.search(
        r"Servings:\s*(.*)",
        recipe_text
    )

    calories_match = re.search(
        r"Calories:\s*(.*)",
        recipe_text
    )

    return {

        "title": (
            title_match.group(1).strip()
            if title_match else ""
        ),

        "description": (
            description_match.group(1).strip()
            if description_match else ""
        ),

        "ingredients": (
            ingredients_match.group(1).strip()
            if ingredients_match else ""
        ),

        "instructions": (
            instructions_match.group(1).strip()
            if instructions_match else ""
        ),

        "tips": (
            tips_match.group(1).strip()
            if tips_match else ""
        ),

        "cook_time": (
            cook_time_match.group(1).strip()
            if cook_time_match else ""
        ),

        "difficulty": (
            difficulty_match.group(1).strip()
            if difficulty_match else ""
        ),

        "servings": (
            servings_match.group(1).strip()
            if servings_match else ""
        ),

        "calories": (
            calories_match.group(1).strip()
            if calories_match else ""
        ),
    }


class ChefChatRequest(BaseModel):

    message: str
    history: list = []


@app.post("/chef-chat")
async def chef_chat(data: ChefChatRequest):

    async def generate_response():

        try:

            messages = [
                {
                    "role": "system",
                    "content": """
You are a friendly AI chef assistant for Charlene AI Recipes.

Help users with:
- recipe ideas
- healthy meals
- meal prep
- cooking substitutions
- grocery lists
- beginner cooking advice
- quick meals
- high protein meals

Keep responses conversational, helpful, and easy to understand.
"""
                }
            ]

            messages.extend(data.history)

            messages.append({
                "role": "user",
                "content": data.message
            })

            stream = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=messages,
                stream=True
            )

            for chunk in stream:

                content = chunk.choices[0].delta.content

                if content:

                    yield content

                    await asyncio.sleep(0.01)

        except Exception as e:

            yield f"Error: {str(e)}"

    return StreamingResponse(
        generate_response(),
        media_type="text/plain"
    )


@app.post("/signup", response_model=UserResponse)
def signup(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user


@app.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    valid_password = verify_password(
        user.password,
        existing_user.password
    )

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = jwt.encode(
        {
            "user_id": existing_user.id,
            "email": existing_user.email
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": existing_user.id,
            "username": existing_user.username,
            "email": existing_user.email
        }
    }