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

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pencil'); // 'pencil' or 'line'
  const [lineStart, setLineStart] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
  }, []);

  const startDrawing = (e) => {
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
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setTool('pencil')} style={{ marginRight: '0.5rem', backgroundColor: tool === 'pencil' ? '#2563eb' : '#cbd5e1' }}>Pencil</button>
        <button onClick={() => setTool('line')} style={{ marginRight: '0.5rem', backgroundColor: tool === 'line' ? '#2563eb' : '#cbd5e1' }}>Line</button>
        <button onClick={clearCanvas} style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>Clear</button>
      </div>
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
