<script setup>
import { reactive } from 'vue';

defineProps({
    error: String,
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['submit']);

const form = reactive({
    email: '',
    password: '',
});
</script>

<template>
    <form class="card" @submit.prevent="emit('submit', { ...form })">
        <h2>Login</h2>

        <label>Email</label>
        <input
            v-model="form.email"
            type="email"
            placeholder="Email address"
        />

        <label>Password</label>
        <input
            v-model="form.password"
            type="password"
            placeholder="Password"
        />

        <p v-if="error" class="field-error">
            {{ error }}
        </p>

        <button
            type="submit"
            class="btn primary"
            :disabled="loading"
        >
            {{ loading ? 'Logging in...' : 'Login' }}
        </button>
    </form>
</template>
