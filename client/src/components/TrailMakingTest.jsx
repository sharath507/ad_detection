import React, { useRef, useEffect, useState } from 'react';

function TrailMakingTest({ onComplete }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [currentNode, setCurrentNode] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);

  const sequence = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E', '6', 'F'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const width = (canvas?.width) || 600;
    const height = (canvas?.height) || 500;
    const pad = 50;
    const minDist = 70;
    const maxAttempts = 2000;

    const placed = [];
    let attempts = 0;
    for (let i = 0; i < sequence.length; i++) {
      let placedNode = null;
      while (!placedNode && attempts < maxAttempts) {
        attempts++;
        const candidate = {
          label: sequence[i],
          x: pad + Math.random() * (width - pad * 2),
          y: pad + Math.random() * (height - pad * 2),
          index: i
        };
        const ok = placed.every(p => {
          const dx = p.x - candidate.x;
          const dy = p.y - candidate.y;
          return Math.hypot(dx, dy) >= minDist;
        });
        if (ok) placedNode = candidate;
      }
      // Fallback grid placement if random failed
      if (!placedNode) {
        const cols = 4;
        const rows = Math.ceil(sequence.length / cols);
        const col = i % cols;
        const row = Math.floor(i / cols);
        placedNode = {
          label: sequence[i],
          x: pad + (col + 0.5) * ((width - pad * 2) / cols),
          y: pad + (row + 0.5) * ((height - pad * 2) / rows),
          index: i
        };
      }
      placed.push(placedNode);
    }
    setNodes(placed);
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [nodes, connections, currentNode]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.from.x, conn.from.y);
      ctx.lineTo(conn.to.x, conn.to.y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach((node, index) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      ctx.fillStyle = index < currentNode ? '#10b981' : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked node matches the expected sequence
    nodes.forEach((node, index) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (distance < 25) {
        if (index === currentNode) {
          // Correct node clicked
          if (currentNode > 0) {
            setConnections([...connections, { from: nodes[currentNode - 1], to: node }]);
          }
          setCurrentNode(currentNode + 1);

          if (currentNode === sequence.length - 1) {
            // Test complete
            const completionTime = (Date.now() - startTime) / 1000;
            onComplete({ time: completionTime, errors, connections: connections.length + 1 });
          }
        } else {
          // Wrong node clicked
          setErrors(errors + 1);
        }
      }
    });
  };

  return (
    <div>
      <p>Click: {sequence[currentNode] || 'Finished!'}</p>
      <p>Errors: {errors}</p>
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        onClick={handleCanvasClick}
        style={{ border: '2px solid #ccc', cursor: 'pointer', display: 'block', margin: '1rem auto' }}
      />
    </div>
  );
}

export default TrailMakingTest;
