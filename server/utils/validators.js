// utils/validators.js

// Validate Memory Recall
exports.validateMemoryRecall = (userWords, originalWords) => {
  let correctCount = 0;
  const feedback = {};
  
  const original = originalWords.map(w => w.toLowerCase());
  const userAnswers = [
    userWords.word1?.toLowerCase(),
    userWords.word2?.toLowerCase(),
    userWords.word3?.toLowerCase()
  ];
  
  userAnswers.forEach((userWord, idx) => {
    if (userWord && original.includes(userWord)) {
      correctCount++;
      feedback[`word${idx + 1}`] = { correct: true };
    } else {
      feedback[`word${idx + 1}`] = { correct: false, expected: original[idx] };
    }
  });
  
  return { correctCount, score: correctCount * 33.33, feedback };
};

// Validate Trail Making (time and errors scoring)
exports.validateTrailMaking = (result) => {
  const { time, errors } = result;
  let score = 100;
  
  // Deduct points for time (less time = higher score)
  if (time > 300) score -= (time - 300) * 0.1; // 0.1 point per second over 5 min
  if (time > 600) score = Math.max(score - 30, 10); // Cap reduction
  
  // Deduct points for errors
  score -= errors * 5; // 5 points per error
  
  return { score: Math.max(score, 0), time, errors };
};

// Validate Serial Subtraction
exports.validateSerialSubtraction = (answers) => {
  let correctCount = 0;
  let score = 0;
  
  // Expected: 60, 53, 46, 39, 32
  const expected = [60, 53, 46, 39, 32];
  
  answers.forEach((answer, idx) => {
    if (answer.userAnswer === expected[idx]) {
      correctCount++;
      score += 20; // 20 points per correct subtraction
    }
  });
  
  return { correctCount, score, totalExpected: expected.length };
};

// Validate Letter Tap Test
exports.validateLetterTap = (result) => {
  const { correctTaps, incorrectTaps, totalTargets } = result;
  const accuracy = (correctTaps / totalTargets) * 100;
  
  let score = 0;
  if (accuracy >= 90) score = 100;
  else if (accuracy >= 80) score = 80;
  else if (accuracy >= 70) score = 60;
  else if (accuracy >= 60) score = 40;
  else score = 20;
  
  return { score, accuracy, result };
};

// Validate Image Naming
exports.validateImageNaming = (answers) => {
  let correctCount = 0;
  let score = 0;
  
  answers.forEach(answer => {
    const isCorrect = answer.userAnswer.toLowerCase().trim() === 
                     answer.correctAnswer.toLowerCase().trim();
    if (isCorrect) {
      correctCount++;
      score += 33.33;
    }
  });
  
  return { correctCount, score, total: answers.length };
};

// Validate Orientation Questions
exports.validateOrientationQuestions = (answers, correctAnswers) => {
  let correctCount = 0;
  let score = 0;
  
  answers.forEach((answer, idx) => {
    const expected = correctAnswers[idx];
    const isCorrect = answer.toLowerCase().includes(expected.toLowerCase());
    
    if (isCorrect) {
      correctCount++;
      score += 16.67; // 6 questions, 100 points total
    }
  });
  
  return { correctCount, score, total: answers.length };
};

// Calculate Total Cognitive Score (using Mini-Cog + MoCA style scoring)
exports.calculateTotalCognitiveScore = (scores) => {
  const weights = {
    memory: 0.25,
    attention: 0.20,
    orientation: 0.20,
    visuospatial: 0.15,
    language: 0.10,
    similarity: 0.10
  };
  
  let totalScore = 0;
  for (let [category, weight] of Object.entries(weights)) {
    totalScore += (scores[category] || 0) * weight;
  }
  
  return Math.round(totalScore);
};

// Determine Risk Level
exports.determineRiskLevel = (totalScore) => {
  if (totalScore >= 26) return 'low';
  if (totalScore >= 20) return 'medium';
  return 'high';
};
