import React, { useState, useEffect } from 'react';

function SpeechRecorder({ sentence, onComplete }) {
  const [displaySentence, setDisplaySentence] = useState(true);
  const [timer, setTimer] = useState(10);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event) => {
        const transcriptResult = event.results[0][0].transcript;
        setTranscript(transcriptResult);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    if (displaySentence && timer > 0) {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    } else if (timer === 0 && displaySentence) {
      setDisplaySentence(false);
    }
  }, [timer, displaySentence]);

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    }
  };

  const submitTranscript = () => {
    onComplete(transcript);
  };

  if (displaySentence) {
    return (
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '2rem', backgroundColor: '#f0f9ff', borderRadius: '8px', margin: '2rem 0' }}>
          "{sentence}"
        </div>
        <p style={{ fontSize: '1.2rem', color: '#1d4ed8' }}>Time remaining: {timer}s</p>
        <p>Memorize this sentence. You will repeat it after the timer ends.</p>
      </div>
    );
  }

  return (
    <div>
      <p>Please repeat the sentence you just saw. Click "Start Recording" when ready.</p>
      {!isRecording && !transcript && (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {isRecording && <p style={{ color: '#ef4444' }}>Recording... Speak now!</p>}
      {transcript && (
        <div>
          <p><strong>Your response:</strong> "{transcript}"</p>
          <button onClick={submitTranscript}>Submit and Continue</button>
          <button onClick={() => { setTranscript(''); startRecording(); }} style={{ marginLeft: '1rem' }}>Re-record</button>
        </div>
      )}
      {!recognition && (
        <div>
          <p style={{ color: '#ef4444' }}>Speech recognition not supported. Please type your response:</p>
          <input type="text" value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Type the sentence here" style={{ width: '100%', marginBottom: '1rem' }} />
          <button onClick={submitTranscript}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default SpeechRecorder;
