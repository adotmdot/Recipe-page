from pydantic import BaseModel
from pydantic import Field


class RecipeBase(BaseModel):

    title: str
    image: str
    description: str
    ingredients: str | None = None
    instructions: str
    tips: str | None = None


class RecipeCreate(RecipeBase):
    pass


class RecipeResponse(RecipeBase):

    id: int

    class Config:
        from_attributes = True
        
        
class UserCreate(BaseModel):

    username: str
    email: str
    password: str = Field(
        min_length=6,
        max_length=72
    )


class UserLogin(BaseModel):

    email: str
    password: str = Field(
        min_length=6,
        max_length=72
    )


class UserResponse(BaseModel):

    id: int
    username: str
    email: str

    class Config:
        from_attributes = True        