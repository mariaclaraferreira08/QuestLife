<script setup>
import { computed } from "vue"

import HabitSchedule from "./HabitSchedule.vue"
import HabitStats from "./HabitStats.vue"

const props = defineProps({
    habit: {
        type: Object,
        required: true
    }
})

const emit = defineEmits([
    "complete",
    "fail",
    "remove",
    "restore-streak"
])

const difficultyNames = {
    trivial: "TRIVIAL",
    easy: "FÁCIL",
    medium: "MÉDIO",
    hard: "DIFÍCIL",
    legendary: "LENDÁRIO"
}

const difficultyName = computed(() => {
    return (
        difficultyNames[props.habit.difficulty] ||
        props.habit.difficulty ||
        "TRIVIAL"
    )
})

const alreadyCompletedToday = computed(() => {
    if (!props.habit.lastCompletedAt) {
        return false
    }

    const lastCompleted = new Date(
        props.habit.lastCompletedAt
    )

    const today = new Date()

    return (
        lastCompleted.getFullYear() ===
            today.getFullYear() &&
        lastCompleted.getMonth() ===
            today.getMonth() &&
        lastCompleted.getDate() ===
            today.getDate()
    )
})

const scheduledToday = computed(() => {
    if (
        !props.habit.frequency ||
        props.habit.frequency === "daily"
    ) {
        return true
    }

    const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ]

    const today = dayNames[
        new Date().getDay()
    ]

    return (
        props.habit.daysOfWeek || []
    ).includes(today)
})

const canComplete = computed(() => {
    return (
        scheduledToday.value &&
        !alreadyCompletedToday.value &&
        !props.habit.failed
    )
})

function completeHabit() {
    if (!canComplete.value) {
        return
    }

    emit("complete", props.habit.id)
}

function failHabit() {
    if (props.habit.failed) {
        return
    }

    emit("fail", props.habit.id)
}

function removeHabit() {
    const confirmed = window.confirm(
        `Excluir o hábito "${props.habit.title}"?`
    )

    if (!confirmed) {
        return
    }

    emit("remove", props.habit.id)
}

function restoreStreak() {
    emit(
        "restore-streak",
        props.habit.id
    )
}
</script>

<template>
    <article
        class="habit-card"
        :class="{
            failed: habit.failed
        }"
    >
        <!-- CABEÇALHO -->

        <header class="habit-header">
            <div class="habit-title-area">
                <div class="habit-icon">
                    🔥
                </div>

                <div>
                    <div class="title-row">
                        <h2>
                            {{ habit.title }}
                        </h2>

                        <span
                            class="difficulty"
                            :class="habit.difficulty"
                        >
                            {{ difficultyName }}
                        </span>
                    </div>

                    <p v-if="habit.description">
                        {{ habit.description }}
                    </p>
                </div>
            </div>

            <button
                type="button"
                class="delete-button"
                title="Excluir hábito"
                @click="removeHabit"
            >
                ×
            </button>
        </header>

        <!-- STATUS DE HOJE -->

        <div
            v-if="alreadyCompletedToday"
            class="habit-message completed-message"
        >
            ✓ HÁBITO CONCLUÍDO HOJE
        </div>

        <div
            v-else-if="habit.failed"
            class="habit-message failed-message"
        >
            ✕ SEQUÊNCIA INTERROMPIDA
        </div>

        <div
            v-else-if="!scheduledToday"
            class="habit-message rest-message"
        >
            ◷ ESTE HÁBITO NÃO ESTÁ PROGRAMADO
            PARA HOJE
        </div>

        <!-- CALENDÁRIO -->

        <HabitSchedule
            :habit="habit"
        />

        <!-- STREAK -->

        <HabitStats
            :habit="habit"
        />

        <!-- AÇÕES -->

        <footer class="habit-actions">
            <template v-if="habit.failed">
                <button
                    type="button"
                    class="restore-button"
                    @click="restoreStreak"
                >
                    🧪 RECUPERAR SEQUÊNCIA
                </button>
            </template>

            <template v-else>
                <button
                    type="button"
                    class="complete-button"
                    :disabled="!canComplete"
                    @click="completeHabit"
                >
                    <template
                        v-if="alreadyCompletedToday"
                    >
                        ✓ CONCLUÍDO HOJE
                    </template>

                    <template
                        v-else-if="!scheduledToday"
                    >
                        NÃO PROGRAMADO HOJE
                    </template>

                    <template v-else>
                        ✓ CONCLUIR HOJE
                    </template>
                </button>

                <button
                    type="button"
                    class="fail-button"
                    @click="failHabit"
                >
                    ✕ FALHEI
                </button>
            </template>
        </footer>
    </article>
</template>

<style scoped>
.habit-card {
    display: flex;
    flex-direction: column;

    gap: 16px;

    padding: 20px;

    color: #eef1f7;

    background: #151f30;

    border: 1px solid #354158;
    border-radius: 11px;

    transition: 0.2s;
}

.habit-card:hover {
    border-color: #604180;
}

.habit-card.failed {
    border-color: #74394b;
}

/* CABEÇALHO */

.habit-header {
    display: flex;

    align-items: flex-start;
    justify-content: space-between;

    gap: 20px;
}

.habit-title-area {
    display: flex;

    align-items: flex-start;

    gap: 13px;
}

.habit-icon {
    width: 38px;
    height: 38px;

    flex-shrink: 0;

    display: grid;
    place-items: center;

    background: #211b35;

    border: 1px solid #493269;
    border-radius: 8px;

    font-size: 18px;
}

.title-row {
    display: flex;

    align-items: center;
    flex-wrap: wrap;

    gap: 10px;
}

.title-row h2 {
    margin: 0;

    font-size: 17px;
}

.habit-title-area p {
    margin: 6px 0 0;

    color: #8794a8;

    font-size: 12px;
}

/* DIFICULDADE */

.difficulty {
    padding: 4px 8px;

    border: 1px solid;
    border-radius: 20px;

    font-size: 9px;
    letter-spacing: 1px;
}

.difficulty.trivial {
    color: #9ba7ba;
}

.difficulty.easy {
    color: #69d4a9;
}

.difficulty.medium {
    color: #e2c556;
}

.difficulty.hard {
    color: #ef796e;
}

.difficulty.legendary {
    color: #c27cff;
}

/* EXCLUIR */

.delete-button {
    width: 30px;
    height: 30px;

    flex-shrink: 0;

    color: #667389;

    background: transparent;

    border: 0;

    font-size: 21px;

    cursor: pointer;
}

.delete-button:hover {
    color: #ff617a;
}

/* MENSAGENS */

.habit-message {
    padding: 9px 12px;

    border-radius: 6px;

    font-size: 9px;
    letter-spacing: 1px;
}

.completed-message {
    color: #54d6ab;

    background:
        rgba(51, 184, 143, 0.08);

    border: 1px solid #276c5b;
}

.failed-message {
    color: #ef7889;

    background:
        rgba(199, 67, 90, 0.08);

    border: 1px solid #733848;
}

.rest-message {
    color: #8e9aad;

    background: #101927;

    border: 1px solid #2e3a4d;
}

/* AÇÕES */

.habit-actions {
    display: flex;

    gap: 10px;

    padding-top: 3px;
}

.complete-button,
.fail-button,
.restore-button {
    min-height: 40px;

    padding: 10px 16px;

    border-radius: 7px;

    font-family: inherit;

    font-size: 10px;
    font-weight: bold;

    cursor: pointer;

    transition: 0.2s;
}

.complete-button {
    flex: 1;

    color: #09291f;

    background: #45d3a4;

    border: 1px solid #5ce5b8;
}

.complete-button:hover:not(:disabled) {
    transform: translateY(-1px);
}

.complete-button:disabled {
    color: #637083;

    background: #111a28;

    border-color: #303b4d;

    cursor: not-allowed;

    opacity: 0.7;
}

.fail-button {
    color: #e88190;

    background: #1d1721;

    border: 1px solid #713847;
}

.fail-button:hover {
    background: #291920;
}

.restore-button {
    width: 100%;

    color: white;

    background:
        linear-gradient(
            90deg,
            #6827b8,
            #9d2ce1
        );

    border: 1px solid #a75ce9;
}

.restore-button:hover {
    box-shadow:
        0 0 14px
        rgba(157, 44, 225, 0.2);
}

@media (max-width: 600px) {
    .habit-header {
        gap: 10px;
    }

    .habit-actions {
        flex-direction: column;
    }

    .fail-button {
        width: 100%;
    }
}
</style>