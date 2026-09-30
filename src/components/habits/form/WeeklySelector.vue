<script setup>
const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    }
})

const emit = defineEmits([
    "update:modelValue"
])

const weekDays = [
    {
        id: "monday",
        short: "SEG"
    },
    {
        id: "tuesday",
        short: "TER"
    },
    {
        id: "wednesday",
        short: "QUA"
    },
    {
        id: "thursday",
        short: "QUI"
    },
    {
        id: "friday",
        short: "SEX"
    },
    {
        id: "saturday",
        short: "SÁB"
    },
    {
        id: "sunday",
        short: "DOM"
    }
]

function isSelected(dayId) {
    return props.modelValue.includes(dayId)
}

function toggleDay(dayId) {
    if (isSelected(dayId)) {
        const updatedDays =
            props.modelValue.filter(
                day => day !== dayId
            )

        emit(
            "update:modelValue",
            updatedDays
        )

        return
    }

    emit(
        "update:modelValue",
        [
            ...props.modelValue,
            dayId
        ]
    )
}
</script>

<template>
    <section class="weekly-selector">
        <div class="selector-header">
            <span class="section-label">
                DIAS DA SEMANA
            </span>

            <p>
                Escolha em quais dias este hábito
                deve ser realizado.
            </p>
        </div>

        <div class="week-selector">
            <button
                v-for="day in weekDays"
                :key="day.id"
                type="button"
                class="day-button"
                :class="{
                    selected:
                        isSelected(day.id)
                }"
                @click="
                    toggleDay(day.id)
                "
            >
                {{ day.short }}
            </button>
        </div>

        <div class="selection-summary">
            <template
                v-if="modelValue.length > 0"
            >
                <span class="selection-dot">
                    ●
                </span>

                <span>
                    {{ modelValue.length }}

                    {{
                        modelValue.length === 1
                            ? "dia selecionado"
                            : "dias selecionados"
                    }}
                </span>
            </template>

            <template v-else>
                <span class="warning-dot">
                    ○
                </span>

                <span>
                    Selecione pelo menos um dia
                </span>
            </template>
        </div>
    </section>
</template>

<style scoped>
.weekly-selector {
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

.week-selector {
    display: grid;

    grid-template-columns:
        repeat(7, 1fr);

    gap: 8px;
}

.day-button {
    min-height: 46px;

    color: #7e8b9f;

    background: #0b1320;

    border: 1px solid #354158;
    border-radius: 8px;

    font-family: inherit;
    font-size: 10px;
    font-weight: bold;

    cursor: pointer;

    transition: 0.2s;
}

.day-button:hover {
    color: #d5b9f5;

    border-color: #75509c;
}

.day-button.selected {
    color: white;

    background: #6831a5;

    border-color: #b267f1;

    box-shadow:
        0 0 12px
        rgba(165, 84, 239, 0.15);
}

.selection-summary {
    min-height: 18px;

    display: flex;
    align-items: center;

    gap: 6px;

    color: #7d899c;

    font-size: 10px;
}

.selection-dot {
    color: #ad6df1;
}

.warning-dot {
    color: #66748a;
}

@media (max-width: 800px) {
    .week-selector {
        grid-template-columns:
            repeat(4, 1fr);
    }
}

@media (max-width: 550px) {
    .week-selector {
        grid-template-columns:
            repeat(3, 1fr);
    }
}
</style>