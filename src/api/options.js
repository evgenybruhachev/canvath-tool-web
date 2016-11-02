import { HOST, session } from '../constants';

export const getBrushes = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/brushes?session=${session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.brushes)))
    .catch(err => reject(err));
  });
};

export const getFonts = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/drawer/fonts?session=${session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.fonts)))
    .catch(err => reject(err));
  });
};
