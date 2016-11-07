import { HOST, session } from '../constants';

export const upload = (image) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('image', image);
    formData.append('session', session);

    fetch(`${HOST}/designs/design/image/upload`, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json().then(data => resolve(data.image_url)))
    .catch(err => reject(err));
  });
};

export const getShapes = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/shapes?session=${session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.shapes)))
    .catch(err => reject(err));
  });
};

export const getStickersCategories = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/stickers/categories?session=${session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.categories)))
    .catch(err => reject(err));
  });
};

export const getStickers = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/stickers?session=${session}&category_id=${id}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.stickers)))
    .catch(err => reject(err));
  });
};
