<script setup>
import { ref, onMounted } from "vue"

import HabitForm from "../components/habits/HabitForm.vue"
import HabitCard from "../components/habits/HabitCard.vue"

import habitService from "../services/habitService"
import gameService from "../services/gameService"

const habits = ref([])
const showForm = ref(false)

const feedback = ref({
    show: false,
    type: "info",
    title: "",
    message: ""
})

/*
 * =========================
 * FEEDBACK
 * =========================
 */

function showFeedback(
    type,
    title,
    message
) {
    feedback.value = {
        show: true,
        type,
        title,
        message
    }
}

function closeFeedback() {
    feedback.value.show = false
}

/*
 * =========================
 * ATUALIZAR HÁBITOS
 * =========================
 */

function refreshHabits() {
    habits.value = [
        ...habitService.getHabits()
    ]
}

/*
 * =========================
 * CRIAR HÁBITO
 * =========================
 */

function createHabit(habitData) {
    habitService.addHabit(
        habitData
    )

    showForm.value = false

    refreshHabits()

    showFeedback(
        "success",
        "Novo hábito criado",
        "Sua nova rotina foi adicionada."
    )
}

/*
 * =========================
 * CONCLUIR HÁBITO
 * =========================
 */

function completeHabit(habitId) {
    const result =
        gameService.completeHabitById(
            habitId
        )

    if (!result?.success) {
        if (
            result?.reason ===
            "already-completed-today"
        ) {
            showFeedback(
                "warning",
                "Hábito já concluído",
                "Você já concluiu este hábito hoje."
            )

            return
        }

        if (
            result?.reason ===
            "not-scheduled-today"
        ) {
            showFeedback(
                "warning",
                "Fora da programação",
                "Este hábito não está programado para hoje."
            )

            return
        }

        if (
            result?.reason ===
            "goal-completed"
        ) {
            showFeedback(
                "warning",
                "Meta já alcançada",
                "Você já atingiu a meta deste período."
            )

            return
        }

        showFeedback(
            "error",
            "Não foi possível concluir",
            "Ocorreu um problema ao concluir este hábito."
        )

        return
    }

    refreshHabits()

    showFeedback(
        "success",
        "Hábito concluído!",
        "Você recebeu XP e moedas e avançou sua sequência."
    )
}

/*
 * =========================
 * FALHAR HÁBITO
 * =========================
 */

function failHabit(habitId) {
    const result =
        gameService.failHabitById(
            habitId
        )

    if (!result?.success) {
        if (
            result?.reason ===
            "manual-failure-not-allowed"
        ) {
            showFeedback(
                "warning",
                "Falha manual indisponível",
                "Hábitos semanais e mensais não podem ser marcados manualmente como falhos."
            )

            return
        }

        if (
            result?.reason ===
            "habit-already-failed"
        ) {
            showFeedback(
                "warning",
                "Falha já registrada",
                "Este hábito já foi marcado como falho."
            )

            return
        }

        if (
            result?.reason ===
            "not-scheduled-today"
        ) {
            showFeedback(
                "warning",
                "Fora da programação",
                "Este hábito não está programado para hoje."
            )

            return
        }

        showFeedback(
            "error",
            "Não foi possível registrar",
            "Ocorreu um problema ao registrar a falha deste hábito."
        )

        return
    }

    refreshHabits()

    const damage =
        result.damage

    if (damage?.protected) {
        showFeedback(
            "special",
            "Amuleto de Proteção ativado!",
            `O dano foi reduzido de ${damage.originalDamage} para ${damage.damageTaken} HP.`
        )

        return
    }

    showFeedback(
        "error",
        "Hábito marcado como falho",
        "Você sofreu a penalidade de HP e moedas."
    )
}

/*
 * =========================
 * REMOVER HÁBITO
 * =========================
 */

function removeHabit(habitId) {
    habitService.removeHabit(
        habitId
    )

    refreshHabits()

    showFeedback(
        "info",
        "Hábito removido",
        "O hábito foi removido da sua rotina."
    )
}

/*
 * =========================
 * RECUPERAÇÃO DE SEQUÊNCIA
 * =========================
 */

function restoreStreak() {
    showFeedback(
        "info",
        "Recuperação de sequência",
        "O Elixir da Persistência atualmente protege sequências de Diárias."
    )
}

/*
 * =========================
 * INICIALIZAÇÃO
 * =========================
 */

onMounted(() => {
    refreshHabits()
})
</script>

<template>
    <section class="habits-page">
        <header class="page-header">
            <div>
                <span>
                    DAILY ROUTINES
                </span>

                <h1>
                    Hábitos
                </h1>

                <p>
                    Construa sequências e fortaleça
                    seu personagem todos os dias.
                </p>
            </div>

            <button
                v-if="!showForm"
                type="button"
                class="new-habit-button"
                @click="showForm = true"
            >
                + NOVO HÁBITO
            </button>
        </header>

        <div
            v-if="feedback.show"
            class="feedback"
            :class="feedback.type"
        >
            <div class="feedback-icon">
                <span
                    v-if="
                        feedback.type ===
                        'success'
                    "
                >
                    ✓
                </span>

                <span
                    v-else-if="
                        feedback.type ===
                        'warning'
                    "
                >
                    !
                </span>

                <span
                    v-else-if="
                        feedback.type ===
                        'error'
                    "
                >
                    ×
                </span>

                <span
                    v-else-if="
                        feedback.type ===
                        'special'
                    "
                >
                    ✦
                </span>

                <span v-else>
                    i
                </span>
            </div>

            <div class="feedback-content">
                <strong>
                    {{ feedback.title }}
                </strong>

                <p>
                    {{ feedback.message }}
                </p>
            </div>

            <button
                type="button"
                class="feedback-close"
                @click="closeFeedback"
            >
                ×
            </button>
        </div>

        <HabitForm
            v-if="showForm"
            @create="createHabit"
            @cancel="showForm = false"
        />

        <section
            v-else-if="habits.length === 0"
            class="empty-state"
        >
            <span class="empty-icon">
                🔥
            </span>

            <h2>
                Nenhum hábito criado
            </h2>

            <p>
                Comece uma rotina e construa
                sua primeira sequência.
            </p>

            <button
                type="button"
                class="create-first-button"
                @click="showForm = true"
            >
                CRIAR PRIMEIRO HÁBITO
            </button>
        </section>

        <section
            v-else
            class="habit-list"
        >
            <HabitCard
                v-for="habit in habits"
                :key="habit.id"
                :habit="habit"
                @complete="completeHabit"
                @fail="failHabit"
                @remove="removeHabit"
                @restore-streak="restoreStreak"
            />
        </section>
    </section>
</template>

<style scoped>
.habits-page {
    width: 100%;
    max-width: 1050px;
    margin: 0 auto;
    color: #eef1f7;
}

/* =========================
   CABEÇALHO
   ========================= */

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 24px;
    padding-bottom: 22px;
    border-bottom: 1px solid #29364a;
}

.page-header > div > span {
    color: #ad6df1;
    font-size: 11px;
    letter-spacing: 2px;
}

.page-header h1 {
    margin: 5px 0 7px;
    font-size: 27px;
}

.page-header p {
    margin: 0;
    color: #8793a7;
    font-size: 13px;
}

/* =========================
   BOTÕES
   ========================= */

.new-habit-button,
.create-first-button {
    padding: 12px 18px;

    color: white;

    background:
        linear-gradient(
            90deg,
            #7227dc,
            #a928ef
        );

    border: 1px solid #aa5cf2;
    border-radius: 7px;

    font-family: inherit;
    font-size: 11px;
    font-weight: bold;

    cursor: pointer;

    transition: 0.2s;
}

.new-habit-button:hover,
.create-first-button:hover {
    transform: translateY(-1px);

    box-shadow:
        0 0 15px
        rgba(
            169,
            40,
            239,
            0.2
        );
}

/* =========================
   FEEDBACK
   ========================= */

.feedback {
    margin-bottom: 24px;
    padding: 14px 16px;

    display: grid;
    grid-template-columns:
        36px
        minmax(0, 1fr)
        auto;

    align-items: center;
    gap: 12px;

    background: #151f30;

    border: 1px solid #354158;
    border-radius: 10px;
}

.feedback-icon {
    width: 34px;
    height: 34px;

    display: grid;
    place-items: center;

    border-radius: 8px;

    font-size: 16px;
    font-weight: 800;
}

.feedback-content {
    min-width: 0;
}

.feedback-content strong {
    display: block;
    margin-bottom: 3px;

    color: #f2f5fb;

    font-size: 11px;
}

.feedback-content p {
    margin: 0;

    color: #929fb2;

    font-size: 10px;
    line-height: 1.5;
}

.feedback-close {
    padding: 4px;

    color: #768398;
    background: transparent;

    border: 0;

    font-size: 18px;

    cursor: pointer;
}

.feedback.success {
    border-color: #347e69;
}

.feedback.success .feedback-icon {
    color: #68e2b8;

    background:
        rgba(
            48,
            163,
            123,
            0.14
        );
}

.feedback.warning {
    border-color: #826a34;
}

.feedback.warning .feedback-icon {
    color: #f3c55b;

    background:
        rgba(
            206,
            158,
            54,
            0.13
        );
}

.feedback.error {
    border-color: #834456;
}

.feedback.error .feedback-icon {
    color: #ff7896;

    background:
        rgba(
            206,
            67,
            94,
            0.13
        );
}

.feedback.special {
    border-color: #75439f;

    background:
        linear-gradient(
            90deg,
            rgba(117, 67, 159, 0.13),
            #151f30 35%
        );
}

.feedback.special .feedback-icon {
    color: #ca82ff;

    background:
        rgba(
            160,
            73,
            222,
            0.14
        );

    box-shadow:
        0 0 14px
        rgba(
            165,
            73,
            226,
            0.13
        );
}

.feedback.info {
    border-color: #3f5674;
}

.feedback.info .feedback-icon {
    color: #8eb8ee;

    background:
        rgba(
            73,
            119,
            178,
            0.13
        );
}

/* =========================
   ESTADO VAZIO
   ========================= */

.empty-state {
    min-height: 400px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    text-align: center;

    background: #121c2d;

    border: 1px dashed #3b4960;
    border-radius: 12px;
}

.empty-icon {
    font-size: 42px;
}

.empty-state h2 {
    margin: 18px 0 7px;
}

.empty-state p {
    margin: 0 0 22px;
    color: #7e8a9e;
}

/* =========================
   LISTA
   ========================= */

.habit-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* =========================
   RESPONSIVO
   ========================= */

@media (max-width: 700px) {
    .page-header {
        align-items: stretch;
        flex-direction: column;
    }

    .new-habit-button {
        width: 100%;
    }

    .feedback {
        grid-template-columns:
            34px
            minmax(0, 1fr)
            auto;
    }
}
</style>