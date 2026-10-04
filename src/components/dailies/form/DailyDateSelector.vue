<script setup>
import {
    ref,
    computed
} from "vue"

import DailyCalendar from "./DailyCalendar.vue"

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    }
})

const emit = defineEmits([
    "update:modelValue"
])

const isOpen = ref(false)

const formattedDate = computed(() => {
    if (!props.modelValue) {
        return "Escolher data"
    }

    const [
        year,
        month,
        day
    ] = props.modelValue.split("-")

    if (
        !year ||
        !month ||
        !day
    ) {
        return props.modelValue
    }

    return `${day}/${month}/${year}`
})

function selectDate(date) {
    emit(
        "update:modelValue",
        date
    )

    isOpen.value = false
}

function toggleCalendar() {
    isOpen.value =
        !isOpen.value
}
</script>

<template>
    <section class="date-selector">
        <span class="control-label">
            DATA DE INÍCIO
        </span>

        <button
            type="button"
            class="date-card"
            :class="{
                active: isOpen
            }"
            @click="toggleCalendar"
        >
            <div class="date-info">
                <span>
                    INÍCIO
                </span>

                <strong>
                    {{ formattedDate }}
                </strong>
            </div>

            <span class="calendar-icon">
                📅
            </span>
        </button>

        <DailyCalendar
            v-if="isOpen"
            :model-value="modelValue"
            @select="selectDate"
        />
    </section>
</template>

<style scoped>
.date-selector {
    position: relative;

    display: flex;
    flex-direction: column;

    gap: 12px;
}

.control-label {
    color: #b16cff;

    font-size: 0.72rem;
    font-weight: 800;

    letter-spacing: 1.5px;
}

.date-card {
    width: 100%;
    min-height: 80px;

    box-sizing: border-box;

    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 15px;

    padding: 16px;

    color: #eef1f7;

    background: #101927;

    border:
        1px solid #354158;

    border-radius: 9px;

    font-family: inherit;

    cursor: pointer;

    transition: 0.2s;
}

.date-card:hover,
.date-card.active {
    border-color: #9851df;
}

.date-card.active {
    box-shadow:
        0 0 0 2px
        rgba(
            152,
            81,
            223,
            0.08
        );
}

.date-info {
    display: flex;
    flex-direction: column;

    align-items: flex-start;

    gap: 7px;
}

.date-info span {
    color: #8190a6;

    font-size: 0.65rem;
    font-weight: 700;

    letter-spacing: 1px;
}

.date-info strong {
    color: #eef1f7;

    font-size: 0.95rem;
    font-weight: 700;
}

.calendar-icon {
    font-size: 1.2rem;
}

@media (max-width: 700px) {
    .date-card {
        min-height: 70px;
    }
}
</style>