from flask import Flask
from flask_cors import CORS
# from flask_bcrypt import Bcrypt
from secrets import token_urlsafe
from datetime import timedelta
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from os import path, makedirs, getenv

from .config import config_dict, bcrypt
from .db import db

def create_app(config=config_dict['dev']):

    # importando configuracoes
    # from .config import db
    # importando os modelos
    from .models.os_estoque import Os_estoque
    from .models.os_servico import Os_servico

    from .models.cliente import Cliente
    from .models.estoque import Estoque
    from .models.ordemServico import OrdemServico
    from .models.produto import Produto
    from .models.servico import Servico
    from .models.tecnico import Tecnico
    from .models.categoria import Categoria
    from .models.anexo import Anexo

    # importando blueprints
    from .routes.client import view_client
    from .routes.product import view_product
    from .routes.home import view_home
    from .routes.technician import view_technician
    from .routes.storage import view_storage
    from .routes.category import view_category
    from .routes.service import view_service
    from .routes.os import view_os
    from .routes.attachment import view_attachment

    # criando uma instancia flask
    app = Flask(__name__)

    # permissão da comunicação entre frontend e backend
    CORS(app)

    # para criptografia de senhas
    # bcrypt = Bcrypt(app)
    bcrypt.init_app(app)

    # criando a secret key do jwt
    app.config['JWT_SECRET_KEY'] = token_urlsafe(nbytes=32)
    # definindo o tempo de expiração
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)

    jwt = JWTManager(app)

    # cria a pasta do banco de dados caso nao exista
    db_folder = path.join(app.root_path, 'database')
    makedirs(db_folder, exist_ok=True)

    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{app.root_path}/database/alos.db'

    db.init_app(app=app)

    # registrando blueprints
    app.register_blueprint(view_client)
    app.register_blueprint(view_product)
    app.register_blueprint(view_home)
    app.register_blueprint(view_technician)
    app.register_blueprint(view_storage)
    app.register_blueprint(view_category)
    app.register_blueprint(view_service)
    app.register_blueprint(view_os)
    app.register_blueprint(view_attachment)

    app.config.from_object(config)


    return app