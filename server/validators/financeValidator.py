from fastapi import Depends, HTTPException, Request, status

from database import db
from models.User import User
from models.Finance import Finance
from models.Company import Company
from utils.helpers import tags_arr_to_str
from middlewares import get_current_user2
from schemas.FinanceSchema import createFinanceSchema


def validate_create_finance(
    request: Request,
    finance: createFinanceSchema,
    user=Depends(get_current_user2)
):
    # all fileds should be non-negative
    if finance.income < 0 or finance.expense < 0 or finance.debts < 0 or finance.assets < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='All fields should be non-negative'
        )

    return finance

def validate_get_finance(
    request: Request,
    id: int,
    user=Depends(get_current_user2)
):
    finance = (
        db.query(Finance)
        .filter(Finance.id == id)
        .first()
    )
    print(finance)

    if finance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Finance not found'
        )

    if finance.company.user_id != user.get('id'):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='You are not allowed to access this finance'
        )
    else:
        return finance
