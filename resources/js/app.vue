
<script setup>
import { ref, computed, onMounted } from 'vue';
import api, { setToken } from './api';
import LoginForm from './components/LoginForm.vue';
import MessageBanner from './components/MessageBanner.vue';
import StudentForm from './components/StudentForm.vue';
import StudentTable from './components/StudentTable.vue';

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
const students = ref([]);
const editing = ref(null);
const showForm = ref(false);
const loading = ref(false);
const errors = ref({});
const loginError = ref('');
const message = ref({ text: '', type: 'success' });

const isAdmin = computed(() => user.value?.role === 'administrator');

function notify(text, type = 'success') {
    message.value = { text, type };
    setTimeout(() => (message.value.text = ''), 4000);
}

function clearSession() {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    user.value = null;
    students.value = [];
    showForm.value = false;
}

function handleError(e) {
    const status = e.response?.status;

    if (status === 401) {
        clearSession();
        notify('Session expired. Please log in again.', 'error');
    } else if (status === 403) {
        notify('You do not have permission to do that.', 'error');
    } else if (status === 422) {
        errors.value = e.response.data.errors || {};
    } else if (status === 404) {
        notify('Student not found.', 'error');
    } else {
        notify('Something went wrong. Please try again.', 'error');
    }
}

async function loadStudents() {
    loading.value = true;

    try {
        const { data } = await api.get('/students');
        students.value = data;
    } catch (e) {
        handleError(e);
    } finally {
        loading.value = false;
    }
}

async function login(credentials) {
    loginError.value = '';

    try {
        const { data } = await api.post('/login', credentials);

        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        user.value = data.user;

        notify(`Welcome, ${data.user.name}!`);
        await loadStudents();
    } catch (e) {
        const errs = e.response?.data?.errors;

        loginError.value = errs
            ? Object.values(errs)[0][0]
            : e.response?.data?.message || 'Login failed.';
    }
}

async function logout() {
    try {
        await api.post('/logout');
    } catch (e) {
        // token may already be invalid; clear the session anyway
    }

    clearSession();
    notify('Logged out successfully.');
}

function openAdd() {
    editing.value = null;
    errors.value = {};
    showForm.value = true;
}

function openEdit(student) {
    editing.value = student;
    errors.value = {};
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editing.value = null;
    errors.value = {};
}

async function saveStudent(form) {
    errors.value = {};

    try {
        if (editing.value) {
            await api.put(`/students/${editing.value.id}`, form);
            notify('Student updated successfully.');
        } else {
            await api.post('/students', form);
            notify('Student added successfully.');
        }

        closeForm();
        await loadStudents();
    } catch (e) {
        handleError(e);
    }
}

async function removeStudent(student) {
    if (!confirm(`Delete ${student.name}?`)) return;

    try {
        await api.delete(`/students/${student.id}`);
        notify('Student deleted successfully.');
        await loadStudents();
    } catch (e) {
        handleError(e);
    }
}

onMounted(() => {
    const token = localStorage.getItem('token');

    if (token && user.value) {
        setToken(token);
        loadStudents();
    } else {
        clearSession();
    }
});
</script>

<template>
    <div class="container">
        <header class="sidebar">
            <h1>Student Management</h1>

            <div v-if="user" class="user-info">
                <span>{{ user.name }}</span>
                <span class="badge">{{ user.role }}</span>
                <button class="btn" @click="logout">Logout</button>
            </div>
        </header>

        <main class="content">
            <MessageBanner
                :text="message.text"
                :type="message.type"
            />

            <LoginForm
                v-if="!user"
                :error="loginError"
                @submit="login"
            />

            <template v-else>
                <div class="records-heading">
                    <h2>Student Records</h2>
                    <button
                        v-if="isAdmin && !showForm"
                        class="btn primary add-btn"
                        @click="openAdd"
                    >
                        + Add Student
                    </button>
                </div>

                <StudentForm
                    v-if="showForm"
                    :student="editing"
                    :errors="errors"
                    @save="saveStudent"
                    @cancel="closeForm"
                />

                <StudentTable
                    :students="students"
                    :is-admin="isAdmin"
                    :loading="loading"
                    @edit="openEdit"
                    @remove="removeStudent"
                />
            </template>
        </main>
    </div>
</template>
