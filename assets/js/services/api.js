import config from '../config/config';

/**
 * Load an object by id and type.
 * @param {int} id
 * @param {string} type
 * @return {Promise<Response|void>}
 */
export const loadObjectByIdAndType = async (id, type) => {
  const response = await fetch(
    `${config.apiUrl}/${type}/${id}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  ).catch((e) => {
    console.error(e);
  });

  return response.json();
};

/**
 * Load an object list by type from the API
 * @param {string} type
 * @return {Promise<Response|void>}
 */
export const loadObjectsFromApi = async (type) => {
  const response = await fetch(
    `${config.apiUrl}/${type}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  ).catch((e) => {
    console.error(e);
  });

  return response.json();
};

/**
 * Send a POST order to the API
 * @param {string} type
 * @param {object} data
 * @return {Promise<Response<any, Record<string, any>, number>>}
 */
export const sendOrder = async (type, data) => {
  let endpoint = config.apiUrl;

  switch (type) {
    case 'teddies':
      endpoint += '/teddies/order';
      break;
    case 'cameras':
      endpoint += '/cameras/order';
      break;
    case 'furniture':
      endpoint += '/furniture/order';
      break;
    default:
      throw new Error('Invalid type');
  }

  return await fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).catch((err) => console.log(err));
};
