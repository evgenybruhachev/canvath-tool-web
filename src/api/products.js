import { HOST } from '../constants';
import query from '../constants/query';

export const getCategories = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/categories?session=${query.session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.categories)))
    .catch(err => reject(err));
  });
};

export const getProductsByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/models?session=${query.session}&category_id=${categoryId}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.products)))
    .catch(err => reject(err));
  });
};

export const getProduct = (productId) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/models/model?session=${query.session}&product_id=${productId}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data)))
    .catch(err => reject(err));
  });
};

export const getDefaultProduct = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/models/model/default?session=${query.session}`, {
      method: 'GET',
      mode: 'cors',
    })
      .then(response => response.json().then(data => resolve(data)))
      .catch(err => reject(err));
  });
};

export const saveTemplate = (image, svg) => {
  const payload = {
    session: query.session,
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
    fetch(`${HOST}/designs/templates?session=${query.session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.templates)))
    .catch(err => reject(err));
  });
};

export const removeTemplate = (id) => {
  const payload = {
    session: query.session,
    DesignTemplate: {
      id,
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`${HOST}/designs/templates/template`, {
      method: 'DELETE',
      mode: 'cors',
      body: JSON.stringify(payload),
    })
    .then(response => resolve(response))
    .catch(err => reject(err));
  });
};

export const getProductWithDesign = (item_id) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/product/design?session=${query.session}&item_id=${item_id}`, {
      method: 'GET',
      mode: 'cors',
    })
      .then(response => response.json().then(data => resolve(data)))
      .catch(err => reject(err));
  });
};

export const getDesign = (design_id) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/designs/design?session=${query.session}&design_id=${design_id}`, {
      method: 'GET',
      mode: 'cors',
    })
      .then(response => response.json().then(data => resolve(data)))
      .catch(err => reject(err));
  });
};

export const saveProduct = (colorId, sides) => {
  const payload = {
    session: query.session,
    Product: {
      color_id: colorId,
      design_sides: sides,
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/product`, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(payload),
    })
      .then(response => response.json().then(data => resolve(data)))
      .catch(err => reject(err));
  });
};