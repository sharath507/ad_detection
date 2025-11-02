// import React, { useRef, useState, useEffect } from "react";

// function DrawingCanvas() {
//   const canvasRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   const getContext = () => canvasRef.current?.getContext('2d');

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         ctx.lineCap = 'round';
//         ctx.strokeStyle = 'black';
//         ctx.lineWidth = 3;
//       }
//     }
//   }, []);

//   const startDrawing = ({ nativeEvent }) => {
//     const { offsetX, offsetY } = nativeEvent;
//     const ctx = getContext();
//     if (ctx) {
//       ctx.beginPath();
//       ctx.moveTo(offsetX, offsetY);
//       setIsDrawing(true);
//     }
//   };

//   const stopDrawing = () => {
//     const ctx = getContext();
//     if (ctx) {
//       ctx.closePath();
//       setIsDrawing(false);
//     }
//   };

//   const draw = ({ nativeEvent }) => {
//     if (!isDrawing) return;
//     const { offsetX, offsetY } = nativeEvent;
//     const ctx = getContext();
//     if (ctx) {
//       ctx.lineTo(offsetX, offsetY);
//       ctx.stroke();
//     }
//   };

//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     const ctx = getContext();
//     if (canvas && ctx) {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//     }
//   };

//   return (
//     <div>
//       <canvas
//         ref={canvasRef}
//         width="500"
//         height="400"
//         style={{ border: '1px solid #ccc', borderRadius: '8px', touchAction: 'none', backgroundColor: '#fff' }}
//         onMouseDown={startDrawing}
//         onMouseUp={stopDrawing}
//         onMouseMove={draw}
//         onMouseLeave={stopDrawing}
//       />
//       <div style={{marginTop: '1rem'}}>
//         <button type="button" onClick={clearCanvas}>Clear Drawing</button>
//       </div>
//     </div>
//   );
// }
// export default DrawingCanvas;
import React, { useRef, useState, useEffect } from 'react';

function DrawingCanvas({ clockMode = false }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pencil'); // 'pencil' or 'line'
  const [lineStart, setLineStart] = useState(null);
  const [activeHand, setActiveHand] = useState('minute');
  const [hourAngle, setHourAngle] = useState(-Math.PI / 6);
  const [minuteAngle, setMinuteAngle] = useState(Math.PI / 3);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
  }, []);

  useEffect(() => {
    if (!clockMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 20;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 3;
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + Math.cos(a) * (r - 10);
      const y1 = cy + Math.sin(a) * (r - 10);
      const x2 = cx + Math.cos(a) * (r - 2);
      const y2 = cy + Math.sin(a) * (r - 2);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    const drawHand = (angle, length, color, width) => {
      const x = cx + Math.cos(angle - Math.PI / 2) * length;
      const y = cy + Math.sin(angle - Math.PI / 2) * length;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };
    drawHand(hourAngle, r * 0.5, '#111827', 4);
    drawHand(minuteAngle, r * 0.8, '#2563eb', 3);
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#111827';
    ctx.fill();
  }, [clockMode, hourAngle, minuteAngle]);

  const startDrawing = (e) => {
    if (clockMode) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const x = e.clientX - rect.left - cx;
      const y = e.clientY - rect.top - cy;
      const angle = Math.atan2(y, x) + Math.PI / 2;
      setDragging(true);
      if (activeHand === 'hour') setHourAngle(angle);
      else setMinuteAngle(angle);
      return;
    }
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'line') {
      if (!lineStart) {
        setLineStart({ x, y });
      } else {
        drawLine(lineStart.x, lineStart.y, x, y);
        setLineStart(null);
      }
    } else {
      setIsDrawing(true);
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e) => {
    if (clockMode && dragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const x = e.clientX - rect.left - cx;
      const y = e.clientY - rect.top - cy;
      const angle = Math.atan2(y, x) + Math.PI / 2;
      if (activeHand === 'hour') setHourAngle(angle);
      else setMinuteAngle(angle);
      return;
    }
    if (!isDrawing || tool === 'line') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (clockMode) {
      setDragging(false);
      return;
    }
    setIsDrawing(false);
  };

  const drawLine = (x1, y1, x2, y2) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setLineStart(null);
  };

  return (
    <div>
      {!clockMode && (
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setTool('pencil')} style={{ marginRight: '0.5rem', backgroundColor: tool === 'pencil' ? '#2563eb' : '#cbd5e1' }}>Pencil</button>
          <button onClick={() => setTool('line')} style={{ marginRight: '0.5rem', backgroundColor: tool === 'line' ? '#2563eb' : '#cbd5e1' }}>Line</button>
          <button onClick={clearCanvas} style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>Clear</button>
        </div>
      )}
      {clockMode && (
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <button onClick={() => setActiveHand('hour')} style={{ backgroundColor: activeHand === 'hour' ? '#2563eb' : '#cbd5e1' }}>Hour Hand</button>
          <button onClick={() => setActiveHand('minute')} style={{ backgroundColor: activeHand === 'minute' ? '#2563eb' : '#cbd5e1' }}>Minute Hand</button>
          <button onClick={clearCanvas} style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>Clear</button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '2px solid #ccc', cursor: 'crosshair', display: 'block', margin: '0 auto' }}
      />
    </div>
  );
}

export default DrawingCanvas;
