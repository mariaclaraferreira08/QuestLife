<script setup>
import { ref, computed, onMounted } from "vue"

import DailyForm from "../components/dailies/DailyForm.vue"
import DailyCard from "../components/dailies/DailyCard.vue"

import dailyService from "../services/dailyService"
import gameService from "../services/gameService"

const dailies = ref([])
const showForm = ref(false)

const feedback = ref({
    show: false,
    type: "info",
    title: "",
    message: ""
})

function refreshDailies() {
    dailies.value = [
        ...dailyService.getDailies()
    ]
}

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

const todayDailies = computed(() => {
    return dailies.value.filter(
        daily =>
            dailyService.isScheduledToday(
                daily
            )
    )
})

const otherDailies = computed(() => {
    return dailies.value.filter(
        daily =>
            !dailyService.isScheduledToday(
                daily
            )
    )
})

function createDaily(dailyData) {
    dailyService.addDaily(
        dailyData
    )

    showForm.value = false

    refreshDailies()

    showFeedback(
        "success",
        "Nova diária criada",
        "Sua nova missão recorrente foi adicionada."
    )
}

function completeDaily(dailyId) {
    const result =
        gameService.completeDailyById(
            dailyId
        )

    if (!result.success) {
        if (
            result.reason ===
            "already-completed-today"
        ) {
            showFeedback(
                "warning",
                "Diária já concluída",
                "Você já concluiu esta diária hoje."
            )
        } else if (
            result.reason ===
            "already-failed-today"
        ) {
            showFeedback(
                "warning",
                "Diária já encerrada",
                "Esta diária já foi marcada como falha hoje."
            )
        } else if (
            result.reason ===
            "not-scheduled-today"
        ) {
            showFeedback(
                "warning",
                "Fora da programação",
                "Esta diária não está programada para hoje."
            )
        } else {
            showFeedback(
                "error",
                "Não foi possível concluir",
                "Ocorreu um problema ao concluir esta diária."
            )
        }

        return
    }

    refreshDailies()

    showFeedback(
        "success",
        "Missão concluída!",
        "Recompensas adicionadas: XP e moedas foram recebidos."
    )
}

function failDaily(dailyId) {
    const result =
        gameService.failDailyById(
            dailyId
        )

    if (!result.success) {
        if (
            result.reason ===
            "already-completed-today"
        ) {
            showFeedback(
                "warning",
                "Diária já concluída",
                "Você já concluiu esta diária hoje."
            )
        } else if (
            result.reason ===
            "already-failed-today"
        ) {
            showFeedback(
                "warning",
                "Falha já registrada",
                "Você já marcou esta diária como falha hoje."
            )
        } else if (
            result.reason ===
            "not-scheduled-today"
        ) {
            showFeedback(
                "warning",
                "Fora da programação",
                "Esta diária não está programada para hoje."
            )
        } else {
            showFeedback(
                "error",
                "Não foi possível registrar",
                "Ocorreu um problema ao registrar a falha."
            )
        }

        return
    }

    refreshDailies()

    const streakProtected =
        result.streakProtected

    const damage =
        result.damage

    if (
        streakProtected &&
        damage?.protected
    ) {
        showFeedback(
            "special",
            "Elixir e Amuleto ativados!",
            `Sua sequência foi preservada e o dano foi reduzido de ${damage.originalDamage} para ${damage.damageTaken} HP.`
        )

        return
    }

    if (streakProtected) {
        showFeedback(
            "special",
            "Elixir da Persistência ativado!",
            "Sua sequência foi preservada apesar da falha desta diária."
        )

        return
    }

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
        "Diária marcada como falha",
        "Você sofreu a penalidade de HP e moedas desta missão."
    )
}

function removeDaily(dailyId) {
    dailyService.removeDaily(
        dailyId
    )

    refreshDailies()

    showFeedback(
        "info",
        "Diária removida",
        "A missão recorrente foi removida."
    )
}

onMounted(
    refreshDailies
)
</script>

<template>
    <section class="dailies-page">
        <header class="page-header">
            <div>
                <span>
                    DAILY QUESTS
                </span>

                <h1>
                    Diárias
                </h1>

                <p>
                    Missões recorrentes que
                    retornam nos dias programados.
                </p>
            </div>

            <button
                v-if="!showForm"
                type="button"
                class="new-button"
                @click="showForm = true"
            >
                + NOVA DIÁRIA
            </button>
        </header>

        <div
            v-if="feedback.show"
            class="feedback"
            :class="feedback.type"
        >
            <div class="feedback-icon">
                <span v-if="feedback.type === 'success'">
                    ✓
                </span>

                <span v-else-if="feedback.type === 'warning'">
                    !
                </span>

                <span v-else-if="feedback.type === 'error'">
                    ×
                </span>

                <span v-else-if="feedback.type === 'special'">
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

        <DailyForm
            v-if="showForm"
            @create="createDaily"
            @cancel="showForm = false"
        />

        <template v-else>
            <section
                v-if="dailies.length === 0"
                class="empty"
            >
                <span>
                    📅
                </span>

                <h2>
                    Nenhuma diária criada
                </h2>

                <p>
                    Crie uma missão recorrente
                    para começar sua rotina.
                </p>

                <button
                    type="button"
                    @click="showForm = true"
                >
                    CRIAR PRIMEIRA DIÁRIA
                </button>
            </section>

            <template v-else>
                <section class="daily-section">
                    <div class="section-title">
                        <span>
                            HOJE
                        </span>

                        <strong>
                            {{ todayDailies.length }}
                            {{
                                todayDailies.length === 1
                                    ? "MISSÃO"
                                    : "MISSÕES"
                            }}
                        </strong>
                    </div>

                    <div
                        v-if="todayDailies.length"
                        class="daily-list"
                    >
                        <DailyCard
                            v-for="daily in todayDailies"
                            :key="daily.id"
                            :daily="daily"
                            @complete="completeDaily"
                            @fail="failDaily"
                            @remove="removeDaily"
                        />
                    </div>

                    <div
                        v-else
                        class="nothing-today"
                    >
                        ✓ Nenhuma diária
                        programada para hoje.
                    </div>
                </section>

                <section
                    v-if="otherDailies.length"
                    class="daily-section"
                >
                    <div class="section-title">
                        <span>
                            OUTRAS DIÁRIAS
                        </span>

                        <strong>
                            {{ otherDailies.length }}
                            {{
                                otherDailies.length === 1
                                    ? "MISSÃO"
                                    : "MISSÕES"
                            }}
                        </strong>
                    </div>

                    <div class="daily-list">
                        <DailyCard
                            v-for="daily in otherDailies"
                            :key="daily.id"
                            :daily="daily"
                            @complete="completeDaily"
                            @fail="failDaily"
                            @remove="removeDaily"
                        />
                    </div>
                </section>
            </template>
        </template>
    </section>
</template>

<style scoped>
.dailies-page {
    width: 100%;
    max-width: 1050px;
    margin: 0 auto;
    color: #eef1f7;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 24px;
    padding-bottom: 22px;
    border-bottom: 1px solid #29364a;
}

.page-header span {
    color: #ad6df1;
    font-size: 10px;
    letter-spacing: 2px;
}

.page-header h1 {
    margin: 6px 0;
}

.page-header p {
    margin: 0;
    color: #8190a6;
    font-size: 12px;
}

.new-button,
.empty button {
    padding: 12px 18px;
    color: white;
    background:
        linear-gradient(
            90deg,
            #7227dc,
            #a928ef
        );
    border: 1px solid #b05bf0;
    border-radius: 7px;
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
}

.new-button:hover,
.empty button:hover {
    filter: brightness(1.08);
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
   LISTA
   ========================= */

.daily-section {
    margin-bottom: 30px;
}

.section-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    color: #8996a9;
    font-size: 10px;
    letter-spacing: 1px;
}

.section-title strong {
    color: #ad6df1;
}

.daily-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.nothing-today {
    padding: 20px;
    color: #768398;
    text-align: center;
    background: #101927;
    border: 1px solid #2e3a4d;
    border-radius: 8px;
}

/* =========================
   VAZIO
   ========================= */

.empty {
    min-height: 380px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 13px;

    text-align: center;

    background: #121c2d;

    border: 1px dashed #3b4960;
    border-radius: 12px;
}

.empty > span {
    font-size: 40px;
}

.empty h2,
.empty p {
    margin: 0;
}

.empty p {
    color: #7e8a9e;
}

@media (max-width: 700px) {
    .page-header {
        align-items: stretch;
        flex-direction: column;
    }

    .new-button {
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