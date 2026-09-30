<script setup>
import { ref, computed, watch } from "vue"

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

const difficulties = [
    {
        id: "trivial",
        name: "Trivial",
        stars: "✦"
    },
    {
        id: "easy",
        name: "Fácil",
        stars: "✦✦"
    },
    {
        id: "medium",
        name: "Médio",
        stars: "✦✦✦"
    },
    {
        id: "hard",
        name: "Difícil",
        stars: "✦✦✦✦"
    },
    {
        id: "legendary",
        name: "Lendário",
        stars: "✦✦✦✦✦"
    }
]

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

function getCurrentMonthKey() {
    const today = new Date()

    const year = today.getFullYear()

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0")

    return `${year}-${month}`
}

function createHabit() {
    const habitTitle = title.value.trim()

    if (!habitTitle) {
        alert(
            "Digite o nome do hábito."
        )

        return
    }

    if (
        frequency.value === "weekly" &&
        selectedDays.value.length === 0
    ) {
        alert(
            "Escolha pelo menos um dia da semana."
        )

        return
    }

    const habitData = {
        title:
            habitTitle,

        description:
            description.value.trim(),

        difficulty:
            difficulty.value,

        frequency:
            frequency.value,

        daysOfWeek:
            frequency.value === "weekly"
                ? [...selectedDays.value]
                : [],

        monthlyTarget:
            frequency.value === "monthly"
                ? monthlyTarget.value
                : null,

        monthlyProgress:
            frequency.value === "monthly"
                ? 0
                : null,

        monthlyPeriod:
            frequency.value === "monthly"
                ? getCurrentMonthKey()
                : null
    }

    emit(
        "create",
        habitData
    )
}

function cancel() {
    emit("cancel")
}
</script>

<template>
    <section class="habit-form">
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

        <div class="form-section">
            <div class="section-label">
                DIFICULDADE
            </div>

            <div class="difficulty-grid">
                <button
                    v-for="item in difficulties"
                    :key="item.id"
                    type="button"
                    class="difficulty-option"
                    :class="{
                        selected:
                            difficulty === item.id
                    }"
                    @click="
                        difficulty = item.id
                    "
                >
                    <strong>
                        {{ item.stars }}
                    </strong>

                    <span>
                        {{ item.name }}
                    </span>
                </button>
            </div>
        </div>

        <!-- FREQUÊNCIA -->

        <FrequencySelector
            v-model="frequency"
        />

        <!-- SEMANAL -->

        <WeeklySelector
            v-if="frequency === 'weekly'"
            v-model="selectedDays"
        />

        <!-- MENSAL -->

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
        </div>

        <!-- AÇÕES -->

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

/* CABEÇALHO */

.form-heading span,
.section-label {
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

/* CAMPOS */

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
}

.field textarea {
    resize: vertical;
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

/* SEÇÕES */

.form-section {
    display: flex;
    flex-direction: column;

    gap: 12px;
}

/* DIFICULDADE */

.difficulty-grid {
    display: grid;

    grid-template-columns:
        repeat(5, 1fr);

    gap: 10px;
}

.difficulty-option {
    min-height: 85px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 9px;

    color: #8794a8;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 9px;

    font-family: inherit;

    cursor: pointer;

    transition: 0.2s;
}

.difficulty-option:hover {
    border-color: #75509c;
}

.difficulty-option strong {
    color: #b484f1;

    font-size: 15px;
}

.difficulty-option.selected {
    color: white;

    background: #3c2861;

    border-color: #a45ce7;

    box-shadow:
        0 0 14px
        rgba(164, 92, 231, 0.08);
}

/* RESUMO */

.habit-preview {
    padding: 14px;

    display: flex;
    flex-direction: column;

    gap: 5px;

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
    font-size: 13px;
}

.habit-preview p {
    margin: 0;

    color: #768499;

    font-size: 11px;
}

/* AÇÕES */

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
    box-shadow:
        0 0 15px
        rgba(169, 40, 239, 0.2);
}

/* RESPONSIVO */

@media (max-width: 800px) {
    .difficulty-grid {
        grid-template-columns:
            repeat(3, 1fr);
    }
}

@media (max-width: 550px) {
    .difficulty-grid {
        grid-template-columns:
            repeat(2, 1fr);
    }

    .form-actions {
        flex-direction: column;
    }
}
</style>