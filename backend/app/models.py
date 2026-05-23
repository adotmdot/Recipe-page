from sqlalchemy import Column, Integer, String, Text
from .database import Base


class Recipe(Base):

    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    image = Column(String)

    description = Column(Text)
    
    ingredients = Column(Text)

    tips = Column(Text)
    
    instructions = Column(Text)
    
    
class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, index=True)

    email = Column(String, unique=True, index=True)

    password = Column(String)    