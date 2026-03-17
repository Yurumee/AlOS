from config import db

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import locale
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

view_os = Blueprint('view_os', __name__, url_prefix='/os')

# rota get all os
# essa rota deve exibir todas as ordens de serviço em lista na tela inicial do modulo de ordens
@view_os.route('/', methods=['GET'])
@jwt_required()
def all_os():
    from models.ordemServico import OrdemServico
    from models.cliente import Cliente
    from models.produto import Produto
    from models.tecnico import Tecnico

    orders = db.session.query(OrdemServico).all()
    result = {}
    
    # retorna ordens de serviço em formato json
    for os in orders:
        cliente_os = db.session.query(Cliente).filter_by(cliente_id=os.cliente_id).one_or_none().nome_completo

        produto_os = db.session.query(Produto).filter_by(produto_id=os.produto_id).one_or_none().num_serie

        tecnico_os = db.session.query(Tecnico).filter_by(cpf_tecnico=os.tecnico_cpf).one_or_none().nome_tecnico

        result[os.ordem_id] = {
                                    "id":os.ordem_id,
                                    "tipo_ordem": os.tipo_ordem,
                                    "tecnico_resp": tecnico_os,
                                    "cliente_nome": cliente_os,
                                    "produto_num_serie": produto_os,
                                    "prognostico": os.prognostico,
                                    "diagnostico": os.diagnostico,
                                    "orcamento": os.orcamento,
                                    "estado": os.estado_os,
                                    "emitida": os.emitida,
                                    "data_emissao": datetime.strftime(os.emissao, '%A, %d/%m/%Y às %H:%M:%S'),
                                    "data_fechamento": os.fechamento,
                                    "validade": os.validade,
                                    "ult_atualizacao": os.ultima_atualizacao
                                }
        
    return result, 200
        
# rota cadastro de nova ordem
# esta rota deve exibir o formulário de ordens de serviço
# quando o formulario for enviado, deve cadastrar a ordem no banco e ligá-la ao cliente, produto e tecnico especificado
@view_os.route('/novo', methods=['POST'])
@jwt_required()
def new_os():
    if request.method == 'POST':
        from models.ordemServico import OrdemServico
        from models.tecnico import Tecnico
        from models.produto import Produto
        from models.cliente import Cliente

        try:
            # guarda dados do frontend
            data = request.json

            # separando em variaveis
            cliente_id = data.get('cliente_id')
            produto_id = data.get('produto_id')
            tecnico_id = int(get_jwt_identity())
            tipo_os = data.get('tipo_os')
            prognostico = data.get('prognostico')
            diagnostico = data.get('diagnostico')
            orcamento = data.get('orcamento')
            estado = data.get('estado')
            emitir = data.get('emitir')
            criacao = data.get('hora_emissao')
            fechamento = data.get('hora_fechamento')
            validade = data.get('data_validade')
            valor_orcamento = 0.0

            print(f'cliente id: {cliente_id}')
            print(f'produto id: {produto_id}')
            print(f'tecnico id: {tecnico_id}')
            print(f'tipo os: {tipo_os}')
            print(f'diagnostico: {diagnostico}')
            print(f'prognostico: {prognostico}')
            print(f'orcamento: {orcamento}')
            print(f'estado: {estado}')
            print(f'emitir: {emitir}')
            print(f'emissao: {criacao}')
            print(f'validade: {validade}')
            print(f'fechamento: {fechamento}')
        
        except Exception as e:    
            response = {'status':'error', 'msg':'AINDA HÁ DADOS QUE NÃO FORAM CADASTRADOS'}
            return response, 500

        try:
            cliente_desejado = db.session.query(Cliente).filter_by(cliente_id=cliente_id).first()
        
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500

        # cliente deve existir
        if not cliente_desejado:
            response = {'status':'error','msg':'O CLIENTE SOLICITADO NÃO ESTÁ CADASTRADO'}
            return response, 404

        # verifica se o produto ja existe no banco
        try:
            product_exists = db.session.query(Produto).filter_by(produto_id=produto_id).first()
            
            if not product_exists:
                response = {'status':'error', 'msg':'O PRODUTO SOLICITADO NÃO ESTÁ CADASTRADO'}
                return response, 404
                
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        
        # puxa o cpf do tecnico
        try:
            tecnico_cpf = db.session.query(Tecnico).filter_by(tecnico_id=tecnico_id).first().cpf_tecnico
        except:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        
        # se a data de criação for nulo, puxe a data atual
        # senão, pegue o datetime informado e transforme de string para datetime
        if criacao == None:
            criacao = datetime.now()
        
        else:
            criacao = datetime.strptime(criacao, '%Y-%m-%dT%H:%M')

        # se a data de validade for nulo, puxe a data atual
        # senão, pegue o datetime informado e transforme de string para datetime
        # a diferença minima deve ser de 1 semana entre a data de criação e a data de validade
        if validade == None:
            validade = criacao + timedelta(weeks=1)

        else:
            validade = datetime.strptime(validade, '%Y-%m-%dT%H:%M')
        
        diferenca_data = validade.date() - criacao.date()
        if diferenca_data.days//7 < 1:
            validade = criacao + timedelta(weeks=1)

        # atualize o valor do orçamento total
        for item in orcamento:
            valor_orcamento += (float(item['preco']) * int(item['quantidade']))
        
        # se a os tiver sido emitida e autorizada, retire os itens de estoque
        if emitir and estado == 'Autorizada':
            from models.estoque import Estoque

            for item in orcamento:
                if item['tipo'] == 'estoque':
                    item_atualizar = db.session.query(Estoque).filter_by(cod_barras=item['cod_barra_item']).one_or_none()
                    item_atualizar.quantidade -= item['quantidade'] 
                    
                    # se for ficar com estoque negativo, transforme em 0
                    if item_atualizar.quantidade < 0:
                        item_atualizar.quantidade = 0

        # se ela tiver sido emitida mas estiver em um estado diferente de 
        # autorizada, não autorizada ou cancelada
        # transforme em finalizada
        if emitir and (estado == 'Criada' or estado == 'Em análise'):
            estado = 'Finalizada'
            
        try:
            # realizando transação
            # criando a os a ser inserido

            os = OrdemServico(
                                tecnico_cpf = tecnico_cpf,
                                produto_id = produto_id,
                                cliente_id = cliente_id,
                                tipo_ordem = tipo_os,
                                emissao = criacao,
                                fechamento = fechamento,
                                validade = validade,
                                prognostico = prognostico,
                                diagnostico = diagnostico,
                                orcamento = valor_orcamento,
                                estado_os = estado,
                                emitida = emitir,
                                ultima_atualizacao = datetime.now()
                            )

            # inserindo e realizando commit
            db.session.add(os)

            db.session.commit()
            # fim da transação

            response = {'status':'success', 'msg':'ORDEM DE SERVIÇO CADASTRADA COM SUCESSO!'}
            return response, 201

        except Exception as e:
            print(str(e))
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500

# rota para alterar uma os existente
# esta rota deve alterar os dados da os desejada baseado no id 
@view_os.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def patch_os(id_desejado):
    from models.ordemServico import OrdemServico

    if request.method == 'POST':
        # recebe dados do frontend
        data = request.get_json()

        # separando em variaveis
        tipo = data.get('tipo_os')
        fechamento = data.get('fechamento')
        validade = data.get('validade')
        prognostico = data.get('prognostico')
        diagnostico = data.get('diagnostico')
        orcamento = data.get('orcamento')
        estado = data.get('estado')
        emitir = data.get('emitir_os')

        # checa se a os existe
        try:
            os_exists = db.session.query(OrdemServico).filter_by(ordem_id=id_desejado).one_or_none()
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        
        if not os_exists:
            response = {'status':'error', 'msg':'A ORDEM SOLICITADA NÃO EXISTE'}
            return response, 404
        
        # checa se a ordem foi emitida ou não
        # se foi emitida, não permite editar
        if os_exists.emitida:
            response = {'status':'error', 'msg':'A ORDEM JÁ FOI EMITIDA E NÃO PODE SER EDITADA'}
            return response, 401

        # realizando modificações
        try:
            if tipo != None and tipo != os_exists.tipo:
                os_exists.tipo_ordem = tipo
                os_exists.ultima_atualizacao = datetime.now()
            
            if fechamento != None and fechamento != os_exists.fechamento:
                os_exists.fechamento = fechamento
                os_exists.ultima_atualizacao = datetime.now()
            
            if validade != None and validade != os_exists.validade:
                os_exists.validade = validade
                os_exists.ultima_atualizacao = datetime.now()
            
            if prognostico != None and prognostico != os_exists.prognostico:
                os_exists.prognostico = prognostico
                os_exists.ultima_atualizacao = datetime.now()

            if diagnostico != None and diagnostico != os_exists.diagnostico:
                os_exists.diagnostico = diagnostico
                os_exists.ultima_atualizacao = datetime.now()

            if orcamento != None and orcamento != os_exists.orcamento:
                os_exists.orcamento = orcamento
                os_exists.ultima_atualizacao = datetime.now()
            
            if estado != None and estado != os_exists.estado_os:
                os_exists.estado_os = estado
                os_exists.ultima_atualizacao = datetime.now()
            
            if emitir != None and emitir != os_exists.emitida:
                os_exists.emitida = emitir
                os_exists.ultima_atualizacao = datetime.now()
            
            # if observacoes != None and observacoes != os_exists.observacoes:
            #                 os_exists.observacoes = observacoes

            db.session.commit()
            response = {'status':'success', 'msg':'ORDEM DE SERVIÇO ALTERADA COM SUCESSO!'}
            return response, 200

        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500

# rota para deletar uma ordem de serviço com base no id informado
@view_os.route('/excluir/<int:id_desejado>', methods=['POST'])
@jwt_required()
def delete_os(id_desejado):
    from models.ordemServico import OrdemServico

    if request.method == 'POST':
        # checa se a ordem existe
        try:
            os_exists = db.session.query(OrdemServico).filter_by(ordem_id=id_desejado).one_or_none()
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO COM O BANCO DE DADOS'}
            return response, 500
        
        if not os_exists:
            response = {'status':'error', 'msg':'A ORDEM DE SERVIÇO SOLICITADA NÃO ESTÁ CADASTRADA'}
            return '', 404
        
        # checa se a ordem já foi emitida
        # se sim, não permite a exclusão
        if os_exists.emitida:
            response = {'status':'error', 'msg':'A ORDEM JÁ FOI EMITIDA E NÃO PODE SER EXCLUÍDA'}
            return response, 401

        # exclui a ordem
        try:
                db.session.query(OrdemServico).filter_by(ordem_id=id_desejado).delete()
                db.session.commit()
    
                response = {'status':'success', 'msg':'ORDEM DE SERVIÇO DELETADA COM SUCESSO!'}
                return response, 200
    
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        
# rota usada para pesquisar ordem com base no id para ser utilizado para edição ou exclusão
@view_os.route('/pesquisar/<int:id_desejado>', methods=['GET'])
@jwt_required()
def getOS(id_desejado):
    from models.ordemServico import OrdemServico
    from models.produto import Produto
    from models.cliente import Cliente

    try:
        os_desejada = db.session.query(OrdemServico).filter_by(ordem_id=id_desejado).first()
    
    except Exception as e:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500
    
    try:
        # caso a ordem de serviço exista
        if os_desejada:
            # pega o nome do cliente da os especifica
            cliente_nome = db.session.query(Cliente).filter_by(cliente_id=os_desejada.cliente_id).one_or_none().nome_completo

            produto_num_serie = db.session.query(Produto).filter_by(produto_id=os_desejada.produto_id).one_or_none().num_serie
            
        else:
            response = {'status':'error', 'msg':'O CLIENTE OU PRODUTO SOLICITADO NÃO ESTÃO CADASTRADOS'}
            return response, 404
        
    except Exception as e:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500
    
    result = {
                "id":os_desejada.ordem_id,
                "cliente_nome": cliente_nome,
                "num serie": produto_num_serie,
                "tecnico resp": os_desejada.tecnico_cpf,
                "tipo": os_desejada.tipo_ordem,
                "data_emissao": os_desejada.emissao,
                "data_fechamento": os_desejada.fechamento,
                "validade": os_desejada.validade,
                "prognostico": os_desejada.prognostico,
                "diagnostico": os_desejada.diagnostico,
                "orcamento": os_desejada.orcamento,
                "is_emitida": os_desejada.emitida,
                "ult_atualizacao": os_desejada.ultima_atualizacao,
            }
                
    return result, 302