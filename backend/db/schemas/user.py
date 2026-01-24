from sqlalchemy import Table, Column, Integer, String, MetaData
from .meta import metaData

user = Table(
    "user",
    metaData,
    Column("id", Integer, primary_key=True),
    Column("username", String(50), unique=True, nullable=False),
    Column("email", String(120), unique=True, nullable=False),
    Column("password_hash", String(128), nullable=False),
)