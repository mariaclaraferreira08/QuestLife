<script setup>
import {
    ref,
    computed
} from "vue"

import DailyDifficultySelector
    from "./form/DailyDifficultySelector.vue"

import DailyDateSelector
    from "./form/DailyDateSelector.vue"

import DailyRepeatSelector
    from "./form/DailyRepeatSelector.vue"

import DailyWeekdaySelector
    from "./form/DailyWeekdaySelector.vue"

const emit = defineEmits([
    "create",
    "cancel"
])

/*
 * FORMULÁRIO
 */

const title = ref("")
const notes = ref("")

const difficulty = ref("easy")

const repeatEvery = ref(1)

/*
 * DATA
 */

function getLocalDateString(
    date = new Date()
) {
    const year =
        date.getFullYear()

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        )

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )

    return `${year}-${month}-${day}`
}

const today =
    getLocalDateString()

const startDate =
    ref(today)

/*
 * DIAS
 */

const selectedDays =
    ref([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ])

const weekDays = [
    {
        id: "monday",
        name: "Segunda"
    },
    {
        id: "tuesday",
        name: "Terça"
    },
    {
        id: "wednesday",
        name: "Quarta"
    },
    {
        id: "thursday",
        name: "Quinta"
    },
    {
        id: "friday",
        name: "Sexta"
    },
    {
        id: "saturday",
        name: "Sábado"
    },
    {
        id: "sunday",
        name: "Domingo"
    }
]

/*
 * RESUMO
 */

const selectedDayNames =
    computed(() => {
        return weekDays
            .filter(day =>
                selectedDays.value.includes(
                    day.id
                )
            )
            .map(day => day.name)
            .join(", ")
    })

const repeatText =
    computed(() => {
        if (
            repeatEvery.value === 1
        ) {
            return "Toda semana"
        }

        return (
            `A cada ` +
            `${repeatEvery.value} semanas`
        )
    })

/*
 * VALIDAÇÃO
 */

const canCreate =
    computed(() => {
        return (
            title.value
                .trim()
                .length > 0 &&

            Boolean(
                startDate.value
            ) &&

            selectedDays.value
                .length > 0
        )
    })

/*
 * CRIAR
 */

function createDaily() {
    if (!canCreate.value) {
        return
    }

    const dailyData = {
        title:
            title.value.trim(),

        description:
            notes.value.trim(),

        difficulty:
            difficulty.value,

        startDate:
            startDate.value,

        repeatEvery:
            repeatEvery.value,

        daysOfWeek: [
            ...selectedDays.value
        ]
    }

    emit(
        "create",
        dailyData
    )
}

function cancelForm() {
    emit("cancel")
}
</script>

<template>
    <form
        class="daily-form"
        @submit.prevent="createDaily"
    >
        <!-- CABEÇALHO -->

        <header class="form-header">
            <span class="eyebrow">
                NEW DAILY
            </span>

            <h1>
                Criar diária
            </h1>

            <p>
                Crie uma missão recorrente
                para determinados dias da
                semana.
            </p>
        </header>

        <!-- TÍTULO -->

        <section class="form-section">
            <label
                class="section-label"
                for="daily-title"
            >
                TÍTULO
            </label>

            <input
                id="daily-title"
                v-model="title"
                class="text-input"
                type="text"
                placeholder="Ex: Estudar SQL"
                maxlength="80"
                autocomplete="off"
            />
        </section>

        <!-- ANOTAÇÕES -->

        <section class="form-section">
            <label
                class="section-label"
                for="daily-notes"
            >
                ANOTAÇÕES
            </label>

            <textarea
                id="daily-notes"
                v-model="notes"
                class="notes-input"
                placeholder="Ex: Revisar durante 30 minutos"
                maxlength="300"
            ></textarea>
        </section>

        <!-- DIFICULDADE -->

        <DailyDifficultySelector
            v-model="difficulty"
        />

        <!-- AGENDAMENTO -->

        <section class="form-section">
            <span class="section-label">
                AGENDAMENTO
            </span>

            <DailyDateSelector
                v-model="startDate"
                :min="today"
            />

            <DailyRepeatSelector
                v-model="repeatEvery"
            />

            <DailyWeekdaySelector
                v-model="selectedDays"
            />
        </section>

        <!-- RESUMO -->

        <section class="summary">
            <span class="summary-label">
                RESUMO
            </span>

            <strong>
                {{
                    title.trim() ||
                    "Nova diária"
                }}
            </strong>

            <p>
                {{ repeatText }}
            </p>

            <p
                v-if="
                    selectedDays.length
                "
            >
                {{ selectedDayNames }}
            </p>

            <p>
                Início:
                {{ startDate }}
            </p>
        </section>

        <!-- AÇÕES -->

        <footer class="form-actions">
            <button
                type="button"
                class="cancel-button"
                @click="cancelForm"
            >
                CANCELAR
            </button>

            <button
                type="submit"
                class="create-button"
                :disabled="!canCreate"
            >
                + CRIAR DIÁRIA
            </button>
        </footer>
    </form>
</template>

<style scoped>
.daily-form {
    width: 100%;

    display: flex;
    flex-direction: column;

    gap: 28px;
}

/* CABEÇALHO */

.form-header {
    padding-bottom: 6px;
}

.eyebrow {
    display: block;

    margin-bottom: 8px;

    color: #ae63ef;

    font-size: 10px;
    letter-spacing: 2px;
}

.form-header h1 {
    margin: 0;

    color: #f1f3f8;

    font-size: 31px;
    font-weight: 400;
}

.form-header p {
    margin: 10px 0 0;

    color: #8491a5;

    font-size: 12px;
}

/* SEÇÕES */

.form-section {
    display: flex;
    flex-direction: column;

    gap: 12px;
}

.section-label {
    color: #b15cf0;

    font-size: 10px;
    letter-spacing: 2px;
}

/* INPUTS */

.text-input,
.notes-input {
    width: 100%;

    box-sizing: border-box;

    color: #edf0f7;

    background: #0d1725;

    border: 1px solid #354158;
    border-radius: 7px;

    font-family: inherit;

    transition: 0.2s;
}

.text-input {
    height: 57px;

    padding: 0 16px;
}

.notes-input {
    min-height: 100px;

    padding: 16px;

    resize: vertical;
}

.text-input::placeholder,
.notes-input::placeholder {
    color: #627087;
}

.text-input:focus,
.notes-input:focus {
    outline: none;

    border-color: #9950d7;

    box-shadow:
        0 0 0 2px
        rgba(
            153,
            80,
            215,
            0.08
        );
}

/* RESUMO */

.summary {
    padding: 16px;

    display: flex;
    flex-direction: column;

    gap: 7px;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 9px;
}

.summary-label {
    color: #a960dd;

    font-size: 9px;
    letter-spacing: 1px;
}

.summary strong {
    color: #edf0f7;

    font-size: 13px;
}

.summary p {
    margin: 0;

    color: #8390a4;

    font-size: 10px;
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
    min-height: 42px;

    padding: 10px 18px;

    border-radius: 7px;

    font-family: inherit;

    font-size: 10px;
    font-weight: bold;

    cursor: pointer;

    transition: 0.2s;
}

.cancel-button {
    color: #bdc5d3;

    background: #101927;

    border: 1px solid #3b475a;
}

.cancel-button:hover {
    color: white;

    border-color: #68758b;
}

.create-button {
    color: white;

    background:
        linear-gradient(
            90deg,
            #7b2cd3,
            #a82ce8
        );

    border: 1px solid #b05eea;
}

.create-button:hover:not(:disabled) {
    transform: translateY(-1px);
}

.create-button:disabled {
    color: #687487;

    background: #27213b;

    border-color: #49365e;

    opacity: 0.6;

    cursor: not-allowed;
}

@media (max-width: 550px) {
    .form-actions {
        flex-direction:
            column-reverse;
    }

    .cancel-button,
    .create-button {
        width: 100%;
    }
}
</style>