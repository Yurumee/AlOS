from config import db
from sqlalchemy import VARCHAR, INTEGER
from sqlalchemy.orm import Mapped, mapped_column

class Tecnico(db.Model):
    __tablename__ = 'tecnico'

    # COLUNAS
    # chave primaria
    # max 11
    cpf_tecnico: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=False)
    
    nome_tecnico: Mapped[str] = mapped_column(VARCHAR(50), nullable=False)
    contato_tecnico: Mapped[str] = mapped_column(VARCHAR(20))
    endereco: Mapped[str] = mapped_column(VARCHAR(30))