import React, { Component } from 'react';

function ProductCard ({title, onClick, image, images}){
  return (
    <div className="product-card">
      {title && <div className="title">{title}</div>}
      <img className="preview" src={image} alt=""/>
      {images.length && <div className="previews">{images.map((item, index) => <img src={item} alt='' key={index}/> ) }</div>}
    </div>
  )
};

ProductCard.propTypes = {
  title: React.PropTypes.string,
  image: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  images: React.PropTypes.array
};

export default ProductCard;