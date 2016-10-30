import React from 'react';
import classNames from 'classnames';
import Ink from 'react-ink';
import Icon from '../icon';

function IconButton({ label, icon, onClick, active = false, type = 'button', className, style }) {
  return (
    <button
      className={classNames('icon-button', { active }, className)}
      label={label}
      onClick={onClick}
      type={type}
      style={style}
    >
      {icon && <Icon icon={icon} />}
      {label && <span className="label">{label}</span>}
      <Ink hasTouch={false} />
    </button>
  );
}

IconButton.propTypes = {
  label: React.PropTypes.string,
  icon: React.PropTypes.string,
  onClick: React.PropTypes.func,
  active: React.PropTypes.bool,
  type: React.PropTypes.oneOf(['button', 'reset', 'submit']),
  className: React.PropTypes.string,
  style: React.PropTypes.obj,
};

export default IconButton;
