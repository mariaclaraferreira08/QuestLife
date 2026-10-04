<script setup>
import { computed, ref, watch } from "vue"

const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    }
})

const emit = defineEmits([
    "select"
])

const weekDays = [
    "DOM",
    "SEG",
    "TER",
    "QUA",
    "QUI",
    "SEX",
    "SÁB"
]

const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
]

function parseDate(dateString) {
    if (!dateString) {
        return new Date()
    }

    const [year, month, day] =
        dateString
            .split("-")
            .map(Number)

    return new Date(
        year,
        month - 1,
        day
    )
}

function formatDate(date) {
    const year =
        date.getFullYear()

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0")

    const day =
        String(
            date.getDate()
        ).padStart(2, "0")

    return `${year}-${month}-${day}`
}

function getTodayKey() {
    return formatDate(
        new Date()
    )
}

const initialDate =
    parseDate(
        props.modelValue
    )

const currentMonth = ref(
    initialDate.getMonth()
)

const currentYear = ref(
    initialDate.getFullYear()
)

watch(
    () => props.modelValue,
    (newValue) => {
        if (!newValue) {
            return
        }

        const date =
            parseDate(newValue)

        currentMonth.value =
            date.getMonth()

        currentYear.value =
            date.getFullYear()
    }
)

const monthTitle = computed(() => {
    return `${
        monthNames[
            currentMonth.value
        ]
    } ${currentYear.value}`
})

const calendarDays = computed(() => {
    const year =
        currentYear.value

    const month =
        currentMonth.value

    const firstDay =
        new Date(
            year,
            month,
            1
        )

    const lastDay =
        new Date(
            year,
            month + 1,
            0
        )

    const firstWeekDay =
        firstDay.getDay()

    const daysInMonth =
        lastDay.getDate()

    const days = []

    /*
     * Dias do mês anterior.
     */
    const previousMonthLastDay =
        new Date(
            year,
            month,
            0
        ).getDate()

    for (
        let i = firstWeekDay - 1;
        i >= 0;
        i--
    ) {
        const day =
            previousMonthLastDay - i

        const date =
            new Date(
                year,
                month - 1,
                day
            )

        days.push({
            date,
            key: formatDate(date),
            day,
            currentMonth: false
        })
    }

    /*
     * Dias do mês atual.
     */
    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        const date =
            new Date(
                year,
                month,
                day
            )

        days.push({
            date,
            key: formatDate(date),
            day,
            currentMonth: true
        })
    }

    /*
     * Completa a grade.
     *
     * 42 = 6 semanas.
     */
    let nextMonthDay = 1

    while (days.length < 42) {
        const date =
            new Date(
                year,
                month + 1,
                nextMonthDay
            )

        days.push({
            date,
            key: formatDate(date),
            day: nextMonthDay,
            currentMonth: false
        })

        nextMonthDay++
    }

    return days
})

function previousMonth() {
    if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--

        return
    }

    currentMonth.value--
}

function nextMonth() {
    if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++

        return
    }

    currentMonth.value++
}

function isSelected(day) {
    return (
        day.key ===
        props.modelValue
    )
}

function isToday(day) {
    return (
        day.key ===
        getTodayKey()
    )
}

function isPast(day) {
    return (
        day.key <
        getTodayKey()
    )
}

function selectDay(day) {
    if (isPast(day)) {
        return
    }

    emit(
        "select",
        day.key
    )
}

function goToToday() {
    const today =
        new Date()

    currentMonth.value =
        today.getMonth()

    currentYear.value =
        today.getFullYear()

    emit(
        "select",
        formatDate(today)
    )
}
</script>

<template>
    <div class="calendar">
        <!-- CABEÇALHO -->

        <header class="calendar-header">
            <button
                type="button"
                class="navigation-button"
                aria-label="Mês anterior"
                @click="previousMonth"
            >
                ‹
            </button>

            <strong>
                {{ monthTitle }}
            </strong>

            <button
                type="button"
                class="navigation-button"
                aria-label="Próximo mês"
                @click="nextMonth"
            >
                ›
            </button>
        </header>

        <!-- DIAS DA SEMANA -->

        <div class="week-header">
            <span
                v-for="weekDay in weekDays"
                :key="weekDay"
            >
                {{ weekDay }}
            </span>
        </div>

        <!-- DIAS -->

        <div class="days-grid">
            <button
                v-for="day in calendarDays"
                :key="day.key"
                type="button"
                class="day"
                :class="{
                    outside:
                        !day.currentMonth,

                    today:
                        isToday(day),

                    selected:
                        isSelected(day),

                    past:
                        isPast(day)
                }"
                :disabled="isPast(day)"
                @click="selectDay(day)"
            >
                {{ day.day }}
            </button>
        </div>

        <!-- RODAPÉ -->

        <footer class="calendar-footer">
            <span>
                Selecione a data de início
            </span>

            <button
                type="button"
                @click="goToToday"
            >
                HOJE
            </button>
        </footer>
    </div>
</template>

<style scoped>
.calendar {
    position: absolute;
    z-index: 50;

    top: calc(100% + 10px);
    left: 0;

    width: min(
        100%,
        430px
    );

    padding: 18px;

    color: #eef1f7;

    background: #101927;

    border:
        1px solid #47566e;

    border-radius: 12px;

    box-shadow:
        0 20px 45px
        rgba(
            0,
            0,
            0,
            0.35
        );
}

/* HEADER */

.calendar-header {
    display: grid;

    grid-template-columns:
        42px 1fr 42px;

    align-items: center;

    gap: 10px;

    margin-bottom: 18px;
}

.calendar-header strong {
    text-align: center;

    font-size: 1rem;

    text-transform: capitalize;
}

.navigation-button {
    width: 40px;
    height: 40px;

    color: #c47cff;

    background: #151f30;

    border:
        1px solid #354158;

    border-radius: 8px;

    font-size: 1.5rem;

    cursor: pointer;
}

.navigation-button:hover {
    color: white;

    background: #472c68;

    border-color: #ad5ae8;
}

/* SEMANA */

.week-header {
    display: grid;

    grid-template-columns:
        repeat(7, 1fr);

    gap: 5px;

    margin-bottom: 7px;
}

.week-header span {
    color: #77869d;

    font-size: 0.65rem;
    font-weight: 800;

    text-align: center;
}

/* DIAS */

.days-grid {
    display: grid;

    grid-template-columns:
        repeat(7, 1fr);

    gap: 5px;
}

.day {
    aspect-ratio: 1;

    min-width: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #dce3ef;

    background: transparent;

    border:
        1px solid transparent;

    border-radius: 8px;

    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 700;

    cursor: pointer;

    transition:
        background 0.15s,
        border-color 0.15s,
        color 0.15s,
        transform 0.15s;
}

.day:hover:not(:disabled) {
    color: white;

    background: #202b3e;

    border-color: #536078;

    transform:
        translateY(-1px);
}

/* FORA DO MÊS */

.day.outside {
    color: #526078;
}

/* HOJE */

.day.today {
    border-color: #9851df;
}

.day.today:not(.selected) {
    color: #c77cff;
}

/* SELECIONADO */

.day.selected {
    color: white;

    background:
        linear-gradient(
            135deg,
            #7227dc,
            #a928ef
        );

    border-color: #c071ff;

    box-shadow:
        0 0 14px
        rgba(
            169,
            40,
            239,
            0.25
        );
}

/* PASSADO */

.day.past {
    color: #3f4a5d;

    opacity: 0.45;

    cursor: not-allowed;
}

/* FOOTER */

.calendar-footer {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 15px;

    margin-top: 15px;
    padding-top: 14px;

    border-top:
        1px solid #29364a;
}

.calendar-footer span {
    color: #718097;

    font-size: 0.68rem;
}

.calendar-footer button {
    padding: 7px 11px;

    color: #c87aff;

    background:
        rgba(
            152,
            45,
            234,
            0.08
        );

    border:
        1px solid #623783;

    border-radius: 6px;

    font-family: inherit;
    font-size: 0.7rem;
    font-weight: 800;

    cursor: pointer;
}

.calendar-footer button:hover {
    color: white;

    background: #7227dc;

    border-color: #a95bef;
}

/* RESPONSIVO */

@media (max-width: 550px) {
    .calendar {
        width: 100%;

        padding: 14px;
    }

    .day {
        font-size: 0.72rem;
    }

    .week-header span {
        font-size: 0.55rem;
    }
}
</style>