from flask_sqlalchemy import SQLAlchemy
from os import path, makedirs, getenv
# import create_app
from .config import Base

# app = create_app()

# associa sqlalchemy com flask 
# passa a classe base o objeto
db = SQLAlchemy(model_class=Base)
# cria a pasta do banco de dados caso nao exista
# db_folder = path.join(app.root_path, 'database')
# makedirs(db_folder, exist_ok=True)
