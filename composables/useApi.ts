import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';

export const useApi = () => {
  return {
    api: GATEWAY_ENDPOINT_WITH_AUTH,
  };
};
