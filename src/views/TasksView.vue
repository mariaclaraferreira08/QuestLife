<script setup>
import { ref } from "vue"

import TaskList from "../components/TaskList.vue"

import taskService from "../services/taskService"
import gameService from "../services/gameService"

const tasks = ref(taskService.getTasks())

function refreshTasks() {
    tasks.value = taskService.getTasks()
}

function completeTask(taskId) {
    gameService.completeTaskById(taskId)
    refreshTasks()
}

function failTask(taskId) {
    gameService.failTaskById(taskId)
    refreshTasks()
}

function removeTask(taskId) {
    taskService.removeTask(taskId)
    refreshTasks()
}

function addSubtask(taskId, title) {
    taskService.addSubtask(taskId, title)
    refreshTasks()
}

function toggleSubtask(taskId, subtaskId) {
    taskService.toggleSubtask(taskId, subtaskId)
    refreshTasks()
}
</script>

<template>
    <section class="page">
        <div class="page-header">
            <div>
                <span>QUEST LOG</span>
                <h1>Tarefas</h1>
            </div>

            <RouterLink
                to="/tasks/new"
                class="new-task"
            >
                + Nova missão
            </RouterLink>
        </div>

        <TaskList
            :tasks="tasks"
            @complete-task="completeTask"
            @fail-task="failTask"
            @remove-task="removeTask"
            @add-subtask="addSubtask"
            @toggle-subtask="toggleSubtask"
        />
    </section>
</template>

<style scoped>
.page {
    max-width: 1000px;
    margin: auto;

    color: white;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.page-header span {
    color: #bd7cff;

    font-size: 12px;
    letter-spacing: 2px;
}

.new-task {
    padding: 10px 16px;

    color: white;
    text-decoration: none;

    background: #812de3;

    border-radius: 8px;
}
</style>