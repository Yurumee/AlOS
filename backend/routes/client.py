# realizando importações necessárias
from config import db
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

# criando uma blueprint
view_client = Blueprint('view_client', __name__, url_prefix='/cliente')

# rota get all clients
# essa rota deve exibir todos os clientes em lista na tela inicial do modulo de clientes
@view_client.route('/', methods=['GET'])
@jwt_required()
def all_clients():
    from models.cliente import Cliente

    clients = db.session.query(Cliente).all()
    result = {}
    
    # retorna clientes em formato json
    for client in clients:
        result[client.cliente_id] = {
                                    "id":client.cliente_id,
                                    "cpf_cnpj": client.cpf_cnpj,
                                    "nome_completo": client.nome_completo,
                                    "nome_fantasia": client.nome_fantasia,
                                    "endereco": client.endereco,
                                    "bairro": client.bairro,
                                    "cidade": client.cidade,
                                    "cep": client.cep,
                                    "telefone": client.telefone,
                                    "limite_credito": client.limite_credito,
                                    "pessoa_juridica": client.pessoa_juridica
                                }
        
    return result, 200
    # return resp

# rota pesquisa de cliente por nome/cpf/cnpj
# esta rota é utilizada pela barra de pesquisa
# essa rota deve exibir os clientes com base no cpf/cnpj informado ou nome do cliente
# @view_client.route('/pesquisar/<str_pesquisa>', methods=['GET'])
# def search_client(str_pesquisa):
#     from models.cliente import Cliente
#     # pesquisa pelo cpf/cnpj
#     if str_pesquisa.isdigit():    
#         # pesquisa pelo cpf
#         if int(str_pesquisa) <= 14:
            
#             try:
#                 cliente_desejado =  db.session.query(Cliente).filter_by(Cliente.cpf_cnpj.ilike(f'%{str_pesquisa}')).all()
#                 if cliente_desejado:
#                     result = {}
#                     for cliente in clientes_desejados:
#                         result[cliente.cliente_id] = {
#                                                     'cpf_cnpj': cliente.cpf_cnpj,
#                                                     'nome_cliente':cliente.nome_completo,
#                                                     'nome_fantasia':cliente.nome_fantasia,
#                                                     'endereco':cliente.endereco,
#                                                     'bairro':cliente.bairro,
#                                                     'cep':cliente.cep,
#                                                     'cidade':cliente.cidade,
#                                                     'limite_credito':cliente.limite_credito,
#                                                     'pessoa_juridica':cliente.pessoa_juridica
#                                                     }
                    
#                     return result, 200
#                 else:
#                     return '', 404
            
#             except Exception as e:
#                 return '', 500
#     else: 
#         # pesquisa pelo nome
#         try:
#             clientes_desejados =  db.session.query(Cliente).filter(Cliente.nome_completo.ilike(f'%{str_pesquisa}%')).all()
#             if clientes_desejados:
#                 result = {}
#                 for cliente in clientes_desejados:
#                     result[cliente.cliente_id] = {
#                                                 'cpf_cnpj': cliente.cpf_cnpj,
#                                                 'nome_cliente':cliente.nome_completo,
#                                                 'nome_fantasia':cliente.nome_fantasia,
#                                                 'endereco':cliente.endereco,
#                                                 'bairro':cliente.bairro,
#                                                 'cep':cliente.cep,
#                                                 'cidade':cliente.cidade,
#                                                 'limite_credito':cliente.limite_credito,
#                                                 'pessoa_juridica':cliente.pessoa_juridica
#                                                 }
#                 return result, 200
#             else:
#                 return '', 404
            
#         except Exception as e:
#             return '', 500

# rota cadastro de cliente
# esta rota deve exibir o formulário de clientes
# quando o formulario for enviado, deve cadastrar o cliente no banco
@view_client.route('/novo', methods=['POST'])
@jwt_required()
def new_client():
    if request.method == 'POST':
        from models.cliente import Cliente

        try:
            # guarda dados do frontend
            data = request.json

            # separando em variaveis
            cpf_cnpj = data.get('cpf_cnpj_cliente')
            flag_cnpj = data.get('flag_cnpj') # caso contenha algo, sera True, caso nao tenha nada, sera False
            nome = data.get('nome_cliente')
            nome_fantasia = data.get('empresa_cliente')
            endereco = data.get('endereco_cliente')
            bairro = data.get('bairro_cliente')
            cidade = data.get('cidade_cliente')
            cep = data.get('cep_cliente')
            telefone = data.get('telefone_cliente')
            lim_credito = float(data.get('limite_credito'))
        
        except Exception as e:
            return jsonify({'error':str(e)})

        # cpf/cnpj nao deve ser nulo
        if cpf_cnpj == '' or cpf_cnpj == None:
            return jsonify({'message':'cpf/cnpj nao pode ser nulo'})

        # cpf/cnpj devem ter a quantidade de caracteres desejada
        if len(cpf_cnpj) != 11 and flag_cnpj == False:
            return jsonify({
                            'message':'cpf invalido'
                            })
        
        if len(cpf_cnpj) != 14 and flag_cnpj == True:
            return jsonify({
                            'message':'cnpj invalido'
                            })

        # verifica se o cliente ja existe no banco
        try:
            cliente_exists = db.session.query(Cliente).filter_by(cpf_cnpj=cpf_cnpj).first()
            
            if cliente_exists:
                return jsonify({'message':'cliente existe'})    
        except:
            return jsonify({'message':'error'})
        
        # verifica se campo telefone possui apenas numeros
        if all(char.isdigit() for char in telefone) != True:
            return jsonify({'message':'telefone deve conter apenas numeros'})
        
        # verifica se o limite de credito é um valor negativo
        if lim_credito < 0:
            return jsonify({'message':'limite de credito nao deve ser um valor negativo'})
        
        # verifica se o nome é nulo
        if not nome:
            return jsonify({'message':'nome nao deve ser nulo'})
        
        if not nome_fantasia and flag_cnpj == True:
            return jsonify({'message':'informe o nome fantasia da empresa'})
        
        try:
            # realizando transação
            # criando o cliente a ser inserido
            print('iniciando cadastro de cliente')
            client = Cliente(
                                cpf_cnpj = cpf_cnpj,
                                nome_completo = nome,
                                nome_fantasia = nome_fantasia,
                                pessoa_juridica = flag_cnpj,
                                telefone = telefone,
                                endereco = endereco,
                                bairro = bairro,
                                cidade = cidade,
                                cep = cep,
                                limite_credito = lim_credito
                            )

            # inserindo e realizando commit
            db.session.add(client)
            db.session.commit()
            # fim da transação

            return '', 201

        except Exception as e:
            return str(e)

# rota para alterar um cliente existente
# esta rota deve alterar os dados do cliente desejado baseado no cpf/cnpj
# 
@view_client.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def patch_client(id_desejado):
    from models.cliente import Cliente

    if request.method == 'POST':
        # recebe dados do frontend
        data = request.get_json()

        # separando em variaveis
        nome = data.get('nome_cliente')
        nome_fantasia = data.get('empresa_cliente')
        endereco = data.get('endereco_cliente')
        bairro = data.get('bairro_cliente')
        cidade = data.get('cidade_cliente')
        cep = data.get('cep_cliente')
        telefone = data.get('telefone_cliente')
        lim_credito = data.get('limite_credito')

        # checa se o cliente existe
        try:
            cliente_exists = db.session.query(Cliente).filter_by(cliente_id=id_desejado).one_or_none()
        except:
            return '', 500
        
        if not cliente_exists:
            return '', 404
        
        # checar se os dados estao corretos
        # if not nome:
        #     return '', 406
        
        # if not nome_fantasia and cliente_exists.pessoa_juridica == True:
        #     return '', 406
        
        if lim_credito != None and float(lim_credito) < 0:
            return '', 406
        
        if telefone != None and all(char.isdigit() for char in telefone) != True:
            return '', 406
        
        # if not endereco or not bairro or not cidade:
        #     return '', 406
        
        # realizando modificações
        try:
            if nome != None and nome != cliente_exists.nome_completo:
                cliente_exists.nome_completo = nome
                # db.session.commit()
            
            if nome_fantasia != None and nome_fantasia != cliente_exists.nome_fantasia:
                cliente_exists.nome_fantasia = nome_fantasia
            
            if lim_credito != None and lim_credito != cliente_exists.limite_credito:
                cliente_exists.limite_credito = float(lim_credito)
            
            if telefone != None and telefone != cliente_exists.telefone:
                cliente_exists.telefone = telefone

            if cidade != None and cidade != cliente_exists.cidade:
                cliente_exists.cidade = cidade

            if bairro != None and bairro != cliente_exists.bairro:
                cliente_exists.bairro = bairro
            
            if endereco != None and endereco != cliente_exists.endereco:
                cliente_exists.endereco = endereco
            
            if cep != None and cep != cliente_exists.cep:
                cliente_exists.cep = cep

            db.session.commit()

        except Exception as e:
            print(str(e))
            return '', 500
        
        return '', 200

# rota para deletar um cliente com base no cpf/cnpj informado
@view_client.route('/excluir/<int:id_desejado>', methods=['POST'])
@jwt_required()
def delete_client(id_desejado):
    from models.cliente import Cliente

    if request.method == 'POST':
        # checa se o cliente existe
        try:
            cliente_exists = db.session.query(Cliente).filter_by(cliente_id=id_desejado).one_or_none()
        except:
            return '', 500
        
        if not cliente_exists:
            return '', 404
        
        # exclui o cliente
        try:
                db.session.query(Cliente).filter_by(cliente_id=id_desejado).delete()
                db.session.commit()
                return '', 200
    
        except Exception as e:
            return jsonify({'err':str(e)})
        

# esta rota pesquisa o id do cliente
@view_client.route('/pesquisar/<int:id_desejado>', methods=['GET'])
@jwt_required()
def getClient(id_desejado):
    from models.cliente import Cliente

    try:
        cliente_exists = db.session.query(Cliente).filter_by(cliente_id=id_desejado).one_or_none()
    except Exception as e:
        return '', 500
    
    if cliente_exists:
        result = {}
        result[cliente_exists.cliente_id] = {
                                        "id":cliente_exists.cliente_id,
                                        "cpf_cnpj": cliente_exists.cpf_cnpj,
                                        "nome_completo": cliente_exists.nome_completo,
                                        "nome_fantasia": cliente_exists.nome_fantasia,
                                        "endereco": cliente_exists.endereco,
                                        "bairro": cliente_exists.bairro,
                                        "cidade": cliente_exists.cidade,
                                        "cep": cliente_exists.cep,
                                        "telefone": cliente_exists.telefone,
                                        "limite_credito": cliente_exists.limite_credito,
                                        "pessoa_juridica": cliente_exists.pessoa_juridica
                                    }
        # jsonify({cliente_exists.cliente_id:result})
        return result, 200
