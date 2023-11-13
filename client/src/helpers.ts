const getHealthByScore = (score: string) => {
  // convert to float
  const _score = parseFloat(score);
  if (_score >= 0.0 && _score <= 3.0) return 'bad';
  if (_score >= 4.0 && _score <= 7.0) return 'normal';
  if (_score >= 8.0 && _score <= 10.0) return 'good';
};

export { getHealthByScore };
