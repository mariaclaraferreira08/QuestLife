<script setup>
const props = defineProps({
    modelValue: {
        type: Number,
        required: true
    }
})

const emit = defineEmits([
    "update:modelValue"
])

function decrease() {
    if (props.modelValue <= 1) {
        return
    }

    emit(
        "update:modelValue",
        props.modelValue - 1
    )
}

function increase() {
    if (props.modelValue >= 52) {
        return
    }

    emit(
        "update:modelValue",
        props.modelValue + 1
    )
}
</script>

<template>
    <section class="repeat-area">
        <div class="repeat-info">
            <span>
                REPETIÇÕES
            </span>

            <strong>
                Semanal
            </strong>
        </div>

        <div class="repeat-counter">
            <span class="counter-label">
                A CADA
            </span>

            <div class="counter-content">
                <div class="counter-controls">
                    <button
                        type="button"
                        aria-label="Diminuir intervalo"
                        :disabled="modelValue <= 1"
                        @click="decrease"
                    >
                        −
                    </button>

                    <strong>
                        {{ modelValue }}
                    </strong>

                    <button
                        type="button"
                        aria-label="Aumentar intervalo"
                        :disabled="modelValue >= 52"
                        @click="increase"
                    >
                        +
                    </button>
                </div>

                <small>
                    {{
                        modelValue === 1
                            ? "semana"
                            : "semanas"
                    }}
                </small>
            </div>
        </div>
    </section>
</template>

<style scoped>
.repeat-area {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 12px;
}

.repeat-info,
.repeat-counter {
    min-height: 92px;

    padding: 15px;

    box-sizing: border-box;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 9px;
}

.repeat-info {
    display: flex;
    flex-direction: column;

    justify-content: center;

    gap: 8px;
}

.repeat-info span,
.counter-label {
    color: #8d99ac;

    font-size: 9px;
    letter-spacing: 1px;
}

.repeat-info strong {
    color: #e9ecf3;

    font-size: 18px;
    font-weight: 400;
}

.repeat-counter {
    display: flex;
    flex-direction: column;

    justify-content: center;

    gap: 10px;
}

.counter-content {
    display: flex;

    align-items: center;

    gap: 12px;
}

.counter-controls {
    display: flex;

    align-items: center;

    gap: 12px;
}

.counter-controls button {
    width: 31px;
    height: 31px;

    display: grid;
    place-items: center;

    padding: 0;

    color: #dcb9ff;

    background: #302044;

    border: 1px solid #674389;
    border-radius: 6px;

    font-family: inherit;
    font-size: 17px;

    cursor: pointer;

    transition: 0.2s;
}

.counter-controls
button:hover:not(:disabled) {
    background: #482d65;

    border-color: #9564bd;
}

.counter-controls button:disabled {
    opacity: 0.35;

    cursor: not-allowed;
}

.counter-controls strong {
    min-width: 25px;

    color: #f0f2f7;

    text-align: center;

    font-size: 18px;
}

.counter-content small {
    color: #8793a6;

    font-size: 11px;
}

@media (max-width: 750px) {
    .repeat-area {
        grid-template-columns: 1fr;
    }
}
</style>