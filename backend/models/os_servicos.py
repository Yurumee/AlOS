from config import db
from sqlalchemy import INTEGER, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.ordemServico import OrdemServico
from models.servico import Servico

# tabela pivo entre ordemServico e servico
class OSServicos(db.Model):
    __tablename__ = 'osServicos'

    # COLUNAS
    # chave primaria
    id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)
    
    # chaves estrangeiras 
    ordem_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('ordemServico.ordem_id'))
    servico_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('servico.servico_id'))

    # RELACIONAMENTOS
    # relacionamento n:n com ordemServico e servico
    ordem_servico: Mapped['OrdemServico'] = relationship(backref='osServicos')
    servicos: Mapped['Servico'] = relationship(backref='osServicos')
