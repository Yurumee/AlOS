# realizando importações necessárias
from config import db
from flask import Blueprint, jsonify, request

# criando uma blueprint
view_client = Blueprint('view_client', __name__, url_prefix='/cliente')

# rota get all clients
# essa rota deve exibir todos os clientes em lista na tela inicial do modulo de clientes
@view_client.route('/', methods=['GET'])
def all_clients():
    from models.cliente import Cliente

    clients = db.session.query(Cliente).all()
    resp = {}
    
    # retorna clientes em formato json
    for client in clients:
        resp[client.cpf_cnpj] = {
                                    "nome completo": client.nome_completo,
                                    "nome fantasia": client.nome_fantasia,
                                    "endereco": client.endereco,
                                    "bairro": client.bairro,
                                    "cidade": client.cidade,
                                    "cep": client.cep,
                                    "limite de credito": client.limite_credito,
                                    "pessoa juridica": client.pessoa_juridica
                                }

    return jsonify({
                    'message':'ok',
                    'status':200,
                    'clientes':resp
                    })

# rota cadastro de cliente
# esta rota deve exibir o formulário de clientes
# quando o formulario for enviado, deve cadastrar o cliente no banco
@view_client.route('/novo', methods=['GET', 'POST'])
def new_client():
    if request.method == 'POST':
        from models.cliente import Cliente

        try:
            # guarda dados do frontend
            data = request.get_json()

            # separando em variaveis
            cpf_cnpj = data.get('cpf-cnpj-cliente')
            flag_cnpj = bool(data.get('flag-cnpj')) # caso contenha algo, sera True, caso nao tenha nada, sera False
            nome = data.get('nome-cliente')
            nome_fantasia = data.get('empresa-cliente')
            endereco = data.get('endereco-cliente')
            bairro = data.get('bairro-cliente')
            cidade = data.get('cidade-cliente')
            cep = data.get('cep-cliente')
            telefone = data.get('telefone-cliente')
            lim_credito = data.get('limite-credito')
        
        except Exception as e:
            return jsonify({'error':str(e)})

        # cpf/cnpj nao deve ser nulo
        if cpf_cnpj == '' or cpf_cnpj == None:
            return jsonify({'message':'cpf/cnpj nao pode ser nulo'})

        # print(f'valor da flag: {flag_cnpj}')
        # print(f'tamanho cpf/cnpj: {len(cpf_cnpj)}')

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
    
            return jsonify({'message':'criado'})

        except Exception as e:
            return jsonify({'message':'algo deu errado', 'err':str(e)})
        

    # com metodo GET, exibe a tela de formulario
    return jsonify({
                    'message':'ok',
                    'status':200
                    })

# rota para alterar um cliente existente
# esta rota deve alterar os dados do cliente desejado baseado no cpf/cnpj
@view_client.route('/editar/<int:cpf_cnpj_desejado>', methods=['GET', 'PATCH'])
def patch_client(cpf_cnpj_desejado):
    from models.cliente import Cliente

    if request.method == 'PATCH':
        # recebe dados do frontend
        data = request.get_json()
        # separando em variaveis
        nome = data.get('nome-cliente')
        nome_fantasia = data.get('empresa-cliente')
        endereco = data.get('endereco-cliente')
        bairro = data.get('bairro-cliente')
        cidade = data.get('cidade-cliente')
        cep = data.get('cep-cliente')
        telefone = data.get('telefone-cliente')
        lim_credito = data.get('limite-credito')

        # checa se o cliente existe
        try:
            cliente_exists = db.session.query(Cliente).filter_by(cpf_cnpj=cpf_cnpj_desejado).one_or_none()
        except:
            return jsonify({'message':'algo deu errado'})
        
        if not cliente_exists:
            return jsonify({'message':'o cliente especificado nao existe'})
        
        # checar se os dados estao corretos
        if not nome:
            return jsonify({'message':'nome nao pode ser nulo'})
        
        if not nome_fantasia and cliente_exists.pessoa_juridica == True:
            return jsonify({'message':'nome fantasia nao pode ser nulo'})
        
        if lim_credito < 0:
            return jsonify({'message':'limite de credito nao pode ser numero negativo'})
        
        if all(char.isdigit() for char in telefone) != True:
            return({'message':'telefone deve apenas conter numeros'})
        
        if not endereco or not bairro or not cidade:
            return jsonify({'message':'endereço incompleto'})
        
        # realizando modificações
        try:
            if nome != cliente_exists.nome_completo:
                cliente_exists.nome_completo = nome
                # db.session.commit()
            
            if nome_fantasia != cliente_exists.nome_fantasia:
                cliente_exists.nome_fantasia = nome_fantasia
            
            if lim_credito != cliente_exists.limite_credito:
                cliente_exists.limite_credito = lim_credito
            
            if telefone != cliente_exists.telefone:
                cliente_exists.telefone = telefone

            if cidade != cliente_exists.cidade:
                cliente_exists.cidade = cidade

            if bairro != cliente_exists.bairro:
                cliente_exists.bairro = bairro
            
            if endereco != cliente_exists.endereco:
                cliente_exists.endereco = endereco
            
            if cep != cliente_exists.cep:
                cliente_exists.cep = cep

            db.session.commit()

        except Exception as e:
            return jsonify({'message':str(e)})
        
        return jsonify({'message':'cliente editado com sucesso'})
        

    # caso metodo seja get, retorna a pagina para edição de cliente
    try:
        cliente = db.session.query(Cliente).filter_by(cpf_cnpj=cpf_cnpj_desejado).one_or_none()
    except:
        return jsonify({'message':'algo deu errado'})
    
    if not cliente:
        cliente = 'este cliente nao existe'

    return jsonify({'message':'ok', 'cliente a ser editado':cliente.nome_completo})

@view_client.route('/excluir/<int:cpf_cnpj_desejado>', methods=['GET', 'DELETE'])
def delete_client(cpf_cnpj_desejado):
    from models.cliente import Cliente

    if request.method == 'DELETE':
        # checa se o cliente existe
        try:
            cliente_exists = db.session.query(Cliente).filter_by(cpf_cnpj=cpf_cnpj_desejado).one_or_none()
        except:
            return jsonify({'message':'algo deu errado'})
        
        if not cliente_exists:
            return jsonify({'message':'o cliente especificado nao existe ou cpf/cnpj incorreto'})
        
        # exclui o cliente
        try:
                db.session.query(Cliente).filter_by(cpf_cnpj=cpf_cnpj_desejado).delete()
                db.session.commit()
                return jsonify({'message':'cliente deletado com sucesso'})
    
        except Exception as e:
            return jsonify({'err':str(e)})

    # caso metodo seja get, retorna a pagina para exclusão de cliente
    try:
        cliente = db.session.query(Cliente).filter_by(cpf_cnpj=cpf_cnpj_desejado).one_or_none()
    except:
        return jsonify({'message':'algo deu errado'})
    
    if not cliente:
        cliente = 'este cliente nao existe'

    return jsonify({'message':'ok', 'cliente a ser excluido':cliente.nome_completo})