# realizando as importações necessarias
from config import db, bcrypt, CPF_ADMIN, NOME_ADMIN, SENHA_ADMIN, CONTATO_ADMIN, ENDERECO_ADMIN, IS_ADMIN
from flask import Blueprint, request

view_technician = Blueprint('view_technician', __name__, url_prefix='/tecnico')

# rota para cadastro de um admin
@view_technician.route('/admin', methods=['GET'])
def create_admin():
    from models.tecnico import Tecnico
    
    tecnico_exists = db.session.query(Tecnico).filter_by(cpf_tecnico=CPF_ADMIN).one_or_none()

    SENHA_ADMIN_HASH = bcrypt.generate_password_hash(SENHA_ADMIN)
    print(SENHA_ADMIN_HASH)

    IS_ADMIN_TRUE = bool(IS_ADMIN)

    if not tecnico_exists:
        tec_admin = Tecnico(
                            cpf_tecnico = CPF_ADMIN,
                            senha = SENHA_ADMIN_HASH,
                            nome_tecnico = NOME_ADMIN,
                            contato_tecnico = CONTATO_ADMIN,
                            endereco = ENDERECO_ADMIN,
                            administrador = IS_ADMIN_TRUE
                            )
        db.session.add(tec_admin)
        db.session.commit()
        
        return '', 201
    
    return '', 409