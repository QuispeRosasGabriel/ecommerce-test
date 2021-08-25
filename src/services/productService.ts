import { AxiosParams, axiosRequest } from "../utils/axiosRequest"

export const getProducts = (productParams: AxiosParams) => axiosRequest(productParams).then(({response}) => response.data.products)