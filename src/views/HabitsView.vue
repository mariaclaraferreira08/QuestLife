<script setup>
import { ref, onMounted } from "vue"

import HabitForm from "../components/habits/HabitForm.vue"
import HabitCard from "../components/habits/HabitCard.vue"

import habitService from "../services/habitService"

const habits = ref([])
const showForm = ref(false)

function refreshHabits() {
    habits.value = [...habitService.getHabits()]
}

function createHabit(habitData) {
    habitService.addHabit(habitData)

    showForm.value = false

    refreshHabits()
}

function completeHabit(habitId) {
    const result = habitService.completeHabit(habitId)

    if (!result.success) {
        if (result.reason === "already-completed-today") {
            alert("Você já concluiu este hábito hoje.")
        }

        if (result.reason === "not-scheduled-today") {
            alert("Este hábito não está programado para hoje.")
        }

        return
    }

    refreshHabits()
}

function failHabit(habitId) {
    habitService.failHabit(habitId)

    refreshHabits()
}

function removeHabit(habitId) {
    habitService.removeHabit(habitId)

    refreshHabits()
}

onMounted(refreshHabits)
</script>

<template>
    <section class="habits-page">
        <header class="page-header">
            <div>
                <span>DAILY ROUTINES</span>

                <h1>Hábitos</h1>

                <p>
                    Construa sequências e fortaleça
                    seu personagem todos os dias.
                </p>
            </div>

            <button
                v-if="!showForm"
                @click="showForm = true"
            >
                + NOVO HÁBITO
            </button>
        </header>

        <HabitForm
            v-if="showForm"
            @create="createHabit"
            @cancel="showForm = false"
        />

        <section
            v-else-if="habits.length === 0"
            class="empty-state"
        >
            <span>🔥</span>

            <h2>Nenhum hábito criado</h2>

            <p>
                Comece uma rotina e construa
                sua primeira sequência.
            </p>

            <button @click="showForm = true">
                CRIAR PRIMEIRO HÁBITO
            </button>
        </section>

        <section
            v-else
            class="habit-list"
        >
            <HabitCard
                v-for="habit in habits"
                :key="habit.id"
                :habit="habit"
                @complete="completeHabit"
                @fail="failHabit"
                @remove="removeHabit"
            />
        </section>
    </section>
</template>