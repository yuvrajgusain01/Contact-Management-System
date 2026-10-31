from pydantic import BaseModel,EmailStr,Field
from typing import Annotated

class Details(BaseModel):
    contactId: Annotated[int, Field(gt=0, description='Must be positive')]
    contactName:Annotated[str,Field(min_length=3,max_length=20,description='Length must be in between 3 and 20 characters')]
    email:EmailStr
    phone: str = Field(pattern=r"^\d{10}$")
    address: str = Field(min_length=5, max_length=100,default='Null')