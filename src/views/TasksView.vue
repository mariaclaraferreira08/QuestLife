<script setup>
import { ref, onMounted } from "vue"

import TaskList from "../components/TaskList.vue"

import taskService from "../services/taskService"
import gameService from "../services/gameService"

const tasks = ref([])

function refreshTasks() {
    tasks.value = [
        ...taskService.getTasks()
    ]
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
    taskService.addSubtask(
        taskId,
        title
    )

    refreshTasks()
}

function toggleSubtask(taskId, subtaskId) {
    taskService.toggleSubtask(
        taskId,
        subtaskId
    )

    refreshTasks()
}

onMounted(() => {
    refreshTasks()
})
</script>

<template>
    <section class="tasks-page">
        <header class="tasks-header">
            <div>
                <span class="eyebrow">
                    QUEST LOG
                </span>

                <h1>Suas missões</h1>

                <p>
                    Complete missões para ganhar XP e moedas.
                </p>
            </div>

            <RouterLink
                to="/tasks/new"
                class="new-task-button"
            >
                + NOVA MISSÃO
            </RouterLink>
        </header>

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
.tasks-page {
    width: 100%;
    max-width: 1050px;

    margin: 0 auto;

    color: #eef1f7;
}

.tasks-header {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 30px;

    margin-bottom: 30px;
    padding-bottom: 22px;

    border-bottom: 1px solid #29364a;
}

.eyebrow {
    color: #ad6df1;

    font-size: 11px;

    letter-spacing: 2px;
}

.tasks-header h1 {
    margin: 5px 0 7px;

    font-size: 27px;
}

.tasks-header p {
    margin: 0;

    color: #8793a7;

    font-size: 13px;
}

.new-task-button {
    padding: 12px 18px;

    color: white;
    text-decoration: none;

    background: linear-gradient(
        90deg,
        #7227dc,
        #a928ef
    );

    border: 1px solid #aa5cf2;
    border-radius: 7px;

    font-size: 12px;
    font-weight: bold;
}

@media (max-width: 700px) {
    .tasks-header {
        align-items: stretch;
        flex-direction: column;
    }

    .new-task-button {
        text-align: center;
    }
}
</style>