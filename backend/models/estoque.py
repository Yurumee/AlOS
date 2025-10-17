# importando bibliotecas necessarias
from config import db
from sqlalchemy import INTEGER, VARCHAR, NUMERIC, Numeric
from sqlalchemy.orm import mapped_column, Mapped

class Estoque(db.Model):
    __tablename__ = 'estoque'

    # COLUNAS
    # chave primaria
    id_item: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    nome_item: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    descricao_item: Mapped[str] = mapped_column(VARCHAR(30))
    quantidade: Mapped[int] = mapped_column(INTEGER, default=0, nullable=False)
    preco_unitario: Mapped[Numeric] = mapped_column(NUMERIC(7, 2), default=0.01, nullable=False)
    cod_barras: Mapped[int] = mapped_column(INTEGER)
    categoria_item: Mapped[str] = mapped_column(VARCHAR(30))