from config import db
from sqlalchemy import INTEGER, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.ordemServico import OrdemServico
from models.estoque import Estoque

class OSItens(db.Model):
    __tablename__ = 'osItens'

    # COLUNAS
    # chave primaria
    id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chaves estrangeiras
    ordem_id: Mapped[int] = mapped_column(ForeignKey('ordemServico.ordem_id'))
    item_id: Mapped[int] = mapped_column(ForeignKey('estoque.item_id'))

    # RELACIONAMENTOS
    # relacionamentos n:n entre ordemServico e estoque
    ordem_servico: Mapped['OrdemServico'] = relationship(backref='osItens')
    itens: Mapped['Estoque'] = relationship(backref='osItens')
