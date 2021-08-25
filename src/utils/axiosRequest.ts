import axios from 'axios';

export interface AxiosParams<T = any> {
  url: string;
  method: 'put' | 'post' | 'get' | 'delete' | 'GET' | 'PUT' | 'POST' | 'DELETE';
  data?: T;
  headers?: any;
}

export const axiosRequest = async (parameters: AxiosParams) => {
  const { url, method, data, headers } = parameters;
  try {
    const response = await axios.request({
      url,
      method,
      data,
      headers
    });
    return {
      status: 'Success',
      response: response.data
    };
  } catch (error) {
    return {
      status: 'Error',
      error: error
    };
  }
};
