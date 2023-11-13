function categorizeHealthScore(score: number) {
  if (score >= 80 && score <= 100) {
    return 'Excellent';
  } else if (score >= 60 && score < 80) {
    return 'Good';
  } else if (score >= 40 && score < 60) {
    return 'Stable';
  } else if (score >= 20 && score < 40) {
    return 'Challenged';
  } else if (score >= 0 && score < 20) {
    return 'Critical';
  } else {
    return 'Invalid Score';
  }
}

function categorizeHealthScoreColor(score: number) {
  if (score >= 80 && score <= 100) {
    return 'bg-green-700';
  } else if (score >= 60 && score < 80) {
    return 'bg-green-500';
  } else if (score >= 40 && score < 60) {
    return 'bg-yellow-700';
  } else if (score >= 20 && score < 40) {
    return 'bg-yellow-500';
  } else if (score >= 0 && score < 20) {
    return 'bg-red-600';
  } else {
    return 'bg-gray-500';
  }
}

function generateSuggestions(
  income: number,
  expense: number,
  debt: number,
  assets: number,
  score: number
) {
  const disposableIncome = income - expense;
  const debtToIncomeRatio = (debt / income) * 100;
  const netWorth = assets - debt;

  const customSuggestions = [];

  if (score < 20) {
    customSuggestions.push('You should consider filing for bankruptcy.');
  } else if (score < 40) {
    if (debtToIncomeRatio > 50) {
      customSuggestions.push('You should consider paying off your debts.');
    } else {
      customSuggestions.push('You should consider increasing your income.');
    }
  } else if (score < 60) {
    customSuggestions.push('You could do better.');

    if (disposableIncome < 0) {
      customSuggestions.push('You should consider increasing your income.');
    } else {
      if (debtToIncomeRatio > 50) {
        customSuggestions.push('You should consider paying off your debts.');
      } else {
        customSuggestions.push('You should consider decreasing your expenses.');
      }
    }
  } else if (score < 80) {
    customSuggestions.push(
      'You are just on the edge of being financially healthy.'
    );

    if (debtToIncomeRatio > 50) {
      customSuggestions.push('Keep it up, and consider paying off your debts.');
    } else {
      customSuggestions.push(
        'Keep it up, and consider decreasing your expenses.'
      );
    }
  } else if (score < 100) {
    customSuggestions.push('You are on the top of your game!');
  }

  return {
    score: score.toFixed(2),
    customSuggestions: customSuggestions,
  };
}

export {
  categorizeHealthScore,
  categorizeHealthScoreColor,
  generateSuggestions
};

