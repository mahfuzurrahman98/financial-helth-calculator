
from os import environ
from fastapi import FastAPI, HTTPException

def finance_health_calculator(
    income: float,
    expense: float,
    debt: float,
    assets: float
):
    # calculate the finance health score of a company using its monthly income, expense, debt, and assets
    # return a score between 0 and 100
    # 0 is the worst score, 100 is the best score
    # the score is calculated using the following formula:
    # score = (income - expense) / (debt + assets)
    score = (income - expense) / (debt + assets)
    return score