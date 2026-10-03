<script setup>
import { reactive, computed } from "vue"

import DailyDifficultySelector from "./form/DailyDifficultySelector.vue"
import DailyDateSelector from "./form/DailyDateSelector.vue"
import DailyRepeatSelector from "./form/DailyRepeatSelector.vue"
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

    repeatType: "weekly",
    repeatEvery: 1,

    daysOfWeek: []
})

const canCreate = computed(() => {
    return (
        form.title.trim().length > 0 &&
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
            <div>
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
            </div>
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
            />
        </div>

        <!-- DESCRIÇÃO -->

        <div class="field">
            <label for="daily-description">
                ANOTAÇÕES
            </label>

            <textarea
                id="daily-description"
                v-model="form.description"
                placeholder="Ex: Revisar durante 30 minutos"
                rows="4"
            ></textarea>
        </div>

        <!-- DIFICULDADE -->

        <section class="form-section">
            <span class="section-label">
                DIFICULDADE
            </span>

            <DailyDifficultySelector
                v-model="form.difficulty"
            />
        </section>

        <!-- AGENDAMENTO -->

        <section class="form-section">
            <span class="section-label">
                AGENDAMENTO
            </span>

            <!-- DATA -->

            <DailyDateSelector
                v-model="form.startDate"
            />

            <!-- REPETIÇÃO -->

            <DailyRepeatSelector
                v-model:repeat-type="
                    form.repeatType
                "
                v-model:repeat-every="
                    form.repeatEvery
                "
            />

            <!-- DIAS DA SEMANA -->

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

            <span>
                {{ selectedDaysText }}
            </span>

            <span>
                Repetição:
                a cada
                {{ form.repeatEvery }}
                {{
                    form.repeatEvery === 1
                        ? "semana"
                        : "semanas"
                }}
            </span>
        </section>

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
    display: flex;
    flex-direction: column;

    gap: 27px;

    padding: 22px;

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

.eyebrow {
    color: #ad6df1;

    font-size: 10px;

    letter-spacing: 2px;
}

.form-header h2 {
    margin: 6px 0;

    font-size: 26px;
}

.form-header p {
    margin: 0;

    color: #8190a6;

    font-size: 12px;
}

/* CAMPOS */

.field {
    display: flex;
    flex-direction: column;

    gap: 10px;
}

.field label,
.section-label {
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
    min-height: 100px;

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

/* SEÇÕES */

.form-section {
    display: flex;
    flex-direction: column;

    gap: 14px;
}

/* RESUMO */

.summary {
    display: flex;
    flex-direction: column;

    gap: 8px;

    padding: 16px;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 8px;
}

.summary-label {
    color: #b16cff;

    font-size: 9px;

    letter-spacing: 2px;
}

.summary strong {
    color: #eef1f7;

    font-size: 13px;
}

.summary > span:not(
    .summary-label
) {
    color: #8190a6;

    font-size: 10px;
}

/* BOTÕES */

.form-actions {
    display: flex;

    justify-content: flex-end;

    gap: 12px;

    padding-top: 5px;
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

/* RESPONSIVO */

@media (max-width: 700px) {
    .daily-form {
        padding: 16px;
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
