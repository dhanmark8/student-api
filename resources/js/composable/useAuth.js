
import { ref, computed } from 'vue';
import api, { setToken, onUnauthorized } from '../api';
import { useNotify } from './useNotify';

// Shared state (one copy for the whole app)
let storedUser = null;
try {
    storedUser = JSON.parse(localStorage.getItem('user') || 'null');
} catch {
    // Invalid stored data is cleared below.
}

const storedToken = localStorage.getItem('token');
const hasStoredSession = !!storedToken &&
    storedUser &&
    typeof storedUser === 'object' &&
    !Array.isArray(storedUser) &&
    typeof storedUser.name === 'string' &&
    ['administrator', 'regular_user'].includes(storedUser.role);

const user = ref(hasStoredSession ? storedUser : null);
const token = ref(hasStoredSession ? storedToken : null);
const loggingIn = ref(false);
const loginError = ref('');

if (hasStoredSession) {
    setToken(token.value);
} else {
    clearSession();
}

function clearSession() {
    setToken(null);
    token.value = null;
    user.value = null;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

onUnauthorized(() => {
    if (!token.value) return;

    const { notify } = useNotify();

    clearSession();
    notify('Session expired. Please log in again.', 'error');
});

export function useAuth() {
    const isLoggedIn = computed(() => !!token.value && !!user.value);
    const isAdmin = computed(() => user.value?.role === 'administrator');

    async function login(credentials) {
        loggingIn.value = true;
        loginError.value = '';

        try {
            const { data } = await api.post('/login', credentials);

            token.value = data.token;
            user.value = data.user;

            setToken(data.token);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return true;
        } catch (e) {
            const errs = e.response?.data?.errors;

            loginError.value = errs
                ? Object.values(errs)[0][0]
                : e.response?.data?.message || 'Login failed. Please try again.';

            return false;
        } finally {
            loggingIn.value = false;
        }
    }

    async function logout() {
        try {
            await api.post('/logout');
        } catch (e) {
            // The token may already be invalid; end the session anyway.
        }

        clearSession();
    }

    return {
        user,
        isLoggedIn,
        isAdmin,
        loggingIn,
        loginError,
        login,
        logout,
    };
}
