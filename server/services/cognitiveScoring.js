// // services/cognitiveScoring.js
// const validators = require('../utils/validators');

// class CognitiveTestScoringService {
//   async scoreCompleteTest(testResponse) {
//     const scores = {};
    
//     // Score Memory Component
//     if (testResponse.memory_encoding && testResponse.memory_recall) {
//       scores.memory = await this.scoreMemory(testResponse);
//     }
    
//     // Score Attention Component
//     if (testResponse.letter_tap) {
//       scores.attention = validators.validateLetterTap(testResponse.letter_tap).score;
//     }
    
//     // Score Serial Subtraction (Attention)
//     if (testResponse.serial_subtraction) {
//       const result = validators.validateSerialSubtraction(testResponse.serial_subtraction);
//       scores.attention = (scores.attention || 0) + result.score / 2;
//     }
    
//     // Score Visuospatial Component
//     if (testResponse.trail_making) {
//       const result = validators.validateTrailMaking(testResponse.trail_making);
//       scores.visuospatial = result.score;
//     }
    
//     if (testResponse.clock_drawing) {
//       scores.visuospatial = (scores.visuospatial || 0) + (testResponse.clock_drawing.score || 0) / 2;
//     }
    
//     // Score Language Component
//     if (testResponse.image_naming) {
//       const result = validators.validateImageNaming(testResponse.image_naming);
//       scores.language = result.score;
//     }
    
//     // Score Orientation
//     const orientationQuestions = testResponse.questions.filter(q => q.category === 'orientation');
//     if (orientationQuestions.length > 0) {
//       scores.orientation = this.scoreQuestions(orientationQuestions);
//     }
    
//     // Score Similarity
//     const similarityQuestions = testResponse.questions.filter(q => q.category === 'similarity');
//     if (similarityQuestions.length > 0) {
//       scores.similarity = this.scoreQuestions(similarityQuestions);
//     }
    
//     // Calculate total score
//     const totalScore = validators.calculateTotalCognitiveScore(scores);
    
//     return {
//       scores,
//       totalScore,
//       riskLevel: validators.determineRiskLevel(totalScore)
//     };
//   }
  
//   scoreMemory(testResponse) {
//     const recallResult = validators.validateMemoryRecall(
//       testResponse.memory_recall,
//       testResponse.memory_encoding.words
//     );
//     return recallResult.score;
//   }
  
//   scoreQuestions(questions) {
//     let correctCount = 0;
//     questions.forEach(q => {
//       if (q.isCorrect) correctCount++;
//     });
//     return (correctCount / questions.length) * 100;
//   }
// }

// module.exports = new CognitiveTestScoringService();



// services/cognitiveScoring.js
class CognitiveTestScoringService {
  async scoreCompleteTest(testResponse) {
    try {
      const scores = {};
      
      // Score Memory Component
      if (testResponse.memory_recall) {
        scores.memory = this.scoreMemory(testResponse.memory_recall);
      }
      
      // Score Attention Component
      if (testResponse.letter_tap) {
        scores.attention = this.scoreLetterTap(testResponse.letter_tap);
      }
      
      if (testResponse.serial_subtraction) {
        const result = this.scoreSerialSubtraction(testResponse.serial_subtraction);
        scores.attention = (scores.attention || 0) + result.score;
      }
      
      // Score Visuospatial Component
      if (testResponse.trail_making) {
        scores.visuospatial = this.scoreTrailMaking(testResponse.trail_making);
      }
      
      // Score Language Component
      if (testResponse.image_naming_0 || testResponse.image_naming_1 || testResponse.image_naming_2) {
        scores.language = this.scoreImageNaming(testResponse);
      }
      
      // Score Orientation - extract from flat structure
      scores.orientation = this.scoreOrientation(testResponse);
      
      // Score Similarity - extract from flat structure
      scores.similarity = this.scoreSimilarity(testResponse);
      
      // Calculate total score
      const totalScore = this.calculateTotalCognitiveScore(scores);
      
      return {
        scores,
        totalScore,
        riskLevel: this.determineRiskLevel(totalScore)
      };
    } catch (error) {
      console.error('Error in scoreCompleteTest:', error);
      return {
        scores: { memory: 0, attention: 0, orientation: 0, visuospatial: 0, language: 0, similarity: 0 },
        totalScore: 0,
        riskLevel: 'low'
      };
    }
  }

  scoreMemory(memoryRecall) {
    if (!memoryRecall) return 0;
    let correctCount = 0;
    const words = ['Banana', 'Sunrise', 'Chair'];
    
    if (memoryRecall.word1?.toLowerCase().includes(words[0].toLowerCase())) correctCount++;
    if (memoryRecall.word2?.toLowerCase().includes(words[1].toLowerCase())) correctCount++;
    if (memoryRecall.word3?.toLowerCase().includes(words[2].toLowerCase())) correctCount++;
    
    return (correctCount / 3) * 100;
  }

  scoreLetterTap(letterTap) {
    if (!letterTap) return 0;
    const { correctTaps, totalTargets } = letterTap;
    const accuracy = (correctTaps / totalTargets) * 100;
    
    if (accuracy >= 90) return 100;
    if (accuracy >= 80) return 80;
    if (accuracy >= 70) return 60;
    if (accuracy >= 60) return 40;
    return 20;
  }

  scoreSerialSubtraction(answers) {
    if (!answers || answers.length === 0) return { score: 0 };
    
    let correctCount = 0;
    answers.forEach(answer => {
      if (answer.userAnswer === answer.expected) {
        correctCount++;
      }
    });
    
    return { correctCount, score: (correctCount / answers.length) * 100 };
  }

  scoreTrailMaking(trailMaking) {
    if (!trailMaking) return 0;
    const { time, errors } = trailMaking;
    
    let score = 100;
    
    // Deduct for time
    if (time > 300) score -= (time - 300) * 0.1;
    if (time > 600) score = Math.max(score - 30, 10);
    
    // Deduct for errors
    score -= errors * 5;
    
    return Math.max(score, 0);
  }

  scoreImageNaming(testResponse) {
    const expectedAnswers = ['lion', 'rhino', 'camel'];
    let correctCount = 0;
    
    for (let i = 0; i < 3; i++) {
      const userAnswer = testResponse[`image_naming_${i}`];
      if (userAnswer && userAnswer.toLowerCase().includes(expectedAnswers[i])) {
        correctCount++;
      }
    }
    
    return (correctCount / 3) * 100;
  }

  scoreOrientation(testResponse) {
    // Extract orientation answers from flat structure
    const orientationAnswers = [
      testResponse.orient1,
      testResponse.orient2,
      testResponse.orient3,
      testResponse.orient4,
      testResponse.orient5,
      testResponse.orient6
    ].filter(a => a);

    if (orientationAnswers.length === 0) return 0;
    
    // Simple scoring: count non-empty answers
    return (orientationAnswers.length / 6) * 100;
  }

  scoreSimilarity(testResponse) {
    const similarityAnswers = [
      testResponse.sim1,
      testResponse.sim2
    ].filter(a => a);

    if (similarityAnswers.length === 0) return 0;
    
    // Score based on answer length (more detailed = better)
    let score = 0;
    similarityAnswers.forEach(answer => {
      if (answer && answer.length > 10) score += 50;
      else if (answer && answer.length > 5) score += 30;
      else score += 10;
    });
    
    return Math.min(score, 100);
  }

  calculateTotalCognitiveScore(scores) {
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
  }

  determineRiskLevel(totalScore) {
    if (totalScore >= 80) return 'low';
    if (totalScore >= 60) return 'medium';
    return 'high';
  }
}

module.exports = new CognitiveTestScoringService();
