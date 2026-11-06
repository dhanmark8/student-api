
<script setup>
defineProps({
    text: String,
    type: {
        type: String,
        default: 'success',
    },
});
</script>

<template>
    <div
        v-if="text"
        class="banner"
        :class="type"
    >
        {{ text }}
    </div>
</template>
