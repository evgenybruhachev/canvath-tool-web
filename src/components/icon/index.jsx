import React from 'react';
import classNames from 'classnames';

function Icon({ icon, className }) {
  return (
    <svg className={classNames('icon', className)}>
      <use xlinkHref={`#icon-${icon}`} />
    </svg>
  );
}

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
};

export default Icon;
