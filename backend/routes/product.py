# realizando importações necessárias
from config import db
from flask import Blueprint, jsonify, request

# criando uma blueprint
view_product = Blueprint('view_product', __name__, url_prefix='/produto')

# rota get all products
# essa rota deve exibir todos os produtos em lista na tela inicial do modulo de produtos
@view_product.route('/', methods=['GET'])
def all_products():
    from models.produto import Produto
    from models.cliente import Cliente

    products = db.session.query(Produto).all()
    result = {}
    
    # retorna clientes em formato json
    for product in products:
        cliente_nome = db.session.query(Cliente).filter_by(cliente_id=product.cliente_id).one_or_none().nome_completo
        result[product.produto_id] = {
                                    "id":product.produto_id,
                                    "cliente_nome": cliente_nome,
                                    "modelo": product.modelo,
                                    "num_serie": product.num_serie,
                                    "cor": product.cor,
                                    "sis_operacional": product.sis_operacional,
                                    "avaria": 'Sim' if product.avaria == True else 'Não',
                                    "liga": 'Sim' if product.liga == True else 'Não',
                                    "carrega": 'Sim' if product.carrega == True else 'Não',
                                    "backup": 'Sim' if product.backup == True else 'Não',
                                    "acessorios": product.acessorios,
                                    "obs": product.observacoes,
                                }
        
    return result, 200
    # return resp

# rota pesquisa de cliente por nome/cpf/cnpj
# essa rota deve exibir os clientes com base no cpf/cnpj informado ou nome do cliente
@view_product.route('/pesquisar/<str_pesquisa>', methods=['GET', 'POST'])
def search_client(str_pesquisa):
    
    if request.method == 'POST':
        from models.cliente import Cliente
        # pesquisa pelo cpf/cnpj
        if str_pesquisa.isdigit():    
            # pesquisa pelo cpf
            if int(str_pesquisa) == 11:
                
                try:
                    cliente_desejado =  db.session.query(Cliente).filter_by(cpf_cnpj=int(str_pesquisa)).one_or_none()
                    if cliente_desejado:
                        return jsonify({'cliente pesquisado':f'{cliente_desejado.nome_completo}'})
                    else:
                        return jsonify({'message':'cliente com esse cpf nao existe'})
                
                except Exception as e:
                    return jsonify({'err':str(e)})

            # pesquisa pelo cnpj
            elif int(str_pesquisa) == 14:
                
                try:
                    cliente_desejado =  db.session.query(Cliente).filter_by(cpf_cnpj=int(str_pesquisa)).one_or_none()
                    if cliente_desejado:
                        return jsonify({'cliente pesquisado':f'{cliente_desejado.nome_completo}'})
                    else:
                        return jsonify({'message':'cliente com esse cnpj nao existe'})
                
                except Exception as e:
                    return jsonify({'err':str(e)})

            # se não for nenhum dos dois, o dado é invalido
            else:
                return 'o dado nao é valido'

        # pesquisa pelo nome
        try:
            clientes_desejados =  db.session.query(Cliente).filter(Cliente.nome_completo.ilike(f'%{str_pesquisa}%')).all()

            if clientes_desejados:
                result = {}
                for cliente in clientes_desejados:
                    result[cliente.cliente_id] = {
                                                'cpf_cnpj': cliente.cpf_cnpj,
                                                'nome_cliente':cliente.nome_completo,
                                                'nome_fantasia':cliente.nome_fantasia,
                                                'endereco':cliente.endereco,
                                                'bairro':cliente.bairro,
                                                'cep':cliente.cep,
                                                'cidade':cliente.cidade,
                                                'limite_credito':cliente.limite_credito,
                                                'pessoa_juridica':cliente.pessoa_juridica
                                                }

                return jsonify({'clientes pesquisados':result})
            
            else:
                return jsonify({'message':'cliente com esse nome nao existe'})
        
        except Exception as e:
            return jsonify({'err':str(e)})

    
    # return 'nao é um tipo de dado valido'

# rota cadastro de produto
# esta rota deve exibir o formulário de produtos
# quando o formulario for enviado, deve cadastrar o produto no banco e ligá-lo ao cliente especificado
@view_product.route('/novo', methods=['POST'])
def new_client():
    if request.method == 'POST':
        from models.produto import Produto
        from models.cliente import Cliente

        try:
            # guarda dados do frontend
            data = request.json
            print(data)

            # separando em variaveis
            cliente_id = data.get('cliente_id')
            modelo = data.get('modelo')
            num_serie = data.get('num_serie')
            cor = data.get('cor')
            so = data.get('sis_operacional')
            avaria = data.get('avaria')
            liga = data.get('liga')
            carrega = data.get('carrega')
            backup = data.get('backup')
            acessorios = data.get('acessorios')
            observacoes = data.get('obs')
        
        except Exception as e:
            return jsonify({'error':str(e)})

        try:
            cliente_desejado = db.session.query(Cliente).filter_by(cliente_id=cliente_id).first()
            print(cliente_desejado)
        except:
            return '', 500

        # cliente deve existir
        if not cliente_desejado:
            return '', 404

        # verifica se o produto ja existe no banco
        try:
            product_exists = db.session.query(Produto).filter_by(num_serie=num_serie).first()
            
            if product_exists:
                return '', 409
                
        except:
            return '', 500
        
        
        try:
            # realizando transação
            # criando o produto a ser inserido
            product = Produto(
                                modelo = modelo,
                                num_serie = num_serie,
                                cor = cor,
                                sis_operacional = so,
                                avaria = avaria,
                                liga = liga,
                                carrega = carrega,
                                backup = backup,
                                acessorios = acessorios,
                                observacoes = observacoes,
                                cliente_id = cliente_id
                            )

            # inserindo e realizando commit
            db.session.add(product)

            # product.cliente.append(cliente_desejado)

            db.session.commit()
            # fim da transação

            return '', 201

        except Exception as e:
            return str(e)

# # rota para alterar um cliente existente
# # esta rota deve alterar os dados do cliente desejado baseado no cpf/cnpj
# # 
# @view_product.route('/editar/<int:id_desejado>', methods=['POST'])
# def patch_client(id_desejado):
#     from models.cliente import Cliente

#     if request.method == 'POST':
#         # recebe dados do frontend
#         data = request.get_json()

#         # separando em variaveis
#         nome = data.get('nome_cliente')
#         nome_fantasia = data.get('empresa_cliente')
#         endereco = data.get('endereco_cliente')
#         bairro = data.get('bairro_cliente')
#         cidade = data.get('cidade_cliente')
#         cep = data.get('cep_cliente')
#         telefone = data.get('telefone_cliente')
#         lim_credito = data.get('limite_credito')

#         # checa se o cliente existe
#         try:
#             cliente_exists = db.session.query(Cliente).filter_by(cliente_id=id_desejado).one_or_none()
#         except:
#             return '', 500
        
#         if not cliente_exists:
#             return '', 404
        
#         # checar se os dados estao corretos
#         # if not nome:
#         #     return '', 406
        
#         # if not nome_fantasia and cliente_exists.pessoa_juridica == True:
#         #     return '', 406
        
#         if lim_credito != None and float(lim_credito) < 0:
#             return '', 406
        
#         if telefone != None and all(char.isdigit() for char in telefone) != True:
#             return '', 406
        
#         # if not endereco or not bairro or not cidade:
#         #     return '', 406
        
#         # realizando modificações
#         try:
#             if nome != None and nome != cliente_exists.nome_completo:
#                 cliente_exists.nome_completo = nome
#                 # db.session.commit()
            
#             if nome_fantasia != None and nome_fantasia != cliente_exists.nome_fantasia:
#                 cliente_exists.nome_fantasia = nome_fantasia
            
#             if lim_credito != None and lim_credito != cliente_exists.limite_credito:
#                 cliente_exists.limite_credito = float(lim_credito)
            
#             if telefone != None and telefone != cliente_exists.telefone:
#                 cliente_exists.telefone = telefone

#             if cidade != None and cidade != cliente_exists.cidade:
#                 cliente_exists.cidade = cidade

#             if bairro != None and bairro != cliente_exists.bairro:
#                 cliente_exists.bairro = bairro
            
#             if endereco != None and endereco != cliente_exists.endereco:
#                 cliente_exists.endereco = endereco
            
#             if cep != None and cep != cliente_exists.cep:
#                 cliente_exists.cep = cep

#             db.session.commit()

#         except Exception as e:
#             print(str(e))
#             return '', 500
        
#         return '', 200

# # rota para deletar um cliente com base no cpf/cnpj informado
# @view_product.route('/excluir/<int:id_desejado>', methods=['POST'])
# def delete_client(id_desejado):
#     from models.cliente import Cliente

#     if request.method == 'POST':
#         # checa se o cliente existe
#         try:
#             cliente_exists = db.session.query(Cliente).filter_by(cliente_id=id_desejado).one_or_none()
#         except:
#             return '', 500
        
#         if not cliente_exists:
#             return '', 404
        
#         # exclui o cliente
#         try:
#                 db.session.query(Cliente).filter_by(cliente_id=id_desejado).delete()
#                 db.session.commit()
#                 return '', 200
    
#         except Exception as e:
#             return jsonify({'err':str(e)})
        
# @view_product.route('/pesquisar/<int:id_desejado>', methods=['GET'])
# def getClient(id_desejado):
#     from models.cliente import Cliente

#     try:
#         cliente_exists = db.session.query(Cliente).filter_by(cliente_id=id_desejado).one_or_none()
#     except Exception as e:
#         return '', 500
    
#     if cliente_exists:
#         result = {}
#         result[cliente_exists.cliente_id] = {
#                                         "id":cliente_exists.cliente_id,
#                                         "cpf_cnpj": cliente_exists.cpf_cnpj,
#                                         "nome_completo": cliente_exists.nome_completo,
#                                         "nome_fantasia": cliente_exists.nome_fantasia,
#                                         "endereco": cliente_exists.endereco,
#                                         "bairro": cliente_exists.bairro,
#                                         "cidade": cliente_exists.cidade,
#                                         "cep": cliente_exists.cep,
#                                         "telefone": cliente_exists.telefone,
#                                         "limite_credito": cliente_exists.limite_credito,
#                                         "pessoa_juridica": cliente_exists.pessoa_juridica
#                                     }
#         # jsonify({cliente_exists.cliente_id:result})
#         return result, 200
