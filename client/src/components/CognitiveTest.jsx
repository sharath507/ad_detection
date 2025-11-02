// import React, { useState, useEffect } from "react";

// const questions = [
//   {
//     text: "Does the patient repeat questions or stories the same day?",
//     options: ["Yes", "No"],
//     image: null,
//   },
//   {
//     text: "Does the patient misplace items more than once a month?",
//     options: ["Yes", "No"],
//     image: null,
//   },
//   // Add more questions as needed, some can have images: image: 'url'
// ];

// const TIMER_DURATION = 30; // seconds

// export default function CognitiveTest() {
//   const [current, setCurrent] = useState(0);
//   const [time, setTime] = useState(TIMER_DURATION);
//   const [answers, setAnswers] = useState([]);

//   useEffect(() => {
//     if (time > 0) {
//       const timer = setTimeout(() => setTime(time - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [time]);

//   function handleAnswer(option) {
//     setAnswers([...answers, option]);
//     setCurrent(current + 1);
//     setTime(TIMER_DURATION);
//   }

//   if (current >= questions.length)
//     return <div>Assessment Complete. Thank you!</div>;

//   const q = questions[current];

//   return (
//     <div>
//       <h2>Question {current + 1} / {questions.length}</h2>
//       <p>{q.text}</p>
//       {q.image && <img src={q.image} alt="question visual" />}
//       <div>Time left: {time}s</div>
//       {time === 0 ? (
//         q.options.map((opt) => (
//           <button key={opt} onClick={() => handleAnswer(opt)}>
//             {opt}
//           </button>
//         ))
//       ) : (
//         <div>(Options will show after timer ends)</div>
//       )}
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import DrawingCanvas from "./DrawingCanvas";
// import api from "../api";

// const assessmentSections = [
//   {
//     title: "Memory Encoding",
//     type: "memory_encoding",
//     words: ["Apple", "Table", "Penny"],
//     duration: 100,
//     instruction: "Please read these words carefully. You will be asked to recall them later. The words will disappear after 10 seconds.",
//   },
//   {
//     title: "Attention & Calculation",
//     type: "questions",
//     questions: [
//       { id: "q1", text: "Please spell the word 'WORLD' backwards.", type: "text" },
//     ],
//   },
//   {
//     title: "Visuospatial Skills - Clock Drawing Test",
//     type: "drawing",
//     instruction: "Please use your mouse to draw a clock showing the time 'ten past eleven'. Include all the numbers on the clock face.",
//   },
//   {
//     title: "Orientation",
//     type: "questions",
//     questions: [
//       { id: "q3", text: "What is today's day of the week?", type: "text" },
//       { id: "q4", text: "What is the current season?", type: "mcq", options: ["Spring", "Summer", "Autumn", "Winter"] },
//     ],
//   },
//   {
//     title: "Memory Recall",
//     type: "memory_recall",
//     instruction: "Please enter the three words you were asked to remember at the beginning of the test.",
//   },
// ];

// function CognitiveTest({ setRoute }) {
//   const [stage, setStage] = useState('instructions');
//   const [sectionIndex, setSectionIndex] = useState(0);
//   const [questionIndex, setQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [currentAnswer, setCurrentAnswer] = useState('');
//   const [timer, setTimer] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const currentSection = assessmentSections[sectionIndex];

//   useEffect(() => {
//     if (stage === 'test' && currentSection.type === 'memory_encoding' && timer > 0) {
//       const timeout = setTimeout(() => setTimer(timer - 1), 1000);
//       return () => clearTimeout(timeout);
//     } else if (timer === 0 && currentSection?.type === 'memory_encoding') {
//       handleNext();
//     }
//   }, [timer, stage, currentSection]);

//   const finishTest = async (finalAnswers) => {
//     setIsSubmitting(true);
//     await api.submitCognitiveTest(finalAnswers);
//     setIsSubmitting(false);
//     setStage('finished');
//   }

//   const startTest = () => {
//     setStage('test');
//     if (assessmentSections[0].type === 'memory_encoding') {
//       setTimer(assessmentSections[0].duration);
//     }
//   };

//   const handleAnswerChange = (e) => {
//     setCurrentAnswer(e.target.value);
//   };

//   const handleMCQAnswer = (option) => {
//     const questionId = currentSection.questions[questionIndex].id;
//     const newAnswers = { ...answers, [questionId]: option };
//     setAnswers(newAnswers);
//     handleNext(newAnswers);
//   };

//   const handleTextSubmit = (e) => {
//     e.preventDefault();
//     if (currentSection.type === 'questions') {
//       const questionId = currentSection.questions[questionIndex].id;
//       const newAnswers = { ...answers, [questionId]: currentAnswer };
//       setAnswers(newAnswers);
//       handleNext(newAnswers);
//     }
//   };

//   const handleRecallSubmit = (e) => {
//     e.preventDefault();
//     const recallAnswers = {
//       word1: e.target.elements.word1.value,
//       word2: e.target.elements.word2.value,
//       word3: e.target.elements.word3.value,
//     };
//     const newAnswers = {...answers, memory_recall: recallAnswers };
//     setAnswers(newAnswers);
//     handleNext(newAnswers);
//   }

//   const handleNext = (updatedAnswers = answers) => {
//     setCurrentAnswer('');
//     const isLastQuestionInSection = currentSection.type === 'questions' && questionIndex >= currentSection.questions.length - 1;

//     let newAnswers = {...updatedAnswers};
//     if (currentSection.type === 'drawing') {
//       newAnswers = { ...newAnswers, clock_drawing: 'submitted' };
//       setAnswers(newAnswers);
//     }

//     if (currentSection.type !== 'questions' || isLastQuestionInSection) {
//       if (sectionIndex >= assessmentSections.length - 1) {
//         finishTest(newAnswers);
//       } else {
//         setSectionIndex(sectionIndex + 1);
//         setQuestionIndex(0);
//         if(assessmentSections[sectionIndex + 1].type === 'memory_encoding') {
//           setTimer(assessmentSections[sectionIndex + 1].duration);
//         }
//       }
//     } else {
//       setQuestionIndex(questionIndex + 1);
//     }
//   };

//   const renderTestStage = () => {
//     if (!currentSection) return null;

//     switch (currentSection.type) {
//       case 'memory_encoding':
//         return (
//           <div>
//             <h3>{currentSection.title}</h3>
//             <p>{currentSection.instruction}</p>
//             <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '2rem 0', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
//               {currentSection.words.map(word => <span key={word}>{word}</span>)}
//             </div>
//             <p style={{ fontSize: '1.5rem', color: '#1d4ed8' }}>Time remaining: {timer}s</p>
//           </div>
//         );
//       case 'memory_recall':
//         return (
//           <form onSubmit={handleRecallSubmit}>
//             <h3>{currentSection.title}</h3>
//             <p>{currentSection.instruction}</p>
//             <input name="word1" placeholder="First word" required />
//             <input name="word2" placeholder="Second word" required />
//             <input name="word3" placeholder="Third word" required />
//             <button type="submit">Submit Answers</button>
//           </form>
//         );
//       case 'drawing':
//         return (
//           <div>
//             <h3>{currentSection.title}</h3>
//             <p>{currentSection.instruction}</p>
//             <DrawingCanvas />
//             <button onClick={() => handleNext()} style={{marginTop: '1rem'}}>Submit Drawing</button>
//           </div>
//         );
//       case 'questions':
//         const q = currentSection.questions[questionIndex];
//         return (
//           <div>
//             <h3>{currentSection.title}</h3>
//             <p style={{ fontSize: '1.2rem', margin: '2rem 0' }}>{q.text}</p>

//             {q.type === 'text' && (
//               <form onSubmit={handleTextSubmit}>
//                 <input type="text" value={currentAnswer} onChange={handleAnswerChange} required autoFocus />
//                 <button type="submit">Next</button>
//               </form>
//             )}
//             {q.type === 'mcq' && (
//               <div style={{ display: 'flex', gap: '1rem' }}>
//                 {q.options.map(opt => <button key={opt} onClick={() => handleMCQAnswer(opt)}>{opt}</button>)}
//               </div>
//             )}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="card" style={{ textAlign: 'center' }}>
//       {stage === 'instructions' && (
//         <div>
//           <h2>Cognitive Assessment</h2>
//           <p>This test consists of several short sections designed to assess different aspects of cognitive function, including memory, attention, and orientation. Please find a quiet place to begin.</p>
//           <p>This is a demonstration and not a medical diagnosis.</p>
//           <button onClick={startTest}>Start Assessment</button>
//         </div>
//       )}
//       {stage === 'test' && (
//         <>
//           <div style={{ marginBottom: '1rem', backgroundColor: '#eee', padding: '0.5rem', borderRadius: '8px' }}>
//             Progress: Section {sectionIndex + 1} of {assessmentSections.length}
//           </div>
//           {renderTestStage()}
//         </>
//       )}
//       {stage === 'finished' && (
//         <div>
//           <h2>Assessment Complete</h2>
//           {isSubmitting ? <p>Submitting your results...</p> :
//             <>
//               <p>Thank you. Your responses have been recorded.</p>
//               <button onClick={() => setRoute('dashboard')}>Return to Dashboard</button>
//             </>
//           }
//         </div>
//       )}
//     </div>
//   );
// }

// export default CognitiveTest;


import React, { useState, useEffect, useRef } from "react";
import DrawingCanvas from "./DrawingCanvas";
import TrailMakingTest from "./TrailMakingTest";
import LetterTapTest from "./LetterTapTest";
import SpeechRecorder from "./SpeechRecorder";
import MultiSentenceRepeat from "./MultiSentenceRepeat";
import api from "../api";

// Comprehensive assessment sections combining MoCA, SAGE, and Mini-Cog
const assessmentSections = [
  // Patient Information Collection
  {
    title: "Patient Information",
    type: "patient_info",
    instruction: "Please provide your personal and medical information before starting the assessment."
  },
  
  // Memory Encoding (Mini-Cog + MoCA)
  {
    title: "Memory Registration",
    type: "memory_encoding",
    words: ["Banana", "Sunrise", "Chair"], // Mini-Cog words
    duration: 6,
    instruction: "Please listen carefully and remember these three words. You will be asked to recall them later."
  },
  
  // Trail Making Test (connecting numbers and letters)
  {
    title: "Trail Making Test",
    type: "trail_making",
    instruction: "Connect the circles by alternating between numbers and letters in order (1-A-2-B-3-C, etc.). Try to do this as quickly and accurately as possible."
  },
  
  // Object Naming (MoCA + SAGE)
  {
    title: "Object Naming",
    type: "image_naming",
    instruction: "Please type the name of each object shown in the image below.",
    images: [
      { src: "/images/lion.jpg", answer: "lion" },
      { src: "/images/rhino.jpg", answer: "rhinoceros" },
      { src: "/images/camel.jpg", answer: "camel" }
    ]
  },
  
  // Attention Test - Letter A Tap (MoCA)
  {
    title: "Attention Test",
    type: "letter_tap",
    instruction: "Press the SPACEBAR every time you see or hear the letter 'A'. Try not to press for any other letters.",
    letters: "F B A C M N A J A K L B A F A K D E A M A J A M O F A O B".split(" "),
    targetLetter: "A"
  },
  
  // Serial 7 Subtraction (MoCA)
  {
    title: "Serial 7 Subtraction",
    type: "serial_subtraction",
    instruction: "Starting at 60, subtract 7 and enter the result. Then subtract 7 from that number, and continue.",
    startNumber: 60,
    subtractBy: 7,
    repetitions: 5
  },
  
  // Clock Drawing Test (Mini-Cog + MoCA + SAGE)
  {
    title: "Clock Drawing Test",
    type: "clock_drawing",
    instruction: "Draw a large clock face. Put in all the numbers and set the time to 10 past 11 (11:10). Label 'L' for the long hand and 'S' for the short hand."
  },
  
  // Sentence Repetition (MoCA)
  {
    title: "Sentence Repetition",
    type: "sentence_repeat",
    instruction: "You will see a sentence on the screen for 10 seconds. Please read it carefully and remember it. After the timer ends, you will be asked to repeat it aloud.",
    sentences: [
      "The child walked his dog in the park after midnight",
      "The artist finished his painting at the right moment for the exhibition"
    ]
  },
  
  // Abstraction/Similarity (MoCA + SAGE)
  {
    title: "Similarities",
    type: "questions",
    questions: [
      { id: "sim1", text: "How are a banana and an orange similar? (They both are...)", type: "text", category: "similarity" },
      { id: "sim2", text: "How are a watch and a ruler similar? (They both are...)", type: "text", category: "similarity" }
    ]
  },
  
  // Orientation Questions (MoCA + SAGE)
  {
    title: "Orientation",
    type: "questions",
    questions: [
      { id: "orient1", text: "What is today's date?", type: "text" },
      { id: "orient2", text: "What month is it?", type: "text" },
      { id: "orient3", text: "What year is it?", type: "text" },
      { id: "orient4", text: "What day of the week is it?", type: "text" },
      { id: "orient5", text: "What season are we in?", type: "mcq", options: ["Spring", "Summer", "Autumn", "Winter"] },
      { id: "orient6", text: "What city are we in?", type: "text" }
    ]
  },
  
  // Memory Recall (Mini-Cog + MoCA)
  {
    title: "Memory Recall",
    type: "memory_recall",
    instruction: "Please enter the three words you were asked to remember at the beginning of the test."
  }
];

function CognitiveTest({ setRoute }) {
  const [stage, setStage] = useState('instructions');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [ethnicityOpen, setEthnicityOpen] = useState(false);
  const [memProbOpen, setMemProbOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [strokeOpen, setStrokeOpen] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    personal_information: {
      name: "",
      date_of_birth: "",
      education_level: "",
      gender: "",
      ethnicity: ""
    },
    medical_history: {
      memory_or_thinking_problems: { response: "", frequency: "" },
      family_memory_problems: "",
      balance_problems: { response: "", known_cause: { response: "", cause_description: "" } },
      stroke_history: { major_stroke: "", minor_or_mini_stroke: "" },
      mood_status: { sad_or_depressed: "", frequency: "" },
      personality_change: { response: "", description_of_change: "" },
      daily_activity_difficulty_due_to_thinking: ""
    }
  });

  const currentSection = assessmentSections[sectionIndex];
  useEffect(() => {
    console.log('Stage changed to:', stage);
    console.log('Current section index:', sectionIndex);
    console.log('Current section:', currentSection);
    
    if (stage === 'test' && currentSection) {
      console.log('Rendering section:', currentSection.title);
    }
  }, [stage, sectionIndex, currentSection]);

  // Timer for memory encoding
  // useEffect(() => {
  //   if (stage === 'test' && currentSection?.type === 'memory_encoding' && timer > 0) {
  //     const timeout = setTimeout(() => setTimer(timer - 1), 1000);
  //     return () => clearTimeout(timeout);
  //   } else if (timer === 0 && currentSection?.type === 'memory_encoding' && stage === 'test') {
  //     handleNext();
  //   }
  // }, [timer, stage, currentSection]);

    useEffect(() => {
  if (stage !== 'test' || !currentSection) return;

  if (currentSection.type === 'memory_encoding' && timer > 0) {
    const timeout = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(timeout);
  }

  if (currentSection.type === 'memory_encoding' && timer === 0) {
    console.log("Memory encoding timer finished, advancing...");
    // Prevent multiple calls
    if (sectionIndex < assessmentSections.length - 1) {
      handleNext();
    } else {
      finishTest(answers);
    }
  }
}, [timer, stage, currentSection, sectionIndex]);


  // const finishTest = async (finalAnswers) => {
  //   setIsSubmitting(true);
  //   const completeData = {
  //     patient_info: patientInfo,
  //     test_answers: finalAnswers
  //   };
  //   await api.submitCognitiveTest(completeData);
  //   setIsSubmitting(false);
  //   setStage('finished');
  // };
//   const finishTest = async (finalAnswers) => {
//   setIsSubmitting(true);
//   try {
//     const userId = localStorage.getItem('userId');
//     const token = localStorage.getItem('token');
    
//     if (!userId || !token) {
//       alert('Session expired. Please log in again.');
//       setRoute('login');
//       return;
//     }

//     const completeData = {
//       patientId: `patient_${userId}_${Date.now()}`,
//       testData: {
//         testStartTime: new Date(),
//         testEndTime: new Date(),
//         ...finalAnswers
//       }
//     };

//     console.log('Submitting test data:', completeData);

//     // Submit using axios with token
//     const response = await fetch('http://localhost:5000/api/test/submit-test', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(completeData)
//     });

//     if (!response.ok) {
//       throw new Error('Failed to submit test');
//     }

//     const result = await response.json();
//     console.log('Test submission result:', result);

//     setIsSubmitting(false);
//     setStage('finished');
//   } catch (error) {
//     console.error('Error submitting test:', error);
//     setIsSubmitting(false);
//     alert('Failed to submit test. Please try again.');
//   }
// };
const finishTest = async (finalAnswers) => {
  setIsSubmitting(true);
  try {
    const token = localStorage.getItem('token');
    const patientId = localStorage.getItem('patientId');
    
    if (!token || !patientId) {
      alert('Session expired. Please log in again.');
      setRoute('login');
      return;
    }

    // Transform answers to match server schema when necessary
    const transformed = { ...finalAnswers };
    const sentenceSection = assessmentSections.find(s => s.type === 'sentence_repeat');
    if (Array.isArray(transformed.sentence_repeat)) {
      transformed.sentence_repeat = transformed.sentence_repeat.map((userTranscript, idx) => ({
        sentenceId: `sr${idx + 1}`,
        sentence: sentenceSection?.sentences?.[idx] || `Sentence ${idx + 1}`,
        userTranscript,
        audioFile: '',
        recordedAt: new Date()
      }));
    }

    const completeData = {
      patientId,
      testData: {
        testStartTime: new Date(),
        testEndTime: new Date(),
        ...transformed
      }
    };

    console.log('Submitting test data:', completeData);

    const response = await fetch('/api/test/submit-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(completeData)
    });

    if (!response.ok) {
      throw new Error('Failed to submit test');
    }

    const result = await response.json();
    console.log('Test submission result:', result);

    setIsSubmitting(false);
    setStage('finished');
  } catch (error) {
    console.error('Error submitting test:', error);
    setIsSubmitting(false);
    alert('Failed to submit test. Please try again.');
  }
};


  const startTest = () => {
    setStage('patient_info');
  };

  // const submitPatientInfo = () => {
  //   setStage('test');
  //   if (assessmentSections[0].type === 'memory_encoding') {
  //     setTimer(assessmentSections[0].duration);
  //   }
  // };

//   const submitPatientInfo = () => {
//   setStage('test');
//   setSectionIndex(0); // Ensure starting from first assessment section
//   setQuestionIndex(0);
//   if (assessmentSections[0].type === 'memory_encoding') {
//     setTimer(assessmentSections[0].duration);
//   }
// };
//   const submitPatientInfo = () => {
//   setStage('test');
//   setSectionIndex(1); // Start from Memory Registration instead of Patient Info
//   setQuestionIndex(0);
//   if (assessmentSections[1].type === 'memory_encoding') {
//     setTimer(assessmentSections[1].duration);
//   }
// };
  
//   const submitPatientInfo = async (e) => {
//   e.preventDefault();
//   try {
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       alert('Session expired. Please log in again.');
//       setStage('instructions');
//       return;
//     }

//     // Save patient info first
//     const response = await fetch('http://localhost:5000/api/test/patient-info', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(patientInfo)
//     });

//     if (!response.ok) {
//       throw new Error('Failed to save patient info');
//     }

//     const result = await response.json();
//     console.log('Patient info saved:', result.patientId);

//     // Start test
//     setStage('test');
//     setSectionIndex(0);
//     setQuestionIndex(0);
//     setTimer(assessmentSections[0].duration);
//   } catch (error) {
//     console.error('Error saving patient info:', error);
//     alert('Failed to save patient information. Please try again.');
//   }
// };


//   const handleAnswerChange = (e) => {
//     setCurrentAnswer(e.target.value);
//   };

//   const handleMCQAnswer = (option) => {
//     const questionId = currentSection.questions[questionIndex].id;
//     const newAnswers = { ...answers, [questionId]: option };
//     setAnswers(newAnswers);
//     handleNext(newAnswers);
//   };

//   const handleTextSubmit = (e) => {
//     e.preventDefault();
//     if (currentSection.type === 'questions') {
//       const questionId = currentSection.questions[questionIndex].id;
//       const newAnswers = { ...answers, [questionId]: currentAnswer };
//       setAnswers(newAnswers);
//       setCurrentAnswer('');
//       handleNext(newAnswers);
//     }
//   };
const submitPatientInfo = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      alert('Session expired. Please log in again.');
      setRoute('login');
      return;
    }

    // Validate required fields before sending
    const pi = patientInfo.personal_information || {};
    const mh = patientInfo.medical_history || {};
    const missing = [];
    if (!pi.name?.trim()) missing.push('Name');
    if (!pi.date_of_birth) missing.push('Date of Birth');
    if (!pi.education_level) missing.push('Education Level');
    if (!pi.gender) missing.push('Gender');
    if (!pi.ethnicity) missing.push('Ethnicity');
    if (!mh.memory_or_thinking_problems?.response) missing.push('Memory/Thinking Problems');
    if (!mh.balance_problems?.response) missing.push('Balance Problems');
    if (!mh.stroke_history?.major_stroke) missing.push('Major Stroke');
    if (!mh.mood_status?.sad_or_depressed) missing.push('Mood Status');

    if (missing.length > 0) {
      alert('Please fill all required fields before starting the test:\n- ' + missing.join('\n- '));
      return;
    }

    setIsSubmitting(true);

    console.log('Saving patient info:', patientInfo);

    // Send patient info to backend
    const response = await fetch('/api/test/patient-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(patientInfo)
    });

    const result = await response.json();
    console.log('Patient info response:', result);

    if (!response.ok) {
      throw new Error(result.error || 'Failed to save patient info');
    }

    // Store patientId for later use
    localStorage.setItem('patientId', result.patientId);
    console.log('Patient ID saved:', result.patientId);

    setIsSubmitting(false);
    
    // Now start the test
    setStage('test');
    setSectionIndex(1);
    setQuestionIndex(0);
    if (assessmentSections[1].type === 'memory_encoding') {
      setTimer(assessmentSections[1].duration);
    }
  } catch (error) {
    setIsSubmitting(false);
    console.error('Error saving patient info:', error);
    alert('Failed to save patient information: ' + error.message);
  }
};

  const handleAnswerChange = (e) => {
  setCurrentAnswer(e.target.value);
};

const handleMCQAnswer = (option) => {
  const questionId = currentSection.questions[questionIndex].id;
  const newAnswers = { ...answers, [questionId]: option };
  setAnswers(newAnswers);
  handleNext(newAnswers);
};

const handleTextSubmit = (e) => {
  e.preventDefault();
  if (currentSection.type === 'questions') {
    const questionId = currentSection.questions[questionIndex].id;
    const newAnswers = { ...answers, [questionId]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer('');
    handleNext(newAnswers);
  }
};



  const handleRecallSubmit = (e) => {
    e.preventDefault();
    const recallAnswers = {
      word1: e.target.elements.word1.value,
      word2: e.target.elements.word2.value,
      word3: e.target.elements.word3.value,
    };
    const newAnswers = { ...answers, memory_recall: recallAnswers };
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const handleSerialSubtraction = (userAnswers) => {
    const newAnswers = { ...answers, serial_subtraction: userAnswers };
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const handleTrailMaking = (result) => {
    const newAnswers = { ...answers, trail_making: result };
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const handleLetterTap = (result) => {
    const newAnswers = { ...answers, letter_tap: result };
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const handleSkipSection = () => {
    handleNext(answers);
  };

  const handleSpeechRecord = (transcript) => {
    const newAnswers = { ...answers, [`sentence_repeat_${questionIndex}`]: transcript };
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const handleMultiSentenceComplete = (transcripts) => {
    const newAnswers = { ...answers, sentence_repeat: transcripts };
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const handleImageNaming = (e) => {
    e.preventDefault();
    const imageAnswer = e.target.elements.imageName.value;
    const imageIndex = questionIndex;
    const newAnswers = { ...answers, [`image_naming_${imageIndex}`]: imageAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer('');
    // Clear the input field to avoid carrying over previous value
    if (e.target && typeof e.target.reset === 'function') {
      e.target.reset();
    }
    handleNext(newAnswers);
  };

  // const handleNext = (updatedAnswers = answers) => {
  //   setCurrentAnswer('');
  //   const isLastQuestionInSection = currentSection?.type === 'questions' && questionIndex >= currentSection.questions.length - 1;
  //   const isLastImageInSection = currentSection?.type === 'image_naming' && questionIndex >= currentSection.images.length - 1;
  //   const isLastSentenceInSection = currentSection?.type === 'sentence_repeat' && questionIndex >= currentSection.sentences.length - 1;

  //   let newAnswers = { ...updatedAnswers };
    
  //   if (currentSection?.type === 'clock_drawing') {
  //     newAnswers = { ...newAnswers, clock_drawing: 'submitted' };
  //     setAnswers(newAnswers);
  //   }

  //   if (currentSection?.type !== 'questions' && currentSection?.type !== 'image_naming' && currentSection?.type !== 'sentence_repeat') {
  //     if (sectionIndex >= assessmentSections.length - 1) {
  //       finishTest(newAnswers);
  //     } else {
  //       setSectionIndex(sectionIndex + 1);
  //       setQuestionIndex(0);
  //       if (assessmentSections[sectionIndex + 1]?.type === 'memory_encoding') {
  //         setTimer(assessmentSections[sectionIndex + 1].duration);
  //       }
  //     }
  //   } else if ((currentSection?.type === 'questions' && isLastQuestionInSection) || 
  //              (currentSection?.type === 'image_naming' && isLastImageInSection) ||
  //              (currentSection?.type === 'sentence_repeat' && isLastSentenceInSection)) {
  //     if (sectionIndex >= assessmentSections.length - 1) {
  //       finishTest(newAnswers);
  //     } else {
  //       setSectionIndex(sectionIndex + 1);
  //       setQuestionIndex(0);
  //       if (assessmentSections[sectionIndex + 1]?.type === 'memory_encoding') {
  //         setTimer(assessmentSections[sectionIndex + 1].duration);
  //       }
  //     }
  //   } else {
  //     setQuestionIndex(questionIndex + 1);
  //   }
  // };
    const handleNext = (updatedAnswers = answers) => {
  if (sectionIndex >= assessmentSections.length) {
    console.warn("Attempted to move past last section — ignoring");
    finishTest(updatedAnswers);
    return;
  }

  setCurrentAnswer('');

  const section = assessmentSections[sectionIndex];
  const isLastQuestionInSection = section?.type === 'questions' && questionIndex >= section.questions.length - 1;
  const isLastImageInSection = section?.type === 'image_naming' && questionIndex >= section.images.length - 1;
  const isLastSentenceInSection = section?.type === 'sentence_repeat' && questionIndex >= section.sentences.length - 1;

  let newAnswers = { ...updatedAnswers };
  if (section?.type === 'clock_drawing') newAnswers.clock_drawing = 'submitted';

  // Determine whether to go to next section
  // For sentence_repeat handled by MultiSentenceRepeat, advance section upon completion
  const shouldAdvanceSection =
    (section?.type === 'sentence_repeat') ||
    (
      section?.type !== 'questions' &&
      section?.type !== 'image_naming' &&
      section?.type !== 'sentence_repeat'
    ) ||
    isLastQuestionInSection ||
    isLastImageInSection ||
    isLastSentenceInSection;

  if (shouldAdvanceSection) {
    if (sectionIndex + 1 >= assessmentSections.length) {
      finishTest(newAnswers);
    } else {
      setSectionIndex(i => i + 1);
      setQuestionIndex(0);
      const next = assessmentSections[sectionIndex + 1];
      if (next?.type === 'memory_encoding') setTimer(next.duration);
    }
  } else {
    setQuestionIndex(i => i + 1);
  }
};


  // const renderPatientInfoForm = () => {
  //   return (
  //     <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
  //       <h3>Personal Information</h3>
  //       <div style={{ marginBottom: '1rem' }}>
  //         <label>Name: <input type="text" value={patientInfo.personal_information.name} onChange={(e) => setPatientInfo({...patientInfo, personal_information: {...patientInfo.personal_information, name: e.target.value}})} required /></label>
  //       </div>
  //       <div style={{ marginBottom: '1rem' }}>
  //         <label>Date of Birth: <input type="date" value={patientInfo.personal_information.date_of_birth} onChange={(e) => setPatientInfo({...patientInfo, personal_information: {...patientInfo.personal_information, date_of_birth: e.target.value}})} required /></label>
  //       </div>
  //       <div style={{ marginBottom: '1rem' }}>
  //         <label>Education Level: <input type="text" placeholder="e.g., High School, Bachelor's" value={patientInfo.personal_information.education_level} onChange={(e) => setPatientInfo({...patientInfo, personal_information: {...patientInfo.personal_information, education_level: e.target.value}})} required /></label>
  //       </div>
  //       <div style={{ marginBottom: '1rem' }}>
  //         <label>Gender: 
  //           <select value={patientInfo.personal_information.gender} onChange={(e) => setPatientInfo({...patientInfo, personal_information: {...patientInfo.personal_information, gender: e.target.value}})} required>
  //             <option value="">Select</option>
  //             <option value="Male">Male</option>
  //             <option value="Female">Female</option>
  //             <option value="Other">Other</option>
  //           </select>
  //         </label>
  //       </div>
  //       <div style={{ marginBottom: '1rem' }}>
  //         <label>Ethnicity: 
  //           <select value={patientInfo.personal_information.ethnicity} onChange={(e) => setPatientInfo({...patientInfo, personal_information: {...patientInfo.personal_information, ethnicity: e.target.value}})} required>
  //             <option value="">Select</option>
  //             <option value="Asian">Asian</option>
  //             <option value="Black">Black</option>
  //             <option value="Hispanic">Hispanic</option>
  //             <option value="White">White</option>
  //             <option value="Other">Other</option>
  //           </select>
  //         </label>
  //       </div>

  //       <h3 style={{ marginTop: '2rem' }}>Medical History</h3>
  //       <div style={{ marginBottom: '1rem' }}>
  //         <label>Have you had any problems with memory or thinking?
  //           <select value={patientInfo.medical_history.memory_or_thinking_problems.response} onChange={(e) => setPatientInfo({...patientInfo, medical_history: {...patientInfo.medical_history, memory_or_thinking_problems: {...patientInfo.medical_history.memory_or_thinking_problems, response: e.target.value}}})} required>
  //             <option value="">Select</option>
  //             <option value="Yes">Yes</option>
  //             <option value="Only Occasionally">Only Occasionally</option>
  //             <option value="No">No</option>
  //           </select>
  //         </label>
  //       </div>
        
  //       <div style={{ marginBottom: '1rem' }}>
  //         <label>Do you have balance problems?
  //           <select value={patientInfo.medical_history.balance_problems.response} onChange={(e) => setPatientInfo({...patientInfo, medical_history: {...patientInfo.medical_history, balance_problems: {...patientInfo.medical_history.balance_problems, response: e.target.value}}})} required>
  //             <option value="">Select</option>
  //             <option value="Yes">Yes</option>
  //             <option value="No">No</option>
  //           </select>
  //         </label>
  //       </div>

  //       <div style={{ marginBottom: '1rem' }}>
  //         <label>Have you ever had a major stroke?
  //           <select value={patientInfo.medical_history.stroke_history.major_stroke} onChange={(e) => setPatientInfo({...patientInfo, medical_history: {...patientInfo.medical_history, stroke_history: {...patientInfo.medical_history.stroke_history, major_stroke: e.target.value}}})} required>
  //             <option value="">Select</option>
  //             <option value="Yes">Yes</option>
  //             <option value="No">No</option>
  //           </select>
  //         </label>
  //       </div>

  //       <div style={{ marginBottom: '1rem' }}>
  //         <label>Do you currently feel sad or depressed?
  //           <select value={patientInfo.medical_history.mood_status.sad_or_depressed} onChange={(e) => setPatientInfo({...patientInfo, medical_history: {...patientInfo.medical_history, mood_status: {...patientInfo.medical_history.mood_status, sad_or_depressed: e.target.value}}})} required>
  //             <option value="">Select</option>
  //             <option value="Yes">Yes</option>
  //             <option value="Only Occasionally">Only Occasionally</option>
  //             <option value="No">No</option>
  //           </select>
  //         </label>
  //       </div>

  //       <button onClick={submitPatientInfo} style={{ marginTop: '2rem' }}>Start Cognitive Assessment</button>
  //     </div>
  //   );
  // };

  const renderPatientInfoForm = () => {
  return (
    <div className="card" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
      <h3>Patient Information</h3>
      <div style={{ marginBottom: '1rem' }}>
        <label>Name: </label>
        <input 
          type="text" 
          value={patientInfo.personal_information.name} 
          onChange={(e) => setPatientInfo({...patientInfo, personal_information: {...patientInfo.personal_information, name: e.target.value}})} 
          required 
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Date of Birth: </label>
        <input 
          type="date" 
          value={patientInfo.personal_information.date_of_birth} 
          onChange={(e) => setPatientInfo({...patientInfo, personal_information: {...patientInfo.personal_information, date_of_birth: e.target.value}})} 
          required 
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Education Level: </label>
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setEduOpen(!eduOpen)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: '#fff',
              color: '#111',
              cursor: 'pointer'
            }}
          >
            {patientInfo.personal_information.education_level
              ? (patientInfo.personal_information.education_level === 'none' ? 'No school'
                : patientInfo.personal_information.education_level === 'secondary' ? 'School'
                : "Bachelor's")
              : 'Select'}
          </button>
          {eduOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              {[
                { v: 'none', l: 'No school' },
                { v: 'secondary', l: 'School' },
                { v: 'graduate', l: "Bachelor's" }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.v}
                  onClick={() => {
                    setPatientInfo({
                      ...patientInfo,
                      personal_information: {
                        ...patientInfo.personal_information,
                        education_level: opt.v
                      }
                    });
                    setEduOpen(false);
                  }}
                  style={{ padding: '0.5rem', width: '100%', textAlign: 'left', background: '#fff', color: '#111', border: 'none', cursor: 'pointer' }}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Gender: </label>
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setGenderOpen(!genderOpen)}
            style={{
              width: '100%', textAlign: 'left', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', color: '#111', cursor: 'pointer'
            }}
          >
            {patientInfo.personal_information.gender || 'Select'}
          </button>
          {genderOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              {['Male','Female','Other'].map(opt => (
                <button type="button" key={opt} style={{ padding: '0.5rem', width: '100%', textAlign: 'left', background: '#fff', color: '#111', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setPatientInfo({ ...patientInfo, personal_information: { ...patientInfo.personal_information, gender: opt } }); setGenderOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Ethnicity: </label>
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <button type="button" onClick={() => setEthnicityOpen(!ethnicityOpen)}
            style={{ width: '100%', textAlign: 'left', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', color: '#111', cursor: 'pointer' }}>
            {patientInfo.personal_information.ethnicity || 'Select'}
          </button>
          {ethnicityOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              {['Asian','Black','Hispanic','White','Other'].map(opt => (
                <button type="button" key={opt} style={{ padding: '0.5rem', width: '100%', textAlign: 'left', background: '#fff', color: '#111', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setPatientInfo({ ...patientInfo, personal_information: { ...patientInfo.personal_information, ethnicity: opt } }); setEthnicityOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Medical History</h3>
      <div style={{ marginBottom: '1rem' }}>
        <label>Have you had any problems with memory or thinking?</label>
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <button type="button" onClick={() => setMemProbOpen(!memProbOpen)}
            style={{ width: '100%', textAlign: 'left', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', color: '#111', cursor: 'pointer' }}>
            {patientInfo.medical_history.memory_or_thinking_problems.response || 'Select'}
          </button>
          {memProbOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              {['Yes','Only Occasionally','No'].map(opt => (
                <button type="button" key={opt} style={{ padding: '0.5rem', width: '100%', textAlign: 'left', background: '#fff', color: '#111', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setPatientInfo({ ...patientInfo, medical_history: { ...patientInfo.medical_history, memory_or_thinking_problems: { ...patientInfo.medical_history.memory_or_thinking_problems, response: opt } } }); setMemProbOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Do you have balance problems?</label>
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <button type="button" onClick={() => setBalanceOpen(!balanceOpen)}
            style={{ width: '100%', textAlign: 'left', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', color: '#111', cursor: 'pointer' }}>
            {patientInfo.medical_history.balance_problems.response || 'Select'}
          </button>
          {balanceOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              {['Yes','No'].map(opt => (
                <button type="button" key={opt} style={{ padding: '0.5rem', width: '100%', textAlign: 'left', background: '#fff', color: '#111', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setPatientInfo({ ...patientInfo, medical_history: { ...patientInfo.medical_history, balance_problems: { ...patientInfo.medical_history.balance_problems, response: opt } } }); setBalanceOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Have you ever had a major stroke?</label>
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <button type="button" onClick={() => setStrokeOpen(!strokeOpen)}
            style={{ width: '100%', textAlign: 'left', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', color: '#111', cursor: 'pointer' }}>
            {patientInfo.medical_history.stroke_history.major_stroke || 'Select'}
          </button>
          {strokeOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              {['Yes','No'].map(opt => (
                <button type="button" key={opt} style={{ padding: '0.5rem', width: '100%', textAlign: 'left', background: '#fff', color: '#111', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setPatientInfo({ ...patientInfo, medical_history: { ...patientInfo.medical_history, stroke_history: { ...patientInfo.medical_history.stroke_history, major_stroke: opt } } }); setStrokeOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Do you currently feel sad or depressed?</label>
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <button type="button" onClick={() => setMoodOpen(!moodOpen)}
            style={{ width: '100%', textAlign: 'left', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', color: '#111', cursor: 'pointer' }}>
            {patientInfo.medical_history.mood_status.sad_or_depressed || 'Select'}
          </button>
          {moodOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              {['Yes','Only Occasionally','No'].map(opt => (
                <button type="button" key={opt} style={{ padding: '0.5rem', width: '100%', textAlign: 'left', background: '#fff', color: '#111', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setPatientInfo({ ...patientInfo, medical_history: { ...patientInfo.medical_history, mood_status: { ...patientInfo.medical_history.mood_status, sad_or_depressed: opt } } }); setMoodOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={submitPatientInfo} style={{ marginTop: '2rem', width: '100%' }}>Start Cognitive Assessment</button>
    </div>
  );
};

  
  
  const renderTestStage = () => {
    if (!currentSection) return null;

    switch (currentSection.type) {
      case 'memory_encoding':
        return (
          <div>
            <h3>{currentSection.title}</h3>
            <p>{currentSection.instruction}</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '2rem 0', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              {currentSection.words.map(word => <span key={word}>{word}</span>)}
            </div>
            <p style={{ fontSize: '1.5rem', color: '#1d4ed8' }}>Time remaining: {timer}s</p>
            <div style={{ marginTop: '1rem' }}>
              <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
            </div>
          </div>
        );

      case 'memory_recall':
        return (
          <form onSubmit={handleRecallSubmit}>
            <h3>{currentSection.title}</h3>
            <p>{currentSection.instruction}</p>
            <input name="word1" placeholder="First word" required autoComplete="off" autoCorrect="off" spellCheck={false} style={{ display: 'block', marginBottom: '1rem' }} />
            <input name="word2" placeholder="Second word" required autoComplete="off" autoCorrect="off" spellCheck={false} style={{ display: 'block', marginBottom: '1rem' }} />
            <input name="word3" placeholder="Third word" required autoComplete="off" autoCorrect="off" spellCheck={false} style={{ display: 'block', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit">Submit Answers</button>
              <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
            </div>
          </form>
        );

      case 'trail_making':
        return (
          <div>
            <h3>{currentSection.title}</h3>
            <p>{currentSection.instruction}</p>
            <TrailMakingTest onComplete={handleTrailMaking} />
            <div style={{ marginTop: '1rem' }}>
              <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
            </div>
          </div>
        );

      case 'image_naming':
        const currentImage = currentSection.images[questionIndex];
        return (
          <div>
            <h3>{currentSection.title}</h3>
            <p>{currentSection.instruction}</p>
            <p>Image {questionIndex + 1} of {currentSection.images.length}</p>
            <img
              src={`${import.meta.env.BASE_URL || '/'}${currentImage.src.replace(/^\//,'')}`}
              alt="Object to name"
              style={{ maxWidth: '400px', margin: '2rem auto', display: 'block' }}
              onError={(e) => {
                const el = e.currentTarget;
                if (el.dataset.fallback) return;
                el.dataset.fallback = '1';
                const orig = `${import.meta.env.BASE_URL || '/'}${currentImage.src.replace(/^\//,'')}`;
                if (orig.toLowerCase().endsWith('.jpg')) {
                  el.src = orig.replace(/\.jpg$/i, '.jpeg');
                } else if (orig.toLowerCase().endsWith('.jpeg')) {
                  el.src = orig.replace(/\.jpeg$/i, '.jpg');
                }
              }}
            />
            <form onSubmit={handleImageNaming} key={`img-form-${questionIndex}`}>
              <input key={`img-input-${questionIndex}`} name="imageName" type="text" placeholder="Type the object name" required autoFocus autoComplete="off" autoCorrect="off" spellCheck={false} style={{ marginTop: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit">Next</button>
                <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
              </div>
            </form>
          </div>
        );

      case 'letter_tap':
        return (
          <div>
            <h3>{currentSection.title}</h3>
            <p>{currentSection.instruction}</p>
            <LetterTapTest letters={currentSection.letters} targetLetter={currentSection.targetLetter} onComplete={handleLetterTap} />
            <div style={{ marginTop: '1rem' }}>
              <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
            </div>
          </div>
        );

      case 'serial_subtraction':
        return (
          <div>
            <h3>{currentSection.title}</h3>
            <p>{currentSection.instruction}</p>
            <SerialSubtractionTest 
              startNumber={currentSection.startNumber} 
              subtractBy={currentSection.subtractBy} 
              repetitions={currentSection.repetitions} 
              onComplete={handleSerialSubtraction} 
            />
            <div style={{ marginTop: '1rem' }}>
              <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
            </div>
          </div>
        );

      case 'clock_drawing':
        return (
          <div>
            <h3>{currentSection.title}</h3>
            <p>{currentSection.instruction}</p>
            <DrawingCanvas clockMode={true} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => handleNext()}>Submit Drawing</button>
              <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
            </div>
          </div>
        );

      case 'sentence_repeat':
        return (
          <div>
            <h3>{currentSection.title}</h3>
            <p>{currentSection.instruction}</p>
            <MultiSentenceRepeat
              sentences={currentSection.sentences}
              duration={10}
              onComplete={handleMultiSentenceComplete}
            />
            <div style={{ marginTop: '1rem' }}>
              <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
            </div>
          </div>
        );

      case 'questions':
        const q = currentSection.questions[questionIndex];
        return (
          <div>
            <h3>{currentSection.title}</h3>
            <p style={{ fontSize: '1.2rem', margin: '2rem 0' }}>{q.text}</p>

            {q.type === 'text' && (
              <form onSubmit={handleTextSubmit}>
                <input type="text" value={currentAnswer} onChange={handleAnswerChange} required autoFocus />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit">Next</button>
                  <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
                </div>
              </form>
            )}
            {q.type === 'mcq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                {q.options.map(opt => <button key={opt} onClick={() => handleMCQAnswer(opt)}>{opt}</button>)}
                <button type="button" onClick={handleSkipSection} style={{ backgroundColor: '#9ca3af' }}>Skip</button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // return (
  //   <div className="card" style={{ textAlign: 'center' }}>
  //     {stage === 'instructions' && (
  //       <div>
  //         <h2>Cognitive Assessment</h2>
  //         <p>This comprehensive test assesses various aspects of cognitive function including memory, attention, visuospatial skills, language, and orientation.</p>
  //         <p>The assessment consists of multiple sections and will take approximately 15-20 minutes to complete.</p>
  //         <p><strong>Important:</strong> This is a screening tool and not a medical diagnosis. Results should be reviewed by a healthcare professional.</p>
  //         <button onClick={startTest}>Begin Assessment</button>
  //       </div>
  //     )}

  //     {stage === 'patient_info' && renderPatientInfoForm()}

  //     {stage === 'test' && currentSection && (
  //       <>
  //         <div style={{ marginBottom: '1rem', backgroundColor: '#eee', padding: '0.5rem', borderRadius: '8px' }}>
  //           Progress: Section {sectionIndex + 1} of {assessmentSections.length}
  //         </div>
  //         {renderTestStage()}
  //       </>
  //     )}

  //     {stage === 'finished' && (
  //       <div>
  //         <h2>Assessment Complete</h2>
  //         {isSubmitting ? <p>Submitting your results...</p> :
  //           <>
  //             <p>Thank you for completing the cognitive assessment. Your responses have been recorded.</p>
  //             <button onClick={() => setRoute('dashboard')}>Return to Dashboard</button>
  //           </>
  //         }
  //       </div>
  //     )}
  //   </div>
  // );
  return (
  <div className="card" style={{ textAlign: 'center' }}>
    {stage === 'instructions' && (
      <div>
        <h2>Cognitive Assessment</h2>
        <p>This comprehensive test assesses various aspects of cognitive function including memory, attention, visuospatial skills, language, and orientation.</p>
        <p>The assessment consists of multiple sections and will take approximately 15-20 minutes to complete.</p>
        <p><strong>Important:</strong> This is a screening tool and not a medical diagnosis. Results should be reviewed by a healthcare professional.</p>
        <button onClick={startTest}>Begin Assessment</button>
      </div>
    )}

    {stage === 'patient_info' && renderPatientInfoForm()}

    {stage === 'test' && currentSection && (
      <>
        <div style={{ marginBottom: '1rem', backgroundColor: '#eee', padding: '0.5rem', borderRadius: '8px' }}>
          Progress: Section {sectionIndex + 1} of {assessmentSections.length}
        </div>
        {renderTestStage()}
      </>
    )}

    {stage === 'finished' && (
      <div>
        <h2>Assessment Complete</h2>
        {isSubmitting ? <p>Submitting your results...</p> :
          <>
            <p>Thank you for completing the cognitive assessment. Your responses have been recorded.</p>
            <button onClick={() => setRoute('dashboard')}>Return to Dashboard</button>
          </>
        }
      </div>
    )}
  </div>
);


}

// Serial Subtraction Component
function SerialSubtractionTest({ startNumber, subtractBy, repetitions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [expectedAnswer, setExpectedAnswer] = useState(startNumber - subtractBy);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userAnswer = parseInt(currentInput);
    const newAnswers = [...answers, { expected: expectedAnswer, userAnswer }];
    setAnswers(newAnswers);

    if (currentIndex >= repetitions - 1) {
      onComplete(newAnswers);
    } else {
      setExpectedAnswer(expectedAnswer - subtractBy);
      setCurrentIndex(currentIndex + 1);
      setCurrentInput('');
    }
  };

  return (
    <div>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '2rem 0' }}>
        {currentIndex === 0 ? startNumber : expectedAnswer + subtractBy} - {subtractBy} = ?
      </p>
      <p>Question {currentIndex + 1} of {repetitions}</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="number" 
          value={currentInput} 
          onChange={(e) => setCurrentInput(e.target.value)} 
          placeholder="Enter your answer" 
          required 
          autoFocus
          style={{ fontSize: '1.2rem', padding: '0.5rem', width: '150px' }}
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>Submit</button>
      </form>
    </div>
  );
}

export default CognitiveTest;
