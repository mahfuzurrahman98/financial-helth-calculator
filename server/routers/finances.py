from validators.financeValidator import validate_get_finance, validate_create_finance
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
from schemas.FinanceSchema import createFinanceSchema


router = APIRouter()


# get finance dashboard
@router.get('/finances/dashboard')
def dashboard(request: Request, user=Depends(get_current_user)):
    try:
        finances = (
            db.query(Finance)
            .join(Company, Finance.company_id == Company.id)
            .join(User, Company.user_id == User.id)
            .filter(User.id == user.get('id'))
            .order_by(desc(Finance.created_at))
            .all()
        )

        total_finances = len(finances)

        # find total income, expense, last debts, and last assets
        total_income = 0
        total_expense = 0
        last_debts = 0
        last_assets = 0
        average_score = 0
        total_score = 0
        recent_finances = []

        if total_finances > 0:
            total_income = sum([finance.income for finance in finances])
            total_expense = sum([finance.expense for finance in finances])
            last_debts = finances[0].debts
            last_assets = finances[0].assets
            total_score = sum([finance.score for finance in finances])
            average_score = total_score / total_finances
            recent_finances = finances[:6]
            recent_finances = [finance.serialize()
                               for finance in recent_finances]
        else:
            finances = []

        return JSONResponse(
            status_code=200,
            content={
                'detail': 'Finances fetched successfully',
                'data': {
                    'recent_finances': recent_finances,
                    'total_finances_count': total_finances,
                    'total_income': total_income,
                    'total_expense': total_expense,
                    'last_debts': last_debts,
                    'last_assets': last_assets,
                    'current_score': finances[0].score if total_finances > 0 else 0,
                    'average_score': average_score
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# create a finance
@router.post('/finances')
def store(
    request: Request,
    finance: createFinanceSchema = Depends(validate_create_finance),
    user=Depends(get_current_user),
):
    try:
        print(finance)
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

        _finances = []
        if total_finances > 0:
            for finance in finances:
                _finance = finance.serialize()
                # with data and time also
                _finance['calculated_at'] = finance.created_at.strftime(
                    "%d %b %Y, %H:%M"
                )
                _finances.append(_finance)

        return JSONResponse(
            status_code=200,
            content={
                'detail': 'Finances fetched successfully',
                'data': {
                    'finances': _finances,
                    'total': total_finances
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# create a finance score for guest user
@router.post('/finances/guest')
def guest(
    request: Request,
    finance: createFinanceSchema = Depends(validate_create_finance)
):
    try:
        print(finance)
        score = finance_health_calculator(
            finance.income, finance.expense, finance.debts, finance.assets)
        print(score)
   

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                'detail': 'Finance create successfully',
                'data': {
                    'finance': {
                        'score': score
                    }
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
