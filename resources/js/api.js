import axios from 'axios';
const api = axios.create({
baseURL: '/api',
headers: { Accept: 'application/json' },
});
export function setToken(token) {
if (token) {
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
delete api.defaults.headers.common['Authorization'];
}
}
export default api;
