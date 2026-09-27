<script setup>
import { computed, ref } from "vue"

import TaskList from "../components/TaskList.vue"

import playerService from "../services/playerService"
import taskService from "../services/taskService"
import gameService from "../services/gameService"
import habitService from "../services/habitService"

const player = ref(playerService.getPlayer())
const tasks = ref(taskService.getTasks())
const habits = ref(habitService.getHabits())

const activeTasks = computed(() => {
    return tasks.value.filter(
        task => !task.completed && !task.failed
    )
})

const completedTasks = computed(() => {
    return tasks.value.filter(task => task.completed)
})

function refreshData() {
    player.value = playerService.getPlayer()
    tasks.value = taskService.getTasks()
    habits.value = habitService.getHabits()
}

function completeTask(taskId) {
    gameService.completeTaskById(taskId)
    refreshData()
}

function failTask(taskId) {
    gameService.failTaskById(taskId)
    refreshData()
}

function removeTask(taskId) {
    taskService.removeTask(taskId)
    refreshData()
}

function addSubtask(taskId, title) {
    taskService.addSubtask(taskId, title)
    refreshData()
}

function toggleSubtask(taskId, subtaskId) {
    taskService.toggleSubtask(taskId, subtaskId)
    refreshData()
}
</script>

<template>
    <div class="dashboard">
        <section class="welcome">
            <span class="eyebrow">
                WELCOME BACK, ADVENTURER!
            </span>

            <h1>Habit Quest</h1>

            <p>
                Continue sua jornada e transforme suas
                tarefas em missões.
            </p>
        </section>

        <section class="stats">
            <article class="stat-card">
                <span>✓</span>

                <div>
                    <small>MISSÕES CONCLUÍDAS</small>
                    <strong>{{ completedTasks.length }}</strong>
                </div>
            </article>

            <article class="stat-card">
                <span>⚔</span>

                <div>
                    <small>MISSÕES ATIVAS</small>
                    <strong>{{ activeTasks.length }}</strong>
                </div>
            </article>

            <article class="stat-card">
                <span>🔥</span>

                <div>
                    <small>HÁBITOS</small>
                    <strong>{{ habits.length }}</strong>
                </div>
            </article>

            <article class="stat-card">
                <span>🪙</span>

                <div>
                    <small>MOEDAS</small>
                    <strong>{{ player.coins }}</strong>
                </div>
            </article>
        </section>

        <section class="quests">
            <div class="section-header">
                <div>
                    <span class="eyebrow">
                        ACTIVE QUESTS
                    </span>

                    <h2>Missões ativas</h2>
                </div>

                <RouterLink
                    to="/tasks/new"
                    class="create-button"
                >
                    + Nova missão
                </RouterLink>
            </div>

            <TaskList
                :tasks="activeTasks"
                @complete-task="completeTask"
                @fail-task="failTask"
                @remove-task="removeTask"
                @add-subtask="addSubtask"
                @toggle-subtask="toggleSubtask"
            />
        </section>
    </div>
</template>

<style scoped>
.dashboard {
    max-width: 1200px;
    margin: auto;
}

.welcome,
.quests {
    padding: 28px;

    background: rgba(21, 31, 48, 0.92);

    border: 1px solid #2d3a51;
    border-radius: 14px;
}

.welcome h1 {
    margin: 8px 0;

    color: #f2f5fb;
    font-size: 30px;
}

.welcome p {
    margin: 0;
    color: #9da9bd;
}

.eyebrow {
    color: #bd7cff;

    font-size: 12px;
    letter-spacing: 2px;
}

.stats {
    display: grid;

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap: 16px;

    margin: 20px 0;
}

.stat-card {
    min-height: 120px;
    padding: 20px;

    display: flex;
    align-items: center;
    gap: 16px;

    background: #151f30;

    border: 1px solid #344158;
    border-radius: 12px;

    color: white;
}

.stat-card > span {
    font-size: 25px;
}

.stat-card div {
    display: flex;
    flex-direction: column;
}

.stat-card small {
    color: #8f9caf;
    font-size: 11px;
}

.stat-card strong {
    margin-top: 6px;

    font-size: 26px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-header h2 {
    margin-top: 6px;

    color: white;
}

.create-button {
    padding: 10px 16px;

    color: white;
    text-decoration: none;

    background: #802ce3;

    border: 1px solid #a867f2;
    border-radius: 8px;
}

.create-button:hover {
    color: white;
    background: #933af5;
}

@media (max-width: 1000px) {
    .stats {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>