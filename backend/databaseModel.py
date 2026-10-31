from sqlalchemy.orm import declarative_base
from sqlalchemy import Column,Integer,String

Base=declarative_base()

class Contact(Base):
    __tablename__="contact"
    contactId=Column(Integer,primary_key=True,index=True)
    contactName=Column(String,nullable=False)
    email=Column(String,nullable=False,unique=True)
    phone=Column(String,nullable=False)
    address=Column(String)