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

# rota pesquisa de produto por modelo/num_serie
# essa rota deve exibir os produtos com base no numero de serie informado, modelo ou id
@view_product.route('/pesquisar/<str_pesquisa>', methods=['GET'])
def search_product(str_pesquisa):
    from models.produto import Produto
    from models.cliente import Cliente

    print(str_pesquisa)

    # pesquisa pelo modelo
    try:
        # checa se é um id (apenas numeros)
        if str_pesquisa.isdigit():
            produto_desejado =  db.session.query(Produto).filter_by(produto_id=int(str_pesquisa)).all()

            if produto_desejado:
                cliente_nome = db.session.query(Cliente).filter_by(cliente_id=produto_desejado.cliente_id).one_or_none().nome_completo
                
                result = {}
                for product in produto_desejado:
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
                return result, 302
            
            else:
                return '', 404
    
    
        else:
            produto_desejado =  db.session.query(Produto).filter(Produto.modelo.ilike(f'%{str_pesquisa}%')).all()
            
            if produto_desejado:
                cliente_nome = db.session.query(Cliente).filter_by(cliente_id=produto_desejado.cliente_id).one_or_none().nome_completo

                result = {}
                for product in produto_desejado:
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
                return result, 302
            else:
                return '', 404
    
    except Exception as e:
        return jsonify({'err':str(e)}), 500

        
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

# rota para alterar um produto existente
# esta rota deve alterar os dados do produto desejado baseado no id
# 
@view_product.route('/editar/<int:id_desejado>', methods=['POST'])
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
        except:
            return '', 500
        
        if not produto_exists:
            return '', 404
        
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

        except Exception as e:
            print(str(e))
            return '', 500
        
        return '', 200

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
