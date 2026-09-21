import { GATEWAY_ENDPOINT } from '../axios.config'

export const addonsApi = {
  $_get_categories: () => GATEWAY_ENDPOINT.get('/addons/categories'),
  $_create_category: (data: any) => GATEWAY_ENDPOINT.post('/addons/categories', data),
  $_update_category: (id: string, data: any) => GATEWAY_ENDPOINT.put(`/addons/categories/${id}`, data),
  $_delete_category: (id: string) => GATEWAY_ENDPOINT.delete(`/addons/categories/${id}`),

  $_get_addons: (categoryId?: string) => {
    let url = '/addons';
    if (categoryId) url += `?categoryId=${categoryId}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_create_addon: (data: any) => GATEWAY_ENDPOINT.post('/addons', data),
  $_update_addon: (id: string, data: any) => GATEWAY_ENDPOINT.put(`/addons/${id}`, data),
  $_delete_addon: (id: string) => GATEWAY_ENDPOINT.delete(`/addons/${id}`)
}
