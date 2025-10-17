from config import db
from sqlalchemy import VARCHAR, INTEGER, BOOLEAN
from sqlalchemy.orm import Mapped, mapped_column

class Produto(db.Model):
    __tablename__ = 'produto'

    # COLUNAS
    # chave primaria
    produto_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    # TO DO

    modelo: Mapped[str] = mapped_column(VARCHAR(20), nullable=False, default='SEM INFO')
    num_serie: Mapped[str] = mapped_column(VARCHAR(20), nullable=False, default='SEM INFO')
    cor: Mapped[str] = mapped_column(VARCHAR(20))
    sis_operacional: Mapped[str] = mapped_column(VARCHAR(20))
    avaria: Mapped[bool] = mapped_column(BOOLEAN)
    liga: Mapped[bool] = mapped_column(BOOLEAN)
    carrega: Mapped[bool] = mapped_column(BOOLEAN)
    backup: Mapped[bool] = mapped_column(BOOLEAN)
    acessorios: Mapped[str] = mapped_column(VARCHAR)
    observacoes: Mapped[str] = mapped_column(VARCHAR)