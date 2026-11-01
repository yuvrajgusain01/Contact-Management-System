from sqlalchemy  import create_engine,URL
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL)
session=sessionmaker(bind=engine,autoflush=False,autocommit=False)
