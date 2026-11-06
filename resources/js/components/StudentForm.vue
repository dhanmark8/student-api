
<script setup>
import { reactive, computed, watch } from 'vue';

const props = defineProps({
    student: {
        type: Object,
        default: null,
    },
    errors: {
        type: Object,
        default: () => ({}),
    },
    saving: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['save', 'cancel']);

const blank = {
    name: '',
    email: '',
    course: '',
};

const form = reactive({ ...blank });

watch(
    () => props.student,
    (student) => {
        Object.assign(form, student ? { ...student } : blank);
    },
    { immediate: true }
);

const canSubmit = computed(() =>
    Object.keys(blank).every(
        (key) => String(form[key] ?? '').trim() !== ''
    )
);
</script>

<template>
    <form class="card" @submit.prevent="emit('save', { name: form.name, email: form.email, course: form.course })">
        <h2>{{ student ? 'Edit Student' : 'Add Student' }}</h2>

        <label>Name</label>
        <input v-model="form.name" type="text" />
        <p v-if="errors.name" class="field-error">
            {{ errors.name[0] }}
        </p>

        <label>Email</label>
        <input v-model="form.email" type="email" />
        <p v-if="errors.email" class="field-error">
            {{ errors.email[0] }}
        </p>

        <label>Course</label>
        <input v-model="form.course" type="text" />
        <p v-if="errors.course" class="field-error">
            {{ errors.course[0] }}
        </p>

        <div class="actions">
            <button
                type="submit"
                class="btn primary"
                :disabled="saving || !canSubmit"
            >
                {{ saving ? 'Saving...' : 'Save' }}
            </button>

            <button
                type="button"
                class="btn"
                :disabled="saving"
                @click="emit('cancel')"
            >
                Cancel
            </button>
        </div>
    </form>
</template>
