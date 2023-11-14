from pydantic import BaseModel

class createFinanceSchema(BaseModel):
    income: float
    expense: float
    debts: float
    assets: float