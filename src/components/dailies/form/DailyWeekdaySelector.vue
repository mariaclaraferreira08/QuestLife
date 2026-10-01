<script setup>
import { computed } from "vue"

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
        short: "S",
        name: "Segunda"
    },
    {
        id: "tuesday",
        short: "T",
        name: "Terça"
    },
    {
        id: "wednesday",
        short: "Q",
        name: "Quarta"
    },
    {
        id: "thursday",
        short: "Q",
        name: "Quinta"
    },
    {
        id: "friday",
        short: "S",
        name: "Sexta"
    },
    {
        id: "saturday",
        short: "S",
        name: "Sábado"
    },
    {
        id: "sunday",
        short: "D",
        name: "Domingo"
    }
]

function isSelected(dayId) {
    return props.modelValue.includes(
        dayId
    )
}

function toggleDay(dayId) {
    if (isSelected(dayId)) {
        emit(
            "update:modelValue",

            props.modelValue.filter(
                day =>
                    day !== dayId
            )
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

const selectedDayNames =
    computed(() => {
        return weekDays
            .filter(day =>
                props.modelValue.includes(
                    day.id
                )
            )
            .map(day => day.name)
            .join(", ")
    })
</script>

<template>
    <section class="days-area">
        <span class="days-title">
            DIAS DA SEMANA
        </span>

        <div class="week-days">
            <button
                v-for="day in weekDays"
                :key="day.id"
                type="button"
                class="day-button"
                :class="{
                    active:
                        isSelected(day.id)
                }"
                :title="day.name"
                :aria-label="day.name"
                :aria-pressed="
                    isSelected(day.id)
                "
                @click="
                    toggleDay(day.id)
                "
            >
                {{ day.short }}
            </button>
        </div>

        <p
            v-if="modelValue.length"
            class="days-description"
        >
            Repete em:
            {{ selectedDayNames }}.
        </p>

        <p
            v-else
            class="days-warning"
        >
            Escolha pelo menos um
            dia da semana.
        </p>
    </section>
</template>

<style scoped>
.days-area {
    padding: 16px;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 9px;
}

.days-title {
    display: block;

    margin-bottom: 13px;

    color: #8996aa;

    font-size: 9px;
    letter-spacing: 1px;
}

.week-days {
    display: grid;

    grid-template-columns:
        repeat(7, 1fr);

    gap: 9px;
}

.day-button {
    width: 100%;

    aspect-ratio: 1;

    max-height: 50px;

    color: #79869a;

    background: #0a1421;

    border: 1px solid #354158;
    border-radius: 50%;

    font-family: inherit;

    cursor: pointer;

    transition: 0.2s;
}

.day-button:hover {
    color: #d8c3ef;

    border-color: #9860c9;
}

.day-button.active {
    color: #20132e;

    background: #bd91ff;

    border-color: #d4b5ff;

    box-shadow:
        0 0 12px
        rgba(
            189,
            145,
            255,
            0.15
        );
}

.days-description,
.days-warning {
    margin: 13px 0 0;

    font-size: 10px;
    line-height: 1.6;
}

.days-description {
    color: #8e9bad;
}

.days-warning {
    color: #ee7184;
}

@media (max-width: 550px) {
    .week-days {
        grid-template-columns:
            repeat(4, 1fr);
    }
}
</style>