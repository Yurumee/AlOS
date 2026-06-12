# realizando as importações necessarias
# from config import db, bcrypt, CPF_ADMIN, NOME_ADMIN, SENHA_ADMIN, CONTATO_ADMIN, ENDERECO_ADMIN, IS_ADMIN
from config import db, bcrypt, log_path
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import create_access_token, unset_jwt_cookies, get_jwt, get_jwt_identity, jwt_required
import json

view_technician = Blueprint('view_technician', __name__, url_prefix='/tecnico')

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
        if data != {}:
            usuario = data.get('usuario')
            senha = data.get('senha')
        else:
            response = {'status':'error', 'msg':'CAMPOS USUÁRIO OU SENHA VAZIOS!'}
            return response, 400

        # se nao existir cpf ou senha, retorne erro
        if not usuario or not senha:
            response = {'status':'error', 'msg':'CAMPOS USUÁRIO OU SENHA VAZIOS!'}
            return response, 400

        # checando se o cpf existe
        try:
            tech_exists = db.session.query(Tecnico).filter_by(usuario=usuario).first()

        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO COM O BANCO DE DADOS!'}    
            return response, 500
            
        if not bcrypt.check_password_hash(tech_exists.senha, senha):
            response = {'status':'error', 'msg':'SENHAS NÃO COINCIDEM'}    
            return response, 401
        
        # se for autorizado
        # cria o token
        token_access = create_access_token(identity=str(tech_exists.tecnico_id))
        response = {'status':'success', 'msg':'TÉCNICO LOGADO COM SUCESSO!', "access_token":token_access}
        return response, 200
    

# rota para logout do tecnico
@view_technician.route('/logout', methods=['POST'])
@jwt_required()
def tech_logout():
    response = {'status':'success', 'msg':'LOGOUT REALIZADO COM SUCESSO'}
    unset_jwt_cookies(response)
    return response, 200

# rota get all technicians
# essa rota deve exibir todos os tecnicos em lista na tela inicial do modulo de tecnicos
@view_technician.route('/', methods=['GET'])
@jwt_required()
def all_technicians():

    from models.tecnico import Tecnico

    technicians = db.session.query(Tecnico).all()
    result = {}
    
    # retorna clientes em formato json
    for technician in technicians:
        result[technician.tecnico_id] = {
                                    "id":technician.tecnico_id,
                                    "cpf": technician.cpf_tecnico,
                                    "usuario": technician.usuario,
                                    "nome_completo": technician.nome_tecnico,
                                    "endereco": technician.endereco,
                                    "telefone": technician.contato_tecnico,
                                    "admin": 'Sim' if technician.administrador == True else 'Não'
                                }
        
    return result, 200

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
            response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            # print(str(e))   
            return response, 500
        
        # se o tecnico nao existir, retorne erro 404
        if not tech_exists:
            response = {'status':'error', 'msg':'TECNICO NÃO ENCONTRADO'}
            return '', 404
        
        # caso o tecnico exista
        # cheque se ele é admin
        # se for, permita o cadastro
        if tech_exists.administrador == True:
            
            # puxe os dados do novo tecnico
            data = request.json
            cpf_tech = data.get('cpf_tecnico')
            user_tech = data.get('user')
            senha_tech = data.get('senha_tecnico')
            senha_confirma_tech = data.get('senha_confirma')
            nome_tech = data.get('nome_tecnico')
            contato_tech = data.get('contato_tecnico')
            endereco_tech = data.get('endereco_tecnico')
            is_admin = data.get('admin')

            # checa se o cpf é valido
            if len(cpf_tech) != 11:
                response = {'status':'error', 'msg':'CPF INVÁLIDO '}
                return response, 406

            # checa se o cpf desejado ja esta cadastrado
            try:
                is_registered = db.session.query(Tecnico).filter_by(cpf_tecnico=cpf_tech).one_or_none()
                user_registered = db.session.query(Tecnico).filter_by(usuario=user_tech).one_or_none()
            
            except Exception as e:
                response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
            
            # se ja estiver registrado, retorne erro
            if is_registered:
                response = {'status':'error', 'msg':'O CPF JÁ FOI CADASTRADO'}
                return response, 409
            
            if user_registered:
                response = {'status':'error', 'msg':'NOME DE USUÁRIO JÁ EM USO'}
                return response, 409
            
            
            # senao, continue tentando cadastrar
            # cheque se as senhas sao iguais
            if senha_tech != senha_confirma_tech:
                response = {'status':'error', 'msg':'SENHAS NÃO COINCIDEM'}
                return response, 406
            
            # cheque se possui um nome valido
            if not nome_tech or len(nome_tech) < 3 or nome_tech == '':
                response = {'status':'error', 'msg':'NOME DO TÉCNICO INVÁLIDO'}
                return response, 406
            
            if not user_tech or len(user_tech) < 3 or user_tech ==  '':
                response = {'status':'error', 'msg':'NOME DE USUÁRIO DO TÉCNICO INVÁLIDO'}
                return response, 406
            
            if not contato_tech or all(char.isdigit() for char in contato_tech) != True:
                response = {'status':'error', 'msg':'TELEFONE INVÁLIDO'}
                return response, 406

            # tenta cadastrar um tecnico
            try:
                # criando tecnico a ser inserido
                tech = Tecnico(
                                cpf_tecnico = cpf_tech,
                                usuario = user_tech,
                                senha = bcrypt.generate_password_hash(senha_tech),
                                nome_tecnico = nome_tech,
                                contato_tecnico = contato_tech,
                                endereco = endereco_tech,
                                administrador = is_admin
                            )
                
                # inserindo no banco
                db.session.add(tech)
                db.session.commit()
                
                response = {'status':'success', 'msg':'TÉCNICO CADASTRADO COM SUCESSO!'}
                return response, 201
            
            except Exception as e:
                response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500

        # caso nao, retorne nao autorizado
        else:
            response = {'status':'error', 'msg':'TÉCNICO NÃO POSSUI PERMISSÃO DE ADMINISTRADOR'}
            return response, 401

# rota para cadastro de um editar tecnico
# PARA EDITAR NOVOS TECNICOS, O ATUAL DEVE SER UM ADMIN
@view_technician.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def patch_technician(id_desejado):
    if request.method == 'POST':
        from models.tecnico import Tecnico

        # pegando o id do tecnico do token logado atualmente
        # convertendo para um int
        
        tech_id = int(get_jwt_identity())

        # pesquisando pelo tecnico
        try:
            tech_exists = db.session.query(Tecnico).filter_by(tecnico_id=tech_id).one_or_none()
        except Exception as e:
            response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500    
        
        # se o tecnico nao existir, retorne erro 404
        if not tech_exists:
            response = {'status':'error','msg':'TÉCNICO INFORMADO NÃO EXISTE OU NÃO AUTENTICADO'}
            return '', 404
        
        # caso o tecnico exista
        # cheque se ele é admin
        # se for, permita o cadastro
        if tech_exists.administrador == True:

            # puxe os dados do tecnico a ser edditado
            data = request.json
            nome_tech = data.get('nome_tecnico')
            contato_tech = data.get('contato_tecnico')
            endereco_tech = data.get('endereco_tecnico')
            is_admin = data.get('admin')

            # checa se o tecnico desejado existe
            try:
                is_registered = db.session.query(Tecnico).filter_by(tecnico_id=id_desejado).one_or_none()
            
            except Exception as e:
                response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
            
            # se nao existir, retorne erro
            if not is_registered:
                response = {'status':'error','msg':'TECNICO PESQUISADO NÃO EXISTE'}
                return response, 404
            
            # senao, continue tentando editar
            # cheque se possui um nome valido
            if nome_tech == '':
                response = {'status':'error','msg':'O NOME NÃO PODE SER VAZIO'}
                return response, 406
            
            if nome_tech and len(nome_tech) < 3:
                response = {'status':'error','msg':'O NOME É CURTO DEMAIS'}
                return response, 406
            
            # cheque se o telefone é valido
            if contato_tech == '':
                response = {'status':'error', 'msg':'TELEFONE NÃO PODE SER NULO'}
                return response, 406

            # cheque se o telefone contem apenas numeros
            if contato_tech != None and all(char.isdigit() for char in contato_tech) != True:
                response = {'status':'error', 'msg':'TELEFONE DEVE CONTER APENAS NÚMEROS'}
                return response, 406
            
            # cheque se endereco é vazio
            if endereco_tech == '':
                response = {'status':'error', 'msg':'O ENDEREÇO NÃO PODE SER VAZIO'}
                return response, 400
            
            # realizando modificacoes
            try:
                if nome_tech != None and nome_tech != is_registered.nome_tecnico:
                    is_registered.nome_tecnico = nome_tech

                if contato_tech != None and contato_tech != is_registered.contato_tecnico:
                    is_registered.contato_tecnico = contato_tech

                if endereco_tech != None and is_registered.endereco:
                    is_registered.endereco = endereco_tech
                
                if is_admin != None and is_registered.administrador:
                    is_registered.administrador = is_admin
                
                db.session.commit()
                response = {'status':'success','msg':'TECNICO EDITADO COM SUCESSO!'}
                return response, 200
                
            except Exception as e:
                response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
        # caso nao, retorne nao autorizado
        else:
            response = {'status':'error','msg':'TÉCNICO NÃO AUTENTICADO'}
            return '', 401



# rota para deletar um tecnico com base no id informado
@view_technician.route('/excluir/<int:id_desejado>', methods=['DELETE'])
@jwt_required()
def delete_technician(id_desejado):
    from models.tecnico import Tecnico

    if request.method == 'DELETE':

        tech_id = int(get_jwt_identity())

        # pesquisando pelo tecnico
        try:
            tech_exists = db.session.query(Tecnico).filter_by(tecnico_id=tech_id).one_or_none()
        
        except Exception as e:
            response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500    
        
        # se o tecnico nao existir, retorne erro 404
        if not tech_exists:
            response = {'status':'error','msg':'TÉCNICO INFORMADO NÃO EXISTE OU NÃO AUTENTICADO'}
            return response, 404
        
        # caso o tecnico exista
        # cheque se ele é admin
        # se for, permita a exclusao
        if tech_exists.administrador == True:

            # checa se o tecnico existe
            try:
                tecnico_exists = db.session.query(Tecnico).filter_by(tecnico_id=id_desejado).one_or_none()

            except:
                response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500

            if not tecnico_exists:
                response = {'status':'error', 'msg':'O TECNICO PESQUISADO NÃO EXISTE'}
                return response, 404

            if tecnico_exists.tecnico_id != tech_id:
                # exclui o tecnico
                try:
                        db.session.query(Tecnico).filter_by(tecnico_id=id_desejado).delete()
                        db.session.commit()
                        response = {'status':'success', 'msg':'TECNICO APAGADO COM SUCESSO!'}
                        return response, 500

                except Exception as e:
                    response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                    return response, 500
            else:
                response = {'status':'error','msg':'NÃO PODE DELETAR UM TÉCNICO EM USO'}
                return response, 500
        

# esta rota pesquisa o id do tecnico
@view_technician.route('/pesquisar/<int:id_desejado>', methods=['GET'])
@jwt_required()
def getTechnician(id_desejado):
    from models.tecnico import Tecnico

    try:
        tecnico_exists = db.session.query(Tecnico).filter_by(tecnico_id=id_desejado).one_or_none()
        print(tecnico_exists)
    except Exception as e:
        response = {'status':'error','msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500
    
    if tecnico_exists:
        result = {}
        result[tecnico_exists.tecnico_id] = {
                                        "id":tecnico_exists.tecnico_id,
                                        "cpf": tecnico_exists.cpf_tecnico,
                                        "nome_completo": tecnico_exists.nome_tecnico,
                                        "usuario": tecnico_exists.usuario,
                                        "endereco": tecnico_exists.endereco,
                                        "telefone": tecnico_exists.contato_tecnico,
                                        "admin": tecnico_exists.administrador
                                    }
        
        return result, 302
    
    
    response = {'status':'error', 'msg':'NENHUM TÉCNICO ENCONTRADO COM ESTE ID'}
    return response, 404