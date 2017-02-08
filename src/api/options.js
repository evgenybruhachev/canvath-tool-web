import { HOST } from '../constants';
import query from '../constants/query';

export const getBrushes = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/brushes?session=${query.session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.brushes)))
    .catch(err => reject(err));
  });
};

export const getFonts = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/fonts?session=${query.session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.fonts)))
    .catch(err => reject(err));
  });
};

export const getFontsJP = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/fonts?session=${query.session}&category_id=1`, {
      method: 'GET',
      mode: 'cors',
    })
      .then(response => response.json().then(data => resolve(data.fonts)))
      .catch(err => reject(err));
  });
};

export const getFontsEN = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/fonts?session=${query.session}&category_id=2`, {
      method: 'GET',
      mode: 'cors',
    })
      .then(response => response.json().then(data => resolve(data.fonts)))
      .catch(err => reject(err));
  });
};

export const getCategoriesFonts = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/fonts/categories?session=${query.session}`, {
      method: 'GET',
      mode: 'cors',
    })
      .then(response => response.json().then(data => resolve(data.categories)))
      .catch(err => reject(err));
  });
};

