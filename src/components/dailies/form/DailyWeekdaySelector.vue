<script setup>
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits([
    "update:modelValue"
])

const weekdays = [
    {
        value: "monday",
        label: "SEG"
    },
    {
        value: "tuesday",
        label: "TER"
    },
    {
        value: "wednesday",
        label: "QUA"
    },
    {
        value: "thursday",
        label: "QUI"
    },
    {
        value: "friday",
        label: "SEX"
    },
    {
        value: "saturday",
        label: "SÁB"
    },
    {
        value: "sunday",
        label: "DOM"
    }
]

function isSelected(day) {
    return props.modelValue.includes(day)
}

function toggleDay(day) {
    let updatedDays

    if (isSelected(day)) {
        updatedDays =
            props.modelValue.filter(
                selectedDay =>
                    selectedDay !== day
            )
    } else {
        updatedDays = [
            ...props.modelValue,
            day
        ]
    }

    emit(
        "update:modelValue",
        updatedDays
    )
}
</script>

<template>
    <section class="weekday-selector">
        <div class="selector-header">
            <span class="label">
                DIAS DA SEMANA
            </span>

            <p>
                Escolha em quais dias esta diária
                deve ser realizada.
            </p>
        </div>

        <div class="weekdays">
            <button
                v-for="day in weekdays"
                :key="day.value"
                type="button"
                class="weekday"
                :class="{
                    selected:
                        isSelected(day.value)
                }"
                @click="
                    toggleDay(day.value)
                "
            >
                {{ day.label }}
            </button>
        </div>

        <p
            v-if="modelValue.length === 0"
            class="warning"
        >
            ○ Selecione pelo menos um dia.
        </p>

        <p
            v-else
            class="selected-count"
        >
            ✓
            {{
                modelValue.length === 1
                    ? "1 dia selecionado"
                    : `${modelValue.length} dias selecionados`
            }}
        </p>
    </section>
</template>

<style scoped>
.weekday-selector {
    padding: 18px;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 9px;
}

.selector-header {
    margin-bottom: 17px;
}

.label {
    display: block;

    margin-bottom: 8px;

    color: #b16cff;

    font-size: 10px;

    letter-spacing: 2px;
}

.selector-header p {
    margin: 0;

    color: #7f8ca1;

    font-size: 11px;
}

.weekdays {
    display: grid;

    grid-template-columns:
        repeat(7, 1fr);

    gap: 9px;
}

.weekday {
    min-height: 46px;

    padding: 10px 6px;

    color: #9eabc0;

    background: #0e1725;

    border: 1px solid #354158;
    border-radius: 7px;

    font-family: inherit;
    font-size: 10px;

    cursor: pointer;

    transition:
        background 0.2s,
        border-color 0.2s,
        color 0.2s,
        transform 0.2s;
}

.weekday:hover {
    color: #d6b4ff;

    border-color: #8851c7;

    transform: translateY(-1px);
}

.weekday.selected {
    color: #ffffff;

    background:
        rgba(
            139,
            55,
            255,
            0.28
        );

    border-color: #a65bea;

    box-shadow:
        inset 0 0 14px
        rgba(
            155,
            73,
            255,
            0.08
        );
}

.warning,
.selected-count {
    margin:
        13px 0 0;

    font-size: 9px;
}

.warning {
    color: #8a97aa;
}

.selected-count {
    color: #52d7ab;
}

@media (max-width: 750px) {
    .weekdays {
        grid-template-columns:
            repeat(4, 1fr);
    }
}

@media (max-width: 450px) {
    .weekdays {
        grid-template-columns:
            repeat(2, 1fr);
    }
}
</style>