<script setup>
import gameService from "./services/gameService"

const player = gameService.takeDamage(20)

console.log("Jogador:", player)
</script>

<template>
    <h1>QuestLife</h1>
</template>
