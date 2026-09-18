<script setup>
import gameService from "./services/gameService"

const task = {
    id: 1,
    title: "Estudar Python",
    description: "Fazer exercícios",
    difficulty: "medium",
    completed: false
}

const player = gameService.completeTaskAndReward(task)

console.log("Jogador depois da recompensa:", player)
</script>

<template>
    <h1>QuestLife</h1>
</template>