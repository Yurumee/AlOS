# importando bibliotecas necessarias
from ..db import db
# from config import db
from sqlalchemy import INTEGER, VARCHAR, NUMERIC, Numeric, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

class Estoque(db.Model):
    __tablename__ = 'estoque'

    # COLUNAS
    # chave primaria
    item_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    categoria_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('categoria.categoria_id'), nullable=True)

    nome_item: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    descricao_item: Mapped[str] = mapped_column(VARCHAR(30), nullable=True)
    quantidade: Mapped[int] = mapped_column(INTEGER, default=0, nullable=False)
    preco_unitario: Mapped[Numeric] = mapped_column(NUMERIC(7, 2), default=0.01, nullable=False)
    cod_barras: Mapped[str] = mapped_column(VARCHAR, unique=True)

    # RELACIONAMENTOS
    # relacionamentos n:n entre ordemServico e estoque
    ordens_item: Mapped[list['models.os_estoque.Os_estoque']] = relationship(back_populates='itens')
    