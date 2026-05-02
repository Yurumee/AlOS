from config import db

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import locale
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

view_attachment = Blueprint('view_attachment', __name__, url_prefix='/anexo')

# rota usada para criar um anexo
@view_attachment.route('/criar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def new_attachment(id_desejado):
    if request.method == 'POST':
        from models.ordemServico import OrdemServico
        from models.anexo import Anexo

        data = request.get_json()

        # separando em variaveis
        solucao = data.get('solucao')
        garantia = data.get('garantia')
        observacoes = data.get('observacoes')
        emitir = data.get('emitido')

        try:
            os_desejado = db.session.query(OrdemServico).filter_by(ordem_id=id_desejado).first()
        
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        
        if os_desejado:
            if os_desejado.emitida:
                if os_desejado.anexo:
                    response = {'status':'error', 'msg':'ANEXO JA CADASTRADO'}
                    return response, 403
                else:

                    if garantia == None:
                        garantia = os_desejado.fechamento + timedelta(weeks=1)

                    else:
                        garantia = datetime.strptime(garantia, '%Y-%m-%dT%H:%M')

                    try:
                        anexo = Anexo(
                                        anexo_id = id_desejado,
                                        solucao = solucao,
                                        garantia = garantia,
                                        observacoes = observacoes,
                                        emitida = emitir,
                                      )

                        os_desejado.anexo = anexo

                        db.session.add(anexo)

                        db.session.commit()

                        response = {'status':'success', 'msg':'ANEXO CADASTRADO COM SUCESSO!'}
                        return response, 201

                    except Exception as e:
                        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                        return response, 500



# rota usada para editar um anexo
@view_attachment.route('/editar/<int:id_desejado>', methods=['POST'])
@jwt_required()
def edit_attachment(id_desejado):
    if request.method == 'POST':
        from models.anexo import Anexo

        data = request.get_json()

        # separando em variaveis
        solucao = data.get('solucao')
        garantia = data.get('garantia')
        observacoes = data.get('observacoes')
        emitir = data.get('emitido')

        try:
            anexo_desejado = db.session.query(Anexo).filter_by(anexo_id=id_desejado).first()
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500

        if anexo_desejado.emitida:
            response = {'status':'error', 'msg':'ANEXO JA EMITIDO'}
            return response, 500
        
        else:
            if garantia != None and garantia != anexo_desejado.garantia:
                garantia = datetime.strptime(garantia, '%Y-%m-%dT%H:%M')
                anexo_desejado.garantia = garantia
            
            if observacoes != None and observacoes != anexo_desejado.observacoes:
                anexo_desejado.observacoes = observacoes

            if solucao != None and solucao != anexo_desejado.solucao:
                anexo_desejado.solucao = solucao

            if emitir != None and emitir != anexo_desejado.emitida:
                anexo_desejado.solucao = emitir
            
            db.session.commit()

            response = {'status':'success', 'msg':'ANEXO ALTERADO COM SUCESSO!'}
            return response, 200
            

# rota usada para excluir um anexo
@view_attachment.route('/excluir/<int:id_desejado>', methods=['POST'])
@jwt_required()
def delete_attachment(id_desejado):
    if request.method == 'POST':
        from models.anexo import Anexo

        try:
            anexo_desejado = db.session.query(Anexo).filter_by(anexo_id=id_desejado).first()
        
        except Exception as e:
            response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
            return response, 500
        
        if anexo_desejado.emitida:
            response = {'status':'error', 'msg':'ANEXO JA EMITIDO'}
            return response, 500
        
        else:
            try:
                db.session.query(Anexo).filter_by(anexo_id=id_desejado).delete()
            
            except Exception as e:
                response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
                return response, 500

            db.session.commit()
            response = {'status':'success', 'msg':'ANEXO DELETADO COM SUCESSO!'}
            return response, 200



# rota usada para exibir um anexo
@view_attachment.route('/<int:id_desejado>', methods=['GET'])
@jwt_required()
def get_attachment(id_desejado):
    from models.anexo import Anexo

    try:
        anexo_desejado = db.session.query(Anexo).filter_by(anexo_id=id_desejado).first()
    
    except Exception as e:
        response = {'status':'error', 'msg':'HOUVE UM ERRO NO BANCO DE DADOS'}
        return response, 500
    

    result = {
                "id":anexo_desejado.anexo_id,
                "garantia": datetime.strftime(anexo_desejado.garantia, '%d/%m/%Y às %H:%M:%S, %A') if anexo_desejado.garantia != None else '',
                "observacoes": anexo_desejado.observacoes,
                "solucao": anexo_desejado.solucao,
                "is_emitida": True if anexo_desejado.emitida else False
            }
                
    return result, 302
