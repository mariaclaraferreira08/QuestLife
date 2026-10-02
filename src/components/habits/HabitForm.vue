<script setup>
import { ref, computed, watch } from "vue"

import DifficultySelector from "./form/DifficultySelector.vue"
import FrequencySelector from "./form/FrequencySelector.vue"
import WeeklySelector from "./form/WeeklySelector.vue"
import MonthlySelector from "./form/MonthlySelector.vue"

const emit = defineEmits([
    "create",
    "cancel"
])

const title = ref("")
const description = ref("")

const difficulty = ref("easy")

const frequency = ref("daily")

const selectedDays = ref([])

const monthlyTarget = ref(4)

/*
 * Texto utilizado no resumo do hábito.
 */
const frequencyDescription = computed(() => {
    if (frequency.value === "daily") {
        return "Todos os dias"
    }

    if (frequency.value === "weekly") {
        if (selectedDays.value.length === 0) {
            return "Escolha os dias da semana"
        }

        return `${selectedDays.value.length} ${
            selectedDays.value.length === 1
                ? "dia por semana"
                : "dias por semana"
        }`
    }

    if (frequency.value === "monthly") {
        return `${monthlyTarget.value} ${
            monthlyTarget.value === 1
                ? "vez"
                : "vezes"
        } por mês`
    }

    return ""
})

/*
 * Quando o usuário sai da frequência semanal,
 * limpamos os dias que estavam selecionados.
 *
 * Assim não ficam dias antigos escondidos
 * dentro de um hábito diário ou mensal.
 */
watch(
    frequency,

    (newFrequency, oldFrequency) => {
        if (
            oldFrequency === "weekly" &&
            newFrequency !== "weekly"
        ) {
            selectedDays.value = []
        }
    }
)

/*
 * Cria o objeto que será enviado para
 * HabitsView e depois para habitService.
 */
function createHabit() {
    const habitTitle = title.value.trim()

    /*
     * O hábito precisa ter um nome.
     */
    if (!habitTitle) {
        alert(
            "Digite o nome do hábito."
        )

        return
    }

    /*
     * Um hábito semanal precisa ter
     * pelo menos um dia selecionado.
     */
    if (
        frequency.value === "weekly" &&
        selectedDays.value.length === 0
    ) {
        alert(
            "Escolha pelo menos um dia da semana."
        )

        return
    }

    /*
     * Dados básicos enviados para
     * habitService.addHabit().
     */
    const habitData = {
        title:
            habitTitle,

        description:
            description.value.trim(),

        difficulty:
            difficulty.value,

        frequency:
            frequency.value,

        /*
         * Só hábitos semanais possuem
         * dias específicos.
         */
        daysOfWeek:
            frequency.value === "weekly"
                ? [...selectedDays.value]
                : [],

        /*
         * Meta semanal.
         *
         * Por enquanto, cada dia escolhido
         * representa uma conclusão esperada
         * durante a semana.
         *
         * Exemplo:
         *
         * SEG + QUA + SEX
         *
         * weeklyGoal = 3
         */
        weeklyGoal:
            frequency.value === "weekly"
                ? selectedDays.value.length
                : null,

        /*
         * Meta mensal.
         *
         * Exemplo:
         *
         * "Ler livro 4 vezes por mês"
         *
         * monthlyGoal = 4
         */
        monthlyGoal:
            frequency.value === "monthly"
                ? monthlyTarget.value
                : null
    }

    emit(
        "create",
        habitData
    )
}

/*
 * Fecha/cancela o formulário.
 */
function cancel() {
    emit("cancel")
}
</script>

<template>
    <section class="habit-form">

        <!-- CABEÇALHO -->

        <div class="form-heading">
            <span>
                NEW ROUTINE
            </span>

            <h2>
                Criar hábito
            </h2>

            <p>
                Defina sua nova rotina e quando
                ela deve ser realizada.
            </p>
        </div>

        <!-- NOME -->

        <label class="field">
            <span>
                NOME DO HÁBITO
            </span>

            <input
                v-model="title"
                type="text"
                placeholder="Ex: Estudar Python"
                @keyup.enter="createHabit"
            >
        </label>

        <!-- DESCRIÇÃO -->

        <label class="field">
            <span>
                DESCRIÇÃO
            </span>

            <textarea
                v-model="description"
                rows="4"
                placeholder="Ex: Estudar durante 30 minutos"
            ></textarea>
        </label>

        <!-- DIFICULDADE -->

        <DifficultySelector
            v-model="difficulty"
        />

        <!-- FREQUÊNCIA -->

        <FrequencySelector
            v-model="frequency"
        />

        <!-- CONFIGURAÇÃO SEMANAL -->

        <WeeklySelector
            v-if="frequency === 'weekly'"
            v-model="selectedDays"
        />

        <!-- CONFIGURAÇÃO MENSAL -->

        <MonthlySelector
            v-if="frequency === 'monthly'"
            v-model="monthlyTarget"
        />

        <!-- RESUMO -->

        <div class="habit-preview">
            <span>
                RESUMO
            </span>

            <strong>
                {{
                    title.trim() ||
                    "Novo hábito"
                }}
            </strong>

            <p>
                {{ frequencyDescription }}
            </p>

            <!--
                Mostra os dias escolhidos
                somente para hábitos semanais.
            -->

            <small
                v-if="
                    frequency === 'weekly' &&
                    selectedDays.length > 0
                "
            >
                {{ selectedDays.length }}

                {{
                    selectedDays.length === 1
                        ? "dia selecionado"
                        : "dias selecionados"
                }}
            </small>

            <!--
                Mostra a meta mensal.
            -->

            <small
                v-if="frequency === 'monthly'"
            >
                Meta:
                {{ monthlyTarget }}

                {{
                    monthlyTarget === 1
                        ? "conclusão"
                        : "conclusões"
                }}
            </small>
        </div>

        <!-- BOTÕES -->

        <div class="form-actions">
            <button
                type="button"
                class="cancel-button"
                @click="cancel"
            >
                CANCELAR
            </button>

            <button
                type="button"
                class="create-button"
                @click="createHabit"
            >
                + CRIAR HÁBITO
            </button>
        </div>

    </section>
</template>

<style scoped>
.habit-form {
    padding: 24px;

    display: flex;
    flex-direction: column;

    gap: 25px;

    color: #eef1f7;

    background: #151f30;

    border: 1px solid #354158;
    border-radius: 12px;
}

/* =========================
   CABEÇALHO
   ========================= */

.form-heading {
    display: flex;
    flex-direction: column;
}

.form-heading > span {
    color: #ad6df1;

    font-size: 11px;
    letter-spacing: 2px;
}

.form-heading h2 {
    margin: 6px 0;

    font-size: 22px;
}

.form-heading p {
    margin: 0;

    color: #7f8ca1;

    font-size: 12px;
}

/* =========================
   CAMPOS
   ========================= */

.field {
    display: flex;
    flex-direction: column;

    gap: 8px;
}

.field > span {
    color: #aab4c6;

    font-size: 10px;
    letter-spacing: 1px;
}

.field input,
.field textarea {
    width: 100%;

    box-sizing: border-box;

    padding: 14px;

    color: #eef1f7;

    background: #0e1725;

    border: 1px solid #354158;
    border-radius: 7px;

    outline: none;

    font-family: inherit;

    transition: 0.2s;
}

.field textarea {
    resize: vertical;

    min-height: 110px;
}

.field input::placeholder,
.field textarea::placeholder {
    color: #58667a;
}

.field input:focus,
.field textarea:focus {
    border-color: #9d55e5;

    box-shadow:
        0 0 0 2px
        rgba(157, 85, 229, 0.08);
}

/* =========================
   RESUMO
   ========================= */

.habit-preview {
    padding: 14px;

    display: flex;
    flex-direction: column;

    gap: 6px;

    background: #101927;

    border: 1px solid #2e3a4d;
    border-radius: 8px;
}

.habit-preview > span {
    color: #8e5dbd;

    font-size: 9px;
    letter-spacing: 1px;
}

.habit-preview strong {
    color: #eef1f7;

    font-size: 13px;
}

.habit-preview p {
    margin: 0;

    color: #768499;

    font-size: 11px;
}

.habit-preview small {
    color: #9a72bf;

    font-size: 10px;
}

/* =========================
   BOTÕES
   ========================= */

.form-actions {
    display: flex;

    justify-content: flex-end;

    gap: 10px;

    padding-top: 5px;
}

.cancel-button,
.create-button {
    padding: 11px 17px;

    border-radius: 7px;

    font-family: inherit;

    font-size: 11px;
    font-weight: bold;

    cursor: pointer;

    transition: 0.2s;
}

.cancel-button {
    color: #aab4c6;

    background: #101927;

    border: 1px solid #354158;
}

.cancel-button:hover {
    color: white;

    border-color: #536178;

    background: #151f30;
}

.create-button {
    color: white;

    background:
        linear-gradient(
            90deg,
            #7227dc,
            #a928ef
        );

    border: 1px solid #aa5cf2;
}

.create-button:hover {
    transform: translateY(-1px);

    box-shadow:
        0 0 15px
        rgba(169, 40, 239, 0.2);
}

.create-button:active {
    transform: translateY(0);
}

/* =========================
   RESPONSIVO
   ========================= */

@media (max-width: 550px) {
    .habit-form {
        padding: 18px;

        gap: 20px;
    }

    .form-actions {
        flex-direction: column;
    }

    .cancel-button,
    .create-button {
        width: 100%;
    }
}
</style>
