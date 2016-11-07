import { HOST, session } from '../constants';

export const getCategories = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/categories?session=${session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.categories)))
    .catch(err => reject(err));
  });
};

export const getProductsByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products?session=${session}&category_id=${categoryId}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.products)))
    .catch(err => reject(err));
  });
};

export const getProduct = (productId) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/product?session=${session}&product_id=${productId}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data)))
    .catch(err => reject(err));
  });
};

export const saveTemplate = (image, svg) => {
  const payload = {
    session,
    DesignTemplate: {
      image_url: image,
      content_url: svg,
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`${HOST}/designs/templates/template`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .then(response => resolve(response))
    .catch(err => reject(err));
  });
};

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/designs/templates?session=${session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.templates)))
    .catch(err => reject(err));
  });
};
