import React from 'react';
import classNames from 'classnames';

function Icon({ icon, className, onClick }) {
  return (
    <svg className={classNames('icon', className)} onClick={onClick}>
      <use xlinkHref={`#icon-${icon}`} />
    </svg>
  );
}

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  onClick: React.PropTypes.func,
};

export default Icon;
