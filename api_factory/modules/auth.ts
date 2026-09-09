import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const authApi = {
  login(data: any) {
    return GATEWAY_ENDPOINT.post('/auth/admin/login', data);
  },
  me() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/admin/me');
  },
};
