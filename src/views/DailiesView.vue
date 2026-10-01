<script setup>
import {
    ref,
    computed,
    onMounted
} from "vue"

import DailyForm from "../components/dailies/DailyForm.vue"
import DailyCard from "../components/dailies/DailyCard.vue"

import dailyService from "../services/dailyService"
import gameService from "../services/gameService"

const dailies = ref([])
const showForm = ref(false)

function refreshDailies() {
    dailies.value = [
        ...dailyService.getDailies()
    ]
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
            alert(
                "Você já concluiu esta diária hoje."
            )
        }

        if (
            result.reason ===
            "not-scheduled-today"
        ) {
            alert(
                "Esta diária não está programada para hoje."
            )
        }

        return
    }

    refreshDailies()
}

function removeDaily(dailyId) {
    dailyService.removeDaily(
        dailyId
    )

    refreshDailies()
}

onMounted(
    refreshDailies
)
</script>

<template>
    <section class="dailies-page">
        <header class="page-header">
            <div>
                <span>DAILY QUESTS</span>

                <h1>Diárias</h1>

                <p>
                    Missões recorrentes que
                    retornam nos dias programados.
                </p>
            </div>

            <button
                v-if="!showForm"
                type="button"
                class="new-button"
                @click="
                    showForm = true
                "
            >
                + NOVA DIÁRIA
            </button>
        </header>

        <DailyForm
            v-if="showForm"
            @create="createDaily"
            @cancel="
                showForm = false
            "
        />

        <template v-else>
            <section
                v-if="
                    dailies.length === 0
                "
                class="empty"
            >
                <span>📅</span>

                <h2>
                    Nenhuma diária criada
                </h2>

                <p>
                    Crie uma missão recorrente
                    para começar sua rotina.
                </p>

                <button
                    type="button"
                    @click="
                        showForm = true
                    "
                >
                    CRIAR PRIMEIRA DIÁRIA
                </button>
            </section>

            <template v-else>
                <section
                    class="daily-section"
                >
                    <div
                        class="section-title"
                    >
                        <span>HOJE</span>

                        <strong>
                            {{
                                todayDailies.length
                            }}
                            MISSÕES
                        </strong>
                    </div>

                    <div
                        v-if="
                            todayDailies.length
                        "
                        class="daily-list"
                    >
                        <DailyCard
                            v-for="
                                daily
                                in todayDailies
                            "
                            :key="
                                daily.id
                            "
                            :daily="
                                daily
                            "
                            @complete="
                                completeDaily
                            "
                            @remove="
                                removeDaily
                            "
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
                    v-if="
                        otherDailies.length
                    "
                    class="daily-section"
                >
                    <div
                        class="section-title"
                    >
                        <span>
                            OUTRAS DIÁRIAS
                        </span>
                    </div>

                    <div
                        class="daily-list"
                    >
                        <DailyCard
                            v-for="
                                daily
                                in otherDailies
                            "
                            :key="
                                daily.id
                            "
                            :daily="
                                daily
                            "
                            @complete="
                                completeDaily
                            "
                            @remove="
                                removeDaily
                            "
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

    margin-bottom: 30px;
    padding-bottom: 22px;

    border-bottom:
        1px solid #29364a;
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

    background: #982dea;

    border: 1px solid #b05bf0;
    border-radius: 7px;

    font-family: inherit;
    font-weight: bold;

    cursor: pointer;
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
}
</style>