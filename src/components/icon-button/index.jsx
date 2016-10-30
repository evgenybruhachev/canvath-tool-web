import React from 'react';
import classNames from 'classnames';
import Ink from 'react-ink';

import Icon from '../icon';

function IconButton({ icon, label, onClick, active = false, type = 'button',
  className, style, background = true }) {
  return (
    <button
      className={classNames('icon-button', { active }, className)}
      label={label}
      onClick={onClick}
      type={type}
      style={style}
    >

      <Icon icon={icon} />
      {label && <span className="label">{label}</span>}
      <Ink hasTouch={false} background={background} />
    </button>
  );
}

IconButton.propTypes = {
  icon: React.PropTypes.string.isRequired,
  label: React.PropTypes.string,
  onClick: React.PropTypes.func,
  active: React.PropTypes.bool,
  type: React.PropTypes.oneOf(['button', 'reset', 'submit']),
  className: React.PropTypes.string,
  style: React.PropTypes.func,
  background: React.PropTypes.bool,
};

export default IconButton;
