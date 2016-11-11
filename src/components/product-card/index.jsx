import React from 'react';
import Icon from '../icon';

function ProductCard({ title, actionTitle, onClick, image, images, removeBtn = false, onRemove }) {
  return (
    <div className="product-card">
      {removeBtn && <Icon icon="remove-template" className="remove-template" onClick={onRemove} />}
      {title && <div className="title">{title}</div>}
      <img className="preview" src={image} alt="" onClick={onClick} />
      {actionTitle && <button className="action-button" onClick={onClick}>{actionTitle}</button>}
      {images && <div className="previews">{images.map((item, index) => <img src={item.ProductColorSide.image_url} alt="" key={index} />) }</div>}
    </div>
  );
}

ProductCard.propTypes = {
  title: React.PropTypes.string,
  image: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  images: React.PropTypes.array,
  actionTitle: React.PropTypes.string,
  removeBtn: React.PropTypes.bool,
  onRemove: React.PropTypes.func,
};

export default ProductCard;
