from validators.financeValidator import validate_get_finance, validate_get_finance_by_company
from sqlalchemy import desc
from middlewares import get_current_user
from typing import Annotated
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse

from database import db
from models.Finance import Finance
from models.Company import Company
from models.User import User
from services.finance_health_calculator import finance_health_calculator


class createFinanceSchema(BaseModel):
    income: float
    expense: float
    debts: float
    assets: float


router = APIRouter()

# create a finance
@router.post('/finances')
def store(
    request: Request,
    finance: createFinanceSchema,
    user=Depends(get_current_user),
):
    try:
        score = finance_health_calculator(
            finance.income, finance.expense, finance.debts, finance.assets)
        print(score)
        new_finance = Finance(
            income=finance.income,
            expense=finance.expense,
            debts=finance.debts,
            assets=finance.assets,
            score=score,
            company_id=user.get('company_id')
        )
        db.add(new_finance)
        db.commit()

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                'detail': 'Finance create successfully',
                'data': {
                    'finance': new_finance.serialize()
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# get finances history by company
@router.get('/finances')
def index(
    request: Request,
    page: int = 1,
    limit: int = 10,
    user=Depends(get_current_user),
):
    try:
        finances = (
            db.query(Finance)
            .join(Company, Finance.company_id == Company.id)
            .join(User, Company.user_id == User.id)
            .filter(User.id == user.get('id'))
            .order_by(desc(Finance.created_at))
            .limit(limit)
            .offset((page - 1) * limit)
            .all()
        )

        total_finances = (
            db.query(Finance)
            .join(Company, Finance.company_id == Company.id)
            .join(User, Company.user_id == User.id)
            .filter(User.id == user.get('id'))
            .count()
        )

        finances = [finance.serialize() for finance in finances]
        
        return JSONResponse(
            status_code=200,
            content={
                'detail': 'Finances fetched successfully',
                'data': {
                    'finances': finances,
                    'total': total_finances
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# get a single finance
@router.get('/finances/{id}')
def show(request: Request, finance: Finance = Depends(validate_get_finance)):
    try:
        finance = finance.serialize()

        return JSONResponse(
            status_code=200,
            content={
                'detail': 'Finance fetched successfully',
                'data': {
                    'finance': finance                    
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
