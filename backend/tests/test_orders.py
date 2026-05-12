import unittest
from .. import create_app
from ..config import config_dict
from ..db import db
from flask_jwt_extended import create_access_token
from ..insert_sup import insert_sup


class TestOrders(unittest.TestCase):
    def setUp(self):

        mock_user = {
                        'cpf_tecnico': '12345678902',
                        'user': 'Fulano',
                        'senha_tecnico':'123456',
                        'senha_confirma':'123456',
                        'nome_tecnico': 'Fulano',
                        'contato_tecnico': '912345678',
                        'endereco_tecnico': 'Rua Bonita, n 123',
                        'admin': True
                    }

        mock_cli = {
                        'cpf_cnpj_cliente': '12345678903',
                        'flag_cnpj': False,
                        'nome_cliente':'cliente 01',
                        'empresa_cliente':'',
                        'endereco_cliente': 'Rua Formosa, n 456',
                        'bairro_cliente': 'Centro',
                        'cidade_cliente': 'Campos Neutrais',
                        'cep_cliente': '12345000',
                        'telefone_cliente': '9123789465',
                        'limite_credito': '300.50',
                    }

        mock_cat_1 = {
                        'nome_categoria': 'Peças Notebook',
                        'tipo_categoria': 'Estoque',
                        'descricao_categoria':'Peças de reposição para notebook',
                    }
        mock_cat_2 = {
                        'nome_categoria': 'Formatação',
                        'tipo_categoria': 'Servico',
                        'descricao_categoria':'Serviço de formatação realizado',
                    }

        mock_serv = {
                        'nome_servico': 'Formatação completa',
                        'categoria_servico': 'Servico',
                        'descricao_servico': 'formatação + serial windows original',
                        'custo_servico': 100,
                    }

        mock_item_1 = {
                        'nome_item': 'Teclado Samsung',
                        'categoria_item': 'Estoque',
                        'descricao_item':'teclado samsung original',
                        'quantidade':3,
                        'valor_un':42.56,
                        'codigo_barras':963852741456,
                    }

        mock_item_2 = {
                        'nome_item': 'SSD 240GB',
                        'categoria_item': 'Estoque',
                        'descricao_item':'SSD 240GB marca X',
                        'quantidade': 5,
                        'valor_un': 329.99,
                        'codigo_barras': 1472583690123,
                    }


        mock_prod = {
                        'cliente_id': 1,
                        'modelo': 'DELL',
                        'num_serie':'73573-A1',
                        'cor':'Preto',
                        'sis_operacional': 'Windows 10',
                        'avaria': False,
                        'liga': True,
                        'carrega': True,
                        'backup': True,
                        'acessorios': 'Com carregador',
                        'obs': '',
                        }

        self.mock_os = {
                        'cliente_id': 1,
                        'produto_id': 1,
                        'tipo_os':'Preventiva',
                        'prognostico':'Tela quebrada',
                        'diagnostico': 'Troca de tela; conserto da dobradiça esquerda',
                        'estado': 'Criada',
                        'emitir': False,
                        'hora_emissao': '2026-05-11T20:31',
                        'hora_fechamento': '2026-05-31T20:31',
                        'data_validade': '2026-06-09T20:31',
                        'orcamento': [
                                        {'cod_barra_item': 1472583690123, 'id':1, 'quantidade':1, 'nome': 'SSD 240GB', 'preco': 329.99, 'tipo': 'estoque'}, 

                                        {'cod_barra_item': 963852741456, 'id':2, 'quantidade':2, 'nome': 'Teclado Samsung', 'preco': 42.56, 'tipo': 'estoque'},

                                        {'id_item': 1, 'quantidade':1, 'nome': 'Formatação completa', 'preco': 100, 'tipo': 'servico'}
                                     ],
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
        
        # realizando login
        self.client.post('/tecnico/login', json={'usuario': 'admin', 'senha': 'admin001'})

        # criando novo tecnico
        self.client.post('/tecnico/novo', json=mock_user, headers=self.headers)

        # cadastrando cliente
        self.client.post('/cliente/novo', json=mock_cli, headers=self.headers)

        # cadastrando produto do cliente
        self.client.post('/produto/novo', json=mock_prod, headers=self.headers)
        
        # cadastrando categorias
        self.client.post('/categoria/novo', json=mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=mock_cat_2, headers=self.headers)
        
        # cadastrando produtos de estoque
        self.client.post('/estoque/novo', json=mock_item_1, headers=self.headers)
        self.client.post('/estoque/novo', json=mock_item_2, headers=self.headers)

        # cadastrando servicos
        self.client.post('/servico/novo', json=mock_serv, headers=self.headers)

    def tearDown(self):
        self.client.post('/tecnico/logout', headers=self.headers)

        db.drop_all()

        self.appContext.pop()

        self.app = None

        self.client = None


    def test_os_new(self):
        '''
        DADO um modelo OrdemServico
        QUANDO cadastrado uma nova OS
        TESTE SE a OS é criada com sucesso
        '''
        # from ..models.ordemServico import OrdemServico
        
        response = self.client.post('/os/novo', json=self.mock_os, headers=self.headers)

        print(response.get_json())

        assert response.status_code == 201

    def test_os_edit(self):
        '''
        DADO um modelo OrdemServico
        QUANDO editar uma OS
        TESTE SE a OS é editada com sucesso
        '''

        from ..models.ordemServico import OrdemServico

        # criando os
        self.client.post('/os/novo', json=self.mock_os, headers=self.headers)

        edit_os = {
                    'fechamento': '2026-05-23T21:58',
                    'validade': '2026-05-21T23:59',
                    'prognostico': 'Tela quebrada, lentidão',
                    'diagnostico': 'Troca de tela, formatação, conserto de dobradiça',
                    'orcamento': [
                                    {'cod_barra_item': '1472583690123', 'id':1, 'quantidade':1, 'nome': 'SSD 240GB', 'preco': 329.99, 'tipo': 'estoque'}, 

                                    {'cod_barra_item': '963852741456', 'id':2, 'quantidade':1, 'nome': 'Teclado Samsung', 'preco': 42.56, 'tipo': 'estoque'},

                                    {'id_item': 1, 'quantidade':1, 'nome': 'Formatação completa', 'preco': 100, 'tipo': 'servico'}
                                ],
                    'estado': 'Emitida',
                    'emitir_os': True,
                  }
        
        # orcamento_val_total = 472,55
        orcamento_val_total = 0
        
        for item in edit_os['orcamento']:
            orcamento_val_total += int(item['quantidade']) * float(item['preco'])

        # editando os
        response = self.client.post('/os/editar/1', json=edit_os, headers=self.headers)

        print(response.get_json())

        assert response.status_code == 200

        # checando

        os = db.session.query(OrdemServico).filter_by(ordem_id = 1).one_or_none()

        assert os.fechamento == edit_os['fechamento']
        assert os.validade == edit_os['validade']
        assert os.estado_os == edit_os['estado']
        assert os.prognostico == edit_os['prognostico']
        assert os.diagnostico == edit_os['diagnostico']
        assert os.emissao == edit_os['emitir_os']
        
        assert os.orcamento == orcamento_val_total

    def test_os_del(self):
        '''
        DADO um modelo OrdemServico
        QUANDO excluir uma  OS
        TESTE SE a OS é criada com sucesso
        '''