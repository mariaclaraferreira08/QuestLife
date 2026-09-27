<script setup>
import { ref } from "vue"

const emit = defineEmits([
    "add-task"
])

const title = ref("")
const description = ref("")
const difficulty = ref("easy")

function submitTask() {
    if (!title.value.trim()) {
        return
    }

    const task = {
        title: title.value,
        description: description.value,
        difficulty: difficulty.value
    }

    emit("add-task", task)

    title.value = ""
    description.value = ""
    difficulty.value = "easy"
}
</script>

<template>
    <section class="task-form">
        <h2>Nova tarefa</h2>

        <form @submit.prevent="submitTask">
            <div class="mb-3">
                <label class="form-label">
                    Título
                </label>

                <input
                    v-model="title"
                    type="text"
                    class="form-control"
                    placeholder="Ex: Estudar Banco de Dados"
                    required
                >
            </div>

            <div class="mb-3">
                <label class="form-label">
                    Descrição
                </label>

                <textarea
                    v-model="description"
                    class="form-control"
                    placeholder="Ex: Resolver exercícios de JOIN"
                ></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">
                    Dificuldade
                </label>

                <select
                    v-model="difficulty"
                    class="form-select"
                >
                    <option value="trivial">
                        Trivial
                    </option>

                    <option value="easy">
                        Fácil
                    </option>

                    <option value="medium">
                        Médio
                    </option>

                    <option value="hard">
                        Difícil
                    </option>

                    <option value="legendary">
                        Lendário
                    </option>
                </select>
            </div>

            <button
                type="submit"
                class="btn btn-primary"
            >
                Criar tarefa
            </button>
        </form>
    </section>
</template>

<style scoped>
.task-form {
    max-width: 600px;
    margin-top: 30px;
    padding: 20px;

    background: #212529;
    color: white;

    border-radius: 12px;
}
</style>
