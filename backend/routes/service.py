# realizando importações necessárias
from config import db
from flask_jwt_extended import jwt_required
from flask import Blueprint, jsonify, request

# criando uma blueprint
view_service = Blueprint('view_service', __name__, url_prefix='/servico')

# rota get all storage
# essa rota deve exibir todos os servicos em lista na tela inicial do modulo de servico
@view_service.route('/', methods=['GET'])
@jwt_required()
def all_service():
    from models.servico import Servico
    from models.categoria import Categoria

    services = db.session.query(Servico).all()
    result = {}
    
    # retorna clientes em formato json
    for service in services:
        servico_categoria = db.session.query(Categoria).filter_by(categoria_id=service.categoria_id).one_or_none().titulo
        result[service.servico_id] = {
                                    "id":service.servico_id,
                                    "categoria": servico_categoria,
                                    "nome_servico": service.nome_servico,
                                    "descricao": service.descricao_servico,
                                    "valor": service.custo
                                }
        
    return result, 200
    # return resp

# rota pesquisa de produto por modelo/id
# rota utilizada pela barra de pesquisa
# essa rota deve exibir os produtos com base no numero de serie ou id
# @view_service.route('/pesquisar/<str_pesquisa>', methods=['GET'])
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

        
# rota cadastro de servico
# esta rota deve exibir o formulário de servicos
# quando o formulario for enviado, deve cadastrar o servico no banco e ligá-lo a categoria especificada
@view_service.route('/novo', methods=['POST'])
@jwt_required()
def new_service():
    if request.method == 'POST':
        from models.servico import Servico
        from models.categoria import Categoria

        try:
            # guarda dados do frontend
            data = request.json

            # separando em variaveis
            # cliente_id = data.get('cliente_id')
            nome_servico = data.get('nome_servico')
            categoria = data.get('categoria_servico')
            descricao = data.get('descicao_servico')
            valor = data.get('custo_servico')

            print(data)
            
        except Exception as e:
            return jsonify({'error':str(e)})

        try:
            categoria_desejada = db.session.query(Categoria).filter_by(categoria_id=categoria).first()
            
        except:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500

        # categoria deve existir
        if not categoria_desejada:
            response = {'status':'error', 'msg':'A CATEGORIA SOLICITADA NÃO ESTÁ CADASTRADA NO BANCO DE DADOS'}
            return response, 404

        # verifica se o servico ja existe no banco
        try:
            service_exists = db.session.query(Servico).filter_by(nome_servico=nome_servico).first()
            
            if service_exists:
                response = {'status':'error', 'msg':'O SERVIÇO JÁ ESTÁ CADASTRADO'}
                return response, 409
                
        except:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        
        if not nome_servico or nome_servico == '' or len(nome_servico) < 3:
            response = {'status':'error', 'msg':'NOME DO SERVIÇO INVÁLIDO'}
            return response, 406
        
        if not valor or valor == '' or float(valor) < 0:
            response = {'status':'error', 'msg':'VALOR DO SERVIÇO OFERTADO É INVÁLIDO'}
            return response, 406
        
        try:
            # realizando transação
            # criando o serviço a ser inserido
            servico = Servico(
                                nome_servico = nome_servico,
                                descricao_servico = descricao,
                                custo = float(valor),
                                categoria_id = categoria_desejada.categoria_id
                            )

            # inserindo e realizando commit
            db.session.add(servico)

            print(servico)
            # product.cliente.append(cliente_desejado)

            db.session.commit()
            # fim da transação

            response = {'status':'success', 'msg':'SERVIÇO CADASTRADO COM SUCESSO'}
            return response, 201
        
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}


# rota para alterar um servico existente
# esta rota deve alterar os dados do servico desejado baseado no id

@view_service.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def patch_service(id_desejado):
    from models.servico import Servico
    from models.categoria import Categoria

    if request.method == 'POST':
        
        # recebe dados do frontend
        data = request.get_json()

        # separando em variaveis
        nome_servico = data.get('nome_servico')
        categoria = data.get('categoria_servico')
        descricao = data.get('descicao_servico')
        valor = data.get('valor_servico')

        # checa se o produto existe
        try:
            servico_exists = db.session.query(Servico).filter_by(servico_id=id_desejado).one_or_none()
        except:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        
        if not servico_exists:
            response = {'status':'error', 'msg':'O SERVIÇO NÃO ESTÁ CADASTRADO NO BANCO DE DADOS'}
            return response, 404
        
        try:
            categoria_desejada = db.session.query(Categoria).filter_by(categoria_id=categoria).first()
        except:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500

        # categoria deve existir
        if categoria and not categoria_desejada:
            response = {'status':'error','msg':'A CATEGORIA DESEJADA NÃO ESTÁ CADASTRADA NO BANCO DE DADOS'}
            return response, 404
        
        if nome_servico and nome_servico == '':
            response = {'status':'error', 'msg':'NOME DO SERVIÇO INVÁLIDO'}
            return response, 406
        
        if nome_servico and len(nome_servico) < 3:
            response = {'status':'error', 'msg':'NOME DO SERVIÇO INVÁLIDO'}
            return response, 406
        
        if valor and valor == '':
            response = {'status':'error', 'msg':'VALOR DO SERVIÇO INVÁLIDO'}
            return response, 406
        
        if valor and float(valor) < 0:
            response = {'status':'error', 'msg':'VALOR DO SERVIÇO INVÁLIDO'}
            return response, 406
        
        # realizando modificações
        try:
            if nome_servico != None and nome_servico != servico_exists.nome_servico:
                servico_exists.nome_servico = nome_servico
            
            if descricao != None and descricao != servico_exists.descricao_servico:
                servico_exists.descricao_servico = descricao
            
            if valor != None and valor != servico_exists.custo:
                servico_exists.custo = valor
            
            if categoria_desejada != None and categoria_desejada.categoria_id != servico_exists.categoria_id:
                servico_exists.categoria_id = categoria_desejada.categoria_id
        

            db.session.commit()
            
            response = {'status':'success', 'msg':'SERVIÇO EDITADO COM SUCESSO!'}
            return response, 200

        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        

# rota para deletar um produto com base no id informado
@view_service.route('/excluir/<int:id_desejado>', methods=['POST'])
@jwt_required()
def delete_service(id_desejado):
    from models.servico import Servico

    if request.method == 'POST':
        # checa se o servico existe
        try:
            servico_exists = db.session.query(Servico).filter_by(servico_id=id_desejado).one_or_none()
        except:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        
        if not servico_exists:
            response = {'status':'error', 'msg':'O SERVIÇO NÃO ESTÁ CADASTRADO NO BANCO DE DADOS'}
            return response, 404
        
        # exclui o servico
        try:
                db.session.query(Servico).filter_by(servico_id=id_desejado).delete()
                db.session.commit()
                response = {'status':'success', 'msg':'O SERVIÇO FOI DELETADO'}
                return response, 200
    
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        
# rota usada para pesquisar servicos com base no id para ser utilizado para edição ou exclusão
@view_service.route('/pesquisar/<int:id_desejado>', methods=['GET'])
@jwt_required()
def get_service(id_desejado):
    from models.servico import Servico
    from models.categoria import Categoria

    try:
        servico_desejado = db.session.query(Servico).filter_by(servico_id=id_desejado).first()
    
    except Exception:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500
    
    try:
        # caso o servico exista
        if servico_desejado:
            # pega o nome da categoria do servico especifico
            categoria_id = db.session.query(Categoria).filter_by(categoria_id=servico_desejado.categoria_id).one_or_none().categoria_id
        else:
            response = {'status':'error', 'msg':'O SERVIÇO NÃO ESTÁ CADASTRADO NO BANCO DE DADOS'}
            return response, 404
    except Exception:
        response = {'status':'error', 'msg':'HOUVE UM ERRO COM O BANCO DE DADOS'}
        return response, 500
    
    result = {
                "id":servico_desejado.servico_id,
                "nome_servico": servico_desejado.nome_servico,
                "descricao": servico_desejado.descricao_servico,
                "valor": servico_desejado.custo,
                "categoria": categoria_id,
            }
    
    return result, 302

# # rota usada para gerenciar itens com base no id para repor ou retiar sua quantidade
# @view_service.route('/gerenciamento/<int:id_desejado>', methods=['POST'])
# @jwt_required()
# def manageItem(id_desejado):
#     from models.estoque import Estoque

#     data = request.json
#     quant = int(data.get('quantidade'))
#     reposicao = data.get('isRepo')

#     print(data)

#     try:
#         item_desejado = db.session.query(Estoque).filter_by(item_id=id_desejado).first()
    
#     except Exception:
#         return '', 500
    
#     if not item_desejado:
#         return '', 404
    
#     if reposicao == True:
#         item_desejado.quantidade = item_desejado.quantidade + quant
#         db.session.commit()
#         return '', 201
    
#     else:
#         if quant > item_desejado.quantidade:
#             return '',  406
        
#         else:
#             item_desejado.quantidade = item_desejado.quantidade - quant
#             db.session.commit()
#             return '', 201