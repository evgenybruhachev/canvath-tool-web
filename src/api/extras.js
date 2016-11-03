import { HOST, session } from '../constants';

export const upload = (image) => {
  const formData = new FormData()
  formData.append('image', image[0]);
  formData.append('session', session);

  return new Promise((resolve, reject) => {
    fetch(`${HOST}/designs/design/image/upload`, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json().then(data => resolve(data.image_url)))
    .catch(err => reject(err));
  });
};
