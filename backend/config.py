# importando bibliotecas necessarias
from os import path, makedirs, getenv
from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from secrets import token_urlsafe
from dotenv import load_dotenv

# carregando variaveis de ambiente
load_dotenv()
CPF_ADMIN = getenv('CPF_ADMIN')
SENHA_ADMIN = getenv('SENHA_ADMIN')
NOME_ADMIN = getenv('NOME_ADMIN')
CONTATO_ADMIN = getenv('CONTATO_ADMIN')
ENDERECO_ADMIN = getenv('ENDERECO_ADMIN')
IS_ADMIN = getenv('IS_ADMIN')

# criando uma instancia flask
app = Flask(__name__)

# permissão da comunicação entre frontend e backend
CORS(app)

# para criptografia de senhas
bcrypt = Bcrypt(app)

# cria a pasta do banco de dados caso nao exista
db_folder = path.join(app.root_path, 'database')
makedirs(db_folder, exist_ok=True)

# criando a secret key do jwt
app.config['JWT_SECRET_KEY'] = token_urlsafe(nbytes=32)
# definindo o tempo de expiração
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)

# configurando banco sqlite
# cria o arquivo de banco na pasta especificada
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{app.root_path}/database/alos.db'
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
                                            'pool_size': 5,
                                            'max_overflow': 1,
                                            'pool_timeout': 900
                                          }


jwt = JWTManager(app)

# modelo para as tabelas
class Base(DeclarativeBase):
    # necessarios para relacionamentos 1:n
    __abstract__ = True
    __allow_unmaped__ = True

# associa sqlalchemy com flask 
# passa a classe base o objeto
db = SQLAlchemy(app, model_class=Base)