import React, { useState, useEffect, useCallback } from 'react';

import CommandLine from '../command-line/command-line.component';

import './paint.styles.scss';

const Paint = () => {
  const [paintCommands, setPaintCommands] = useState(undefined);

  const getPaintCommands = useCallback(commands => {
    setPaintCommands(commands);
  }, []);

  return (
    <div className="paint">
      <p>
        Available commands:
        <br />
        C w h <br />
        L x1 y1 x2 y2 <br />
        R x1 y1 x2 y2 <br />
        B x y c<br />
      </p>
      <CommandLine getPaintCommands={getPaintCommands} />
    </div>
  );
};

export default Paint;
