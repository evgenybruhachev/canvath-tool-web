import { HOST } from '../constants';
import query from '../constants/query';

export const upload = (image) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('session', query.session);

    fetch(`${HOST}/designs/design/image/upload`, {
    // fetch(`${HOST}/designs/design/image/base64`, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json().then((data) => {
      if (!response.ok) {
        reject(data.message);
      } else {
        resolve(data.image_url);
        // resolve(data.image_content);
      }
    }));
  });
};

export const uploadByString = (mime_type, content, extension) => {
  const data = {
    session: query.session,
    File: { mime_type, content, extension },
  };

  return new Promise((resolve, reject) => {
    fetch(`${HOST}/designs/design/file/upload`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(response => response.json().then(data => resolve(data.file_url)))
    .catch(err => reject(err));
  });
};

export const getShapesCategories = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/shapes/categories?session=${query.session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.categories)))
    .catch(err => reject(err));
  });
};

export const getShapes = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/shapes?session=${query.session}&category_id=${id}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.shapes)))
    .catch(err => reject(err));
  });
};

export const getStickersCategories = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/stickers/categories?session=${query.session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.categories)))
    .catch(err => reject(err));
  });
};

export const getStickers = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/stickers?session=${query.session}&category_id=${id}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.stickers)))
    .catch(err => reject(err));
  });
};
