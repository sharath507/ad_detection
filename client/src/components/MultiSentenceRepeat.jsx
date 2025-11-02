import React, { useEffect, useState } from 'react';

function MultiSentenceRepeat({ sentences = [], duration = 10, onComplete }) {
  const [step, setStep] = useState(0); // 0..(sentences.length-1)
  const [showSentence, setShowSentence] = useState(true);
  const [timer, setTimer] = useState(duration);
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState(Array(sentences.length).fill(''));
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.onresult = (event) => {
        const t = event.results[0][0].transcript;
        setTranscripts((prev) => {
          const copy = [...prev];
          copy[step] = t;
          return copy;
        });
      };
      rec.onend = () => setIsRecording(false);
      setRecognition(rec);
    }
  }, [step]);

  useEffect(() => {
    if (!showSentence) return;
    if (timer <= 0) {
      setShowSentence(false);
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [showSentence, timer]);

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    }
  };

  const proceedNext = () => {
    if (step < sentences.length - 1) {
      setStep(step + 1);
      setShowSentence(true);
      setTimer(duration);
      setIsRecording(false);
    } else {
      onComplete && onComplete(transcripts);
    }
  };

  return (
    <div>
      {showSentence ? (
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '2rem', backgroundColor: '#f0f9ff', borderRadius: '8px', margin: '2rem 0', textAlign: 'center' }}>
            "{sentences[step]}"
          </div>
          <p style={{ fontSize: '1.2rem', color: '#1d4ed8', textAlign: 'center' }}>Time remaining: {timer}s</p>
          <p style={{ textAlign: 'center' }}>Memorize this sentence. You will repeat it after the timer ends.</p>
        </div>
      ) : (
        <div>
          <p>Please repeat the sentence you just saw. Click "Start Recording" when ready.</p>
          {!isRecording && !transcripts[step] && (
            <button onClick={startRecording}>Start Recording</button>
          )}
          {isRecording && <p style={{ color: '#ef4444' }}>Recording... Speak now!</p>}
          {transcripts[step] && (
            <div>
              <p><strong>Your response:</strong> "{transcripts[step]}"</p>
              <button onClick={proceedNext}>{step < sentences.length - 1 ? 'Next Sentence' : 'Submit and Continue'}</button>
              {recognition && (
                <button onClick={startRecording} style={{ marginLeft: '1rem' }}>Re-record</button>
              )}
            </div>
          )}
          {!recognition && (
            <div>
              <p style={{ color: '#ef4444' }}>Speech recognition not supported. Please type your response:</p>
              <input type="text" value={transcripts[step]} onChange={(e) => setTranscripts((prev) => { const c = [...prev]; c[step] = e.target.value; return c; })} placeholder="Type the sentence here" style={{ width: '100%', marginBottom: '1rem' }} />
              <button onClick={proceedNext}>{step < sentences.length - 1 ? 'Next Sentence' : 'Submit and Continue'}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSentenceRepeat;
