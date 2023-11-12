from typing import Optional

from fastapi import HTTPException, status
from pydantic import BaseModel, field_validator

class createFinanceSchema(BaseModel):
    income: float
    expense: float
    debt: float
    assets: float
    score: float