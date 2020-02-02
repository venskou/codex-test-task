import React from 'react';

const Information = () => {
  return (
    <section className="alert alert-primary">
      <p>Available commands and they parameters:</p>
      <p>
        <b>Canvas:</b> C w h
        <br />
        <b>Line:</b> L x1 y1 x2 y2
        <br />
        <b>Rectangle:</b> R x1 y1 x2 y2
        <br />
        <b>Bucket fill:</b> B x y c
      </p>
    </section>
  );
};

export default Information;
