
<script setup>
defineProps({
    students: {
        type: Array,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['edit', 'remove']);
</script>

<template>
    <div class="card">
        <p v-if="loading">Loading...</p>

        <p v-else-if="students.length === 0">
            No student records found.
        </p>

        <table v-else>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th v-if="isAdmin">Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="student in students" :key="student.id">
                    <td>{{ student.name }}</td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.course }}</td>

                    <td v-if="isAdmin" class="actions">
                        <button class="btn" @click="emit('edit', student)">
                            Edit
                        </button>

                        <button class="btn danger" @click="emit('remove', student)">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
