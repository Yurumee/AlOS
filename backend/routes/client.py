# realizando importações necessárias
from config import db
from flask import Blueprint, jsonify, request

# criando uma blueprint
view_client = Blueprint('view_client', __name__, url_prefix='/cliente')

# rota get all clients
@view_client.route('/', methods=['GET'])
def all_clients():
    from models.cliente import Cliente
    
    clients = db.session.query(Cliente).all()
    resp = {}
    
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
    # return clients

# rota cadastro de cliente
@view_client.route('/novo', methods=['GET', 'POST'])
def new_client():
    if request.method == 'POST':
        from models.cliente import Cliente

        data = request.get_json()

        cpf_cnpj = data.get('cpf-cnpj-cliente')
        flag_cnpj = bool(data.get('flag-cnpj'))

        if len(cpf_cnpj) != 11 and flag_cnpj == False:
            return jsonify({
                            'message':'cpf invalido'
                            })
        
        elif len(cpf_cnpj) != 14 and flag_cnpj == True:
            return jsonify({
                            'message':'cnpj invalido'
                            })

        nome = data.get('nome-cliente')
        nome_fantasia = data.get('empresa-cliente')
        endereco = data.get('endereco-cliente')
        bairro = data.get('bairro-cliente')
        cidade = data.get('cidade-cliente')
        cep = data.get('cep-cliente')
        telefone = data.get('telefone-cliente')
        lim_credito = data.get('limite-credito')

        try:
            cliente_exists = db.session.query(Cliente).filter_by(cpf_cnpj=cpf_cnpj).first()
            # print(cliente_exists)
            if cliente_exists:
                return jsonify({'message':'cliente existe'})    
        except:
            return jsonify({'message':'error'})
        
        try:
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
            
            db.session.add(client)
            db.session.commit()
            return jsonify({'message':'criado'})

        except Exception as e:
            return jsonify({'message':'algo deu errado', 'err':str(e)})
        


    return jsonify({
                    'message':'ok',
                    'status':200
                    })