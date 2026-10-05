<script setup>
import { computed, ref } from "vue"

import DashboardHero from "../components/dashboard/DashboardHero.vue"
import DashboardStats from "../components/dashboard/DashboardStats.vue"
import ActiveQuests from "../components/dashboard/ActiveQuests.vue"
import DashboardCharacter from "../components/dashboard/DashboardCharacterCard.vue"
import PlayerInventory from "../components/dashboard/PlayerInventory.vue"

import playerService from "../services/playerService"
import taskService from "../services/taskService"
import gameService from "../services/gameService"
import habitService from "../services/habitService"

const player = ref({
    ...playerService.getPlayer()
})

const tasks = ref(
    taskService.getTasks()
)

const habits = ref(
    habitService.getHabits()
)

const activeTasks = computed(() =>
    tasks.value.filter(
        task =>
            !task.completed &&
            !task.failed
    )
)

const completedTasks = computed(() =>
    tasks.value.filter(
        task => task.completed
    )
)

function refreshData() {
    player.value = {
        ...playerService.getPlayer()
    }

    tasks.value =
        taskService.getTasks()

    habits.value =
        habitService.getHabits()
}

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

function addSubtask(taskId, title) {
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
    taskService.toggleSubtask(
        taskId,
        subtaskId
    )

    refreshData()
}
</script>

<template>
    <main class="dashboard">
        <DashboardHero
            :player="player"
        />

        <DashboardStats
            :completed-quests="completedTasks.length"
            :active-quests="activeTasks.length"
            :habits="habits.length"
            :coins="player.coins || 0"
        />

        <section class="dashboard-grid">
            <div class="main-column">
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
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 20px;
    align-items: start;
}

.main-column,
.side-column {
    min-width: 0;
}

.side-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: sticky;
    top: 20px;
}

@media (max-width: 1050px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .side-column {
        position: static;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 700px) {
    .dashboard {
        gap: 16px;
    }

    .side-column {
        grid-template-columns: 1fr;
    }
}
</style>