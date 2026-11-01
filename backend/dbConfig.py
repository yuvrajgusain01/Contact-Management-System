from sqlalchemy  import create_engine,URL
from sqlalchemy.orm import sessionmaker

db_url=URL.create(
    drivername='postgresql+psycopg',
    username='postgres',
    password='yuvraj@1',
    host='localhost',
    port=5432,
    database='ContactManagementSystem'
)
engine=create_engine(db_url)
session=sessionmaker(bind=engine,autoflush=False,autocommit=False)
