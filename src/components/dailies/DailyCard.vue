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
    "fail",
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

function completeDaily() {
    if (
        !scheduledToday.value ||
        completedToday.value
    ) {
        return
    }

    emit(
        "complete",
        props.daily.id
    )
}

function failDaily() {
    if (
        !scheduledToday.value ||
        completedToday.value
    ) {
        return
    }

    const confirmed =
        window.confirm(
            `Marcar a diária "${props.daily.title}" como não cumprida hoje?`
        )

    if (!confirmed) {
        return
    }

    emit(
        "fail",
        props.daily.id
    )
}

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
            completed: completedToday
        }"
    >
        <button
            type="button"
            class="check"
            :disabled="
                !scheduledToday ||
                completedToday
            "
            title="Concluir diária"
            @click="completeDaily"
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
                    {{
                        (daily.streak || 0) === 1
                            ? "dia"
                            : "dias"
                    }}
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

        <div class="daily-actions">
            <button
                v-if="
                    scheduledToday &&
                    !completedToday
                "
                type="button"
                class="fail"
                title="Marcar como não cumprida"
                @click="failDaily"
            >
                ✕ FALHEI
            </button>

            <button
                type="button"
                class="delete"
                title="Excluir diária"
                @click="removeDaily"
            >
                ×
            </button>
        </div>
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

    transition: 0.2s;
}

.daily-card:hover {
    border-color: #604180;
}

.daily-card.completed {
    border-color: #347e69;
}

.check {
    width: 45px;
    height: 45px;

    flex-shrink: 0;

    color: #09291f;

    background: #49d2a7;

    border: 1px solid #62e6bd;
    border-radius: 8px;

    font-family: inherit;
    font-size: 20px;

    cursor: pointer;

    transition: 0.2s;
}

.check:hover:not(:disabled) {
    transform: translateY(-1px);

    box-shadow:
        0 0 12px
        rgba(73, 210, 167, 0.2);
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

    text-transform: uppercase;
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

.daily-actions {
    display: flex;

    align-items: center;

    gap: 10px;
}

.fail {
    padding: 8px 11px;

    color: #ff7187;

    background:
        rgba(
            160,
            53,
            76,
            0.1
        );

    border: 1px solid #7f3b4d;
    border-radius: 6px;

    font-family: inherit;
    font-size: 9px;
    font-weight: bold;

    cursor: pointer;

    transition: 0.2s;
}

.fail:hover {
    background:
        rgba(
            160,
            53,
            76,
            0.2
        );

    border-color: #a94c62;
}

.delete {
    width: 30px;
    height: 30px;

    color: #667389;

    background: transparent;

    border: 0;

    font-family: inherit;
    font-size: 21px;

    cursor: pointer;
}

.delete:hover {
    color: #ff617a;
}

@media (max-width: 700px) {
    .daily-card {
        grid-template-columns:
            auto 1fr;
    }

    .daily-actions {
        grid-column:
            1 / -1;

        justify-content:
            flex-end;
    }
}
</style>