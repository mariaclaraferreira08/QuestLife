<script setup>
import { computed } from "vue"
import habitService from "../../services/habitService"

const props = defineProps({
    habit: {
        type: Object,
        required: true
    }
})

const emit = defineEmits([
    "complete",
    "fail",
    "remove"
])

const difficultyLabels = {
    trivial: "TRIVIAL",
    easy: "FÁCIL",
    medium: "MÉDIO",
    hard: "DIFÍCIL",
    legendary: "LENDÁRIO"
}

const frequencyLabels = {
    daily: "DIÁRIO",
    weekly: "SEMANAL",
    monthly: "MENSAL"
}

const dayLabels = {
    monday: "Seg",
    tuesday: "Ter",
    wednesday: "Qua",
    thursday: "Qui",
    friday: "Sex",
    saturday: "Sáb",
    sunday: "Dom"
}

const fullDayLabels = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
}

const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]

const difficultyLabel = computed(() => {
    return (
        difficultyLabels[
            props.habit.difficulty
        ] || "FÁCIL"
    )
})

const frequencyLabel = computed(() => {
    return (
        frequencyLabels[
            props.habit.frequency
        ] || "DIÁRIO"
    )
})

const orderedDaysOfWeek = computed(() => {
    const days =
        props.habit.daysOfWeek || []

    return [...days].sort(
        (a, b) =>
            dayOrder.indexOf(a) -
            dayOrder.indexOf(b)
    )
})

const showSchedule = computed(() => {
    return (
        props.habit.frequency ===
            "daily" ||
        props.habit.frequency ===
            "weekly"
    )
})

const scheduledToday = computed(() => {
    return habitService
        .isScheduledForToday(
            props.habit.id
        )
})

const completedToday = computed(() => {
    return habitService
        .isCompletedToday(
            props.habit
        )
})

const failedToday = computed(() => {
    return habitService
        .isFailedToday(
            props.habit
        )
})

const progress = computed(() => {
    return habitService
        .getCurrentProgress(
            props.habit.id
        )
})

const progressPercentage = computed(() => {
    if (
        !progress.value.goal
    ) {
        return 0
    }

    return Math.min(
        100,
        Math.round(
            (
                progress.value.current /
                progress.value.goal
            ) * 100
        )
    )
})

const progressPeriod = computed(() => {
    if (
        props.habit.frequency ===
        "weekly"
    ) {
        return "ESTA SEMANA"
    }

    if (
        props.habit.frequency ===
        "monthly"
    ) {
        return "ESTE MÊS"
    }

    return "HOJE"
})

const progressDescription = computed(() => {
    if (
        props.habit.frequency ===
        "weekly"
    ) {
        return "conclusões semanais"
    }

    if (
        props.habit.frequency ===
        "monthly"
    ) {
        return "conclusões mensais"
    }

    return "conclusão diária"
})

const streakPeriod = computed(() => {
    if (
        props.habit.frequency ===
        "weekly"
    ) {
        return "semanas"
    }

    if (
        props.habit.frequency ===
        "monthly"
    ) {
        return "meses"
    }

    return "dias"
})

const canComplete = computed(() => {
    return (
        scheduledToday.value &&
        !completedToday.value &&
        !failedToday.value &&
        progress.value.current <
            progress.value.goal
    )
})

const canFail = computed(() => {
    return (
        scheduledToday.value &&
        !completedToday.value &&
        !failedToday.value
    )
})

const statusMessage = computed(() => {
    if (
        !scheduledToday.value
    ) {
        return "ESTE HÁBITO NÃO ESTÁ PROGRAMADO PARA HOJE"
    }

    if (
        completedToday.value
    ) {
        return "HÁBITO CONCLUÍDO HOJE"
    }

    if (
        failedToday.value
    ) {
        return "HÁBITO MARCADO COMO FALHA HOJE"
    }

    if (
        progress.value.current >=
            progress.value.goal &&
        progress.value.goal > 0
    ) {
        return "META DO PERÍODO CONCLUÍDA"
    }

    return null
})

function completeHabit() {
    if (!canComplete.value) {
        return
    }

    emit(
        "complete",
        props.habit.id
    )
}

function failHabit() {
    if (!canFail.value) {
        return
    }

    emit(
        "fail",
        props.habit.id
    )
}

function removeHabit() {
    emit(
        "remove",
        props.habit.id
    )
}
</script>

<template>
    <article class="habit-card">
        <header class="habit-header">
            <div class="habit-title-area">
                <div class="habit-icon">
                    🔥
                </div>

                <div class="habit-title-content">
                    <div class="title-row">
                        <h3>
                            {{ habit.title }}
                        </h3>

                        <span
                            class="tag difficulty"
                            :class="habit.difficulty"
                        >
                            {{
                                difficultyLabel
                            }}
                        </span>

                        <span
                            class="tag frequency"
                        >
                            {{
                                frequencyLabel
                            }}
                        </span>
                    </div>

                    <p
                        v-if="habit.description"
                        class="description"
                    >
                        {{
                            habit.description
                        }}
                    </p>
                </div>
            </div>

            <button
                type="button"
                class="remove-button"
                title="Excluir hábito"
                @click="removeHabit"
            >
                ×
            </button>
        </header>

        <section
            v-if="showSchedule"
            class="schedule"
        >
            <div class="schedule-header">
                <span>
                    PROGRAMADO PARA
                </span>
            </div>

            <div
                v-if="orderedDaysOfWeek.length"
                class="schedule-days"
            >
                <span
                    v-for="day in orderedDaysOfWeek"
                    :key="day"
                    class="day-chip"
                    :title="fullDayLabels[day]"
                >
                    {{
                        dayLabels[day]
                    }}
                </span>
            </div>

            <div
                v-else
                class="every-day"
            >
                Todos os dias
            </div>
        </section>

        <div
            v-if="statusMessage"
            class="status-message"
            :class="{
                completed: completedToday,
                failed: failedToday
            }"
        >
            ◉ {{ statusMessage }}
        </div>

        <section class="progress-card">
            <div class="progress-header">
                <span>
                    PROGRESSO
                </span>

                <strong>
                    {{
                        progressPeriod
                    }}
                </strong>
            </div>

            <div class="progress-value">
                <strong>
                    {{
                        progress.current
                    }}
                    /
                    {{
                        progress.goal
                    }}
                </strong>

                <span>
                    {{
                        progressDescription
                    }}
                </span>

                <b>
                    {{
                        progressPercentage
                    }}%
                </b>
            </div>

            <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{
                        width:
                            progressPercentage +
                            '%'
                    }"
                ></div>
            </div>
        </section>

        <section class="streak-grid">
            <div class="streak-card">
                <span class="streak-title">
                    SEQUÊNCIA ATUAL
                </span>

                <div class="streak-value">
                    <strong>
                        🔥
                        {{
                            habit.streak ||
                            0
                        }}
                    </strong>

                    <span>
                        {{
                            streakPeriod
                        }}
                    </span>
                </div>
            </div>

            <div class="streak-card">
                <span class="streak-title">
                    MELHOR SEQUÊNCIA
                </span>

                <div class="streak-value">
                    <strong>
                        🏆
                        {{
                            habit.bestStreak ||
                            0
                        }}
                    </strong>

                    <span>
                        {{
                            streakPeriod
                        }}
                    </span>
                </div>
            </div>
        </section>

        <section
            v-if="scheduledToday"
            class="actions"
        >
            <button
                type="button"
                class="complete-button"
                :disabled="!canComplete"
                @click="completeHabit"
            >
                ✓ CONCLUIR
            </button>

            <button
                type="button"
                class="fail-button"
                :disabled="!canFail"
                @click="failHabit"
            >
                ✕ FALHAR
            </button>
        </section>

        <div
            v-else
            class="not-scheduled"
        >
            NÃO PROGRAMADO HOJE
        </div>
    </article>
</template>

<style scoped>
.habit-card {
    padding: 18px;
    background: #151f30;
    border: 1px solid #604381;
    border-radius: 12px;
}

.habit-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
}

.habit-title-area {
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.habit-icon {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #241a3a;
    border: 1px solid #55406d;
    border-radius: 7px;
    font-size: 18px;
}

.habit-title-content {
    min-width: 0;
}

.title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 9px;
}

.title-row h3 {
    margin: 0;
    color: #f3f5fa;
    font-size: 16px;
    font-weight: 700;
}

.description {
    margin: 8px 0 0;
    color: #8794a8;
    font-size: 12px;
    line-height: 1.5;
}

.tag {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.8px;
}

.tag.difficulty {
    color: #65e7ba;
    border: 1px solid #2b9d7d;
}

.tag.difficulty.trivial {
    color: #94a3b8;
    border-color: #64748b;
}

.tag.difficulty.easy {
    color: #65e7ba;
    border-color: #2b9d7d;
}

.tag.difficulty.medium {
    color: #f4d06f;
    border-color: #a88435;
}

.tag.difficulty.hard {
    color: #ff8a8a;
    border-color: #a44655;
}

.tag.difficulty.legendary {
    color: #d69cff;
    border-color: #8d52bd;
}

.tag.frequency {
    color: #ce8cff;
    border: 1px solid #6b4089;
}

.remove-button {
    padding: 0;
    color: #73829a;
    background: transparent;
    border: 0;
    font-family: inherit;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
}

.remove-button:hover {
    color: #ff708c;
}

.schedule {
    margin-top: 16px;
    padding: 13px 15px;
    background: #101927;
    border: 1px solid #303d52;
    border-radius: 8px;
}

.schedule-header {
    display: flex;
    align-items: center;
}

.schedule-header span {
    color: #75849b;
    font-size: 9px;
    letter-spacing: 1.2px;
}

.schedule-days {
    margin-top: 11px;
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
}

.day-chip {
    min-width: 39px;
    padding: 6px 9px;
    color: #d7baff;
    background: rgba(
        134,
        69,
        195,
        0.12
    );
    border: 1px solid #65418a;
    border-radius: 999px;
    text-align: center;
    font-size: 10px;
    font-weight: 700;
}

.every-day {
    margin-top: 10px;
    color: #d7baff;
    font-size: 11px;
    font-weight: 600;
}

.status-message {
    margin-top: 16px;
    padding: 9px 13px;
    color: #8fa5c8;
    background: #101927;
    border: 1px solid #303d52;
    border-radius: 7px;
    font-size: 9px;
    letter-spacing: 1.1px;
}

.status-message.completed {
    color: #61d9af;
    border-color: rgba(
        74,
        194,
        151,
        0.4
    );
}

.status-message.failed {
    color: #ff8298;
    border-color: rgba(
        255,
        99,
        133,
        0.4
    );
}

.progress-card {
    margin-top: 16px;
    padding: 16px;
    background: #101927;
    border: 1px solid #303d52;
    border-radius: 8px;
}

.progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.progress-header span {
    color: #7990b2;
    font-size: 9px;
    letter-spacing: 1.2px;
}

.progress-header strong {
    color: #ce72ff;
    font-size: 10px;
    letter-spacing: 0.8px;
}

.progress-value {
    margin-top: 15px;
    display: flex;
    align-items: baseline;
    gap: 7px;
}

.progress-value > strong {
    color: #f4f6fb;
    font-size: 23px;
}

.progress-value span {
    color: #768ba8;
    font-size: 9px;
}

.progress-value b {
    margin-left: auto;
    color: #c76cff;
    font-size: 11px;
}

.progress-bar {
    height: 7px;
    margin-top: 14px;
    overflow: hidden;
    background: #090f18;
    border-radius: 999px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(
        90deg,
        #813ce8,
        #b052ed
    );
    border-radius: inherit;
    transition: width 0.25s ease;
}

.streak-grid {
    margin-top: 16px;
    display: grid;
    grid-template-columns:
        repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.streak-card {
    padding: 16px;
    background: #101927;
    border: 1px solid #303d52;
    border-radius: 8px;
}

.streak-title {
    color: #7288a8;
    font-size: 9px;
    letter-spacing: 1.2px;
}

.streak-value {
    margin-top: 14px;
    display: flex;
    align-items: baseline;
    gap: 7px;
}

.streak-value strong {
    color: #f3f5fa;
    font-size: 19px;
}

.streak-value span {
    color: #77899f;
    font-size: 10px;
}

.actions {
    margin-top: 18px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.actions button {
    min-height: 40px;
    border-radius: 7px;
    font-family: inherit;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.7px;
    cursor: pointer;
}

.complete-button {
    color: #66e1b5;
    background: rgba(
        48,
        177,
        133,
        0.1
    );
    border: 1px solid #2c896b;
}

.complete-button:hover:not(:disabled) {
    background: rgba(
        48,
        177,
        133,
        0.18
    );
}

.fail-button {
    color: #ff8298;
    background: rgba(
        209,
        72,
        101,
        0.08
    );
    border: 1px solid #7c3f51;
}

.fail-button:hover:not(:disabled) {
    background: rgba(
        209,
        72,
        101,
        0.16
    );
}

.actions button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.not-scheduled {
    margin-top: 18px;
    padding: 11px;
    color: #5e6b80;
    background: #101927;
    border: 1px solid #2f3a4c;
    border-radius: 7px;
    text-align: center;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.6px;
}

@media (max-width: 700px) {
    .habit-card {
        padding: 14px;
    }

    .habit-header {
        gap: 9px;
    }

    .title-row {
        gap: 6px;
    }

    .streak-grid {
        grid-template-columns: 1fr;
    }

    .actions {
        grid-template-columns: 1fr;
    }
}
</style>