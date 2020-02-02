import React, { Component } from 'react';

import Information from '../information/information.component';
import CommandLine from '../command-line/command-line.component';
import Artboard from '../artboard/artboard.component';

import './paint.styles.scss';

class Paint extends Component {
  state = {
    error: null,
    paintCommands: [],
    canvas: [],
    canvasParams: { width: 0, height: 0 },
  };

  setError = errorText => {
    this.setState({
      error: errorText ? errorText : null,
    });
  };

  getPaintCommands = paintCommands => {
    this.setState({
      paintCommands,
    });
  };

  executeCommands = () => {
    const { paintCommands } = this.state;
    if (!paintCommands.length) return;
    if (paintCommands[0].type !== 'C') {
      this.setError('Canvas is not created, you must specify canvas width and height at first');
      return;
    }

    const { width, height } = paintCommands[0];

    if (!width || !height) {
      this.setError(`Canvas width or height is not might be a zero`);
      return;
    }

    const canvas = Array(height)
      .fill(null)
      .map((item, index) => Array(width).fill(index + 1));

    this.setState(
      {
        canvas,
        canvasParams: {
          width,
          height,
        },
        error: null,
      },
      this.paint
    );
  };

  paint = () => {
    const {
      paintCommands,
      canvasParams: { width: canvasWidth, height: canvasHeight },
      error,
    } = this.state;

    let { canvas } = this.state;

    let errorInPaint = null;

    const isCoordsInCanvas = (axis, ...coords) => {
      if (axis === 'x') {
        return coords.every(x => x <= canvasWidth);
      }
      return coords.every(y => y <= canvasHeight);
    };

    const drawVerticalLine = (symbol, xAxis, start, end) => {
      canvas = canvas.map((row, index) => {
        if (index >= start - 1 && index <= end - 1) {
          return row.fill(symbol, xAxis - 1, xAxis);
        }

        return row;
      });
    };

    const drawHorizontalLine = (symbol, yAxis, start, end) => {
      canvas[yAxis - 1].fill(symbol, start - 1, end);
    };

    const drawLine = ({ x1, y1, x2, y2 }) => {
      const isLineStraight = x1 === x2 || y1 === y2;
      if (!isLineStraight) {
        errorInPaint = 'Lines can be vertical or horizontal';
        return;
      }

      const isCoordsXInCanvas = isCoordsInCanvas('x', x1, x2);
      const isCoordsYInCanvas = isCoordsInCanvas('y', y1, y2);

      if (!(isCoordsXInCanvas && isCoordsYInCanvas)) {
        errorInPaint = 'Line coords is not in canvas area';
        return;
      }

      const lineType = x1 === x2 ? 'vertical' : 'horizontal';

      if (lineType === 'vertical') {
        drawVerticalLine('v', x1, y1, y2);
      } else {
        drawHorizontalLine('h', y1, x1, x2);
      }
    };

    const drawRectangle = params => {};

    const bucketFill = params => {};

    for (let { type, ...params } of paintCommands) {
      if (errorInPaint || error) break;
      switch (type) {
        case 'L':
          drawLine(params);
          break;
        case 'R':
          drawRectangle(params);
          break;
        case 'B':
          bucketFill(params);
          break;
        case 'C':
          break;
        default:
          errorInPaint = `Command ${type} is not defined`;
      }
    }

    this.setState({
      canvas: errorInPaint ? [] : canvas,
      error: errorInPaint ? errorInPaint : null,
    });
  };

  render() {
    const { error, canvas } = this.state;
    return (
      <div className="paint">
        <Information />
        <CommandLine getPaintCommands={this.getPaintCommands} setError={this.setError} />
        <button onClick={this.executeCommands}>Execute commands</button>
        {error && <p className="command-line__error">{error}</p>}
        <Artboard canvasData={canvas} />
      </div>
    );
  }
}

export default Paint;
