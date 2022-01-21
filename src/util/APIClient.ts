import axios, {AxiosRequestConfig} from "axios";
import urls from "@util/urls";

type Endpoint = string;

async function performGetRequest<V>(endpoint: Endpoint, config?: AxiosRequestConfig) {
    try {
        const res = await axios.get<V>(urls.API_URL + endpoint, {
            withCredentials: true,
            ...config
        });
        return res.data;
    } catch (e) {
        throw e;
    }
}

async function performPostRequest<V>(endpoint: Endpoint, data?: { [key: string]: any }, config?: AxiosRequestConfig) {
    try {
        const res = await axios.post<V>(urls.API_URL + endpoint, data, {withCredentials: true, ...config});
        return res.data;
    } catch (e) {
        throw e;
    }
}

async function performPatchRequest<V>(endpoint: Endpoint, data?: { [key: string]: any }, config?: AxiosRequestConfig) {
    try {
        const res = await axios.patch<V>(urls.API_URL + endpoint, data, {withCredentials: true, ...config});
        return res.data;
    } catch (e) {
        throw e;
    }
}

async function performDeleteRequest<V>(endpoint: Endpoint, config?: AxiosRequestConfig) {
    try {
        const res = await axios.delete<V>(urls.API_URL + endpoint, {
            withCredentials: true,
            ...config
        });
        return res.data;
    } catch (e) {
        throw e;
    }
}

const APIClient = {
    get: performGetRequest,
    post: performPostRequest,
    delete: performDeleteRequest,
    patch: performPatchRequest
};

export default APIClient;