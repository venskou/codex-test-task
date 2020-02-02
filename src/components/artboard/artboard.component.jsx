import React from 'react';
import uuid from 'uuid';

import './artboard.component.scss';

const Artboard = ({ canvasData }) => {
  const renderColumn = column =>
    column.map(cell => (
      <div className="artboard__cell" key={uuid.v1()}>
        {cell && <span>{cell}</span>}
      </div>
    ));

  const renderCanvas = canvas =>
    canvas.map(column => (
      <div className="artboard__column" key={uuid.v1()}>
        {renderColumn(column)}
      </div>
    ));

  return (
    <div>
      {canvasData.length ? (
        <div className="artboard">{canvasData.length && renderCanvas(canvasData)}</div>
      ) : null}
    </div>
  );
};

export default Artboard;
