
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
    },
});

let unauthorizedHandler = null;

export function setToken(token) {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

export function onUnauthorized(handler) {
    unauthorizedHandler = handler;
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        const isAuthCall =
            url.includes('/login') || url.includes('/logout');

        if (
            error.response?.status === 401 &&
            !isAuthCall &&
            unauthorizedHandler
        ) {
            unauthorizedHandler();
        }

        return Promise.reject(error);
    }
);

export default api;
