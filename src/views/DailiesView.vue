<script setup>
import { computed, onMounted, ref } from "vue"
import DailyForm from "../components/dailies/DailyForm.vue"
import DailyCard from "../components/dailies/DailyCard.vue"
import DailyFilters from "../components/dailies/DailyFilters.vue"
import DailyFeedback from "../components/dailies/DailyFeedback.vue"
import dailyService from "../services/dailyService"
import gameService from "../services/gameService"

const dailies = ref([])
const showForm = ref(false)

const filters = ref({
    status: "all",
    difficulty: "all",
    order: "newest"
})

const feedback = ref({
    show: false,
    type: "info",
    title: "",
    message: ""
})

/*
 * =========================
 * FILTROS
 * =========================
 */

const filteredDailies = computed(() => {
    let result = [
        ...dailies.value
    ]

    if (filters.value.status === "today") {
        result = result.filter(daily =>
            dailyService.isScheduledToday(daily)
        )
    }

    if (filters.value.status === "pending") {
        result = result.filter(daily =>
            dailyService.isScheduledToday(daily) &&
            !dailyService.isCompletedToday(daily) &&
            !dailyService.isFailedToday(daily)
        )
    }

    if (filters.value.status === "completed") {
        result = result.filter(daily =>
            dailyService.isCompletedToday(daily)
        )
    }

    if (filters.value.status === "failed") {
        result = result.filter(daily =>
            dailyService.isFailedToday(daily)
        )
    }

    if (filters.value.difficulty !== "all") {
        result = result.filter(daily =>
            daily.difficulty ===
            filters.value.difficulty
        )
    }

    if (filters.value.order === "newest") {
        result.reverse()
    }

    return result
})

const todayDailies = computed(() =>
    filteredDailies.value.filter(daily =>
        dailyService.isScheduledToday(daily)
    )
)

const otherDailies = computed(() =>
    filteredDailies.value.filter(daily =>
        !dailyService.isScheduledToday(daily)
    )
)

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
 * DIÁRIAS
 * =========================
 */

function refreshDailies() {
    dailies.value = [
        ...dailyService.getDailies()
    ]
}

function createDaily(dailyData) {
    dailyService.addDaily(dailyData)
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

    if (!result?.success) {
        if (
            result?.reason ===
            "already-completed-today"
        ) {
            showFeedback(
                "warning",
                "Diária já concluída",
                "Você já concluiu esta diária hoje."
            )
        } else if (
            result?.reason ===
            "already-failed-today"
        ) {
            showFeedback(
                "warning",
                "Diária já encerrada",
                "Esta diária já foi marcada como falha hoje."
            )
        } else if (
            result?.reason ===
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

    if (!result?.success) {
        if (
            result?.reason ===
            "already-completed-today"
        ) {
            showFeedback(
                "warning",
                "Diária já concluída",
                "Você já concluiu esta diária hoje."
            )
        } else if (
            result?.reason ===
            "already-failed-today"
        ) {
            showFeedback(
                "warning",
                "Falha já registrada",
                "Você já marcou esta diária como falha hoje."
            )
        } else if (
            result?.reason ===
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
    dailyService.removeDaily(dailyId)
    refreshDailies()

    showFeedback(
        "info",
        "Diária removida",
        "A missão recorrente foi removida."
    )
}

/*
 * =========================
 * INICIALIZAÇÃO
 * =========================
 */

onMounted(() => {
    refreshDailies()
})
</script>

<template>
    <section class="dailies-page">
        <header class="page-header">
            <div>
                <span>DAILY QUESTS</span>
                <h1>Diárias</h1>

                <p>
                    Missões recorrentes que retornam nos dias programados.
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

        <DailyFeedback
            :feedback="feedback"
            @close="closeFeedback"
        />

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
                <span>📅</span>
                <h2>Nenhuma diária criada</h2>

                <p>
                    Crie uma missão recorrente para começar sua rotina.
                </p>

                <button
                    type="button"
                    @click="showForm = true"
                >
                    CRIAR PRIMEIRA DIÁRIA
                </button>
            </section>

            <template v-else>
                <DailyFilters
                    v-model="filters"
                    :total="filteredDailies.length"
                />

                <div
                    v-if="filteredDailies.length === 0"
                    class="filter-empty"
                >
                    Nenhuma diária encontrada com os filtros selecionados.
                </div>

                <template v-else>
                    <section class="daily-section">
                        <div class="section-title">
                            <span>HOJE</span>

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
                            Nenhuma diária deste filtro está programada para hoje.
                        </div>
                    </section>

                    <section
                        v-if="otherDailies.length"
                        class="daily-section"
                    >
                        <div class="section-title">
                            <span>OUTRAS DIÁRIAS</span>

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
    background: linear-gradient(
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

.filter-empty {
    padding: 30px;
    color: #77869a;
    text-align: center;
    background: #101927;
    border: 1px dashed #354158;
    border-radius: 10px;
    font-size: 11px;
}

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
}
</style>
