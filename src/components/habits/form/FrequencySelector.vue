<script setup>
defineProps({
    modelValue: {
        type: String,
        required: true
    }
})

const emit = defineEmits([
    "update:modelValue"
])

const frequencies = [
    {
        id: "daily",
        name: "DIÁRIO",
        description: "Todos os dias"
    },
    {
        id: "weekly",
        name: "SEMANAL",
        description: "Escolha os dias"
    },
    {
        id: "monthly",
        name: "MENSAL",
        description: "Meta por mês"
    }
]

function selectFrequency(frequency) {
    emit(
        "update:modelValue",
        frequency
    )
}
</script>

<template>
    <section class="frequency-selector">
        <div class="section-label">
            FREQUÊNCIA
        </div>

        <div class="frequency-options">
            <button
                v-for="item in frequencies"
                :key="item.id"
                type="button"
                class="frequency-option"
                :class="{
                    selected:
                        modelValue === item.id
                }"
                @click="
                    selectFrequency(item.id)
                "
            >
                <strong>
                    {{ item.name }}
                </strong>

                <span>
                    {{ item.description }}
                </span>
            </button>
        </div>
    </section>
</template>

<style scoped>
.frequency-selector {
    display: flex;
    flex-direction: column;

    gap: 12px;
}

.section-label {
    color: #ad6df1;

    font-size: 11px;
    letter-spacing: 2px;
}

.frequency-options {
    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 10px;
}

.frequency-option {
    min-height: 78px;

    padding: 15px;

    display: flex;
    flex-direction: column;

    align-items: flex-start;
    justify-content: center;

    gap: 6px;

    color: #8c99ac;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 8px;

    font-family: inherit;

    cursor: pointer;

    transition: 0.2s;
}

.frequency-option:hover {
    border-color: #75509c;
}

.frequency-option strong {
    color: #d8dce5;

    font-size: 11px;
    letter-spacing: 1px;
}

.frequency-option span {
    font-size: 11px;
}

.frequency-option.selected {
    background: #3c2861;

    border-color: #a45ce7;

    box-shadow:
        0 0 15px
        rgba(164, 92, 231, 0.08);
}

.frequency-option.selected strong {
    color: white;
}

@media (max-width: 800px) {
    .frequency-options {
        grid-template-columns: 1fr;
    }
}
</style>