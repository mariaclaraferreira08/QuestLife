<script setup>
import { computed } from "vue"

import dailyService from "../../services/dailyService"

const props = defineProps({
    daily: {
        type: Object,
        required: true
    }
})

const emit = defineEmits([
    "complete",
    "remove"
])

const difficultyNames = {
    trivial: "TRIVIAL",
    easy: "FÁCIL",
    medium: "MÉDIO",
    hard: "DIFÍCIL",
    legendary: "LENDÁRIO"
}

const scheduledToday = computed(() => {
    return dailyService.isScheduledToday(
        props.daily
    )
})

const completedToday = computed(() => {
    return dailyService.isCompletedToday(
        props.daily
    )
})

const difficultyName = computed(() => {
    return (
        difficultyNames[
            props.daily.difficulty
        ] || "TRIVIAL"
    )
})

function removeDaily() {
    const confirmed =
        window.confirm(
            `Excluir a diária "${props.daily.title}"?`
        )

    if (!confirmed) {
        return
    }

    emit(
        "remove",
        props.daily.id
    )
}
</script>

<template>
    <article
        class="daily-card"
        :class="{
            completed:
                completedToday
        }"
    >
        <button
            type="button"
            class="check"
            :disabled="
                !scheduledToday ||
                completedToday
            "
            @click="
                emit(
                    'complete',
                    daily.id
                )
            "
        >
            {{
                completedToday
                    ? "✓"
                    : ""
            }}
        </button>

        <div class="daily-content">
            <div class="title-row">
                <h2>
                    {{ daily.title }}
                </h2>

                <span
                    class="difficulty"
                    :class="
                        daily.difficulty
                    "
                >
                    {{ difficultyName }}
                </span>
            </div>

            <p
                v-if="
                    daily.description
                "
            >
                {{ daily.description }}
            </p>

            <div class="stats">
                <span>
                    🔥
                    {{ daily.streak || 0 }}
                    dias
                </span>

                <span>
                    🏆
                    {{
                        daily.bestStreak ||
                        0
                    }}
                </span>

                <span
                    v-if="
                        !scheduledToday
                    "
                >
                    ◷ Não programada hoje
                </span>

                <span
                    v-else-if="
                        completedToday
                    "
                    class="done"
                >
                    ✓ Concluída hoje
                </span>
            </div>
        </div>

        <button
            type="button"
            class="delete"
            @click="removeDaily"
        >
            ×
        </button>
    </article>
</template>

<style scoped>
.daily-card {
    display: grid;

    grid-template-columns:
        auto 1fr auto;

    align-items: center;

    gap: 15px;

    padding: 18px;

    color: #eef1f7;

    background: #151f30;

    border: 1px solid #354158;
    border-radius: 11px;
}

.daily-card.completed {
    border-color: #347e69;
}

.check {
    width: 45px;
    height: 45px;

    color: #09291f;

    background: #49d2a7;

    border: 1px solid #62e6bd;
    border-radius: 8px;

    font-size: 20px;

    cursor: pointer;
}

.check:disabled {
    color: #758196;

    background: #101927;

    border-color: #354158;

    cursor: not-allowed;
}

.daily-content {
    min-width: 0;
}

.title-row {
    display: flex;

    align-items: center;
    flex-wrap: wrap;

    gap: 10px;
}

.title-row h2 {
    margin: 0;

    font-size: 16px;
}

.daily-content p {
    margin: 7px 0;

    color: #8592a6;

    font-size: 11px;
}

.difficulty {
    padding: 4px 8px;

    border: 1px solid;
    border-radius: 20px;

    font-size: 9px;
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

.stats {
    display: flex;

    flex-wrap: wrap;

    gap: 14px;

    color: #78869a;

    font-size: 10px;
}

.stats .done {
    color: #55d6ac;
}

.delete {
    color: #667389;

    background: transparent;

    border: 0;

    font-size: 21px;

    cursor: pointer;
}

.delete:hover {
    color: #ff617a;
}

@media (max-width: 600px) {
    .daily-card {
        grid-template-columns:
            auto 1fr;
    }

    .delete {
        grid-column: 2;

        justify-self: end;
    }
}
</style>