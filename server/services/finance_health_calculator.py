def finance_health_calculator(
    income: float,
    expense: float,
    debts: float,
    assets: float
):
    disposable_income = income - expense
    debt_to_income_ratio = (debts / income) * 100
    savings_rate = ((income - expense) - debts) / income * 100
    net_worth = assets - debts

    normalized_scores = {
        'disposable_income': min(100, max(0, (disposable_income / max(income, 1)) * 100)),
        'debt_to_income_ratio': min(100, max(0, 100 - debt_to_income_ratio)),
        'savings_rate': min(100, max(0, savings_rate)),
        'net_worth': min(100, max(0, (net_worth / max(assets, 1)) * 100)),
    }

    weights = {
        'disposable_income': 0.4,
        'debt_to_income_ratio': 0.4,
        'savings_rate': 0.2,
        'net_worth': 0.2,
    }

    financial_health_score = sum(
        score * weights[metric] for metric, score in normalized_scores.items()
    )

    return financial_health_score
