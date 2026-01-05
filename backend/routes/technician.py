# realizando as importações necessarias
# from config import db, bcrypt, CPF_ADMIN, NOME_ADMIN, SENHA_ADMIN, CONTATO_ADMIN, ENDERECO_ADMIN, IS_ADMIN
from config import db, bcrypt
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import create_access_token, unset_jwt_cookies, get_jwt, get_jwt_identity, jwt_required
import json

view_technician = Blueprint('view_technician', __name__, url_prefix='/tecnico')

# rota para cadastro de um admin
@view_technician.route('/admin', methods=['GET'])
def create_admin():
    from config import CPF_ADMIN, NOME_ADMIN, SENHA_ADMIN, CONTATO_ADMIN, ENDERECO_ADMIN, IS_ADMIN
    from models.tecnico import Tecnico
    
    tecnico_exists = db.session.query(Tecnico).filter_by(cpf_tecnico=CPF_ADMIN).one_or_none()

    SENHA_ADMIN_HASH = bcrypt.generate_password_hash(SENHA_ADMIN)

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
        new_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if expiration_timestamp < new_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())

            data = response.get_json()
            if type(data) == dict:
                data['access_token'] = access_token
                response.data = json.dumps(data)
            
        return response
    
    except (RuntimeError, KeyError):
        # caso o token ainda nao tehna expirado, retorne o original
        return response

# rota para login
@view_technician.route('/login', methods=['POST'])
def tech_login():
    if request.method == 'POST':
        from models.tecnico import Tecnico
        # puxando dados
        data = request.json
        cpf_login = data.get('cpf')
        senha = data.get('senha')

        # se nao existir cpf ou senha, retorne erro
        if not cpf_login and senha:
            return '', 400

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
        # cria o token
        token_access = create_access_token(identity=str(tech_exists.tecnico_id))
        response = {"access_token":token_access}
        return response, 200
    

# rota para logout do tecnico
@view_technician.route('/logout', methods=['POST'])
@jwt_required()
def tech_logout():
    response = jsonify({'mensage':'DELETADO'})
    unset_jwt_cookies(response)
    return response, 200

# rota para cadastro de um novo tecnico
# PARA CADASTRAR NOVOS TECNICOS, O ATUAL DEVE SER UM ADMIN
@view_technician.route('/novo', methods=['POST'])
@jwt_required()
def new_technician():
    if request.method == 'POST':
        from models.tecnico import Tecnico

        # pegando o id do tecnico do token logado atualmente
        # convertendo para um int
        
        tech_id = int(get_jwt_identity())

        # pesquisando pelo tecnico
        try:
            tech_exists = db.session.query(Tecnico).filter_by(tecnico_id=tech_id).one_or_none()
        except Exception as e:
            return str(e), 500
        
        # se o tecnico nao existir, retorne erro 404
        if not tech_exists:
            # print(tech_exists)
            return '', 404
        
        # caso o tecnico exista
        # cheque se ele é admin
        # se for, permita o cadastro
        if tech_exists.administrador == True:
            print(tech_exists.nome_tecnico)
            print('é admin')
            
            # puxe os dados do novo tecnico
            data = request.json
            cpf_tech = data.get('cpf_tecnico')
            senha_tech = data.get('senha_tecnico')
            senha_confirma_tech = data.get('senha_confirma')
            nome_tech = data.get('nome_tecnico')
            contato_tech = data.get('contato_tecnico')
            endereco_tech = data.get('endereco_tecnico')
            is_admin = data.get('admin')

            # checa se o cpf é valido
            if len(cpf_tech) != 11:
                print('cpf invalido')
                return '', 406

            # checa se o cpf desejado ja esta cadastrado
            try:
                is_registered = db.session.query(Tecnico).filter_by(cpf_tecnico=cpf_tech).one_or_none()
            
            except Exception as e:
                return str(e), 500
            
            # se ja estiver registrado, retorne erro
            if is_registered:
                print('ja registrado')
                return '', 409
            
            # senao, continue tentando cadastrar
            # cheque se as senhas sao iguais
            if senha_tech != senha_confirma_tech:
                print('senha errada')
                return '', 406
            
            # cheque se possui um nome valido
            if nome_tech == None and nome_tech == '':
                return '', 406
            
            if len(nome_tech) < 3:
                return '', 406
            
            if all(char.isdigit() for char in contato_tech) != True:
                return '', 406

            # tenta cadastrar um tecnico
            try:
                # criando tecnico a ser inserido
                tech = Tecnico(
                                cpf_tecnico = cpf_tech,
                                senha = bcrypt.generate_password_hash(senha_tech),
                                nome_tecnico = nome_tech,
                                contato_tecnico = contato_tech,
                                endereco = endereco_tech,
                                administrador = is_admin
                            )
                
                # inserindo no banco
                db.session.add(tech)
                db.session.commit()
                
                return '', 201
            
            except Exception as e:
                return str(e), 500

        # caso nao, retorne nao autorizado
        else:
            return '', 401

        # return '', 201

        