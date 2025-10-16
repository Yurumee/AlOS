# importando bibliotecas necessarias
from os import path, makedirs
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# criando uma instancia flask
app = Flask(__name__)

# cria a pasta do banco de dados caso nao exista
db_folder = path.join(app.root_path, 'database')
makedirs(db_folder, exist_ok=True)

# configurando banco sqlite
# cria o arquivo de banco na pasta especificada
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{app.root_path}/database/alos.db'
# associa sqlalchemy com flask 
db = SQLAlchemy(app)