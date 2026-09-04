<script setup>
import storageService from './services/storageService'

const player = {
  name: 'Maria',
  level: 1,
  xp: 0,
  coins: 100,
}

storageService.save('player', player)

const savedPlayer = storageService.get('player')

console.log(savedPlayer)
</script>

<template>
  <h1>QuestLife</h1>
</template>
