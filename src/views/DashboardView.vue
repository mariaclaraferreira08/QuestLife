<script setup>
import { computed, onMounted, ref } from "vue"
import DashboardHero from "../components/dashboard/DashboardHero.vue"
import ActiveQuests from "../components/dashboard/ActiveQuests.vue"
import DashboardCharacter from "../components/dashboard/DashboardCharacterCard.vue"
import PlayerInventory from "../components/dashboard/PlayerInventory.vue"
import WelcomeGiftModal from "../components/auth/WelcomeGiftModal.vue"
import playerService from "../services/playerService"
import taskService from "../services/taskService"
import habitService from "../services/habitService"
import dailyService from "../services/dailyService"
import gameService from "../services/gameService"

const player = playerService.player
const tasks = ref([])
const habits = ref([])
const dailies = ref([])

/*
 * =========================
 * DADOS
 * =========================
 */

function refreshData() {
    tasks.value = [...taskService.getTasks()]
    habits.value = [...habitService.getHabits()]
    dailies.value = [...dailyService.getDailies()]
}

const activeTasks = computed(() =>
    tasks.value.filter(task =>
        !task.completed &&
        !task.failed
    )
)

const completedTasks = computed(() =>
    tasks.value.filter(task =>
        task.completed
    )
)

const failedTasks = computed(() =>
    tasks.value.filter(task =>
        task.failed
    )
)

const todayDailies = computed(() =>
    dailies.value.filter(daily =>
        dailyService.isScheduledToday(daily)
    )
)

const pendingDailiesToday = computed(() =>
    todayDailies.value.filter(daily =>
        !dailyService.isCompletedToday(daily) &&
        !dailyService.isFailedToday(daily)
    )
)

const completedDailiesToday = computed(() =>
    todayDailies.value.filter(daily =>
        dailyService.isCompletedToday(daily)
    )
)

function isHabitCompletedToday(habit) {
    if (!habit.lastCompletedAt) {
        return false
    }

    const completedDate =
        new Date(habit.lastCompletedAt)

    const today =
        new Date()

    return (
        completedDate.getFullYear() ===
            today.getFullYear() &&
        completedDate.getMonth() ===
            today.getMonth() &&
        completedDate.getDate() ===
            today.getDate()
    )
}

const todayHabits = computed(() =>
    habits.value.filter(habit =>
        habitService.isScheduledForToday(
            habit.id
        )
    )
)

const completedHabitsToday = computed(() =>
    todayHabits.value.filter(habit =>
        isHabitCompletedToday(habit)
    )
)

const pendingHabitsToday = computed(() =>
    todayHabits.value.filter(habit =>
        !isHabitCompletedToday(habit) &&
        !habit.failed
    )
)

/*
 * =========================
 * PRESENTE DE BOAS-VINDAS
 * =========================
 */

function claimWelcomeGift() {
    const result =
        playerService.claimWelcomeGift()

    if (result.success) {
        refreshData()
    }
}

/*
 * =========================
 * TAREFAS
 * =========================
 */

function completeTask(taskId) {
    gameService.completeTaskById(
        taskId
    )

    refreshData()
}

function failTask(taskId) {
    gameService.failTaskById(
        taskId
    )

    refreshData()
}

function removeTask(taskId) {
    taskService.removeTask(
        taskId
    )

    refreshData()
}

function addSubtask(
    taskId,
    title
) {
    taskService.addSubtask(
        taskId,
        title
    )

    refreshData()
}

function toggleSubtask(
    taskId,
    subtaskId
) {
    const result =
        taskService.toggleSubtask(
            taskId,
            subtaskId
        )

    if (!result?.success) {
        refreshData()
        return
    }

    const updatedTask =
        taskService.getTaskById(
            taskId
        )

    if (!updatedTask) {
        refreshData()
        return
    }

    const subtasks =
        updatedTask.subtasks || []

    const shouldComplete =
        subtasks.length > 0 &&
        subtasks.every(
            subtask =>
                subtask.completed === true
        ) &&
        !updatedTask.completed &&
        !updatedTask.failed

    if (shouldComplete) {
        gameService.completeTaskById(
            taskId
        )
    }

    refreshData()
}

/*
 * =========================
 * INICIALIZAÇÃO
 * =========================
 */

onMounted(() => {
    refreshData()
})
</script>

<template>
    <main class="dashboard">
        <DashboardHero
            :player="player"
        />

        <WelcomeGiftModal
            v-if="!player.welcomeGiftClaimed"
            :player-name="player.name"
            @claim="claimWelcomeGift"
        />

        <section class="dashboard-layout">
            <div class="main-column">
                <section class="panel progress-panel">
                    <div class="panel-header">
                        <div>
                            <span class="eyebrow">
                                SUA JORNADA
                            </span>

                            <h2>
                                Progresso
                            </h2>
                        </div>

                        <span class="panel-tag">
                            AVENTURA ATUAL
                        </span>
                    </div>

                    <div class="progress-grid">
                        <article class="progress-card">
                            <div class="progress-icon success">
                                ✓
                            </div>

                            <span class="progress-label">
                                MISSÕES CONCLUÍDAS
                            </span>

                            <strong>
                                {{ completedTasks.length }}
                            </strong>

                            <small>
                                Continue avançando
                            </small>
                        </article>

                        <article class="progress-card">
                            <div class="progress-icon info">
                                ◇
                            </div>

                            <span class="progress-label">
                                MISSÕES ATIVAS
                            </span>

                            <strong>
                                {{ activeTasks.length }}
                            </strong>

                            <small>
                                Aguardando conclusão
                            </small>
                        </article>

                        <article class="progress-card">
                            <div class="progress-icon special">
                                🔥
                            </div>

                            <span class="progress-label">
                                HÁBITOS
                            </span>

                            <strong>
                                {{ habits.length }}
                            </strong>

                            <small>
                                Na sua rotina
                            </small>
                        </article>

                        <article class="progress-card">
                            <div class="progress-icon coin">
                                🪙
                            </div>

                            <span class="progress-label">
                                MOEDAS
                            </span>

                            <strong>
                                {{ player.coins || 0 }}
                            </strong>

                            <small>
                                Tesouro disponível
                            </small>
                        </article>
                    </div>
                </section>

                <section class="panel">
                    <div class="panel-header">
                        <div>
                            <span class="eyebrow">
                                HOJE
                            </span>

                            <h2>
                                Resumo da jornada
                            </h2>
                        </div>

                        <span class="panel-tag">
                            SUA ROTINA
                        </span>
                    </div>

                    <div class="summary-grid">
                        <article class="summary-card">
                            <div class="summary-icon">
                                ☑
                            </div>

                            <div>
                                <strong>
                                    {{ activeTasks.length }}
                                </strong>

                                <span>
                                    MISSÕES PENDENTES
                                </span>

                                <small>
                                    {{
                                        activeTasks.length === 0
                                            ? "Nenhuma missão aguardando."
                                            : "Ainda há aventuras pela frente."
                                    }}
                                </small>
                            </div>
                        </article>

                        <article class="summary-card">
                            <div class="summary-icon">
                                🔥
                            </div>

                            <div>
                                <strong>
                                    {{ completedHabitsToday.length }}/{{ todayHabits.length }}
                                </strong>

                                <span>
                                    HÁBITOS DE HOJE
                                </span>

                                <small>
                                    {{
                                        pendingHabitsToday.length === 0
                                            ? "Rotina em dia."
                                            : `${pendingHabitsToday.length} ainda aguardando.`
                                    }}
                                </small>
                            </div>
                        </article>

                        <article class="summary-card">
                            <div class="summary-icon">
                                📅
                            </div>

                            <div>
                                <strong>
                                    {{ completedDailiesToday.length }}/{{ todayDailies.length }}
                                </strong>

                                <span>
                                    DIÁRIAS DE HOJE
                                </span>

                                <small>
                                    {{
                                        pendingDailiesToday.length === 0
                                            ? "Nenhuma diária pendente."
                                            : `${pendingDailiesToday.length} ainda aguardando.`
                                    }}
                                </small>
                            </div>
                        </article>
                    </div>
                </section>

                <section
                    v-if="failedTasks.length"
                    class="warning-panel"
                >
                    <div class="warning-icon">
                        ⚠
                    </div>

                    <div>
                        <strong>
                            {{ failedTasks.length }}
                            {{
                                failedTasks.length === 1
                                    ? "missão falhou"
                                    : "missões falharam"
                            }}
                        </strong>

                        <span>
                            Nem toda aventura termina em vitória.
                            Reorganize sua estratégia e continue avançando.
                        </span>
                    </div>
                </section>

                <ActiveQuests
                    :tasks="activeTasks"
                    @complete-task="completeTask"
                    @fail-task="failTask"
                    @remove-task="removeTask"
                    @add-subtask="addSubtask"
                    @toggle-subtask="toggleSubtask"
                />
            </div>

            <aside class="side-column">
                <DashboardCharacter
                    :player="player"
                />

                <PlayerInventory
                    :player="player"
                    @inventory-updated="refreshData"
                />
            </aside>
        </section>
    </main>
</template>

<style scoped>
.dashboard {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.dashboard-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 20px;
    align-items: start;
}

.main-column,
.side-column {
    min-width: 0;
}

.main-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.side-column {
    position: sticky;
    top: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.panel {
    padding: 24px;
    background: #142036;
    border: 1px solid #31415a;
    border-radius: 18px;
}

.panel-header {
    margin-bottom: 18px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
}

.eyebrow {
    display: block;
    margin-bottom: 7px;
    color: #b16eff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
}

.panel h2 {
    margin: 0;
    color: #f3f6fb;
    font-size: 20px;
}

.panel-tag {
    color: #718198;
    font-size: 9px;
    letter-spacing: 1.5px;
    white-space: nowrap;
}

.progress-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
}

.progress-card {
    min-height: 145px;
    padding: 18px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: #101a2c;
    border: 1px solid #31415a;
    border-radius: 15px;
}

.progress-icon {
    width: 39px;
    height: 39px;
    margin-bottom: 14px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    font-size: 17px;
    font-weight: 700;
}

.progress-icon.success {
    color: #63e2b4;
    background: rgba(62, 189, 141, 0.15);
}

.progress-icon.info {
    color: #73a4ff;
    background: rgba(73, 119, 178, 0.15);
}

.progress-icon.special {
    color: #cf8bff;
    background: rgba(160, 73, 222, 0.15);
}

.progress-icon.coin {
    color: #f6c85d;
    background: rgba(198, 146, 45, 0.14);
}

.progress-label {
    color: #a8b4c8;
    font-size: 9px;
    letter-spacing: 1.3px;
}

.progress-card strong {
    margin-top: 7px;
    color: white;
    font-size: 34px;
    line-height: 1;
}

.progress-card small {
    margin-top: 8px;
    color: #748398;
    font-size: 10px;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
}

.summary-card {
    padding: 17px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #101a2c;
    border: 1px solid #31415a;
    border-radius: 14px;
}

.summary-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    background: #1b2840;
    border-radius: 11px;
    font-size: 17px;
}

.summary-card strong {
    display: block;
    margin-bottom: 3px;
    color: white;
    font-size: 17px;
}

.summary-card span {
    display: block;
    margin-bottom: 5px;
    color: #b16eff;
    font-size: 8px;
    letter-spacing: 1px;
}

.summary-card small {
    color: #7e8ca1;
    font-size: 9px;
    line-height: 1.5;
}

.warning-panel {
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    color: #d2d8e2;
    background: rgba(122, 52, 66, 0.13);
    border: 1px solid #643b49;
    border-radius: 13px;
}

.warning-icon {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    color: #ff8498;
    background: rgba(204, 75, 96, 0.12);
    border-radius: 10px;
}

.warning-panel strong {
    display: block;
    margin-bottom: 4px;
    color: #f3a0ae;
    font-size: 10px;
}

.warning-panel span {
    color: #8f9aab;
    font-size: 9px;
    line-height: 1.5;
}

@media (max-width: 1180px) {
    .dashboard-layout {
        grid-template-columns: 1fr;
    }

    .side-column {
        position: static;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-items: start;
    }
}

@media (max-width: 820px) {
    .summary-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 700px) {
    .progress-grid,
    .side-column {
        grid-template-columns: 1fr;
    }

    .panel {
        padding: 19px;
    }

    .panel-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .progress-card strong {
        font-size: 30px;
    }
}
</style>