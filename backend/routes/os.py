from ..db import db
# from config import db

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
    from ..models.ordemServico import OrdemServico
    from ..models.cliente import Cliente
    from ..models.produto import Produto
    from ..models.tecnico import Tecnico
    from ..models.anexo import Anexo

    orders = db.session.query(OrdemServico).all()
    result = {}
    
    # retorna ordens de serviço em formato json
    for os in orders:
        cliente_os = db.session.query(Cliente).filter_by(cliente_id=os.cliente_id).one_or_none().nome_completo

        produto_os = db.session.query(Produto).filter_by(produto_id=os.produto_id).one_or_none().num_serie

        tecnico_os = db.session.query(Tecnico).filter_by(cpf_tecnico=os.tecnico_cpf).one_or_none().nome_tecnico

        anexo_os = db.session.query(Anexo).filter_by(anexo_id=os.ordem_id).one_or_none()
        
        if anexo_os != None:
            anexo_emitido = 'Sim' if anexo_os.emitida else 'Não'
        else:
            anexo_emitido = 'Não'

        result[os.ordem_id] = {
                                    "id":os.ordem_id,
                                    "tipo_ordem": os.tipo_ordem,
                                    "tecnico_resp": tecnico_os,
                                    "cliente_nome": cliente_os,
                                    "produto_num_serie": produto_os,
                                    "prognostico": os.prognostico,
                                    "diagnostico": os.diagnostico,
                                    "orcamento": float(os.orcamento),
                                    "estado": os.estado_os,
                                    
                                    "anexo_exists": 'Sim' if anexo_os else 'Não',
                                    "solucao": anexo_os.solucao if anexo_os else '',
                                    "garantia": anexo_os.garantia if anexo_os else '',
                                    "observacao": anexo_os.observacoes if anexo_os else '',
                                    "anexo_emitido": anexo_emitido,
                                    
                                    "emitida": 'Sim' if os.emitida == True else 'Não',
                                    "data_emissao": datetime.strftime(os.emissao, '%A, %d/%m/%Y às %H:%M:%S') if os.emissao != None else '',
                                    "data_fechamento": datetime.strftime(os.fechamento, '%A, %d/%m/%Y às %H:%M:%S') if os.fechamento != None else '',
                                    "validade": datetime.strftime(os.validade, '%A, %d/%m/%Y às %H:%M:%S') if os.validade != None else '',
                                    "ult_atualizacao": datetime.strftime(os.ultima_atualizacao, '%A, %d/%m/%Y às %H:%M:%S')
                                }
        
    return result, 200
        
# rota cadastro de nova ordem
# esta rota deve exibir o formulário de ordens de serviço
# quando o formulario for enviado, deve cadastrar a ordem no banco e ligá-la ao cliente, produto e tecnico especificado
@view_os.route('/novo', methods=['POST'])
@jwt_required()
def new_os():
    if request.method == 'POST':
        from ..models.ordemServico import OrdemServico
        from ..models.tecnico import Tecnico
        from ..models.produto import Produto
        from ..models.cliente import Cliente
        from ..models.servico import Servico
        from ..models.estoque import Estoque
        from ..models.os_estoque import Os_estoque
        from ..models.os_servico import Os_servico

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
            associacoes_estoque = []
            associacoes_servico = []
        
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

        if fechamento == None:
            fechamento = criacao + timedelta(weeks=2)

        else:
            fechamento = datetime.strptime(fechamento, '%Y-%m-%dT%H:%M')
        
        diferenca_data = validade.date() - criacao.date()
        if diferenca_data.days//7 < 1:
            validade = criacao + timedelta(weeks=1)

        if fechamento:
            diferenca_fechamento = fechamento.date() - criacao.date()
            if diferenca_fechamento.days < criacao.date().day:
                response = {'status':'error', 'msg':'A DATA DE FECHAMENTO NÃO PODE SER INFERIOR A DE CRIAÇÃO!'}
                return response, 400

        # atualize o valor do orçamento total
        # adicione os itens e serviços de orçamento nas tabelas pivô
        for item in orcamento:
            valor_orcamento += (float(item['preco']) * int(item['quantidade']))

            if item['tipo'] == 'estoque':
                
                item_desejado = db.session.query(Estoque).filter_by(cod_barras=item['cod_barra_item']).one_or_none()
                # orcamento_estoque.append({'item': item_desejado, 'qtd': item['quantidade']})
                associacoes_estoque.append(
                                            Os_estoque(
                                                        quantidade = item['quantidade'],
                                                        itens = item_desejado
                                                      )
                                          )

            if item['tipo'] == 'servico':
                servico_desejado = db.session.query(Servico).filter_by(servico_id=item['id_item']).one_or_none()
                associacoes_servico.append(
                                            Os_servico(
                                                        servicos = servico_desejado
                                                      )
                                          )

        # se a os tiver sido emitida e autorizada, retire os itens de estoque
        if emitir and estado == 'Autorizada':
            from ..models.estoque import Estoque

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
                                ultima_atualizacao = datetime.now().replace(microsecond=0)
                            )
            

            os.itens_os.extend(associacoes_estoque)
            os.servicos_os.extend(associacoes_servico)

            # inserindo e realizando commit
            db.session.add(os)

            db.session.commit()
            # fim da transação

            response = {'status':'success', 'msg':'ORDEM DE SERVIÇO CADASTRADA COM SUCESSO!'}
            return response, 201

        except Exception as e:
            response = {'status':'error', 'msg':print(str(e))}
            return response, 500

# rota para alterar uma os existente
# esta rota deve alterar os dados da os desejada baseado no id 
@view_os.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def patch_os(id_desejado):
    from ..models.ordemServico import OrdemServico
    from ..models.estoque import Estoque
    from ..models.servico import Servico
    from ..models.os_estoque import Os_estoque
    from ..models.os_servico import Os_servico

    if request.method == 'POST':
        # recebe dados do frontend
        data = request.get_json()

        # separando em variaveis
        fechamento = data.get('fechamento')
        validade = data.get('validade')
        prognostico = data.get('prognostico')
        diagnostico = data.get('diagnostico')
        orcamento = data.get('orcamento')
        estado = data.get('estado')
        emitir = data.get('emitir_os')
        valor_orcamento = 0.0
        associacoes_estoque = []
        associacoes_servico = []

        if validade != None:
            validade = datetime.strptime(validade, '%Y-%m-%dT%H:%M')

        if fechamento != None:
            fechamento = datetime.strptime(fechamento, '%Y-%m-%dT%H:%M')
        

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
            if orcamento != None:
                for estoque_item in os_exists.itens_os:
                    db.session.query(Os_estoque).filter_by(ordem_id=id_desejado).delete()
                
                for servico in os_exists.servicos_os:
                    db.session.query(Os_servico).filter_by(ordem_id=id_desejado).delete()

                for item in orcamento:
                    valor_orcamento += float(item['preco']) * int(item['quantidade'])

                    if item['tipo'] == 'estoque':

                        item_desejado = db.session.query(Estoque).filter_by(cod_barras=item['cod_barra_item']).one_or_none()
                        
                        associacoes_estoque.append(
                                                    Os_estoque(
                                                                quantidade = item['quantidade'],
                                                                itens = item_desejado
                                                              )
                                                  )

                    if item['tipo'] == 'servico':

                        servico_desejado = db.session.query(Servico).filter_by(servico_id=item['id_item']).one_or_none()
                        
                        associacoes_servico.append(
                                                    Os_servico(
                                                                servicos = servico_desejado
                                                              )
                                                  )
                    
                os_exists.itens_os.extend(associacoes_estoque)
                os_exists.servicos_os.extend(associacoes_servico)

                os_exists.orcamento = valor_orcamento
                
                os_exists.ultima_atualizacao = datetime.now()
            
            if fechamento != None and fechamento != os_exists.fechamento:
                diferenca_fechamento = fechamento.date() - os_exists.emissao.date()
                
                if diferenca_fechamento.days < os_exists.emissao.date().day:
                    response = {'status':'error', 'msg':'A DATA DE FECHAMENTO NÃO PODE SER INFERIOR A DE CRIAÇÃO!'}
                    return response, 400
                
                else:
                    os_exists.fechamento = fechamento
                    os_exists.ultima_atualizacao = datetime.now()
            
            
            if validade != None and validade != os_exists.validade:
                diferenca_data = validade.date() - os_exists.emissao.date()

                if diferenca_data.days < os_exists.emissao.date().day:
                    response = {'status':'error', 'msg':'A DATA DE VALIDADE NÃO PODE SER INFERIOR A DE CRIAÇÃO!'}
                    return response, 400
                
                else:
                    os_exists.validade = validade
                    os_exists.ultima_atualizacao = datetime.now()
            
            if prognostico != None and prognostico != os_exists.prognostico:
                os_exists.prognostico = prognostico
                os_exists.ultima_atualizacao = datetime.now()

            if diagnostico != None and diagnostico != os_exists.diagnostico:
                os_exists.diagnostico = diagnostico
                os_exists.ultima_atualizacao = datetime.now()

            # if orcamento != None and orcamento != os_exists.orcamento:
            #     os_exists.orcamento = orcamento
            #     os_exists.ultima_atualizacao = datetime.now()
            
            if estado != None and estado != os_exists.estado_os:
                os_exists.estado_os = estado
                os_exists.ultima_atualizacao = datetime.now()
            
            if emitir != None and emitir != os_exists.emitida:
                os_exists.emitida = emitir
                os_exists.ultima_atualizacao = datetime.now()


            db.session.commit()
            response = {'status':'success', 'msg':'ORDEM DE SERVIÇO ALTERADA COM SUCESSO!'}
            return response, 200

        except Exception as e:
            response = {'status':'error', 'msg': str(e)}
            return response, 500

# rota para deletar uma ordem de serviço com base no id informado
@view_os.route('/excluir/<int:id_desejado>', methods=['POST'])
@jwt_required()
def delete_os(id_desejado):
    from ..models.ordemServico import OrdemServico
    from ..models.os_estoque import Os_estoque
    from ..models.os_servico import Os_servico
    from ..models.anexo import Anexo

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
            for item in os_exists.itens_os:
                db.session.query(Os_estoque).filter_by(ordem_id=id_desejado).delete()
            
            for servico in os_exists.servicos_os:
                db.session.query(Os_servico).filter_by(ordem_id=id_desejado).delete()
            
            if os_exists.anexo:
                anexo_desejado = db.session.query(Anexo).filter_by(anexo_id=id_desejado).first()
                if anexo_desejado.emitida == False:
                    db.session.query(Anexo).filter_by(anexo_id=id_desejado).delete()

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
def get_os(id_desejado):
    from ..models.ordemServico import OrdemServico
    from ..models.servico import Servico
    from ..models.estoque import Estoque
    from ..models.produto import Produto
    from ..models.cliente import Cliente
    
    orcamento = []

    try:
        os_desejada = db.session.query(OrdemServico).filter_by(ordem_id=id_desejado).first()
    
    except Exception as e:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500
    
    try:
        # caso a ordem de serviço exista e não esteja emitida
        if os_desejada and os_desejada.emitida == False:
            # busca os serviços e itens atrelados àquela OS
            for servico in os_desejada.servicos_os:
                servico_desejado = db.session.query(Servico).filter_by(servico_id=servico.servico_id).one_or_none()
                orcamento.append({
                                    'id_item': servico_desejado.servico_id,
                                    'quantidade': 1,
                                    'nome': servico_desejado.nome_servico,
                                    'preco': float(servico_desejado.custo),
                                    'tipo': 'servico'
                                })
            
            for item in os_desejada.itens_os:
                item_desejado = db.session.query(Estoque).filter_by(item_id=item.item_id).one_or_none()
                orcamento.append({
                                    'cod_barra_item': item_desejado.cod_barras,
                                    'quantidade': item.quantidade,
                                    'nome': item_desejado.nome_item,
                                    'preco': float(item_desejado.preco_unitario),
                                    'tipo': 'estoque'
                                })

        else:
            response = {'status':'error', 'msg':'A OS JÁ FOI EMITIDA  OU NÃO EXISTE'}
            return response, 404
        
    except Exception as e:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500

    try:
        cliente_os = db.session.query(Cliente).filter_by(cliente_id=os_desejada.cliente_id).first()
    
    except Exception as e:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500

    try:
        produto_os = db.session.query(Produto).filter_by(produto_id=os_desejada.produto_id).first()
    
    except Exception as e:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500

    result = {
                "id":os_desejada.ordem_id,
                "estado":os_desejada.estado_os,
                "tecnico_resp": os_desejada.tecnico_cpf,
                "tipo": os_desejada.tipo_ordem,
                "data_emissao": str(os_desejada.emissao),
                "data_fechamento": str(os_desejada.fechamento),
                "validade": str(os_desejada.validade),
                "prognostico": os_desejada.prognostico,
                "diagnostico": os_desejada.diagnostico,
                "orcamento": orcamento,
                "cliente_os": cliente_os.nome_completo,
                "produto_os": produto_os.modelo,
                # "is_emitida": os_desejada.emitida,
                "ult_atualizacao": os_desejada.ultima_atualizacao.strftime('%a, %d %b %Y %H:%M:%S GMT'),
            }
    
    return result, 302


# rota usada para pesquisar o orçamento de uma ordem com base no id para ser utilizado para edição ou download
@view_os.route('/orcamento/<int:id_desejado>', methods=['GET'])
@jwt_required()
def get_os_budget(id_desejado):
    from ..models.ordemServico import OrdemServico
    from ..models.produto import Produto
    from ..models.cliente import Cliente
    from ..models.tecnico import Tecnico
    from ..models.estoque import Estoque
    from ..models.servico import Servico
    from ..models.anexo import Anexo
    from ..models.os_estoque import Os_estoque
    from ..models.os_servico import Os_servico

    i = 0
    orcamento_itens = {}
    orcamento_servico = {}

    try:
        os_desejada = db.session.query(OrdemServico).filter_by(ordem_id=id_desejado).first()
    
    except Exception as e:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500
    
    try:
        # caso a ordem de serviço exista
        if os_desejada:
            # pega o nome do cliente da os especifica
            cliente = db.session.query(Cliente).filter_by(cliente_id=os_desejada.cliente_id).one_or_none()

            produto = db.session.query(Produto).filter_by(produto_id=os_desejada.produto_id).one_or_none()

            tecnico = db.session.query(Tecnico).filter_by(cpf_tecnico=os_desejada.tecnico_cpf).one_or_none()

            anexo_os = db.session.query(Anexo).filter_by(anexo_id=os_desejada.ordem_id).one_or_none()
        
            if anexo_os != None:
                anexo_emitido = 'Sim' if anexo_os.emitida else 'Não'
            else:
                anexo_emitido = 'Não'
            
            try:
                itens = db.session.query(Os_estoque).filter_by(ordem_id=id_desejado).all()
                servicos = db.session.query(Os_servico).filter_by(ordem_id=id_desejado).all()

            except:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
        
        else:
            response = {'status':'error', 'msg':'O CLIENTE OU PRODUTO SOLICITADO NÃO ESTÃO CADASTRADOS'}
            return response, 404
        
    except Exception as e:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500


    for itemOrcamento in itens:
        item = db.session.query(Estoque).filter_by(item_id=itemOrcamento.item_id).one_or_none()  
        orcamento_itens[i] = {
                                "cod_barras": item.cod_barras,
                                "nome_item": item.nome_item,
                                "preco": item.preco_unitario,
                                "quantidade_orcamento": itemOrcamento.quantidade
                            }
        i += 1

    for servicoOrcamento in servicos:
        servico = db.session.query(Servico).filter_by(servico_id=servicoOrcamento.servico_id).one_or_none()
        orcamento_servico[i] = {
                                    "nome_servico": servico.nome_servico,
                                    "custo": servico.custo
                                }
        i += 1
    
    result = {
                "id":os_desejada.ordem_id,
                "cliente_nome": cliente.nome_completo,
                "cliente_fantasia": cliente.nome_fantasia,
                "cliente_cpf_cnpj": cliente.cpf_cnpj,
                "cliente_endereco": cliente.endereco,
                "cliente_bairro": cliente.bairro,
                "cliente_cep": cliente.cep,
                "cliente_cidade": cliente.cidade,
                "cliente_telefone": cliente.telefone,
                "cliente_pessoa_juridica": cliente.pessoa_juridica,
                
                "num_serie": produto.num_serie,
                "modelo": produto.modelo,
                "cor": produto.cor,
                "so": produto.sis_operacional,
                "acessorios": produto.acessorios,
                "avaria": produto.avaria,
                "backup": produto.backup,
                "carrega": produto.carrega,
                "liga": produto.liga,
                "obs": produto.observacoes,

                "tecnico_resp": tecnico.nome_tecnico,
                "tecnico_contato": tecnico.contato_tecnico,

                "anexo_exists": 'Sim' if anexo_os else 'Não',
                "solucao": anexo_os.solucao if anexo_os else '',
                "garantia": datetime.strftime(anexo_os.garantia, '%d/%m/%Y às %H:%M:%S, %A') if anexo_os != None else '',
                "observacao": anexo_os.observacoes if anexo_os else '',
                "anexo_emitido": anexo_emitido,

                "tipo": os_desejada.tipo_ordem,
                "data_emissao": datetime.strftime(os_desejada.emissao, '%d/%m/%Y às %H:%M:%S, %A') if os_desejada.emissao != None else '',
                "data_fechamento": datetime.strftime(os_desejada.fechamento, '%d/%m/%Y às %H:%M:%S, %A') if os_desejada.fechamento != None else '',
                "validade": datetime.strftime(os_desejada.validade, '%d/%m/%Y às %H:%M:%S, %A') if os_desejada.validade != None else '',
                "prognostico": os_desejada.prognostico,
                "diagnostico": os_desejada.diagnostico,
                "orcamento_item": orcamento_itens, 
                "orcamento_servico": orcamento_servico,
                "orcamento_total": os_desejada.orcamento,
                "is_emitida": os_desejada.emitida,
                "ult_atualizacao": datetime.strftime(os_desejada.ultima_atualizacao, '%d/%m/%Y às %H:%M:%S, %A') if os_desejada.ultima_atualizacao != None else '',
            }
                
    return result, 302
