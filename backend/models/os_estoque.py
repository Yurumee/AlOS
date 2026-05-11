from ..db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import INTEGER, ForeignKey

# TABELA ASSOCIATIVA ENTRE ESTOQUE E OS
class Os_estoque(db.Model):
    __tablename__ = 'os_estoque'

    # COLUNAS
    # chave primaria
    id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    ordem_id: Mapped[int] = mapped_column(ForeignKey('ordemServico.ordem_id'))
    item_id: Mapped[int] = mapped_column(ForeignKey('estoque.item_id'))

    quantidade: Mapped[int] = mapped_column(INTEGER)

    ordem: Mapped['models.ordemServico.OrdemServico'] = relationship(back_populates='itens_os')
    itens: Mapped['models.estoque.Estoque'] = relationship(back_populates='ordens_item')