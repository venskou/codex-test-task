import React, { Component } from 'react';

import Information from '../information/information.component';
import CommandLine from '../command-line/command-line.component';
import Artboard from '../artboard/artboard.component';

class Paint extends Component {
  state = {
    error: null,
    paintCommands: [],
    canvas: [],
    canvasParams: { width: 0, height: 0 },
    drawSymbol: 'x',
  };

  setError = errorText => {
    this.setState({
      error: errorText ? errorText : null,
      canvas: [],
      canvasParams: { width: 0, height: 0 },
    });
  };

  // method that used for state lifting from command-line component
  setPaintCommands = paintCommands => {
    this.setState({
      paintCommands,
    });
  };

  // method for creating canvas in 2 dimensional array form [[column], [column], ....]
  executeCommands = () => {
    const { paintCommands } = this.state;
    if (!paintCommands.length) return;
    if (paintCommands[0].type !== 'C') {
      this.setError('Canvas is not created, you must specify canvas at first.');
      return;
    }

    const { width, height } = paintCommands[0];

    if (!width || !height) {
      this.setError(`Canvas width or height is not might be a zero.`);
      return;
    }

    // Create 2 dimensional array for canvas render
    const canvas = Array(width)
      .fill(null)
      .map(() => Array(height).fill(null));

    this.setState(
      {
        canvas,
        canvasParams: {
          width,
          height,
        },
        error: null,
      },
      // Run paint method after canvas state was set
      this.paint
    );
  };

  paint = () => {
    const {
      paintCommands,
      canvasParams: { width: canvasWidth, height: canvasHeight },
      error,
      drawSymbol,
    } = this.state;

    let { canvas } = this.state;

    let errorInPaint = null;

    // Сheck if the coordinates are in the canvas
    const checkCoordsPosition = ({ x = undefined, y = undefined }) => {
      const isCoordsInX = x ? x.every(cordX => cordX <= canvasWidth) : true;
      const isCoordsInY = y ? y.every(cordY => cordY <= canvasHeight) : true;
      return isCoordsInX && isCoordsInY;
    };

    // Check if coords are inverse, for example end line coords were installed at the beginning
    const checkIsCoordsInverse = (x1, y1, x2, y2) => x1 - x2 > 0 || y1 - y2 > 0;

    const drawLine = ({ x1, y1, x2, y2 }) => {
      const isCoordsInCanvas = checkCoordsPosition({ x: [x1, x2], y: [y1, y2] });
      if (!isCoordsInCanvas) {
        errorInPaint = 'Line coordinates is not in canvas area';
        return;
      }

      const isLineStraight = x1 === x2 || y1 === y2;
      if (!isLineStraight) {
        errorInPaint = 'Lines can be only vertical or horizontal';
        return;
      }

      const isCoordsInverse = checkIsCoordsInverse(x1, y1, x2, y2);
      const lineType = x1 === x2 ? 'vertical' : 'horizontal';

      let lineStart;
      let lineEnd;
      let linePosition;

      if (lineType === 'vertical') {
        lineStart = isCoordsInverse ? y2 : y1;
        lineEnd = isCoordsInverse ? y1 : y2;
        // Not changed position in vertical line ↓
        linePosition = x1;
      } else {
        lineStart = isCoordsInverse ? x2 : x1;
        lineEnd = isCoordsInverse ? x1 : x2;
        // Not changed position in horizontal line →
        linePosition = y1;
      }

      canvas = canvas.map((column, index) => {
        const colNum = index + 1;

        if (lineType === 'vertical' && colNum === linePosition) {
          return column.fill(drawSymbol, lineStart - 1, lineEnd);
        }

        if (lineType === 'horizontal' && colNum >= lineStart && colNum <= lineEnd) {
          return column.fill(drawSymbol, linePosition - 1, linePosition);
        }

        return column;
      });
    };

    const drawRectangle = ({ x1, y1, x2, y2 }) => {
      const isCoordsInCanvas = checkCoordsPosition({ x: [x1, x2], y: [y1, y2] });
      if (!isCoordsInCanvas) {
        errorInPaint = 'Rectangle coordinates is not in canvas area';
        return;
      }

      const isZeroWidth = !Math.abs(x1 - x2);
      const isZeroHeight = !Math.abs(y1 - y2);

      if (isZeroWidth || isZeroHeight) {
        errorInPaint = 'A rectangle cannot be a zero height or width';
        return;
      }

      const isCoordsInverse = checkIsCoordsInverse(x1, y1, x2, y2);
      const xRectStart = isCoordsInverse ? x2 : x1; // top left angle X axis position
      const yRectStart = isCoordsInverse ? y2 : y1; // top left angle Y axis position
      const xRectEnd = isCoordsInverse ? x1 : x2; // bottom right angle X axis position
      const yRectEnd = isCoordsInverse ? y1 : y2; // bottom right angle Y axis position

      canvas = canvas.map((column, index) => {
        const colNum = index + 1;

        if (colNum === xRectStart || colNum === xRectEnd) {
          return column.fill(drawSymbol, yRectStart - 1, yRectEnd);
        }

        if (colNum > xRectStart && colNum < xRectEnd) {
          return column
            .fill(drawSymbol, yRectStart - 1, yRectStart)
            .fill(drawSymbol, yRectEnd - 1, yRectEnd);
        }

        return column;
      });
    };

    const bucketFill = ({ x, y, c: fillSymbol }) => {
      const isCoordsInCanvas = checkCoordsPosition({ x: [x], y: [y] });
      if (!isCoordsInCanvas) {
        errorInPaint = 'Fill point is not in canvas area';
        return;
      }

      // Change coordinates for work with arrays index
      const targetX = x - 1;
      const targetY = y - 1;

      // Get the symbol that we will fill
      const targetSymbol = canvas[targetX][targetY];

      const fill = (startTarget, targetSymbol, fillSymbol) => {
        // Save visited cells because we don't need to use they again
        const visitedCells = [];

        // Stack of points that we need to check
        const cellsToCheck = [startTarget];

        // Check if cell from cellsToCheck stack was used
        const isCellVisited = ({ x, y }) =>
          visitedCells.some(visitedCoords => x === visitedCoords.x && y === visitedCoords.y);

        while (cellsToCheck.length > 0) {
          // Get last item coordinates from stack and remove him
          const { x, y } = cellsToCheck.pop();

          const isCellAvailable = !(
            x < 0 || // Сheck is cell X coordinate is negative
            y < 0 || // Сheck is cell X coordinate is negative
            x > canvasWidth - 1 || // Сheck is cell X coordinate more than canvas width
            y > canvasHeight - 1 || // Сheck is cell X coordinate more than canvas height
            // Сheck whether the cell was used
            isCellVisited({ x, y })
          );

          // Check if target cell symbol responded to symbol which we fill
          if (isCellAvailable && canvas[x][y] === targetSymbol) {
            canvas[x][y] = fillSymbol;

            // Set that this cell was used
            visitedCells.push({ x, y });

            // We send the cells surrounding the current one on 4 sides for verification // Bottom, Up, Left, Right
            cellsToCheck.push({ x, y: y + 1 }, { x, y: y - 1 }, { x: x - 1, y }, { x: x + 1, y });
          }
        }
      };

      fill({ x: targetX, y: targetY }, targetSymbol, fillSymbol);
    };

    // Start processing received commands
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
      <div className="row p-4">
        <div className="col-4">
          <Information />
        </div>
        <div className="col-4">
          <CommandLine setPaintCommands={this.setPaintCommands} setError={this.setError} />
          <button onClick={this.executeCommands} className="btn btn-primary" disabled={error}>
            Paint
          </button>
        </div>
        <div className="col-12">
          {error && <p className="alert alert-danger d-inline-block my-4">{error}</p>}
        </div>
        <div className="col-12">
          <Artboard canvasData={canvas} />
        </div>
      </div>
    );
  }
}

export default Paint;
