# importando bibliotecas necessarias
from config import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import VARCHAR, INTEGER, NUMERIC, Numeric

class Servico(db.Model):
    __tablename__ = 'servico'

    # COLUNAS
    # chave primaria
    id_servico: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    nome_servico: Mapped[str] = mapped_column(VARCHAR(30), nullable=False)
    descricao_servico: Mapped[str] = mapped_column(VARCHAR(30))
    custo: Mapped[Numeric] = mapped_column(NUMERIC(7, 2), default=0.01 , nullable=False)
    categoria_servico: Mapped[str] = mapped_column(VARCHAR(30))