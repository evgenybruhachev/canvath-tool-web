import React from 'react';
import classNames from 'classnames';
import Ink from 'react-ink';
import Icon from '../icon';

function IconButton({ label, icon, image, onClick, active = false, type = 'button', className, style }) {
  return (
    <button
      className={classNames('button', { active }, className)}
      label={label}
      onClick={onClick}
      type={type}
      style={style}
    >
      {image && <img className="image" src={image} alt="" />}
      {icon && <Icon icon={icon} />}
      {label && <span className="label">{label}</span>}
      <Ink hasTouch={false} />
    </button>
  );
}

IconButton.propTypes = {
  label: React.PropTypes.string,
  icon: React.PropTypes.string,
  image: React.PropTypes.string,
  onClick: React.PropTypes.func,
  active: React.PropTypes.bool,
  type: React.PropTypes.oneOf(['button', 'reset', 'submit']),
  className: React.PropTypes.string,
  style: React.PropTypes.obj,
};

export default IconButton;
