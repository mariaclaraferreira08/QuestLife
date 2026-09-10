<script setup>
import { ref, onMounted } from "vue"
import taskService from "@/services/taskService"

const tasks = ref([])
const newTask = ref("")
const editingTaskId = ref(null)

onMounted(() => {
  tasks.value = taskService.getTasks()
})

function addTask() {
  if (!newTask.value.trim()) {
    return
  }

  const task = {
    id: Date.now(),
    title: newTask.value,
    description: "",
    difficulty: "trivial",
    completed: false
  }

  tasks.value = taskService.addTask(task)

  newTask.value = ""
}

function editTask(task) {
  newTask.value = task.title
  editingTaskId.value = task.id
}

function saveTask() {
  if (!newTask.value.trim()) {
    return
  }

  tasks.value = taskService.updateTask(editingTaskId.value, {
    title: newTask.value
  })

  newTask.value = ""
  editingTaskId.value = null
}

function removeTask(taskId) {
  tasks.value = taskService.removeTask(taskId)
}
</script>

<template>
  <div>
    <h2>Minhas Tarefas</h2>

    <input v-model="newTask" placeholder="Adicione uma tarefa">

    <button v-if="editingTaskId === null" @click="addTask">Adicionar</button>

    <button v-else @click="saveTask">Salvar</button>

    <div v-for="task in tasks" :key="task.id">
      <span>{{ task.title }}</span>

      <button @click="editTask(task)">Editar</button>

      <button @click="removeTask(task.id)">Excluir</button>
    </div>
  </div>
</template>