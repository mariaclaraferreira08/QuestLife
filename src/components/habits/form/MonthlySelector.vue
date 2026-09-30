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
    if (props.modelValue >= 31) {
        return
    }

    emit(
        "update:modelValue",
        props.modelValue + 1
    )
}
</script>

<template>
    <section class="monthly-selector">
        <div class="selector-header">
            <span class="section-label">
                META DO MÊS
            </span>

            <p>
                Quantas vezes você deseja concluir
                este hábito durante o mês?
            </p>
        </div>

        <div class="monthly-target">
            <button
                type="button"
                class="counter-button"
                :disabled="modelValue <= 1"
                @click="decrease"
            >
                −
            </button>

            <div class="counter-value">
                <strong>
                    {{ modelValue }}
                </strong>

                <span>
                    {{
                        modelValue === 1
                            ? "vez por mês"
                            : "vezes por mês"
                    }}
                </span>
            </div>

            <button
                type="button"
                class="counter-button"
                :disabled="modelValue >= 31"
                @click="increase"
            >
                +
            </button>
        </div>

        <div class="monthly-example">
            <span>EXEMPLO</span>

            <p>
                Ao completar

                <strong>
                    {{ modelValue }}/{{ modelValue }}
                </strong>

                durante o mês, sua sequência mensal aumenta.
            </p>
        </div>
    </section>
</template>

<style scoped>
.monthly-selector {
    padding: 18px;

    display: flex;
    flex-direction: column;

    gap: 14px;

    background: #101927;

    border: 1px solid #2e3a4d;
    border-radius: 9px;
}

.selector-header {
    display: flex;
    flex-direction: column;

    gap: 8px;
}

.section-label {
    color: #ad6df1;

    font-size: 11px;
    letter-spacing: 2px;
}

.selector-header p {
    margin: 0;

    color: #748197;

    font-size: 11px;
}

.monthly-target {
    min-height: 100px;

    display: flex;

    align-items: center;
    justify-content: center;

    gap: 25px;

    background: #0b1320;

    border: 1px solid #29364a;
    border-radius: 9px;
}

.counter-button {
    width: 44px;
    height: 44px;

    display: grid;
    place-items: center;

    color: white;

    background: #32204d;

    border: 1px solid #7945ad;
    border-radius: 8px;

    font-family: inherit;
    font-size: 22px;

    cursor: pointer;

    transition: 0.2s;
}

.counter-button:hover:not(:disabled) {
    background: #512a7c;

    border-color: #a55ee8;
}

.counter-button:disabled {
    cursor: not-allowed;

    opacity: 0.3;
}

.counter-value {
    min-width: 110px;

    display: flex;
    flex-direction: column;

    align-items: center;

    gap: 3px;
}

.counter-value strong {
    color: #d7a8ff;

    font-size: 31px;
}

.counter-value span {
    color: #7f8ca1;

    font-size: 10px;
}

.monthly-example {
    padding: 12px;

    background: rgba(
        123,
        55,
        174,
        0.08
    );

    border: 1px solid #3c2e50;
    border-radius: 7px;
}

.monthly-example > span {
    color: #9760c6;

    font-size: 9px;
    letter-spacing: 1px;
}

.monthly-example p {
    margin: 5px 0 0;

    color: #8491a4;

    font-size: 11px;
}

.monthly-example strong {
    color: #c899ef;
}

@media (max-width: 550px) {
    .monthly-target {
        gap: 14px;
    }
}
</style>