import unittest
from .. import create_app
from ..config import config_dict
from ..db import db
from flask_jwt_extended import create_access_token
from ..insert_sup import insert_sup


class TestStorage(unittest.TestCase):
    def setUp(self):
        self.mock_item_1 = {
                        'nome_item': 'SSD 240GB',
                        'categoria_item': 1,
                        'descricao_item':'SSD da marca X',
                        'quantidade': 2,
                        'valor_un': '299.99',
                        'codigo_barras': '012345678901',
                    }
        
        self.mock_item_2 = {
                        'nome_item': 'Teclado ABNT2',
                        'categoria_item': 2,
                        'descricao_item':'Teclado de notebook da marca Z',
                        'quantidade': 2,
                        'valor_un': '49.99',
                        'codigo_barras': '74185296302',
                    }
        
        self.mock_cat_1 = {
                        'nome_categoria': 'SSD',
                        'tipo_categoria': 'Estoque',
                        'descricao_categoria':'SSDs de tamanhos variados',
                    }

        self.mock_cat_2 = {
                        'nome_categoria': 'Peças',
                        'tipo_categoria': 'Geral',
                        'descricao_categoria':'Peças de computadores em geral',
                    }

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

    def test_storage_new(self):
        '''
        DADO um ITEM DE ESTOQUE
        QUANDO cadastrado
        TESTE SE os dados são inseridos corretamente
        '''

        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        response_1 = self.client.post('/estoque/novo', json=self.mock_item_1, headers=self.headers)
        
        assert response_1.status_code == 201

    def test_storage_edit(self):
        '''
        DADO um ITEM DE ESTOQUE
        QUANDO editado
        TESTE SE os dados são modificados corretamente
        '''
        from ..models.estoque import Estoque
        
        data_edit = {
                        'nome_item': 'SSD 500GB',
                        'categoria_item': 2,
                        'descricao_item':'SSD da marca Y',
                        'quantidade': 5,
                        'valor_un': '499.99',
                        'codigo_barras': '98765432109',
                    }

        # inserindo cliente e produto
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        self.client.post('/estoque/novo', json=self.mock_item_1, headers=self.headers)
        
        # editando
        response_1 = self.client.post('/estoque/editar/1', json=data_edit, headers=self.headers)
        
        assert response_1.status_code == 200
        
        # checando
        item = db.session.query(Estoque).filter_by(item_id=1).one_or_none()
        
        assert item.nome_item == data_edit['nome_item']
        assert item.categoria_id == data_edit['categoria_item']
        assert item.descricao_item == data_edit['descricao_item']
        assert item.quantidade == data_edit['quantidade']
        assert float(item.preco_unitario) == float(data_edit['valor_un'])
        assert item.cod_barras == data_edit['codigo_barras']
        
        
    def test_storage_delete(self):
        '''
        DADO um ITEM DE ESTOQUE EXISTENTE
        QUANDO deletado
        TESTE SE os dados são excluídos corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/estoque/novo', json=self.mock_item_1, headers=self.headers)

        # excluindo
        response = self.client.post('/estoque/excluir/1', headers=self.headers)
        
        assert response.status_code == 200

    def test_storage_search(self):
        '''
        DADO um ITEM DE ESTOQUE EXISTENTE
        QUANDO pesquisado
        TESTE SE os dados são retornados corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/estoque/novo', json=self.mock_item_1, headers=self.headers)

        # pesquisando
        response = self.client.get('/estoque/pesquisar/1', headers=self.headers)
        data = response.json

        assert response.status_code == 302
        assert data == {
                        'id':1,
                        'nome_item': 'SSD 240GB',
                        'descricao':'SSD da marca X',
                        'quantidade': 2,
                        'valor_un': '299.99',
                        'codigo_barras': '012345678901',
                        'categoria': 1,
                    }
    
    def test_storage_search_category(self):
        '''
        DADO um ITEM DE ESTOQUE EXISTENTE
        QUANDO pesquisado
        TESTE SE os dados são retornados corretamente de acordo com a categoria desejada
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        self.client.post('/estoque/novo', json=self.mock_item_1, headers=self.headers)
        self.client.post('/estoque/novo', json=self.mock_item_2, headers=self.headers)

        # pesquisando
        response = self.client.get('/estoque/busca/2', headers=self.headers)
        data = response.json

        assert response.status_code == 302
        assert data == {
                        '2': {
                                'id': 2,
                                'categoria': 2,
                                'nome_item': 'Teclado ABNT2',
                                'descricao':'Teclado de notebook da marca Z',
                                'quantidade': 2,
                                'preco_un': '49.99',
                                'codigo_barras': '74185296302',
                                'tipo': 'estoque'
                            } 
                    } 
    

    def test_storage_all(self):
        '''
        DADO um ITEM DE ESTOQUE
        QUANDO pesquisado
        TESTE SE todos os itens são retornados corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        self.client.post('/estoque/novo', json=self.mock_item_1, headers=self.headers)
        self.client.post('/estoque/novo', json=self.mock_item_2, headers=self.headers)

        response = self.client.get('/estoque/', headers=self.headers)
        data = response.json

        assert response.status_code == 200
        assert data == {
                        '1': {
                            'id': 1,
                            'categoria': 'SSD',
                            'nome_item': 'SSD 240GB',
                            'descricao':'SSD da marca X',
                            'quantidade': 2,
                            'preco_un': '299.99',
                            'codigo_barras': '012345678901',
                        },

                        '2': {
                                'id': 2,
                                'categoria': 'Peças',
                                'nome_item': 'Teclado ABNT2',
                                'descricao':'Teclado de notebook da marca Z',
                                'quantidade': 2,
                                'preco_un': '49.99',
                                'codigo_barras': '74185296302',
                            }
                       }