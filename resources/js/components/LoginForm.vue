<script setup>
import { reactive } from 'vue';

defineProps({
    error: String,
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
            placeholder="admin@example.com"
        />

        <label>Password</label>

        <input
            v-model="form.password"
            type="password"
            placeholder="password123"
        />

        <p v-if="error" class="field-error">{{ error }}</p>

        <button type="submit" class="btn primary">Login</button>
    </form>
</template>
