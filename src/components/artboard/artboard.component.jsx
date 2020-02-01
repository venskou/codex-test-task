import React, { useEffect, useState } from 'react';

import './artboard.component.scss';

const Artboard = ({ canvasData }) => {
  const renderCells = cells =>
    cells.map((cell, index) => (
      <div className="artboard__cell" key={index}>
        {cell ? cell : index}
      </div>
    ));

  const renderCanvas = canvas =>
    canvas.map((cells, index) => (
      <div className="artboard__row" key={index}>
        {renderCells(cells)}
      </div>
    ));

  return <div className="artboard">{canvasData.length && renderCanvas(canvasData)}</div>;
};

export default Artboard;
