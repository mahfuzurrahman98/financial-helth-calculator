function categorizeHealthScore(score: number) {
  if (score >= 85 && score <= 100) {
    return 'Excellent';
  } else if (score >= 65 && score < 85) {
    return 'Good';
  } else if (score >= 45 && score < 65) {
    return 'Stable';
  } else if (score >= 25 && score < 45) {
    return 'Challenging';
  } else if (score >= 10 && score < 25) {
    return 'Critical';
  } else if (score < 10) {
    return 'Bankrupt';
  } else {
    return 'bg-gray-500';
  }
}

function categorizeHealthScoreColor(score: number) {
  if (score >= 85 && score <= 100) {
    return 'bg-green-700';
  } else if (score >= 65 && score < 85) {
    return 'bg-green-600';
  } else if (score >= 45 && score < 65) {
    return 'bg-purple-600';
  } else if (score >= 25 && score < 45) {
    return 'bg-orange-500';
  } else if (score >= 10 && score < 25) {
    return 'bg-yellow-400';
  } else if (score < 10) {
    return 'bg-red-500';
  } else {
    return 'bg-gray-500';
  }
}

function generateSuggestions(
  income: number,
  expense: number,
  debts: number,
  score: number
) {
  const disposableIncome = income - expense;
  const debtToIncomeRatio = (debts / income) * 100;

  const customSuggestions = [];

  if (score < 10) {
    customSuggestions.push(
      'Your financial health is critically low. You should consider filing for bankruptcy.'
    );
  } else if (score < 25) {
    customSuggestions.push(
      'Your financial health is in a challenging state. Consider taking immediate actions.'
    );
  } else if (score < 45) {
    if (debtToIncomeRatio > 50) {
      customSuggestions.push(
        'Your debt-to-income ratio is high. Consider paying off your debts.'
      );
    } else {
      customSuggestions.push(
        'Your financial health is stable but needs improvement. Consider increasing your income.'
      );
    }
  } else if (score < 65) {
    customSuggestions.push(
      'Your financial health is decent, but there is room for improvement.'
    );

    if (disposableIncome < 0) {
      customSuggestions.push(
        'Your disposable income is negative. Consider increasing your income.'
      );
    } else {
      if (debtToIncomeRatio > 50) {
        customSuggestions.push(
          'Your debt-to-income ratio is high. Consider paying off your debts.'
        );
      } else {
        customSuggestions.push(
          'Your financial health could improve by decreasing your expenses.'
        );
      }
    }
  } else if (score < 85) {
    customSuggestions.push('You are on the edge of being financially healthy.');

    if (debtToIncomeRatio > 50) {
      customSuggestions.push('Keep it up! Consider paying off your debts.');
    } else {
      customSuggestions.push('Keep it up! Consider decreasing your expenses.');
    }
  } else if (score <= 100) {
    customSuggestions.push(
      'Congratulations! You are on top of your financial game!'
    );
  }

  return customSuggestions;
}

export {
  categorizeHealthScore,
  categorizeHealthScoreColor,
  generateSuggestions
};

