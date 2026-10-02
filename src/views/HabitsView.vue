<script setup>
import { ref, onMounted } from "vue"

import HabitForm from "../components/habits/HabitForm.vue"
import HabitCard from "../components/habits/HabitCard.vue"

import habitService from "../services/habitService"
import gameService from "../services/gameService"

const habits = ref([])
const showForm = ref(false)

/*
 * Recarrega os hábitos do localStorage
 * para atualizar os cards na interface.
 */
function refreshHabits() {
    habits.value = [
        ...habitService.getHabits()
    ]
}

/*
 * Criação de hábito.
 */
function createHabit(habitData) {
    habitService.addHabit(habitData)

    showForm.value = false

    refreshHabits()
}

/*
 * CONCLUIR HÁBITO
 *
 * Agora usamos gameService em vez de chamar
 * habitService diretamente.
 *
 * O gameService:
 * 1. conclui o hábito;
 * 2. concede XP;
 * 3. concede moedas;
 * 4. atualiza a sidebar.
 */
function completeHabit(habitId) {
    const result =
        gameService.completeHabitById(
            habitId
        )

    if (!result.success) {
        if (
            result.reason ===
            "already-completed-today"
        ) {
            alert(
                "Você já concluiu este hábito hoje."
            )

            return
        }

        if (
            result.reason ===
            "not-scheduled-today"
        ) {
            alert(
                "Este hábito não está programado para hoje."
            )

            return
        }

        if (
            result.reason ===
            "goal-completed"
        ) {
            alert(
                "Você já atingiu a meta deste período."
            )

            return
        }

        console.warn(
            "Não foi possível concluir o hábito:",
            result.reason
        )

        return
    }

    refreshHabits()
}

/*
 * FALHAR HÁBITO
 *
 * Atualmente apenas hábitos diários
 * permitem falha manual.
 *
 * A dificuldade determina o dano
 * causado ao jogador.
 */
function failHabit(habitId) {
    const result =
        gameService.failHabitById(
            habitId
        )

    if (!result.success) {
        if (
            result.reason ===
            "manual-failure-not-allowed"
        ) {
            alert(
                "Hábitos semanais e mensais não podem ser marcados manualmente como falhos."
            )

            return
        }

        if (
            result.reason ===
            "habit-already-failed"
        ) {
            alert(
                "Este hábito já foi marcado como falho."
            )

            return
        }

        console.warn(
            "Não foi possível registrar a falha:",
            result.reason
        )

        return
    }

    refreshHabits()
}

/*
 * Excluir hábito.
 */
function removeHabit(habitId) {
    habitService.removeHabit(
        habitId
    )

    refreshHabits()
}

/*
 * RECUPERAÇÃO DE SEQUÊNCIA
 *
 * Ainda não vamos implementar a poção aqui.
 * Essa função fica preparada para a Loja,
 * que será nosso próximo módulo.
 */
function restoreStreak(habitId) {
    console.log(
        "Recuperar sequência:",
        habitId
    )

    alert(
        "A recuperação de sequência será feita através da Loja."
    )
}

onMounted(() => {
    refreshHabits()
})
</script>

<template>
    <section class="habits-page">
        <!-- CABEÇALHO -->

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

        <!-- FORMULÁRIO -->

        <HabitForm
            v-if="showForm"
            @create="createHabit"
            @cancel="showForm = false"
        />

        <!-- ESTADO VAZIO -->

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

        <!-- LISTA -->

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

/* CABEÇALHO */

.page-header {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 30px;

    margin-bottom: 30px;
    padding-bottom: 22px;

    border-bottom:
        1px solid #29364a;
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

/* BOTÕES */

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

    border:
        1px solid #aa5cf2;

    border-radius: 7px;

    font-family: inherit;

    font-size: 11px;
    font-weight: bold;

    cursor: pointer;

    transition: 0.2s;
}

.new-habit-button:hover,
.create-first-button:hover {
    transform:
        translateY(-1px);

    box-shadow:
        0 0 15px
        rgba(
            169,
            40,
            239,
            0.2
        );
}

/* ESTADO VAZIO */

.empty-state {
    min-height: 400px;

    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    text-align: center;

    background: #121c2d;

    border:
        1px dashed #3b4960;

    border-radius: 12px;
}

.empty-icon {
    font-size: 42px;
}

.empty-state h2 {
    margin:
        18px 0 7px;
}

.empty-state p {
    margin:
        0 0 22px;

    color: #7e8a9e;
}

/* LISTA */

.habit-list {
    display: flex;

    flex-direction: column;

    gap: 15px;
}

/* RESPONSIVO */

@media (max-width: 700px) {
    .page-header {
        align-items: stretch;

        flex-direction: column;
    }

    .new-habit-button {
        width: 100%;
    }
}
</style>