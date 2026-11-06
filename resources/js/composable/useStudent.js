
import { reactive, toRefs } from 'vue';
import api from '../api';
import { useNotify } from './useNotify';

export function useStudents() {
    const { notify } = useNotify();

    const state = reactive({
        items: [],
        loading: false,
        saving: false,
        deletingId: null,
        errors: {},
    });

    function handleError(e) {
        const status = e.response?.status;

        if (status === 403) {
            notify('Forbidden: only administrators can do that.', 'error');
        } else if (status === 404) {
            notify('Student not found.', 'error');
        } else if (status === 422) {
            state.errors = e.response.data.errors || {};
        } else if (status !== 401) {
            notify('Something went wrong. Please try again.', 'error');
        }
    }

    async function load() {
        state.loading = true;

        try {
            const { data } = await api.get('/students');
            state.items = data;
        } catch (e) {
            handleError(e);
        } finally {
            state.loading = false;
        }
    }

    async function save(form, editingId = null) {
        state.saving = true;
        state.errors = {};

        try {
            if (editingId) {
                await api.put(`/students/${editingId}`, form);
                notify('Student updated successfully.');
            } else {
                await api.post('/students', form);
                notify('Student added successfully.');
            }

            await load();
            return true;
        } catch (e) {
            handleError(e);
            return false;
        } finally {
            state.saving = false;
        }
    }

    async function remove(student) {
        if (!confirm(`Delete ${student.name}?`)) {
            return;
        }

        state.deletingId = student.id;

        try {
            await api.delete(`/students/${student.id}`);
            notify('Student deleted successfully.');
            await load();
        } catch (e) {
            handleError(e);
        } finally {
            state.deletingId = null;
        }
    }

    function reset() {
        state.items = [];
        state.errors = {};
    }

    return {
        ...toRefs(state),
        load,
        save,
        remove,
        reset,
    };
}
