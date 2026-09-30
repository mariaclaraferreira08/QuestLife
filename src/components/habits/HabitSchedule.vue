<script setup>
import { computed } from "vue"

import habitService from "../../services/habitService"

const props = defineProps({
    habit: {
        type: Object,
        required: true
    }
})

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

const frequency = computed(() => {
    return props.habit.frequency || "daily"
})

const progress = computed(() => {
    if (frequency.value === "weekly") {
        return {
            current:
                habitService.getWeekCompletions(
                    props.habit
                ),

            goal:
                props.habit.weeklyGoal || 1
        }
    }

    if (frequency.value === "monthly") {
        return {
            current:
                habitService.getMonthCompletions(
                    props.habit
                ),

            goal:
                props.habit.monthlyGoal || 1
        }
    }

    return {
        current: 0,
        goal: 0
    }
})

const progressPercentage =
    computed(() => {
        if (!progress.value.goal) {
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

function activeDailyDay(dayId) {
    /*
     * Nenhum dia escolhido significa
     * hábito diário todos os dias.
     */
    if (
        !props.habit.daysOfWeek ||
        props.habit.daysOfWeek.length === 0
    ) {
        return true
    }

    return props.habit.daysOfWeek.includes(
        dayId
    )
}
</script>

<template>
    <section class="schedule">

        <!-- DIÁRIO -->

        <template
            v-if="frequency === 'daily'"
        >
            <div class="schedule-header">
                <span>PROGRAMAÇÃO</span>

                <strong>
                    DIÁRIO
                </strong>
            </div>

            <div class="week">
                <div
                    v-for="day in weekDays"
                    :key="day.id"
                    class="day"
                    :class="{
                        active:
                            activeDailyDay(
                                day.id
                            )
                    }"
                >
                    {{ day.short }}
                </div>
            </div>
        </template>

        <!-- SEMANAL / MENSAL -->

        <template v-else>
            <div class="schedule-header">
                <span>
                    PROGRESSO
                </span>

                <strong>
                    {{
                        frequency ===
                        "weekly"
                            ? "ESTA SEMANA"
                            : "ESTE MÊS"
                    }}
                </strong>
            </div>

            <div class="goal-progress">
                <div class="progress-numbers">
                    <strong>
                        {{ progress.current }}
                        /
                        {{ progress.goal }}
                    </strong>

                    <span>
                        {{
                            frequency ===
                            "weekly"
                                ? "conclusões semanais"
                                : "conclusões mensais"
                        }}
                    </span>
                </div>

                <span class="percentage">
                    {{ progressPercentage }}%
                </span>
            </div>

            <div class="progress-track">
                <div
                    class="progress-fill"
                    :style="{
                        width:
                            progressPercentage +
                            '%'
                    }"
                ></div>
            </div>

            <div
                v-if="
                    progress.current >=
                    progress.goal
                "
                class="goal-completed"
            >
                ✓ META DO PERÍODO CONCLUÍDA
            </div>
        </template>

    </section>
</template>

<style scoped>
.schedule {
    padding: 15px;

    background: #101927;

    border: 1px solid #2e3a4d;
    border-radius: 9px;
}

.schedule-header {
    display: flex;

    justify-content: space-between;

    gap: 15px;

    color: #758398;

    font-size: 10px;
    letter-spacing: 1px;
}

.schedule-header strong {
    color: #a978dc;
}

/* DIÁRIO */

.week {
    display: grid;

    grid-template-columns:
        repeat(7, 1fr);

    gap: 7px;

    margin-top: 13px;
}

.day {
    padding: 9px 4px;

    text-align: center;

    color: #526075;

    background: #0b1320;

    border: 1px solid #253145;
    border-radius: 6px;

    font-size: 10px;
}

.day.active {
    color: #e8d5ff;

    background:
        rgba(
            125,
            49,
            190,
            0.25
        );

    border-color: #7940a9;
}

/* META */

.goal-progress {
    margin-top: 15px;

    display: flex;

    align-items: flex-end;
    justify-content: space-between;

    gap: 20px;
}

.progress-numbers {
    display: flex;

    align-items: baseline;

    gap: 8px;
}

.progress-numbers strong {
    color: #eef1f7;

    font-size: 22px;
}

.progress-numbers span {
    color: #758398;

    font-size: 10px;
}

.percentage {
    color: #b87df2;

    font-size: 11px;
}

.progress-track {
    height: 7px;

    margin-top: 10px;

    overflow: hidden;

    background: #080f19;

    border-radius: 20px;
}

.progress-fill {
    height: 100%;

    background:
        linear-gradient(
            90deg,
            #7b32d1,
            #c35cf1
        );

    border-radius: inherit;

    transition: width 0.3s;
}

.goal-completed {
    margin-top: 11px;

    color: #4bd6a7;

    font-size: 9px;
    letter-spacing: 1px;
}

@media (max-width: 650px) {
    .week {
        grid-template-columns:
            repeat(4, 1fr);
    }

    .goal-progress {
        align-items: flex-start;

        flex-direction: column;
    }
}
</style>