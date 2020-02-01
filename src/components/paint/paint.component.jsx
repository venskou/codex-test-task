import React, { useState, useCallback, useEffect } from 'react';

import CommandLine from '../command-line/command-line.component';
import Artboard from '../artboard/artboard.component';

import './paint.styles.scss';

const Paint = () => {
  const [error, setError] = useState(null);
  const [paintCommands, setPaintCommands] = useState([]);
  const [canvas, setCanvas] = useState([]);

  const createCanvas = ({ width, height }) => {
    if (!width || !height) {
      setError(`Canvas width or height is not might be a zero`);
      return null;
    }

    const canvasData = Array(height)
      .fill(null)
      .map(() => Array(width).fill(null));

    setCanvas(canvasData);
  };

  const paint = useCallback(({ type, ...params }) => {
    switch (type) {
      case 'C':
        createCanvas(params);
        break;
      default:
        setError(`Command ${type} is not defined`);
    }
  }, []);

  const getPaintCommands = useCallback(commands => {
    setPaintCommands(commands);
  }, []);

  useEffect(() => {
    if (error) {
      setError(null);
    }

    paintCommands.forEach(command => {
      paint(command);
    });
  }, [error, paintCommands, paint]);

  return (
    <div className="paint">
      <p>
        Available commands and they params:
        <br />
        C w h
        <br />
        L x1 y1 x2 y2
        <br />
        R x1 y1 x2 y2
        <br />
        B x y c
        <br />
      </p>
      <CommandLine getPaintCommands={getPaintCommands} />
      {error && <p className="command-line__error">{error}</p>}
      <Artboard canvasData={canvas} />
    </div>
  );
};

export default Paint;
