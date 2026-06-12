from config import db
from sqlalchemy import VARCHAR, INTEGER, BOOLEAN
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.ordemServico import OrdemServico
class Tecnico(db.Model):
    __tablename__ = 'tecnico'

    # COLUNAS
    # chave primaria
    tecnico_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    cpf_tecnico: Mapped[str] = mapped_column(VARCHAR(11), unique=True) # max 11
    usuario: Mapped[str] = mapped_column(VARCHAR, unique=True)
    senha: Mapped[str] = mapped_column(VARCHAR)
    nome_tecnico: Mapped[str] = mapped_column(VARCHAR(50))
    contato_tecnico: Mapped[str] = mapped_column(VARCHAR(20))
    endereco: Mapped[str] = mapped_column(VARCHAR(30), nullable=True)
    administrador: Mapped[bool] = mapped_column(BOOLEAN, default=False)

    # RELACIONAMENTOS
    # relacionamento 1:n com ordemServico
    ordem_servicos: Mapped[list['OrdemServico']] = relationship()
    