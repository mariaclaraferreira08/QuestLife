<script setup>
import {
    reactive,
    computed
} from "vue"

import DailyDifficultySelector from "./form/DailyDifficultySelector.vue"
import DailyDateSelector from "./form/DailyDateSelector.vue"
import DailyWeekdaySelector from "./form/DailyWeekdaySelector.vue"

const emit = defineEmits([
    "create",
    "cancel"
])

function getToday() {
    const today = new Date()

    const year =
        today.getFullYear()

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0")

    const day =
        String(
            today.getDate()
        ).padStart(2, "0")

    return `${year}-${month}-${day}`
}

const form = reactive({
    title: "",
    description: "",

    difficulty: "easy",

    startDate: getToday(),

    /*
     * Por enquanto nossas diárias
     * trabalham com recorrência semanal.
     */
    repeatType: "weekly",
    repeatEvery: 1,

    daysOfWeek: []
})

const canCreate = computed(() => {
    return (
        form.title.trim().length > 0 &&
        form.startDate &&
        form.daysOfWeek.length > 0
    )
})

const selectedDaysText = computed(() => {
    const names = {
        monday: "Seg",
        tuesday: "Ter",
        wednesday: "Qua",
        thursday: "Qui",
        friday: "Sex",
        saturday: "Sáb",
        sunday: "Dom"
    }

    if (
        form.daysOfWeek.length === 0
    ) {
        return "Nenhum dia selecionado"
    }

    return form.daysOfWeek
        .map(day => names[day])
        .join(", ")
})

const difficultyText = computed(() => {
    const names = {
        trivial: "Trivial",
        easy: "Fácil",
        medium: "Médio",
        hard: "Difícil",
        legendary: "Lendário"
    }

    return (
        names[form.difficulty] ||
        "Fácil"
    )
})

function decreaseInterval() {
    if (form.repeatEvery <= 1) {
        return
    }

    form.repeatEvery--
}

function increaseInterval() {
    form.repeatEvery++
}

function createDaily() {
    if (!canCreate.value) {
        return
    }

    emit(
        "create",
        {
            title:
                form.title.trim(),

            description:
                form.description.trim(),

            difficulty:
                form.difficulty,

            startDate:
                form.startDate,

            repeatType:
                form.repeatType,

            repeatEvery:
                Number(
                    form.repeatEvery
                ) || 1,

            daysOfWeek: [
                ...form.daysOfWeek
            ]
        }
    )
}

function cancel() {
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
                NEW DAILY QUEST
            </span>

            <h2>
                Criar diária
            </h2>

            <p>
                Crie uma missão recorrente
                para determinados dias da semana.
            </p>
        </header>

        <!-- TÍTULO -->

        <div class="field">
            <label for="daily-title">
                TÍTULO
            </label>

            <input
                id="daily-title"
                v-model="form.title"
                type="text"
                placeholder="Ex: Estudar SQL"
                maxlength="80"
                autocomplete="off"
            />
        </div>

        <!-- ANOTAÇÕES -->

        <div class="field">
            <label for="daily-description">
                ANOTAÇÕES
            </label>

            <textarea
                id="daily-description"
                v-model="form.description"
                placeholder="Ex: Revisar durante 30 minutos"
                maxlength="300"
                rows="4"
            ></textarea>
        </div>

        <!-- DIFICULDADE -->

        <DailyDifficultySelector
            v-model="form.difficulty"
        />

        <!-- AGENDAMENTO -->

        <section class="schedule-section">
            <header class="schedule-header">
                <span class="section-label">
                    AGENDAMENTO
                </span>

                <p>
                    Defina quando esta diária
                    fará parte da sua rotina.
                </p>
            </header>

            <div class="schedule-grid">
                <!-- DATA -->

                <DailyDateSelector
                    v-model="form.startDate"
                />

                <!-- INTERVALO -->

                <section class="interval-selector">
                    <span class="control-label">
                        REPETIR A CADA
                    </span>

                    <div class="interval-card">
                        <button
                            type="button"
                            class="interval-button"
                            :disabled="
                                form.repeatEvery <= 1
                            "
                            @click="decreaseInterval"
                        >
                            −
                        </button>

                        <div class="interval-value">
                            <strong>
                                {{ form.repeatEvery }}
                            </strong>

                            <span>
                                {{
                                    form.repeatEvery === 1
                                        ? "semana"
                                        : "semanas"
                                }}
                            </span>
                        </div>

                        <button
                            type="button"
                            class="interval-button"
                            @click="increaseInterval"
                        >
                            +
                        </button>
                    </div>
                </section>
            </div>

            <!-- DIAS -->

            <DailyWeekdaySelector
                v-model="form.daysOfWeek"
            />
        </section>

        <!-- RESUMO -->

        <section class="summary">
            <span class="summary-label">
                RESUMO
            </span>

            <strong>
                {{
                    form.title.trim() ||
                    "Nova diária"
                }}
            </strong>

            <div class="summary-details">
                <span>
                    📅 {{ selectedDaysText }}
                </span>

                <span>
                    ↻ A cada
                    {{ form.repeatEvery }}
                    {{
                        form.repeatEvery === 1
                            ? "semana"
                            : "semanas"
                    }}
                </span>

                <span>
                    ✦ {{ difficultyText }}
                </span>
            </div>
        </section>

        <!-- VALIDAÇÃO -->

        <p
            v-if="!canCreate"
            class="form-warning"
        >
            Informe um título e selecione
            pelo menos um dia da semana.
        </p>

        <!-- AÇÕES -->

        <footer class="form-actions">
            <button
                type="button"
                class="cancel-button"
                @click="cancel"
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
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    gap: 28px;

    padding: 24px;

    color: #eef1f7;

    background: #151f30;

    border: 1px solid #354158;
    border-radius: 12px;
}

/* HEADER */

.form-header {
    padding-bottom: 20px;

    border-bottom:
        1px solid #29364a;
}

.eyebrow,
.section-label,
.control-label,
.summary-label {
    color: #b16cff;

    font-size: 10px;

    letter-spacing: 2px;
}

.form-header h2 {
    margin: 6px 0;

    font-size: 27px;
    font-weight: 400;
}

.form-header p,
.schedule-header p {
    margin: 0;

    color: #8190a6;

    font-size: 11px;
    line-height: 1.6;
}

/* CAMPOS */

.field {
    display: flex;
    flex-direction: column;

    gap: 10px;
}

.field label {
    color: #b16cff;

    font-size: 10px;

    letter-spacing: 2px;
}

.field input,
.field textarea {
    width: 100%;
    box-sizing: border-box;

    padding: 15px;

    color: #eef1f7;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 7px;

    outline: none;

    font-family: inherit;
}

.field input {
    min-height: 55px;
}

.field textarea {
    min-height: 105px;

    resize: vertical;
}

.field input:focus,
.field textarea:focus {
    border-color: #9851df;

    box-shadow:
        0 0 0 2px
        rgba(
            152,
            81,
            223,
            0.08
        );
}

.field input::placeholder,
.field textarea::placeholder {
    color: #65738a;
}

/* AGENDAMENTO */

.schedule-section {
    display: flex;
    flex-direction: column;

    gap: 20px;
}

.schedule-header {
    display: flex;
    flex-direction: column;

    gap: 6px;
}

.schedule-grid {
    display: grid;

    grid-template-columns:
        minmax(0, 1fr)
        minmax(0, 1fr);

    gap: 14px;

    align-items: end;
}

/* INTERVALO */

.interval-selector {
    display: flex;
    flex-direction: column;

    gap: 12px;
}

.interval-card {
    min-height: 80px;

    box-sizing: border-box;

    display: flex;

    align-items: center;
    justify-content: center;

    gap: 16px;

    padding: 14px;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 9px;
}

.interval-button {
    width: 34px;
    height: 34px;

    display: grid;

    place-items: center;

    padding: 0;

    color: #d2a1ff;

    background: #2a1c3d;

    border: 1px solid #654287;
    border-radius: 6px;

    font-family: inherit;
    font-size: 18px;

    cursor: pointer;

    transition: 0.2s;
}

.interval-button:hover:not(:disabled) {
    color: white;

    background: #42245e;

    border-color: #9851df;
}

.interval-button:disabled {
    opacity: 0.35;

    cursor: not-allowed;
}

.interval-value {
    min-width: 100px;

    display: flex;

    align-items: baseline;
    justify-content: center;

    gap: 7px;
}

.interval-value strong {
    color: #eef1f7;

    font-size: 18px;
}

.interval-value span {
    color: #8996aa;

    font-size: 10px;
}

/* RESUMO */

.summary {
    display: flex;
    flex-direction: column;

    gap: 10px;

    padding: 17px;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 8px;
}

.summary strong {
    font-size: 14px;
    font-weight: 400;
}

.summary-details {
    display: flex;

    flex-wrap: wrap;

    gap: 18px;

    color: #8190a6;

    font-size: 10px;
}

/* VALIDAÇÃO */

.form-warning {
    margin: -10px 0 0;

    color: #8190a6;

    font-size: 9px;
}

/* AÇÕES */

.form-actions {
    display: flex;

    justify-content: flex-end;

    gap: 12px;

    padding-top: 15px;

    border-top:
        1px solid #29364a;
}

.cancel-button,
.create-button {
    padding: 12px 17px;

    border-radius: 7px;

    font-family: inherit;
    font-size: 10px;
    font-weight: bold;

    cursor: pointer;
}

.cancel-button {
    color: #a8b2c3;

    background: transparent;

    border: 1px solid #455168;
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

.create-button:disabled {
    opacity: 0.4;

    cursor: not-allowed;
}

@media (max-width: 750px) {
    .daily-form {
        padding: 16px;
    }

    .schedule-grid {
        grid-template-columns: 1fr;
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