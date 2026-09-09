import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const subscriptionsApi = {
  getSubscriptions(params?: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/subscriptions', { params });
  },
  getSubscription(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/subscriptions/${id}`);
  }
};
