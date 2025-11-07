# importando bibliotecas necessarias
from os import path, makedirs
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import create_engine

# criando uma instancia flask
app = Flask(__name__)

# cria a pasta do banco de dados caso nao exista
db_folder = path.join(app.root_path, 'database')
makedirs(db_folder, exist_ok=True)

# configurando banco sqlite
# cria o arquivo de banco na pasta especificada
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{app.root_path}/database/alos.db'
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
                                            'pool_size': 5,
                                            'max_overflow': 1,
                                            'pool_timeout': 900
                                          }

# modelo para as tabelas
class Base(DeclarativeBase):
    # necessarios para relacionamentos 1:n
    __abstract__ = True
    __allow_unmaped__ = True

# associa sqlalchemy com flask 
# passa a classe base o objeto
db = SQLAlchemy(app, model_class=Base)
