// AlzheimerAssessment.js
import React, { useState, useEffect } from 'react';

const questions = [
  { text: "Does the patient repeat questions or stories the same day?", options: ["Yes", "No"], image: null },
  { text: "Does the patient misplace items more than once a month?", options: ["Yes", "No"], image: null },
  // ... Other questions, some with image: 'url/to/image'
];

const TIMER_DURATION = 30; // seconds

export default function AlzheimerAssessment() {
  const [current, setCurrent] = useState(0);
  const [time, setTime] = useState(TIMER_DURATION);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [time]);

  function handleAnswer(option) {
    setAnswers([...answers, option]);
    setCurrent(current + 1);
    setTime(TIMER_DURATION);
  }

  if (current >= questions.length)
    return <div>Assessment Complete. Thank you!</div>;

  const q = questions[current];

  return (
    <div>
      <h2>Question {current + 1} / {questions.length}</h2>
      <p>{q.text}</p>
      {q.image && <img src={q.image} alt="question visual" />}
      <div>Time left: {time}s</div>
      {time === 0
        ? q.options.map(opt => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
            >{opt}</button>
          ))
        : <div>(Options will show after timer)</div>
      }
    </div>
  );
}
