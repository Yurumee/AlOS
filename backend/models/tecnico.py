from config import db
from sqlalchemy import VARCHAR, INTEGER
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.ordemServico import OrdemServico
class Tecnico(db.Model):
    __tablename__ = 'tecnico'

    # COLUNAS
    # chave primaria
    cpf_tecnico: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=False) # max 11
    
    nome_tecnico: Mapped[str] = mapped_column(VARCHAR(50), nullable=False)
    contato_tecnico: Mapped[str] = mapped_column(VARCHAR(20))
    endereco: Mapped[str] = mapped_column(VARCHAR(30))

    # RELACIONAMENTOS
    # relacionamento 1:n com ordemServico
    ordem_servicos: Mapped[list['OrdemServico']] = relationship()