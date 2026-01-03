# realizando as importações necessarias
# from config import db, bcrypt, CPF_ADMIN, NOME_ADMIN, SENHA_ADMIN, CONTATO_ADMIN, ENDERECO_ADMIN, IS_ADMIN
from config import db, bcrypt
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, unset_jwt_cookies, get_jwt
from flask import Blueprint, request, jsonify

view_technician = Blueprint('view_technician', __name__, url_prefix='/tecnico')

# rota para cadastro de um admin
@view_technician.route('/admin', methods=['GET'])
def create_admin():
    from config import CPF_ADMIN, NOME_ADMIN, SENHA_ADMIN, CONTATO_ADMIN, ENDERECO_ADMIN, IS_ADMIN
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

# rota para recarregar o token expirado
@view_technician.after_request
def refresh_expiring_jwt(response):
    try:
        expiration_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        # timestamp = 

# rota para login
@view_technician.route('/login', methods=['POST'])
def tech_login():
    if request.method == 'POST':
        from models.tecnico import Tecnico
        # puxando dados
        data = request.json
        cpf_login = data.get('cpf')
        senha = data.get('senha')

        # checando se o cpf existe
        try:
            tech_exists = db.session.query(Tecnico).filter_by(cpf_tecnico=cpf_login).first()
        except Exception as e:
            print(str(e))
            return '', 500
        
        # se não existir, retorne ero 404
        if not tech_exists:
            return '', 404
        
        # senao, tente fazer login
        # cheque se os hashes de senha sao iguais
        if not bcrypt.check_password_hash(tech_exists.senha, senha):

            # se nao forem, nao faça login
            # nao autorizado
            return '', 401
        
        # se for autorizado
        token_access = create_access_token(identity=tech_exists.nome_tecnico)
        resp = {"access_token":token_access}
        return resp, 200
    

# rota para logout do tecnico
@view_technician.route('/logout', methods=['POST'])
def tech_logout():
    response = jsonify({'mensage':'DELETADO'})
    unset_jwt_cookies(response)
    return response