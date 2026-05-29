# realizando importações necessárias
from ..db import db
# from config import db
from flask_jwt_extended import jwt_required
from flask import Blueprint, jsonify, request
from sqlalchemy import or_

# criando uma blueprint
view_category = Blueprint('view_category', __name__, url_prefix='/categoria')

# rota get all category
# essa rota deve exibir todos os produtos em lista na tela inicial do modulo de produtos
@view_category.route('/', methods=['GET'])
@jwt_required()
def all_category():
    from ..models.categoria import Categoria
    categories = db.session.query(Categoria).all()
    
    result = {}
    # retorna clientes em formato json
    for category in categories:
        result[category.categoria_id] = {
                                    "id":category.categoria_id,
                                    "titulo": category.titulo,
                                    "tipo": category.tipo,
                                    "descricao": category.descricao
                                    }
    return result, 200
    # return resp

# rota get all specific category
# essa rota deve exibir todos os produtos em lista na tela inicial do modulo de produtos
@view_category.route('/<path:path>', methods=['GET'])
@jwt_required()
def all_typed_category(path=None):
    from ..models.categoria import Categoria

    type_for = path
    
    if type_for == 'service':
        categories = db.session.query(Categoria).filter(or_(Categoria.tipo == 'Geral', Categoria.tipo == 'Servico')).all()

    if type_for == 'storage':
        categories = db.session.query(Categoria).filter(or_(Categoria.tipo == 'Geral', Categoria.tipo == 'Estoque')).all()

    # if not type_for:
    #     categories = db.session.query(Categoria).all()
    
    result = {}
    # retorna clientes em formato json
    for category in categories:
        result[category.categoria_id] = {
                                    "id":category.categoria_id,
                                    "titulo": category.titulo,
                                    "tipo": category.tipo,
                                    "descricao": category.descricao
                                    }
    return result, 200

        
# rota cadastro de produto
# esta rota deve exibir o formulário de produtos
# quando o formulario for enviado, deve cadastrar o produto no banco e ligá-lo ao cliente especificado
@view_category.route('/novo', methods=['POST'])
@jwt_required()
def new_category():
    from ..models.categoria import Categoria
    
    if request.method == 'POST':

        try:
            # guarda dados do frontend
            data = request.json
            # separando em variaveis
            nome_categoria = data.get('nome_categoria')
            tipo = data.get('tipo_categoria')
            descricao = data.get('descricao_categoria')
            
        except Exception as e:
            return jsonify({'error':str(e)})

        # verifica se a categoria ja existe no banco
        try:
            categoria_exists = db.session.query(Categoria).filter(Categoria.titulo == nome_categoria).first()
            
            if categoria_exists:
                return '', 409
                
        except:
            return '', 500
        
        if not nome_categoria or nome_categoria == '' or len(nome_categoria) < 3:
            response = {'status':'error', 'msg':'O TÍTULO PARA A CATEGORIA É INVÁLIDO'}
            return response, 406
        
        try:
            # realizando transação
            # criando o produto a ser inserido
            categoria = Categoria(
                                titulo = nome_categoria,
                                tipo = tipo,
                                descricao = descricao,
                            )
            
            # inserindo e realizando commit
            db.session.add(categoria)

            db.session.commit()
            # fim da transação

            return '', 201

        except Exception as e:
            return str(e)
    

# rota para alterar um produto existente
# esta rota deve alterar os dados do produto desejado baseado no id
# 
@view_category.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def patch_categoria(id_desejado):
    from ..models.categoria import Categoria

    if request.method == 'POST':
        # recebe dados do frontend
        data = request.get_json()

        # separando em variaveis
        nome_categoria = data.get('nome_categoria')
        tipo = data.get('tipo_categoria')
        descricao = data.get('descricao_categoria')
        
        # checa se a categoria existe
        try:
            categoria_exists = db.session.query(Categoria).filter_by(categoria_id=id_desejado).one_or_none()
        except:
            return '', 500
        
        if not categoria_exists:
            return '', 404
        
        if nome_categoria and len(nome_categoria) < 3 or nome_categoria == '':
            response = {'status':'error', 'msg':'O TÍTULO PARA A CATEGORIA É INVÁLIDO'}
            return response, 406
        
        # if tipo == '':
        #     response = {'status':'error', 'msg':'O TIPO DA CATEGORIA É INVÁLIDO'}
        #     return response, 406
        
        # realizando modificações
        try:
            if nome_categoria != None and nome_categoria != categoria_exists.titulo:
                categoria_exists.titulo = nome_categoria
            
            if descricao != None and descricao != categoria_exists.descricao:
                categoria_exists.descricao = descricao
            
            if tipo != None and tipo != categoria_exists.tipo:
                categoria_exists.tipo = tipo

            db.session.commit()

        except Exception as e:
            print(str(e))
            return '', 500
        
        return '', 200

# rota para deletar um produto com base no id informado
@view_category.route('/excluir/<int:id_desejado>', methods=['POST'])
@jwt_required()
def delete_categoria(id_desejado):
    from ..models.categoria import Categoria

    if request.method == 'POST':
        # checa se o produto existe
        try:
            categoria_exists = db.session.query(Categoria).filter_by(categoria_id=id_desejado).one_or_none()
        except:
            return '', 500
        
        if not categoria_exists:
            return '', 404
        
        # exclui o produto
        try:
                db.session.query(Categoria).filter_by(categoria_id=id_desejado).delete()
                db.session.commit()
                return '', 200
    
        except Exception as e:
            return jsonify({'err':str(e)})
        
# rota usada para pesquisar categorias com base no id para ser utilizado para edição ou exclusão
@view_category.route('/pesquisar/<int:id_desejado>', methods=['GET'])
@jwt_required()
def get_categoria(id_desejado):
    from ..models.categoria import Categoria

    try:
        categoria_desejada = db.session.query(Categoria).filter_by(categoria_id=id_desejado).first()
    
    except Exception:
        return '', 500
    
    try:
        # caso a categoria exista
        if not categoria_desejada:
            return '', 404
        
    except Exception:
        return '', 500
    
    result = {
                "id":categoria_desejada.categoria_id,
                "titulo": categoria_desejada.titulo,
                "tipo": categoria_desejada.tipo,
                "descricao": categoria_desejada.descricao
            }
                
    return result, 302


# rota usada para buscar todos os titulos de categoria pelo tipo
@view_category.route('/busca/<str_busca>', methods=['GET'])
@jwt_required()
def get_categoria_by_type(str_busca):
    from ..models.estoque import Estoque
    from ..models.servico import Servico
    from ..models.categoria import Categoria

    if str_busca == 'estoque':
        titulos_categorias = db.session.query(Categoria).filter(Categoria.tipo.ilike(str_busca)).all()

        titulos_encontrados = {}
        
        for titulo in titulos_categorias:
            titulos_encontrados[titulo.categoria_id] = {
                                                        'id': titulo.categoria_id,
                                                        'titulo': titulo.titulo
                                                    }
        
        return titulos_encontrados, 200

    
    if str_busca == 'servico':
        titulos_categorias = db.session.query(Categoria).filter(Categoria.tipo.ilike(str_busca)).all()

        titulos_encontrados = {}
        
        for titulo in titulos_categorias:
            titulos_encontrados[titulo.categoria_id] = {
                                                        'id': titulo.categoria_id,
                                                        'titulo': titulo.titulo
                                                    }
        
        return titulos_encontrados, 200

    if str_busca == 'geral':
        titulos_categorias = db.session.query(Categoria).filter(Categoria.tipo.ilike(str_busca)).all()

        titulos_encontrados = {}
        
        for titulo in titulos_categorias:
            titulos_encontrados[titulo.categoria_id] = {
                                                        'id': titulo.categoria_id,
                                                        'titulo': titulo.titulo
                                                    }
        
        return titulos_encontrados, 200
