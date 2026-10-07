<script setup>
defineProps({
    feedback: {
        type: Object,
        required: true
    }
})

const emit = defineEmits([
    "close"
])
</script>

<template>
    <div
        v-if="feedback.show"
        class="feedback"
        :class="feedback.type"
    >
        <div class="feedback-icon">
            <span
                v-if="
                    feedback.type ===
                    'success'
                "
            >
                ✓
            </span>

            <span
                v-else-if="
                    feedback.type ===
                    'warning'
                "
            >
                !
            </span>

            <span
                v-else-if="
                    feedback.type ===
                    'error'
                "
            >
                ×
            </span>

            <span
                v-else-if="
                    feedback.type ===
                    'special'
                "
            >
                ✦
            </span>

            <span v-else>
                i
            </span>
        </div>

        <div class="feedback-content">
            <strong>
                {{ feedback.title }}
            </strong>

            <p>
                {{ feedback.message }}
            </p>
        </div>

        <button
            type="button"
            class="feedback-close"
            @click="
                emit('close')
            "
        >
            ×
        </button>
    </div>
</template>

<style scoped>
.feedback {
    margin-bottom: 24px;
    padding: 14px 16px;

    display: grid;

    grid-template-columns:
        36px
        minmax(0, 1fr)
        auto;

    align-items: center;

    gap: 12px;

    background: #151f30;

    border: 1px solid #354158;
    border-radius: 10px;
}

.feedback-icon {
    width: 34px;
    height: 34px;

    display: grid;
    place-items: center;

    border-radius: 8px;

    font-size: 16px;
    font-weight: 800;
}

.feedback-content {
    min-width: 0;
}

.feedback-content strong {
    display: block;

    margin-bottom: 3px;

    color: #f2f5fb;

    font-size: 11px;
}

.feedback-content p {
    margin: 0;

    color: #929fb2;

    font-size: 10px;
    line-height: 1.5;
}

.feedback-close {
    padding: 4px;

    color: #768398;

    background: transparent;

    border: 0;

    font-size: 18px;

    cursor: pointer;
}

.feedback.success {
    border-color: #347e69;
}

.feedback.success
.feedback-icon {
    color: #68e2b8;

    background:
        rgba(
            48,
            163,
            123,
            0.14
        );
}

.feedback.warning {
    border-color: #826a34;
}

.feedback.warning
.feedback-icon {
    color: #f3c55b;

    background:
        rgba(
            206,
            158,
            54,
            0.13
        );
}

.feedback.error {
    border-color: #834456;
}

.feedback.error
.feedback-icon {
    color: #ff7896;

    background:
        rgba(
            206,
            67,
            94,
            0.13
        );
}

.feedback.special {
    border-color: #75439f;

    background:
        linear-gradient(
            90deg,
            rgba(
                117,
                67,
                159,
                0.13
            ),
            #151f30 35%
        );
}

.feedback.special
.feedback-icon {
    color: #ca82ff;

    background:
        rgba(
            160,
            73,
            222,
            0.14
        );
}

.feedback.info {
    border-color: #3f5674;
}

.feedback.info
.feedback-icon {
    color: #8eb8ee;

    background:
        rgba(
            73,
            119,
            178,
            0.13
        );
}

@media (max-width: 700px) {
    .feedback {
        grid-template-columns:
            34px
            minmax(0, 1fr)
            auto;
    }
}
</style>
