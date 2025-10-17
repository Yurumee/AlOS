# importando bibliotecas necessarias
from config import db
from sqlalchemy import INTEGER, VARCHAR, NUMERIC, Numeric
from sqlalchemy.orm import Mapped, mapped_column

class Cliente(db.Model):
    __tablename__ = 'cliente'

    # COLUNAS
    # chave primaria
    # max 14
    cpf_cnpj: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=False)
    
    nome_completo: Mapped[str] = mapped_column(VARCHAR(50), nullable=False)
    nome_fantasia: Mapped[str] = mapped_column(VARCHAR(50))
    telefone: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    endereco: Mapped[str] = mapped_column(VARCHAR(50), nullable=False) # rua, numero
    bairro: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    cidade: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    cep: Mapped[int] = mapped_column(INTEGER)
    limite_credito: Mapped[Numeric] = mapped_column(NUMERIC(12, 2))