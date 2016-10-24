import React from 'react';
import style from './style.scss';

function Icon(name) {
  return (
    <svg className={style.icon}>
      <use xlinkHref={`#icon-${name.name}`} />
    </svg>
  );
}

Icon.propTypes = {
  name: React.PropTypes.string.isRequired
};

export default Icon;