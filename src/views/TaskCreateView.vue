<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import taskService from "../services/taskService"

const router = useRouter()

const title = ref("")
const description = ref("")
const difficulty = ref("easy")
const deadline = ref("")

const subtasks = ref([])
const newSubtaskTitle = ref("")

const difficulties = [
    {
        id: "trivial",
        name: "Trivial",
        symbol: "✦"
    },
    {
        id: "easy",
        name: "Fácil",
        symbol: "✦✦"
    },
    {
        id: "medium",
        name: "Médio",
        symbol: "✦✦✦"
    },
    {
        id: "hard",
        name: "Difícil",
        symbol: "✦✦✦✦"
    },
    {
        id: "legendary",
        name: "Lendário",
        symbol: "♛"
    }
]

function addSubtask() {
    const text = newSubtaskTitle.value.trim()

    if (!text) {
        return
    }

    subtasks.value.push({
        id: crypto.randomUUID(),
        title: text,
        completed: false
    })

    newSubtaskTitle.value = ""
}

function removeSubtask(subtaskId) {
    subtasks.value = subtasks.value.filter(
        subtask => subtask.id !== subtaskId
    )
}

function createTask() {
    const taskTitle = title.value.trim()

    if (!taskTitle) {
        return
    }

    const newTask = taskService.addTask({
        title: taskTitle,
        description: description.value.trim(),
        difficulty: difficulty.value,
        deadline: deadline.value || null
    })

    subtasks.value.forEach(subtask => {
        taskService.addSubtask(
            newTask.id,
            subtask.title
        )
    })

    router.push("/tasks")
}
</script>

<template>
    <section class="create-page">
        <header class="page-header">
            <RouterLink
                to="/tasks"
                class="back-button"
            >
                ←
            </RouterLink>

            <div class="header-title">
                <span>NEW QUEST</span>
                <h1>Criar missão</h1>
            </div>

            <button
                class="create-button"
                :disabled="title.trim().length === 0"
                @click="createTask"
            >
                CRIAR
            </button>
        </header>

        <div class="form-content">
            <section class="field-card">
                <label for="title">
                    TÍTULO DA MISSÃO
                </label>

                <input
                    id="title"
                    v-model="title"
                    type="text"
                    placeholder="Ex: Estudar Banco de Dados"
                    maxlength="80"
                >
            </section>

            <section class="field-card">
                <label for="description">
                    NOTAS
                </label>

                <textarea
                    id="description"
                    v-model="description"
                    placeholder="Adicione detalhes sobre sua missão..."
                    rows="5"
                ></textarea>
            </section>

            <section class="form-section">
                <div class="section-title">
                    <div>
                        <span>QUEST STEPS</span>
                        <h2>Checklist</h2>
                    </div>

                    <small>
                        {{ subtasks.length }} itens
                    </small>
                </div>

                <div
                    v-if="subtasks.length"
                    class="subtask-list"
                >
                    <div
                        v-for="subtask in subtasks"
                        :key="subtask.id"
                        class="subtask-item"
                    >
                        <div class="subtask-left">
                            <span class="checkbox-preview"></span>

                            {{ subtask.title }}
                        </div>

                        <button
                            type="button"
                            class="remove-subtask"
                            @click="removeSubtask(subtask.id)"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div class="add-subtask">
                    <span class="plus">+</span>

                    <input
                        v-model="newSubtaskTitle"
                        type="text"
                        placeholder="Nova etapa da missão"
                        @keyup.enter="addSubtask"
                    >

                    <button
                        type="button"
                        @click="addSubtask"
                    >
                        ADICIONAR
                    </button>
                </div>
            </section>

            <section class="form-section">
                <div class="section-title">
                    <div>
                        <span>QUEST LEVEL</span>
                        <h2>Dificuldade</h2>
                    </div>
                </div>

                <div class="difficulty-grid">
                    <button
                        v-for="item in difficulties"
                        :key="item.id"
                        type="button"
                        class="difficulty-option"
                        :class="{
                            selected: difficulty === item.id
                        }"
                        @click="difficulty = item.id"
                    >
                        <span class="difficulty-symbol">
                            {{ item.symbol }}
                        </span>

                        <strong>
                            {{ item.name }}
                        </strong>
                    </button>
                </div>
            </section>

            <section class="form-section">
                <div class="section-title">
                    <div>
                        <span>SCHEDULING</span>
                        <h2>Prazo</h2>
                    </div>
                </div>

                <div class="date-field">
                    <div>
                        <span>DATA LIMITE</span>

                        <strong>
                            {{ deadline || "Sem prazo definido" }}
                        </strong>
                    </div>

                    <input
                        v-model="deadline"
                        type="date"
                    >
                </div>
            </section>

            <div class="bottom-actions">
                <RouterLink
                    to="/tasks"
                    class="cancel-button"
                >
                    CANCELAR
                </RouterLink>

                <button
                    class="save-button"
                    :disabled="title.trim().length === 0"
                    @click="createTask"
                >
                    + CRIAR MISSÃO
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.create-page {
    width: 100%;
    max-width: 950px;
    margin: 0 auto 60px;
    color: #eef1f7;
}

.page-header {
    display: grid;
    grid-template-columns: 50px 1fr auto;
    align-items: center;
    gap: 18px;
    padding-bottom: 22px;
    border-bottom: 1px solid #29364a;
}

.back-button {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    color: #c993ff;
    text-decoration: none;
    background: #151f30;
    border: 1px solid #35435b;
    border-radius: 8px;
    font-size: 23px;
}

.header-title span,
.section-title span {
    color: #ad6df1;
    font-size: 11px;
    letter-spacing: 2px;
}

.header-title h1 {
    margin: 3px 0 0;
    font-size: 25px;
}

.create-button {
    padding: 10px 20px;
    color: white;
    background: transparent;
    border: 1px solid #9250da;
    border-radius: 7px;
    font-weight: bold;
}

.create-button:disabled,
.save-button:disabled {
    cursor: not-allowed;
    opacity: 0.4;
}

.form-content {
    display: flex;
    flex-direction: column;
    gap: 26px;
    margin-top: 28px;
}

.field-card {
    padding: 22px;
    background: #151f30;
    border: 1px solid #344158;
    border-radius: 10px;
}

.field-card:focus-within {
    border-color: #8e49df;
}

.field-card label {
    display: block;
    margin-bottom: 10px;
    color: #b47aee;
    font-size: 12px;
    letter-spacing: 1px;
}

.field-card input,
.field-card textarea {
    width: 100%;
    color: #f3f5fa;
    background: transparent;
    border: none;
    outline: none;
}

.field-card input {
    font-size: 20px;
}

.field-card textarea {
    resize: vertical;
    line-height: 1.6;
}

.field-card input::placeholder,
.field-card textarea::placeholder,
.add-subtask input::placeholder {
    color: #68758a;
}

.section-title {
    display: flex;
    align-items: end;
    justify-content: space-between;
    margin-bottom: 14px;
}

.section-title h2 {
    margin: 3px 0 0;
    font-size: 20px;
}

.section-title small {
    color: #748196;
}

.subtask-list {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 9px;
}

.subtask-item {
    min-height: 52px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #151f30;
    border: 1px solid #303d53;
    border-radius: 8px;
}

.subtask-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.checkbox-preview {
    width: 17px;
    height: 17px;
    border: 1px solid #8d54ca;
    border-radius: 4px;
}

.remove-subtask {
    color: #8e9aae;
    background: transparent;
    border: none;
    font-size: 21px;
}

.add-subtask {
    min-height: 58px;
    padding: 8px 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #192338;
    border: 1px dashed #664292;
    border-radius: 9px;
}

.plus {
    color: #9b4ff0;
    font-size: 27px;
}

.add-subtask input {
    flex: 1;
    color: white;
    background: transparent;
    border: none;
    outline: none;
}

.add-subtask button {
    padding: 8px 12px;
    color: #c897fa;
    background: transparent;
    border: 1px solid #684494;
    border-radius: 6px;
}

.difficulty-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
}

.difficulty-option {
    min-height: 105px;
    padding: 14px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #aab4c6;
    background: #171f31;
    border: 1px solid #354158;
    border-radius: 10px;
}

.difficulty-option.selected {
    color: white;
    background: linear-gradient(145deg, #3d2862, #22213d);
    border-color: #aa6af1;
    box-shadow: 0 0 18px rgba(139, 57, 232, 0.18);
}

.difficulty-symbol {
    color: #b986f3;
    font-size: 19px;
}

.date-field {
    min-height: 80px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #171f31;
    border: 1px solid #354158;
    border-radius: 10px;
}

.date-field div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.date-field span {
    color: #9d69d4;
    font-size: 11px;
}

.date-field input {
    padding: 9px;
    color: white;
    color-scheme: dark;
    background: #0d1421;
    border: 1px solid #39475f;
    border-radius: 6px;
}

.bottom-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.cancel-button,
.save-button {
    padding: 12px 18px;
    border-radius: 7px;
    font-weight: bold;
    text-decoration: none;
}

.cancel-button {
    color: #aab4c6;
    background: #171f31;
    border: 1px solid #354158;
}

.save-button {
    color: white;
    background: linear-gradient(90deg, #7227dc, #a928ef);
    border: 1px solid #aa5cf2;
}

@media (max-width: 850px) {
    .difficulty-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>