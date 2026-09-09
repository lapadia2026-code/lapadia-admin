import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const productsApi = {
  getProducts(params?: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/products', { params });
  },
  getProduct(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/products/${id}`);
  },
  createProduct(data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/products', data);
  },
  updateProduct(id: string, data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/products/${id}`, data);
  },
  deleteProduct(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/products/${id}`);
  }
};
