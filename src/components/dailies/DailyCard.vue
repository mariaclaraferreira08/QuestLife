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

const failedToday = computed(() => {
    return dailyService.isFailedToday(
        props.daily
    )
})

const finishedToday = computed(() => {
    return (
        completedToday.value ||
        failedToday.value
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
        finishedToday.value
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
        finishedToday.value
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
            completed: completedToday,
            failed: failedToday
        }"
    >
        <!-- CONCLUIR -->

        <button
            type="button"
            class="check"
            :class="{
                checked: completedToday
            }"
            :disabled="
                !scheduledToday ||
                finishedToday
            "
            title="Concluir diária"
            @click="completeDaily"
        >
            <span v-if="completedToday">
                ✓
            </span>
        </button>

        <!-- CONTEÚDO -->

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
                class="description"
            >
                {{ daily.description }}
            </p>

            <!-- ESTATÍSTICAS -->

            <div class="stats">
                <span
                    class="stat-item"
                    title="Sequência atual"
                >
                    🔥

                    {{ daily.streak || 0 }}

                    {{
                        (daily.streak || 0) === 1
                            ? "dia"
                            : "dias"
                    }}
                </span>

                <span
                    class="stat-item"
                    title="Melhor sequência"
                >
                    🏆

                    {{
                        daily.bestStreak ||
                        0
                    }}
                </span>

                <!-- NÃO PROGRAMADA -->

                <span
                    v-if="
                        !scheduledToday
                    "
                    class="not-scheduled"
                >
                    ◷ Não programada hoje
                </span>

                <!-- CONCLUÍDA -->

                <span
                    v-else-if="
                        completedToday
                    "
                    class="done"
                >
                    ✓ Concluída hoje
                </span>

                <!-- FALHOU -->

                <span
                    v-else-if="
                        failedToday
                    "
                    class="failed-status"
                >
                    ✕ Não cumprida hoje
                </span>

                <!-- PENDENTE -->

                <span
                    v-else
                    class="pending"
                >
                    ◦ Pendente hoje
                </span>
            </div>
        </div>

        <!-- AÇÕES -->

        <div class="daily-actions">
            <button
                v-if="
                    scheduledToday &&
                    !finishedToday
                "
                type="button"
                class="fail-button"
                title="Marcar como não cumprida"
                @click="failDaily"
            >
                ✕ FALHEI
            </button>

            <button
                type="button"
                class="delete-button"
                title="Excluir diária"
                @click="removeDaily"
            >
                ×
            </button>
        </div>
    </article>
</template>

<style scoped>
/*
 * =========================
 * CARD
 * =========================
 */

.daily-card {
    display: grid;

    grid-template-columns:
        auto 1fr auto;

    align-items: center;

    gap: 18px;

    padding: 20px;

    color: #eef1f7;

    background: #151f30;

    border:
        1px solid
        #354158;

    border-radius: 14px;

    transition:
        border-color 0.2s ease,
        background 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.daily-card:hover {
    border-color: #604180;

    transform:
        translateY(-1px);

    box-shadow:
        0 6px 18px
        rgba(0, 0, 0, 0.08);
}


/*
 * =========================
 * CARD CONCLUÍDO
 * =========================
 */

.daily-card.completed {
    border-color: #347e69;

    background:
        linear-gradient(
            90deg,
            rgba(
                73,
                210,
                167,
                0.05
            ),
            #151f30 25%
        );
}


/*
 * =========================
 * CARD COM FALHA
 * =========================
 */

.daily-card.failed {
    border-color: #7f3b4d;

    background:
        linear-gradient(
            90deg,
            rgba(
                255,
                97,
                122,
                0.04
            ),
            #151f30 25%
        );
}


/*
 * =========================
 * CHECK
 * =========================
 */

.check {
    width: 38px;
    height: 38px;

    display: flex;

    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    color: #071d17;

    background: transparent;

    border:
        2px solid
        #536177;

    border-radius: 50%;

    font-family:
        "Nunito",
        sans-serif;

    font-size: 20px;
    font-weight: 900;

    cursor: pointer;

    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.check:hover:not(:disabled) {
    border-color: #49d2a7;

    transform:
        scale(1.06);

    box-shadow:
        0 0 0 4px
        rgba(
            73,
            210,
            167,
            0.08
        );
}


/*
 * CHECK CONCLUÍDO
 */

.daily-card.completed
.check {
    color: #08271e;

    background: #49d2a7;

    border-color: #62e6bd;

    box-shadow:
        0 0 14px
        rgba(
            73,
            210,
            167,
            0.15
        );
}


/*
 * CHECK QUANDO FALHOU
 */

.daily-card.failed
.check {
    background:
        rgba(
            255,
            97,
            122,
            0.06
        );

    border-color: #7f3b4d;
}


/*
 * DESABILITADO
 */

.check:disabled {
    cursor: default;
}


/*
 * =========================
 * CONTEÚDO
 * =========================
 */

.daily-content {
    min-width: 0;
}


/*
 * =========================
 * TÍTULO
 * =========================
 */

.title-row {
    display: flex;

    align-items: center;
    flex-wrap: wrap;

    gap: 10px;
}

.title-row h2 {
    margin: 0;

    color: #f4f6fb;

    font-family:
        "Fredoka",
        "Nunito",
        sans-serif;

    font-size: 1.15rem;

    font-weight: 600;

    line-height: 1.3;
}


/*
 * =========================
 * DESCRIÇÃO
 * =========================
 */

.description {
    margin:
        8px 0 10px;

    color: #929eb0;

    font-size: 0.9rem;

    line-height: 1.5;
}


/*
 * =========================
 * DIFICULDADE
 * =========================
 */

.difficulty {
    padding:
        4px 9px;

    border:
        1px solid;

    border-radius: 20px;

    font-size: 0.68rem;

    font-weight: 800;

    letter-spacing:
        0.7px;

    text-transform:
        uppercase;
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


/*
 * =========================
 * ESTATÍSTICAS
 * =========================
 */

.stats {
    display: flex;

    align-items: center;
    flex-wrap: wrap;

    gap: 16px;

    margin-top: 8px;

    color: #8c99ad;

    font-size: 0.78rem;

    font-weight: 600;
}

.stat-item {
    display: inline-flex;

    align-items: center;

    gap: 4px;
}


/*
 * =========================
 * STATUS
 * =========================
 */

.done {
    color: #55d6ac;

    font-weight: 800;
}

.failed-status {
    color: #ff7187;

    font-weight: 800;
}

.pending {
    color: #e2c556;

    font-weight: 700;
}

.not-scheduled {
    color: #7f8ca1;
}


/*
 * =========================
 * AÇÕES
 * =========================
 */

.daily-actions {
    display: flex;

    align-items: center;

    gap: 10px;
}


/*
 * =========================
 * FALHAR
 * =========================
 */

.fail-button {
    padding:
        9px 12px;

    color: #ff7187;

    background:
        rgba(
            160,
            53,
            76,
            0.1
        );

    border:
        1px solid
        #7f3b4d;

    border-radius: 7px;

    font-family:
        "Nunito",
        sans-serif;

    font-size: 0.72rem;

    font-weight: 800;

    cursor: pointer;

    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;
}

.fail-button:hover {
    background:
        rgba(
            160,
            53,
            76,
            0.2
        );

    border-color: #a94c62;

    transform:
        translateY(-1px);
}


/*
 * =========================
 * EXCLUIR
 * =========================
 */

.delete-button {
    width: 34px;
    height: 34px;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #718096;

    background:
        transparent;

    border: 0;

    border-radius: 50%;

    font-family:
        "Nunito",
        sans-serif;

    font-size: 21px;

    cursor: pointer;

    transition:
        color 0.2s ease,
        background 0.2s ease;
}

.delete-button:hover {
    color: #ff617a;

    background:
        rgba(
            255,
            97,
            122,
            0.08
        );
}


/*
 * =========================
 * RESPONSIVO
 * =========================
 */

@media (
    max-width: 700px
) {
    .daily-card {
        grid-template-columns:
            auto 1fr;

        padding: 16px;
    }

    .daily-actions {
        grid-column:
            1 / -1;

        justify-content:
            flex-end;

        padding-top: 5px;
    }
}

@media (
    max-width: 480px
) {
    .title-row h2 {
        font-size: 1rem;
    }

    .stats {
        gap: 10px;

        font-size: 0.72rem;
    }

    .check {
        width: 34px;
        height: 34px;

        font-size: 18px;
    }
}
</style>
