import unittest
from .. import create_app
from ..config import config_dict
from ..db import db
from flask_jwt_extended import create_access_token
from ..insert_sup import insert_sup

mock_user = {
                'cpf_tecnico': '12345678902',
                'user': 'fulano',
                'senha_tecnico':'123456',
                'senha_confirma':'123456',
                'nome_tecnico': 'Fulano',
                'contato_tecnico': '912345678',
                'endereco_tecnico': 'Rua Bonita, n 123',
                'admin': True
                }


class TestClient(unittest.TestCase):
    def setUp(self):
        self.app = create_app(config=config_dict['test'])
        
        self.appContext = self.app.app_context()

        self.appContext.push()

        self.client = self.app.test_client()
 
        db.create_all()
        insert_sup()

        self.access_token = create_access_token(identity='1')
        self.headers = {
                    "Authorization": f"Bearer {self.access_token}"
                  }

    def tearDown(self):
        db.drop_all()

        self.appContext.pop()

        self.app = None

        self.client = None

    def test_tech_new(self):
        '''
        DADO um TECNICO
        QUANDO cadastrado
        TESTE SE os dados são inseridos corretamente
        '''

        response = self.client.post('/tecnico/novo', json=mock_user, headers=self.headers)
        assert response.status_code == 201

    def test_tech_login(self):
        '''
        DADO um TECNICO
        QUANDO inserido usuario e senha
        TESTE SE o login é realizado corretamente
        '''
        data = {
                'usuario': 'admin',
                'senha': 'admin001'
                }
        response = self.client.post('/tecnico/login', json=data)
        assert response.status_code == 200

    def test_tech_logout(self):
        '''
        DADO um TECNICO LOGADO
        QUANDO requisitado logout
        TESTE SE o logout é realizado corretamente
        '''

        from flask import session

        # login
        data = {
                'usuario': 'admin',
                'senha': 'admin001'
                }
        self.client.post('/tecnico/login', json=data)

        # testando logout
        response = self.client.post('/tecnico/logout', headers=self.headers)
    
        assert response.status_code == 200

    def test_tech_edit(self):
        '''
        DADO um TECNICO
        QUANDO editado
        TESTE SE os dados são modificados corretamente
        '''
        from ..models.tecnico import Tecnico
        
        data_edit = {
            'nome_tecnico': 'Cicrano',
            'contato_tecnico': '987654321',
            'endereco_tecnico': 'Rua Nova, n° 789',
            'admin': False
        }

        # inserindo tecnico
        self.client.post('/tecnico/novo', json=mock_user, headers=self.headers)
        
        # editando
        response = self.client.post('/tecnico/editar/2', json=data_edit, headers=self.headers)
        
        assert response.status_code == 200
        
        # checando
        tech = db.session.query(Tecnico).filter_by(tecnico_id=2).one_or_none()
        
        assert tech.nome_tecnico == 'Cicrano'
        assert tech.contato_tecnico == '987654321'
        assert tech.endereco == 'Rua Nova, n° 789' 
        assert tech.administrador == False
        
    def test_tech_delete(self):
        '''
        DADO um TECNICO EXISTENTE
        QUANDO editado
        TESTE SE os dados são modificados corretamente
        '''
        # from ..models.tecnico import Tecnico

        # inserindo
        self.client.post('/tecnico/novo', json=mock_user, headers=self.headers)

        # excluindo
        response = self.client.post('/tecnico/excluir/2', headers=self.headers)
        
        assert response.status_code == 200

    def test_tech_search(self):
        '''
        DADO um TECNICO EXISTENTE
        QUANDO pesquisado
        TESTE SE os dados são retornados corretamente
        '''
        # from ..models.tecnico import Tecnico

        # inserindo
        self.client.post('/tecnico/novo', json=mock_user, headers=self.headers)

        # pesquisando
        response = self.client.get('/tecnico/pesquisar/2', headers=self.headers)
        data = response.json

        assert response.status_code == 302
        assert data == {
                        '2': {
                            'id':2,
                            'cpf': '12345678902',
                            'nome_completo': 'Fulano',
                            'usuario': 'fulano',
                            'endereco': 'Rua Bonita, n 123',
                            'telefone': '912345678',
                            'admin': True
                        }
                       }
    
    def test_tech_all(self):
        '''
        DADO um TECNICO
        QUANDO pesquisado
        TESTE SE todos os tecnicos são retornados corretamente
        '''
        # from ..models.tecnico import Tecnico

        response = self.client.get('/tecnico/', headers=self.headers)
        data = response.json

        assert response.status_code == 200
        assert data == {
                        '1': {
                            'id':1,
                            'cpf': '1234567890',
                            'usuario': 'admin',
                            'nome_completo': 'Administrador',
                            'endereco': 'Rua dos Bobos, nº 0',
                            'telefone': '912345678',
                            'admin': 'Sim'
                        }
                       }
    
    