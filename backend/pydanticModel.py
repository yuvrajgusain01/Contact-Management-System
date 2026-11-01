from pydantic import BaseModel, EmailStr, Field
from typing import Annotated


class Details(BaseModel):
    contactName: Annotated[str,Field(min_length=3, max_length=20)]
    email: EmailStr
    phone: str = Field(pattern=r"^\d{10}$")
    address: str | None = Field(
        default=None,
        min_length=5,
        max_length=100
    )