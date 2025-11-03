// // services/cognitiveScoring.js
const https = require('https');

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ ok: true, json });
        } catch (e) {
          resolve({ ok: false });
        }
      });
    });
    // Timeout after 2500ms
    req.setTimeout(2500, () => {
      req.destroy(new Error('timeout'));
    });
    req.on('error', () => resolve({ ok: false }));
    req.end();
  });
}
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
  async scoreCompleteTest(testResponse, options = {}) {
    try {
      const scores = {};
      
      // Score Memory Component
      if (testResponse.memory_recall) {
        scores.memory = this.scoreMemory(testResponse.memory_recall);
      }
      
      // Score Attention Component (average subtests to keep within 0..100)
      const attentionParts = [];
      if (testResponse.letter_tap) {
        attentionParts.push(this.scoreLetterTap(testResponse.letter_tap));
      }
      if (testResponse.serial_subtraction) {
        const result = this.scoreSerialSubtraction(testResponse.serial_subtraction);
        attentionParts.push(result.score);
      }
      if (attentionParts.length > 0) {
        const sum = attentionParts.reduce((a, b) => a + b, 0);
        scores.attention = Math.min(100, Math.max(0, sum / attentionParts.length));
      }
      
      // Score Visuospatial Component (combine trail making and clock drawing if available)
      const visuospatialParts = [];
      if (testResponse.trail_making) {
        visuospatialParts.push(this.scoreTrailMaking(testResponse.trail_making));
      }
      if (testResponse.clock_drawing && (testResponse.clock_drawing.hourAngle != null) && (testResponse.clock_drawing.minuteAngle != null)) {
        visuospatialParts.push(this.scoreClockDrawing(testResponse.clock_drawing));
      }
      if (visuospatialParts.length > 0) {
        const sum = visuospatialParts.reduce((a, b) => a + b, 0);
        scores.visuospatial = Math.min(100, Math.max(0, sum / visuospatialParts.length));
      }
      
      // Score Language Component
      if (testResponse.image_naming_0 || testResponse.image_naming_1 || testResponse.image_naming_2) {
        scores.language = this.scoreImageNaming(testResponse);
      }
      
      // Score Orientation - needs request context for IP-based location
      scores.orientation = await this.scoreOrientation(testResponse, options.req);
      
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

  scoreClockDrawing(clock) {
    // Expected time: 11:10 -> minute at 10 mins, hour at 11 + 10/60
    const TWO_PI = Math.PI * 2;
    const norm = (a) => {
      let x = a % TWO_PI;
      if (x < 0) x += TWO_PI;
      return x;
    };
    const circDist = (a, b) => {
      const d = Math.abs(norm(a) - norm(b));
      return Math.min(d, TWO_PI - d);
    };

    const expectedMinute = (10 / 60) * TWO_PI; // PI/3
    const expectedHour = ((11 + 10/60) / 12) * TWO_PI; // ~5.8469 rad

    const minuteErrRad = circDist(clock.minuteAngle, expectedMinute);
    const hourErrRad = circDist(clock.hourAngle, expectedHour);

    const rad2deg = (r) => r * 180 / Math.PI;
    const minuteErrDeg = rad2deg(minuteErrRad);
    const hourErrDeg = rad2deg(hourErrRad);

    // Tolerances: minute 15°, hour 30°. Linear decay to zero at tolerance.
    const scoreFromErr = (errDeg, tolDeg, max) => {
      if (errDeg >= tolDeg) return 0;
      return max * (1 - (errDeg / tolDeg));
    };

    const minuteScore = scoreFromErr(minuteErrDeg, 15, 50);
    const hourScore = scoreFromErr(hourErrDeg, 30, 50);
    const total = Math.max(0, Math.min(100, minuteScore + hourScore));
    return total;
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

  async scoreOrientation(testResponse, req) {
    const now = new Date();
    const serverDay = now.getDate();
    const serverMonthIndex = now.getMonth(); // 0-based
    const serverYear = now.getFullYear();
    const serverWeekdayIndex = now.getDay(); // 0 (Sun) - 6 (Sat)

    const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    const weekdayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

    const normalize = (v) => (v || '').toString().trim().toLowerCase();

    let correct = 0;
    const total = 6;
    const pointsPer = 100 / total; // ~16.67

    // Date (day of month)
    const a1 = normalize(testResponse.orient1);
    if (a1) {
      const dayNum = parseInt(a1.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(dayNum) && dayNum === serverDay) correct++;
    }

    // Month
    const a2 = normalize(testResponse.orient2);
    if (a2) {
      const monthNum = parseInt(a2.replace(/[^0-9]/g, ''), 10);
      const matchedByNum = !isNaN(monthNum) && monthNum >= 1 && monthNum <= 12 && (monthNum - 1) === serverMonthIndex;
      const matchedByName = monthNames[serverMonthIndex] && a2.includes(monthNames[serverMonthIndex]);
      if (matchedByNum || matchedByName) correct++;
    }

    // Year
    const a3 = normalize(testResponse.orient3);
    if (a3) {
      const yearNum = parseInt(a3.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(yearNum) && yearNum === serverYear) correct++;
    }

    // Day of week
    const a4 = normalize(testResponse.orient4);
    if (a4) {
      const wdNum = parseInt(a4.replace(/[^0-9]/g, ''), 10);
      const matchedByName = weekdayNames[serverWeekdayIndex] && a4.includes(weekdayNames[serverWeekdayIndex]);
      // Accept numbers 0..6 or 1..7 (Mon=1 style isn't standard; we only accept JS indices if provided)
      const matchedByNum = !isNaN(wdNum) && (wdNum === serverWeekdayIndex || wdNum === serverWeekdayIndex + 1);
      if (matchedByName || matchedByNum) correct++;
    }

    // Season by month (northern hemisphere conventional)
    // Winter: Dec-Feb, Spring: Mar-May, Summer: Jun-Aug, Autumn: Sep-Nov
    const a5 = normalize(testResponse.orient5);
    if (a5) {
      const m = serverMonthIndex + 1; // 1..12
      let expectedSeason = '';
      if (m === 12 || m <= 2) expectedSeason = 'winter';
      else if (m >= 3 && m <= 5) expectedSeason = 'spring';
      else if (m >= 6 && m <= 8) expectedSeason = 'summer';
      else expectedSeason = 'autumn';
      if (a5.includes(expectedSeason) || (expectedSeason === 'autumn' && a5.includes('fall'))) correct++;
    }

    // Location: determine via client IP geolocation (city/state/country)
    const a6 = normalize(testResponse.orient6);
    if (a6) {
      try {
        const enableGeo = process.env.ENABLE_GEOLOCATION !== 'false';
        if (!enableGeo) {
          // Geolocation disabled via env flag
          throw new Error('geolocation disabled');
        }

        const ipRaw = req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || req?.ip || '';
        // Handle local addresses gracefully
        const localIps = ['::1','127.0.0.1','::ffff:127.0.0.1'];
        const isPrivate = (ip) => {
          // IPv4 private ranges
          return /^(10\.)|(192\.168\.)|(172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(ip);
        };

        if (!ipRaw || localIps.includes(ipRaw) || isPrivate(ipRaw)) {
          // Cannot verify reliably from localhost; leave as incorrect
        } else {
          // Use ipapi.co (no API key) over HTTPS
          const url = `https://ipapi.co/${ipRaw}/json/`;
          const resp = await httpGetJson(url);
          if (resp.ok && resp.json) {
            const geo = resp.json;
            const parts = [geo.city, geo.region, geo.country_name, geo.country_code];
            const normParts = parts.filter(Boolean).map(x => normalize(x));
            if (normParts.some(p => p && a6.includes(p))) correct++;
          }
        }
      } catch (e) {
        // On failure, do not award point
      }
    }

    return Math.min(100, Math.max(0, correct * pointsPer));
  }

  scoreSimilarity(testResponse) {
    const a1 = (testResponse.sim1 || '').toString().trim().toLowerCase();
    const a2 = (testResponse.sim2 || '').toString().trim().toLowerCase();

    if (!a1 && !a2) return 0;

    const includesAny = (text, terms) => terms.some(t => text.includes(t));
    const countMatches = (text, terms) => terms.reduce((c, t) => c + (text.includes(t) ? 1 : 0), 0);

    // Similarity 1: Banana and Orange
    const sim1Core = ['fruit','fruits','citrus','edible','food'];
    const sim1Bonus = ['peel','seed','seeds','vitamin','vitamins','plant','plants','grow','grown','juicy','sweet','produce'];

    // Similarity 2: Watch and Ruler
    const sim2Core = ['measure','measurement','measuring','unit','units','quantity','quantities'];
    const sim2Bonus = ['time','length','scale','instrument','tool','tools','marks','graduations','quantify','precision','standard','compare','metric'];

    const scoreFor = (text, core, bonus, max = 50) => {
      if (!text) return 0;
      const coreCount = countMatches(text, core);
      const bonusCount = countMatches(text, bonus);

      if (coreCount > 0) {
        // Base from core concepts: 30 for first, +5 for each extra (cap 40)
        const base = Math.min(40, 30 + 5 * (coreCount - 1));
        // Bonus concepts: up to +10
        const extra = Math.min(10, bonusCount * 3);
        return Math.min(max, base + extra);
      }

      // No core: fallback to length-based minor credit
      if (text.length > 10) return Math.min(max, 25);
      if (text.length > 5) return Math.min(max, 15);
      return Math.min(max, 5);
    };

    const s1 = scoreFor(a1, sim1Core, sim1Bonus, 50);
    const s2 = scoreFor(a2, sim2Core, sim2Bonus, 50);
    return Math.min(100, s1 + s2);
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
    // Ensure total remains within 0..100
    totalScore = Math.min(100, Math.max(0, totalScore));
    return Math.round(totalScore);
  }

  determineRiskLevel(totalScore) {
    if (totalScore >= 80) return 'low';
    if (totalScore >= 60) return 'medium';
    return 'high';
  }
}

module.exports = new CognitiveTestScoringService();
