from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydanticModel import Details
import databaseModel
from dbConfig import session, engine


app = FastAPI()

#
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://contact-management-system-frontend-beryl.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

databaseModel.Base.metadata.create_all(bind=engine)

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@app.get("/contacts")
def get_all_contacts(db: Session = Depends(get_db)):
    return db.query(databaseModel.Contact).all()

@app.get("/contacts/{contact_id}")
def get_contact_by_id(contact_id: int,db: Session = Depends(get_db)):
    db_contact = (db.query(databaseModel.Contact).filter(databaseModel.Contact.contactId == contact_id).first())

    if not db_contact:
        raise HTTPException(status_code=404,detail="Contact not found")
    return db_contact

@app.post("/contact", status_code=201)
def create_contact(details: Details,db: Session = Depends(get_db)):
    new_contact = databaseModel.Contact(**details.model_dump())
    db.add(new_contact)

    try:
        db.commit()
        db.refresh(new_contact)
        return new_contact

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,detail="Email already exists")


@app.put("/contact/{contact_id}")
def update_contact(contact_id: int,details: Details,db: Session = Depends(get_db)):
    db_contact = (db.query(databaseModel.Contact).filter(databaseModel.Contact.contactId == contact_id).first())
    if not db_contact:
        raise HTTPException(status_code=404,detail="Contact not found")

    for key, value in details.model_dump().items():
        setattr(db_contact, key, value)

    try:
        db.commit()
        db.refresh(db_contact)
        return db_contact

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,detail="Email already exists")

@app.delete("/contact/{contact_id}")
def delete_contact(contact_id: int,db: Session = Depends(get_db)):
    db_contact = (db.query(databaseModel.Contact).filter(databaseModel.Contact.contactId == contact_id).first())
    if not db_contact:
        raise HTTPException(status_code=404,detail="Contact not found")

    db.delete(db_contact)
    db.commit()

    return {
        "message": "Contact deleted successfully"
    }