<script setup>
import taskService from "./services/taskService"

const task = {
    title: "Estudar Python",
    description: "Fazer exercícios",
    difficulty: "medium",
    completed: false
}

const tasks = taskService.addTask(task)

console.log("Tarefas:", tasks)
</script>

<template>
    <h1>QuestLife</h1>
</template>
