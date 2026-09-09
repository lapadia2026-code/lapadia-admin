import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const ordersApi = {
  getOrders(params?: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders', { params });
  },
  getOrder(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/orders/${id}`);
  },
  updateOrderStatus(id: string, data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/orders/${id}/status`, data);
  },
  getStats() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/stats');
  }
};
