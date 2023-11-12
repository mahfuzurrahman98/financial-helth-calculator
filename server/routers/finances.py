from typing import Annotated
from pydantic import BaseModel, Field

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.responses import StreamingResponse

from database import db
from models.Finance import Finance


class createFinanceSchema(BaseModel):
    income: float
    expense: float
    debt: float
    assets: float
    score: float

from services.code_review_service import get_response_openai
from sqlalchemy import desc


from middlewares import get_current_user

router = APIRouter()

# create a finance
@router.post('/finances')
def store(
    request: Request,
    finance: createFinanceSchema
    user=Depends(get_current_user),
):
    try:
        score = get_response_openai(finance.income, finance.expense, finance.debt, finance.assets)
        new_finance = Finance(
            income=finance.income,
            expense=finance.expense,
            debt=finance.debt,
            assets=finance.assets,
            score=score,
            user_id=user.get('id')
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


# get all public finances
@router.get('/finances')
def index(
    request: Request,
    q: str = '',
    page: int = 1,
    limit: int = 10,
):
    try:
        title_condition = Finance.title.ilike(f"%{q}%")
        tag_condition = Finance.tags.ilike(f"%{q}%")

        total_count = (
            db.query(Finance)
            .filter(
                Finance.visibility == 1,
                title_condition | tag_condition
            )
            .count()
        )

        finances = (
            db.query(Finance)
            .filter(
                Finance.visibility == 1,
                title_condition | tag_condition
            )
            .order_by(desc(Finance.created_at))
            .limit(limit)
            .offset((page - 1) * limit)
            .all()
        )

        if len(finances) == 0:
            return JSONResponse(
                status_code=404,
                content={
                    'detail': 'No finances found',
                }
            )

        finances = [finance.serialize() for finance in finances]
        for finance in finances:
            del finance['id']
            del finance['visibility']
            del finance['updated_at']
            finance['mode'] = get_language(finance['_lang'])['mode']
            del finance['_lang']
            finance['source_code'] = finance['source_code'][:200] if len(
                finance['source_code']) > 200 else finance['source_code']

        return JSONResponse(
            status_code=200,
            content={
                'detail': 'Snipppets fetched successfully',
                'data': {
                    'finances': finances,
                    'total': total_count
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# get a single finance
@router.get('/finances/{uid}')
def show(request: Request, finance: Finance = Depends(validate_finance)):
    try:
        _finance = finance.serialize()
        del _finance['id']
        del _finance['visibility']
        del _finance['updated_at']
        _finance['mode'] = get_language(_finance['_lang'])['mode']
        del _finance['_lang']

        return JSONResponse(
            status_code=200,
            content={
                'detail': 'Snipppet fetched successfully',
                'data': {
                    'finance': _finance
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

