import React from 'react';

function Loader() {
  return (
    <div className="loader">
      <div className="spinner">
        <div className="loader-top" />
        <div className="loader-bottom" />
        <div className="loader-line" />
      </div>
    </div>
  );
}

export default Loader;
