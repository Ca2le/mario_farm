const maxAge = 604800000;
const origin = 'http://localhost:3000';
const credentials = true;
const methods = ['GET', 'PUT', 'POST', 'DELETE'];

export const config = {
  origin,
  maxAge,
  credentials,
  methods,
};
