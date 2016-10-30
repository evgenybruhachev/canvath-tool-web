import React from 'react';

function ProductCard({ title, actionTitle, onClick, image, images }) {
  return (
    <div className="product-card">
      {title && <div className="title">{title}</div>}
      <img className="preview" src={image} alt="" onClick={onClick} />
      {actionTitle && <button className="action-button" onClick={onClick}>{actionTitle}</button>}
      {images && <div className="previews">{images.map((item, index) => <img src={item} alt="" key={index} />) }</div>}
    </div>
  );
}

ProductCard.propTypes = {
  title: React.PropTypes.string,
  image: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  images: React.PropTypes.arr,
  actionTitle: React.PropTypes.string,
};

export default ProductCard;
