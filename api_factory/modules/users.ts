import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const usersApi = {
  getUsers(params?: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/users', { params });
  },
  getUser(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/users/${id}`);
  },
  updateUser(id: string, data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/users/${id}`, data);
  },
  deleteUser(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/users/${id}`);
  }
};
