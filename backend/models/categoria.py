from config import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import INTEGER, VARCHAR

from models.estoque import Estoque
from models.servico import Servico

class Categoria(db.Model):
    __tablename__ = 'categoria'

    # COLUNAS
    # chave primaria
    categoria_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    titulo: Mapped[str] = mapped_column(VARCHAR(20), nullable=False, unique=True)
    tipo: Mapped[str] = mapped_column(VARCHAR(20), nullable=False, default='Geral')
    descricao: Mapped[str] = mapped_column(VARCHAR(100))

    # RELACIONAMENTOS
    # relacionamento 1:n com estoque
    itens: Mapped[list['Estoque']] = relationship()
    # relacionamento 1:n com servico
    servicos: Mapped[list['Servico']] = relationship()