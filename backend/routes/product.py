# realizando importações necessárias
from config import db, log_path
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from datetime import datetime

# criando uma blueprint
view_product = Blueprint('view_product', __name__, url_prefix='/produto')

# rota get all products
# essa rota deve exibir todos os produtos em lista na tela inicial do modulo de produtos
@view_product.route('/', methods=['GET'])
@jwt_required()
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

# rota pesquisa de produto por modelo/id
# rota utilizada pela barra de pesquisa
# essa rota deve exibir os produtos com base no numero de serie ou id
# @view_product.route('/pesquisar/<str_pesquisa>', methods=['GET'])
# def search_product(str_pesquisa):
#     from models.produto import Produto
#     from models.cliente import Cliente

#     # pesquisa pelo modelo
#     try:
#         # checa se é um id (apenas numeros)
#         if str_pesquisa.isdigit():
#             print(str_pesquisa)

#             produto_desejado =  db.session.query(Produto).filter_by(produto_id=int(str_pesquisa)).one_or_none()
#             print(produto_desejado)

#             if produto_desejado:
#                 cliente_nome = db.session.query(Cliente).filter_by(cliente_id=produto_desejado.cliente_id).one_or_none().nome_completo
#                 result = {
#                             "id":produto_desejado.produto_id,
#                             "cliente_nome": cliente_nome,
#                             "modelo": produto_desejado.modelo,
#                             "num_serie": produto_desejado.num_serie,
#                             "cor": produto_desejado.cor,
#                             "sis_operacional": produto_desejado.sis_operacional,
#                             "avaria": produto_desejado.avaria,
#                             "liga": produto_desejado.liga,
#                             "carrega": produto_desejado.carrega,
#                             "backup": produto_desejado.backup,
#                             "acessorios": produto_desejado.acessorios,
#                             "obs": produto_desejado.observacoes,
#                         }
#                 print(result)
#                 return result, 302
            
#             else:
#                 return '', 404
            
#         # else:
#         #     produto_desejado =  db.session.query(Produto).filter(Produto.modelo.ilike(f'%{str_pesquisa}%')).all()
            
#         #     if produto_desejado:
#         #         cliente_nome = db.session.query(Cliente).filter_by(cliente_id=produto_desejado.cliente_id).one_or_none().nome_completo

#         #         result = {}
#         #         for product in produto_desejado:
#         #             result[product.produto_id] = {
#         #                             "id":product.produto_id,
#         #                             "cliente_nome": cliente_nome,
#         #                             "modelo": product.modelo,
#         #                             "num_serie": product.num_serie,
#         #                             "cor": product.cor,
#         #                             "sis_operacional": product.sis_operacional,
#         #                             "avaria": 'Sim' if product.avaria == True else 'Não',
#         #                             "liga": 'Sim' if product.liga == True else 'Não',
#         #                             "carrega": 'Sim' if product.carrega == True else 'Não',
#         #                             "backup": 'Sim' if product.backup == True else 'Não',
#         #                             "acessorios": product.acessorios,
#         #                             "obs": product.observacoes,
#         #                         }
#         #         return result, 302
#         #     else:
#         #         return '', 404
    
#     except Exception as e:
#         return jsonify({'err':str(e)}), 500

        
# rota cadastro de produto
# esta rota deve exibir o formulário de produtos
# quando o formulario for enviado, deve cadastrar o produto no banco e ligá-lo ao cliente especificado
@view_product.route('/novo', methods=['POST'])
@jwt_required()
def new_product():
    if request.method == 'POST':
        from models.produto import Produto
        from models.cliente import Cliente

        try:
            # guarda dados do frontend
            data = request.json

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
            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT ERROR: {str(e)}')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'AINDA HÁ DADOS QUE NÃO FORAM CADASTRADOS'}
                return response, 500

        try:
            cliente_desejado = db.session.query(Cliente).filter_by(cliente_id=cliente_id).first()
        
        except Exception as e:
            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT ERROR: {str(e)}')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500

        # cliente deve existir
        if not cliente_desejado:
            response = {'status':'error','msg':'O CLIENTE SOLICITADO NÃO ESTÁ CADASTRADO'}
            return response, 404

        # verifica se o produto ja existe no banco
        try:
            product_exists = db.session.query(Produto).filter_by(num_serie=num_serie).first()
            
            if product_exists:
                response = {'status':'error', 'msg':'PRODUTO JÁ CADASTRADO'}
                return response, 409
                
        except Exception as e:
            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT ERROR: {str(e)}')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
            
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

            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT CREATED: CADASTRO DE NOVO PRODUTO REALIZADO PELO TECNICO ID {int(get_jwt_identity())} AS {datetime.now().strftime('%d/%m/%Y AS %H:%M:%S')}')

            except Exception as e:
                print('LOG NAO PODE SER CRIADO')
                print(str(e))
            
            finally:
                response = {'status':'success', 'msg':'PRODUTO CADASTRADO COM SUCESSO!'}
                return response, 201

        except Exception as e:
            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT ERROR: {str(e)}')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500

# rota para alterar um produto existente
# esta rota deve alterar os dados do produto desejado baseado no id
# 
@view_product.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def patch_product(id_desejado):
    from models.produto import Produto

    if request.method == 'POST':
        # recebe dados do frontend
        data = request.get_json()

        # separando em variaveis
        modelo = data.get('modelo_dispositivo')
        cor = data.get('cor_dispositivo')
        sistema = data.get('sistema_dispositivo')
        avaria = data.get('avaria')
        liga = data.get('liga')
        carrega = data.get('carrega')
        backup = data.get('backup_dispositivo')
        acessorio = data.get('acessorio_dispositivo')
        observacoes = data.get('obs_dispositivo')

        # checa se o produto existe
        try:
            produto_exists = db.session.query(Produto).filter_by(produto_id=id_desejado).one_or_none()
        except Exception as e:
            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT ERROR: {str(e)}')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
        
        if not produto_exists:
            response = {'status':'error', 'msg':'O PRODUTO SOLICITADO NÃO EXISTE'}
            return response, 404
        
        # realizando modificações
        try:
            if modelo != None and modelo != produto_exists.modelo:
                produto_exists.modelo = modelo
            
            if cor != None and cor != produto_exists.cor:
                produto_exists.cor = cor
            
            if sistema != None and sistema != produto_exists.sis_operacional:
                produto_exists.sis_operacional = sistema
            
            if avaria != None and avaria != produto_exists.avaria:
                produto_exists.avaria = avaria

            if liga != None and liga != produto_exists.liga:
                produto_exists.liga = liga

            if carrega != None and carrega != produto_exists.carrega:
                produto_exists.carrega = carrega
            
            if backup != None and backup != produto_exists.backup:
                produto_exists.backup = backup
            
            if acessorio != None and acessorio != produto_exists.acessorios:
                produto_exists.acessorios = acessorio
            
            if observacoes != None and observacoes != produto_exists.observacoes:
                            produto_exists.observacoes = observacoes

            db.session.commit()

            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT PATCHED: PRODUTO ID {id_desejado} EDITADO PELO TECNICO ID {int(get_jwt_identity())} AS {datetime.now().strftime('%d/%m/%Y AS %H:%M:%S')}')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'success', 'msg':'PRODUTO ALTERADO COM SUCESSO!'}
                return response, 200

        except Exception as e:
            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT ERROR: {str(e)}')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500

# rota para deletar um produto com base no id informado
@view_product.route('/excluir/<int:id_desejado>', methods=['POST'])
@jwt_required()
def delete_product(id_desejado):
    from models.produto import Produto

    if request.method == 'POST':
        # checa se o produto existe
        try:
            produto_exists = db.session.query(Produto).filter_by(produto_id=id_desejado).one_or_none()
        except Exception as e:
            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT ERROR: {str(e)}')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO COM O BANCO DE DADOS'}
                return response, 500
        
        if not produto_exists:
            response = {'status':'error', 'msg':'O PRODUTO SOLICITADO NÃO ESTÁ CADASTRADO'}
            return '', 404
        
        # exclui o produto
        try:
                db.session.query(Produto).filter_by(produto_id=id_desejado).delete()
                db.session.commit()
    
                try:
                    with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                        file.write(f'BACKEND PRODUCT DELETED: PRODUTO ID {id_desejado} DELETADO PELO TECNICO ID {int(get_jwt_identity())} AS {datetime.now().strftime('%d/%m/%Y AS %H:%M:%S')}')

                except:
                    print('LOG NAO PODE SER CRIADO')
            
                finally:
                    response = {'status':'success', 'msg':'PRODUTO DELETADO COM SUCESSO!'}
                    return response, 200
    
        except Exception as e:
            try:
                with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND PRODUCT ERROR: {str(e)}')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        
# rota usada para pesquisar produtos com base no id para ser utilizado para edição ou exclusão
@view_product.route('/pesquisar/<int:id_desejado>', methods=['GET'])
@jwt_required()
def getProduct(id_desejado):
    from models.produto import Produto
    from models.cliente import Cliente

    try:
        produto_desejado = db.session.query(Produto).filter_by(produto_id=id_desejado).first()
    
    except Exception as e:
        try:
            with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                file.write(f'BACKEND PRODUCT ERROR: {str(e)}')
        except:
            print('LOG NAO PODE SER CRIADO')
        
        finally:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
    
    try:
        # caso o produto exista
        if produto_desejado:
            # pega o nome do cliente do produto especifico
            cliente_nome = db.session.query(Cliente).filter_by(cliente_id=produto_desejado.cliente_id).one_or_none().nome_completo
            
        else:
            response = {'status':'error', 'msg':'O PRODUTO SOLICITADO NÃO ESTÁ CADASTRADO'}
            return response, 404
        
    except Exception as e:
        try:
            with open(f'{log_path}/log_prod_{datetime.now().strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                file.write(f'BACKEND PRODUCT ERROR: {str(e)}')
        except:
            print('LOG NAO PODE SER CRIADO')
        
        finally:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
    
    result = {
                "id":produto_desejado.produto_id,
                "cliente_nome": cliente_nome,
                "modelo": produto_desejado.modelo,
                "num_serie": produto_desejado.num_serie,
                "cor": produto_desejado.cor,
                "sis_operacional": produto_desejado.sis_operacional,
                "avaria": produto_desejado.avaria,
                "liga": produto_desejado.liga,
                "carrega": produto_desejado.carrega,
                "backup": produto_desejado.backup,
                "acessorios": produto_desejado.acessorios,
                "obs": produto_desejado.observacoes,
            }
                
    return result, 302