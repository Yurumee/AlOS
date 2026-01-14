# realizando importações necessárias
from config import db
from flask_jwt_extended import jwt_required
from flask import Blueprint, jsonify, request

# criando uma blueprint
view_storage = Blueprint('view_storage', __name__, url_prefix='/estoque')

# rota get all storage
# essa rota deve exibir todos os produtos em lista na tela inicial do modulo de produtos
@view_storage.route('/', methods=['GET'])
@jwt_required()
def all_storage():
    from models.estoque import Estoque
    from models.categoria import Categoria

    storage = db.session.query(Estoque).all()
    result = {}
    
    # retorna clientes em formato json
    for item in storage:
        item_categoria = db.session.query(Categoria).filter_by(categoria_id=item.categoria_id).one_or_none().titulo
        result[item.item_id] = {
                                    "id":item.item_id,
                                    "categoria": item_categoria,
                                    "nome_item": item.nome_item,
                                    "descricao": item.descricao_item,
                                    "quantidade": item.quantidade,
                                    "preco_un": item.preco_unitario,
                                    "codigo_barras": item.cod_barras
                                }
        
    return result, 200
    # return resp

# rota pesquisa de produto por modelo/id
# rota utilizada pela barra de pesquisa
# essa rota deve exibir os produtos com base no numero de serie ou id
# @view_storage.route('/pesquisar/<str_pesquisa>', methods=['GET'])
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
@view_storage.route('/novo', methods=['POST'])
@jwt_required()
def new_item():
    if request.method == 'POST':
        from models.estoque import Estoque
        from models.categoria import Categoria

        try:
            # guarda dados do frontend
            data = request.json

            # separando em variaveis
            # cliente_id = data.get('cliente_id')
            nome_item = data.get('nome_item')
            categoria = data.get('categoria_item')
            descricao = data.get('descicao_item')
            quantidade = int(data.get('quantidade'))
            preco_un = float(data.get('valor_un'))
            cod_barra = data.get('codigo_barras')

            print(data)
            
        except Exception as e:
            return jsonify({'error':str(e)})

        try:
            categoria_desejada = db.session.query(Categoria).filter_by(categoria_id=categoria).first()
        except:
            return '', 500

        # cliente deve existir
        if not categoria_desejada:
            return '', 404

        # verifica se o produto ja existe no banco
        try:
            item_exists = db.session.query(Estoque).filter_by(cod_barras=cod_barra).first()
            
            if item_exists:
                return '', 409
                
        except:
            return '', 500
        
        if not nome_item or nome_item == '' or len(nome_item) < 3:
            response = {'status':'error', 'msg':'NOME DO ITEM INVÁLIDO'}
            return response, 406
        
        if not quantidade or quantidade == '' or quantidade < 0:
            response = {'status':'error', 'msg':'QUANTIDADE DO ITEM INVÁLIDA'}
            return response, 406
        
        if not preco_un or preco_un == '' or preco_un < 0:
            response = {'status':'error', 'msg':'PREÇO DO ITEM INVÁLIDO'}
            return response, 406
        
        
        try:
            # realizando transação
            # criando o produto a ser inserido
            item = Estoque(
                                nome_item = nome_item,
                                descricao_item = descricao,
                                quantidade = quantidade,
                                preco_unitario = preco_un,
                                cod_barras = cod_barra,
                                categoria_id = categoria_desejada.categoria_id
                            )

            # inserindo e realizando commit
            db.session.add(item)

            print(item)
            # product.cliente.append(cliente_desejado)

            db.session.commit()
            # fim da transação

            return '', 201

        except Exception as e:
            return str(e)

# rota para alterar um produto existente
# esta rota deve alterar os dados do produto desejado baseado no id
# 
@view_storage.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def patch_item(id_desejado):
    from models.estoque import Estoque
    from models.categoria import Categoria

    if request.method == 'POST':
        
        # recebe dados do frontend
        data = request.get_json()

        # separando em variaveis
        nome_item = data.get('nome_item')
        categoria = data.get('categoria_item')
        descricao = data.get('descicao_item')
        quantidade = data.get('quantidade')
        preco_un = data.get('valor_un')
        cod_barra = data.get('codigo_barras')

        # checa se o produto existe
        try:
            item_exists = db.session.query(Estoque).filter_by(item_id=id_desejado).one_or_none()
        except:
            return '', 500
        
        if not item_exists:
            return '', 404
        
        try:
            categoria_desejada = db.session.query(Categoria).filter_by(categoria_id=categoria).first()
        except:
            return '', 500

        # cliente deve existir
        if categoria and not categoria_desejada:
            return '', 404
        
        if nome_item and nome_item == '':
            response = {'status':'error', 'msg':'NOME DO ITEM INVÁLIDO'}
            return response, 406
        
        if nome_item and len(nome_item) < 3:
            response = {'status':'error', 'msg':'NOME DO ITEM INVÁLIDO'}
            return response, 406
        
        if quantidade and quantidade == '':
            response = {'status':'error', 'msg':'QUANTIDADE DO ITEM INVÁLIDA'}
            return response, 406
        
        if quantidade and int(quantidade) < 0:
            response = {'status':'error', 'msg':'QUANTIDADE DO ITEM INVÁLIDA'}
            return response, 406
        
        if preco_un and preco_un == '':
            response = {'status':'error', 'msg':'PREÇO DO ITEM INVÁLIDO'}
            return response, 406
        
        if preco_un and float(preco_un) < 0:
            response = {'status':'error', 'msg':'PREÇO DO ITEM INVÁLIDO'}
            return response, 406
        
        # realizando modificações
        try:
            if nome_item != None and nome_item != item_exists.nome_item:
                item_exists.nome_item = nome_item
            
            if descricao != None and descricao != item_exists.descricao_item:
                item_exists.descricao_item = descricao
            
            if quantidade != None and quantidade != item_exists.quantidade:
                item_exists.quantidade = quantidade
            
            if preco_un != None and preco_un != item_exists.preco_unitario:
                item_exists.preco_unitario = preco_un

            if cod_barra != None and cod_barra != item_exists.cod_barras:
                item_exists.cod_barras = cod_barra

            if categoria_desejada != None and categoria_desejada.categoria_id != item_exists.categoria_id:
                item_exists.categoria_id = categoria_desejada.categoria_id
        

            db.session.commit()

        except Exception as e:
            print(str(e))
            return '', 500
        
        return '', 200

# rota para deletar um produto com base no id informado
@view_storage.route('/excluir/<int:id_desejado>', methods=['POST'])
@jwt_required()
def delete_item(id_desejado):
    from models.estoque import Estoque

    if request.method == 'POST':
        # checa se o produto existe
        try:
            item_exists = db.session.query(Estoque).filter_by(item_id=id_desejado).one_or_none()
        except:
            return '', 500
        
        if not item_exists:
            return '', 404
        
        # exclui o produto
        try:
                db.session.query(Estoque).filter_by(item_id=id_desejado).delete()
                db.session.commit()
                return '', 200
    
        except Exception as e:
            return jsonify({'err':str(e)})
        
# rota usada para pesquisar produtos com base no id para ser utilizado para edição ou exclusão
@view_storage.route('/pesquisar/<int:id_desejado>', methods=['GET'])
@jwt_required()
def getItem(id_desejado):
    from models.estoque import Estoque
    from models.categoria import Categoria

    try:
        item_desejado = db.session.query(Estoque).filter_by(item_id=id_desejado).first()
    
    except Exception:
        return '', 500
    
    try:
        # caso o produto exista
        if item_desejado:
            # pega o nome do cliente do produto especifico
            categoria_id = db.session.query(Categoria).filter_by(categoria_id=item_desejado.categoria_id).one_or_none().categoria_id
        else:
            return '', 404
    except Exception:
        return '', 500
    
    result = {
                "id":item_desejado.item_id,
                "nome_item": item_desejado.nome_item,
                "descricao": item_desejado.descricao_item,
                "quantidade": item_desejado.quantidade,
                "valor_un": item_desejado.preco_unitario,
                "codigo_barras": item_desejado.cod_barras,
                "categoria": categoria_id,
            }
    
    return result, 302

# rota usada para gerenciar itens com base no id para repor ou retiar sua quantidade
@view_storage.route('/gerenciamento/<int:id_desejado>', methods=['POST'])
@jwt_required()
def manageItem(id_desejado):
    from models.estoque import Estoque

    data = request.json
    quant = int(data.get('quantidade'))
    reposicao = data.get('isRepo')

    print(data)

    try:
        item_desejado = db.session.query(Estoque).filter_by(item_id=id_desejado).first()
    
    except Exception:
        return '', 500
    
    if not item_desejado:
        return '', 404
    
    if reposicao == True:
        item_desejado.quantidade = item_desejado.quantidade + quant
        db.session.commit()
        return '', 201
    
    else:
        if quant > item_desejado.quantidade:
            return '',  406
        
        else:
            item_desejado.quantidade = item_desejado.quantidade - quant
            db.session.commit()
            return '', 201