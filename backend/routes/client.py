# realizando importações necessárias
from config import db, log_path
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

# criando uma blueprint
view_client = Blueprint('view_client', __name__, url_prefix='/cliente')

# rota get all clients
# essa rota deve exibir todos os clientes em lista na tela inicial do modulo de clientes
@view_client.route('/', methods=['GET'])
@jwt_required()
def all_clients():

    from models.cliente import Cliente

    clients = db.session.query(Cliente).all()
    result = {}
    
    # retorna clientes em formato json
    for client in clients:
        result[client.cliente_id] = {
                                    "id":client.cliente_id,
                                    "cpf_cnpj": client.cpf_cnpj,
                                    "nome_completo": client.nome_completo,
                                    "nome_fantasia": client.nome_fantasia,
                                    "endereco": client.endereco,
                                    "bairro": client.bairro,
                                    "cidade": client.cidade,
                                    "cep": client.cep,
                                    "telefone": client.telefone,
                                    "limite_credito": client.limite_credito,
                                    "pessoa_juridica": client.pessoa_juridica
                                }
        
    return result, 200

# rota cadastro de cliente
# esta rota deve exibir o formulário de clientes
# quando o formulario for enviado, deve cadastrar o cliente no banco
@view_client.route('/novo', methods=['POST'])
@jwt_required()
def new_client():
    if request.method == 'POST':
        from models.cliente import Cliente

        try:
            # guarda dados do frontend
            data = request.json

            # separando em variaveis
            cpf_cnpj = data.get('cpf_cnpj_cliente')
            flag_cnpj = data.get('flag_cnpj')
            nome = data.get('nome_cliente')
            nome_fantasia = data.get('empresa_cliente')
            endereco = data.get('endereco_cliente')
            bairro = data.get('bairro_cliente')
            cidade = data.get('cidade_cliente')
            cep = data.get('cep_cliente')
            telefone = data.get('telefone_cliente')
            lim_credito = float(data.get('limite_credito'))

        except Exception as e:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: {str(e)}')
                print('LOG ESCRITO COM SUCESSO')
                
            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'FALTAM DADOS A SEREM CADASTRADOS'}
                return response, 500
        
        # cpf/cnpj nao deve ser nulo
        if cpf_cnpj == '' or cpf_cnpj == None:
            print(f'{log_path}\\log_cli_{datetime.now().strftime('%d_%m_%Y_at_%H_%M_%S')}.txt')
            try:
                with open(f'{log_path}\\log_{datetime.now().strftime('%d_%m_%Y_at_%H_%M_%S')}.txt', 'a') as file:
                    file.write(f'BACKEND CLIENT ERROR: CPF/CNPJ NULO')
                print('LOG ESCRITO COM SUCESSO')
                
            except Exception as e:
                print('LOG NAO PODE SER CRIADO')
                print(str(e))
            finally:
                response = {'status':'error', 'msg':'O CPF/CNPJ NÃO PODE SER VAZIO'}
                return response, 400
            
        # cpf/cnpj devem ter a quantidade de caracteres desejada
        if len(cpf_cnpj) != 11 and flag_cnpj == False:

            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRAR UM CPF INVALIDO')
                print('LOG ESCRITO COM SUCESSO')
                
            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'O CPF DEVE TER 11 CARACTERES'}
                return response, 406
        
        if len(cpf_cnpj) != 14 and flag_cnpj == True:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRAR UM CNPJ INVALIDO')
                print('LOG ESCRITO COM SUCESSO')
                
            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'error', 'msg':'O CNPJ DEVE TER 14 CARACTERES'}
                return response, 406
            
        # verifica se o cliente ja existe no banco
        try:
            cliente_exists = db.session.query(Cliente).filter_by(cpf_cnpj=cpf_cnpj).first()
        except Exception as e:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: {str(e)}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')

            finally:

                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
        
        if cliente_exists:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRAR UM CPF/CNPJ JA EXISTENTE')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')

            finally:
                response = {'status':'error', 'msg':'O CLIENTE JÁ CADASTRADO'}
                return response, 409    
        
        
        # verifica se o telefone é nulo
        if not telefone or telefone == '':
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRAR UM TELEFONE INVALIDO')
                print('LOG ESCRITO COM SUCESSO')
            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O TELEFONE NÃO PODE SER VAZIO'}
                return response, 406
        
        # verifica se campo telefone possui apenas numeros
        if all(char.isdigit() for char in telefone) != True:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRAR UM TELEFONE INVALIDO')
                print('LOG ESCRITO COM SUCESSO')
            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'TELEFONE DEVE CONTER APENAS NÚMEROS'}
                return response, 406
        
        # verifica se o limite de credito é um valor negativo
        if lim_credito and lim_credito < 0:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRAR UM LIMITE DE CREDITO INVALIDO')
                print('LOG ESCRITO COM SUCESSO')
            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O LIMITE DE CRÉDITO NÃO PODE SER NEGATIVO'}
                return response, 406
        
        # verifica se o nome é nulo
        if not nome:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRAR UM NOME INVALIDO')
                print('LOG ESCRITO COM SUCESSO')
            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O NOME NÃO PODE SER NULO'}
                return response, 406
        
        # verifica se o nome fantasia é nulo
        if not nome_fantasia and flag_cnpj == True:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRAR UM NOME FANTASIA INVALIDO')
                print('LOG ESCRITO COM SUCESSO')
            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O NOME FANTASIA NÃO PODE SER NULO'}
                return response, 406
        
        # verifica se o endereço, bairro ou cidade é nulo
        if not endereco or not cidade or not bairro or not cep:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRAR UM ENDERECO, CIDADE, BAIRRO E/OU CEP INVALIDO')
                print('LOG ESCRITO COM SUCESSO')
            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'ENDEREÇO, CIDADE, CEP E BAIRRO NÃO PODEM SER NULOS'}
                return response, 406 

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
            
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT CREATED: NOVO CLIENTE CADASTRADO AS {datetime.now().strftime('%d/%m/%Y AS %H:%M:%S')} PELO TECNICO ID {int(get_jwt_identity())}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'success', 'msg':'CLIENTE CADASTRADO COM SUCESSO!'}
                return response, 201
        
        except Exception as e:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: {str(e)}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500

# rota para alterar um cliente existente
# esta rota deve alterar os dados do cliente desejado baseado no id
# 
@view_client.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def patch_client(id_desejado):
    from models.cliente import Cliente

    if request.method == 'POST':
        # recebe dados do frontend
        data = request.get_json()

        # separando em variaveis
        nome = data.get('nome_cliente')
        nome_fantasia = data.get('empresa_cliente')
        endereco = data.get('endereco_cliente')
        bairro = data.get('bairro_cliente')
        cidade = data.get('cidade_cliente')
        cep = data.get('cep_cliente')
        telefone = data.get('telefone_cliente')
        lim_credito = data.get('limite_credito')

        # checa se o cliente existe
        try:
            cliente_exists = db.session.query(Cliente).filter_by(cliente_id=id_desejado).one_or_none()

        except:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: {str(e)}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
        
        if not cliente_exists:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: CLIENTE PESQUISADO NAO CADASTRADO NO BANCO DE DADOS. ID: {id_desejado}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:

                response = {'status':'error', 'msg':'O CLIENTE PESQUISADO NÃO EXISTE'}
                return response, 404
        
        # checar se os dados estao corretos
        # cheque se o nome não esta vazio
        if nome == '':
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRO DE NOME NULO')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O NOME NÃO PODE SER VAZIO'}
                return response, 406
        
        # cheque se ele possui nome fantasia caso seja cnpj
        if not nome_fantasia and cliente_exists.pessoa_juridica == True:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRO DE NOME FANTASIA NULO')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')

            finally:
                response = {'status':'error', 'msg':'O NOME FANTASIA NÃO PODE SER NULO'}
                return response, 406
        
        # cheque se o limite de credito é negativo ou nulo
        if lim_credito != None and float(lim_credito) < 0:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRO DE LIMITE DE CREDITO INVALIDO')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O LIMITE DE CRÉDITO NÃO PODE SER NEGATIVO'}
                return response, 406
        
        # cheque se o telefone contem apenas numeros e nao é vazio
        if telefone != None and all(char.isdigit() for char in telefone) != True:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRO DE TELEFONE INVALIDO')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'TELEFONE DEVE CONTER APENAS NÚMEROS'}
                return response, 406
        
        # cheque se o endereco, bairro, cep ou cidade sao nulos
        if endereco == '':
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRO DE ENDERECO INVALIDO')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O ENDEREÇO NÃO PODE SER VAZIO'}
                return response, 406
        
        if bairro == '':
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRO DE BAIRRO INVALIDO')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O BAIRRO NÃO PODE SER VAZIO'}
                return response, 406
        
        if cidade == '':
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRO DE CIDADE INVALIDO')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O CIDADE NÃO PODE SER VAZIO'}
                return response, 406
        
        if cep == '':
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: TENTATIVA DE CADASTRO DE CEP INVALIDO')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O CEP NÃO PODE SER VAZIO'}
                return response, 406
        

        # realizando modificações
        try:
            if nome != None and nome != cliente_exists.nome_completo:
                cliente_exists.nome_completo = nome
            
            if nome_fantasia != None and nome_fantasia != cliente_exists.nome_fantasia:
                cliente_exists.nome_fantasia = nome_fantasia
            
            if lim_credito != None and lim_credito != cliente_exists.limite_credito:
                cliente_exists.limite_credito = float(lim_credito)
            
            if telefone != None and telefone != cliente_exists.telefone:
                cliente_exists.telefone = telefone

            if cidade != None and cidade != cliente_exists.cidade:
                cliente_exists.cidade = cidade

            if bairro != None and bairro != cliente_exists.bairro:
                cliente_exists.bairro = bairro
            
            if endereco != None and endereco != cliente_exists.endereco:
                cliente_exists.endereco = endereco
            
            if cep != None and cep != cliente_exists.cep:
                cliente_exists.cep = cep

            db.session.commit()

            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT PATCH: CLIENTE ID {id_desejado} EDITADO AS {datetime.now().strftime('%d/%m/%Y AS %H:%M:%S')} PELO TECNICO ID {int(get_jwt_identity())}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            
            finally:
                response = {'status':'success', 'msg':'CLIENTE EDITADO COM SUCESSO!'}
                return response, 200

        except Exception as e:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: {str(e)}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500

# rota para deletar um cliente com base no id informado
@view_client.route('/excluir/<int:id_desejado>', methods=['POST'])
@jwt_required()
def delete_client(id_desejado):
    from models.cliente import Cliente

    if request.method == 'POST':
        # checa se o cliente existe
        try:
            cliente_exists = db.session.query(Cliente).filter_by(cliente_id=id_desejado).one_or_none()
        except:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: {str(e)}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
        
        if not cliente_exists:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: CLIENTE PESQUISADO NAO CADASTRADO NO BANCO DE DADOS')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'O CLIENTE PESQUISADO NÃO EXISTE'}
                return response, 404
        
        # exclui o cliente
        try:
            db.session.query(Cliente).filter_by(cliente_id=id_desejado).delete()
            db.session.commit()
                
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT DELETE: CLIENTE ID {id_desejado} DELETADO AS {datetime.now().strftime('%d/%m/%Y AS %H:%M:%S')} PELO TECNICO ID {int(get_jwt_identity())}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')

            finally:
                response = {'status':'success', 'msg':'CLIENTE APAGADO COM SUCESSO!'}
                return response, 200
    
        except Exception as e:
            try:
                with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                    file.write(f'BACKEND CLIENT ERROR: {str(e)}')
                print('LOG ESCRITO COM SUCESSO')

            except:
                print('LOG NAO PODE SER CRIADO')
            finally:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500
        

# esta rota pesquisa o id do cliente
@view_client.route('/pesquisar/<int:id_desejado>', methods=['GET'])
@jwt_required()
def getClient(id_desejado):
    from models.cliente import Cliente

    try:
        cliente_exists = db.session.query(Cliente).filter_by(cliente_id=id_desejado).one_or_none()
    except Exception as e:
        try:
            with open(f'{log_path}/log_cli_{datetime.now.strftime('%Y_%m_%d_at_%H_%M_%S')}.txt', 'w') as file:
                file.write(f'BACKEND CLIENT ERROR: {str(e)}')
            print('LOG ESCRITO COM SUCESSO')
        except:
            print('LOG NAO PODE SER CRIADO')
        finally:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
    
    if cliente_exists:
        result = {}
        result[cliente_exists.cliente_id] = {
                                        "id":cliente_exists.cliente_id,
                                        "cpf_cnpj": cliente_exists.cpf_cnpj,
                                        "nome_completo": cliente_exists.nome_completo,
                                        "nome_fantasia": cliente_exists.nome_fantasia,
                                        "endereco": cliente_exists.endereco,
                                        "bairro": cliente_exists.bairro,
                                        "cidade": cliente_exists.cidade,
                                        "cep": cliente_exists.cep,
                                        "telefone": cliente_exists.telefone,
                                        "limite_credito": cliente_exists.limite_credito,
                                        "pessoa_juridica": cliente_exists.pessoa_juridica
                                    }
        # jsonify({cliente_exists.cliente_id:result})
        return result, 302
    
    
    response = {'status':'error', 'msg':'NENHUM CLIENTE ENCONTRADO COM ESTE ID'}
    return response, 404

# rota pesquisa de cliente por nome/cpf/cnpj
# esta rota é utilizada pela barra de pesquisa
# essa rota deve exibir os clientes com base no cpf/cnpj informado ou nome do cliente
# @view_client.route('/pesquisar/<str_pesquisa>', methods=['GET'])
# def search_client(str_pesquisa):
#     from models.cliente import Cliente
#     # pesquisa pelo cpf/cnpj
#     if str_pesquisa.isdigit():    
#         # pesquisa pelo cpf
#         if int(str_pesquisa) <= 14:
            
#             try:
#                 cliente_desejado =  db.session.query(Cliente).filter_by(Cliente.cpf_cnpj.ilike(f'%{str_pesquisa}')).all()
#                 if cliente_desejado:
#                     result = {}
#                     for cliente in clientes_desejados:
#                         result[cliente.cliente_id] = {
#                                                     'cpf_cnpj': cliente.cpf_cnpj,
#                                                     'nome_cliente':cliente.nome_completo,
#                                                     'nome_fantasia':cliente.nome_fantasia,
#                                                     'endereco':cliente.endereco,
#                                                     'bairro':cliente.bairro,
#                                                     'cep':cliente.cep,
#                                                     'cidade':cliente.cidade,
#                                                     'limite_credito':cliente.limite_credito,
#                                                     'pessoa_juridica':cliente.pessoa_juridica
#                                                     }
                    
#                     return result, 200
#                 else:
#                     return '', 404
            
#             except Exception as e:
#                 return '', 500
#     else: 
#         # pesquisa pelo nome
#         try:
#             clientes_desejados =  db.session.query(Cliente).filter(Cliente.nome_completo.ilike(f'%{str_pesquisa}%')).all()
#             if clientes_desejados:
#                 result = {}
#                 for cliente in clientes_desejados:
#                     result[cliente.cliente_id] = {
#                                                 'cpf_cnpj': cliente.cpf_cnpj,
#                                                 'nome_cliente':cliente.nome_completo,
#                                                 'nome_fantasia':cliente.nome_fantasia,
#                                                 'endereco':cliente.endereco,
#                                                 'bairro':cliente.bairro,
#                                                 'cep':cliente.cep,
#                                                 'cidade':cliente.cidade,
#                                                 'limite_credito':cliente.limite_credito,
#                                                 'pessoa_juridica':cliente.pessoa_juridica
#                                                 }
#                 return result, 200
#             else:
#                 return '', 404
            
#         except Exception as e:
#             return '', 500