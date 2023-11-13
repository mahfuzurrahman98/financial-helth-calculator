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

export { categorizeHealthScore, categorizeHealthScoreColor };


