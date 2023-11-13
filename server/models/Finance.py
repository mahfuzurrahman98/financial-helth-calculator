from sqlalchemy import TIMESTAMP, Column, Integer, func, Double
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

from database import Base


class Finance(Base):
    __tablename__ = 'finances'
    id = Column(Integer, primary_key=True, autoincrement=True)
    income = Column(Double, nullable=False)
    expense = Column(Double, nullable=False)
    debts = Column(Double, nullable=False)
    assets = Column(Double, nullable=False)
    score = Column(Double, nullable=False)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(
        TIMESTAMP,
        nullable=True,
        default=None,
        onupdate=func.now(),
        server_onupdate=func.now()
    )
    deleted_at = Column(TIMESTAMP, nullable=True, default=None)

    # many finances to one company
    company = relationship('Company', back_populates='finances')

    def serialize(self):
        return {
            'id': self.id,
            'income': self.income,
            'expense': self.expense,
            'debts': self.debts,
            'assets': self.assets,
            'score': self.score
        }
