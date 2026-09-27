<script setup>
defineProps({
    tasks: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits([
    "complete-task",
    "fail-task",
    "remove-task",
    "add-subtask",
    "toggle-subtask"
])

function addSubtask(taskId) {
    const title = prompt("Digite o nome da subtarefa:")

    if (!title || !title.trim()) {
        return
    }

    emit("add-subtask", taskId, title.trim())
}
</script>

<template>
    <div class="task-list">
        <div
            v-if="tasks.length === 0"
            class="empty-state"
        >
            <span class="empty-icon">⚔</span>

            <h2>Nenhuma missão ativa</h2>

            <p>
                Sua jornada está esperando por uma nova missão.
            </p>

            <RouterLink
                to="/tasks/new"
                class="empty-button"
            >
                CRIAR PRIMEIRA MISSÃO
            </RouterLink>
        </div>

        <article
            v-for="task in tasks"
            :key="task.id"
            class="quest-card"
            :class="{
                completed: task.completed,
                failed: task.failed
            }"
        >
            <div class="quest-header">
                <div>
                    <div class="title-row">
                        <h2>
                            {{ task.title }}
                        </h2>

                        <span
                            class="difficulty"
                            :class="task.difficulty"
                        >
                            {{ task.difficulty }}
                        </span>
                    </div>

                    <p v-if="task.description">
                        {{ task.description }}
                    </p>
                </div>

                <button
                    class="delete-button"
                    title="Excluir missão"
                    @click="emit('remove-task', task.id)"
                >
                    ×
                </button>
            </div>

            <div
                v-if="task.deadline"
                class="deadline"
            >
                ◷ PRAZO: {{ task.deadline }}
            </div>

            <div
                v-if="task.subtasks?.length"
                class="subtasks"
            >
                <div
                    v-for="subtask in task.subtasks"
                    :key="subtask.id"
                    class="subtask"
                    @click="
                        emit(
                            'toggle-subtask',
                            task.id,
                            subtask.id
                        )
                    "
                >
                    <span
                        class="checkbox"
                        :class="{
                            checked: subtask.completed
                        }"
                    >
                        {{ subtask.completed ? "✓" : "" }}
                    </span>

                    <span
                        :class="{
                            crossed: subtask.completed
                        }"
                    >
                        {{ subtask.title }}
                    </span>
                </div>
            </div>

            <button
                v-if="!task.completed && !task.failed"
                class="add-subtask"
                @click="addSubtask(task.id)"
            >
                + Adicionar etapa
            </button>

            <div class="quest-actions">
                <template
                    v-if="!task.completed && !task.failed"
                >
                    <button
                        class="complete-button"
                        @click="
                            emit(
                                'complete-task',
                                task.id
                            )
                        "
                    >
                        ✓ CONCLUIR
                    </button>

                    <button
                        class="fail-button"
                        @click="
                            emit(
                                'fail-task',
                                task.id
                            )
                        "
                    >
                        ✕ FALHAR
                    </button>
                </template>

                <span
                    v-else-if="task.completed"
                    class="completed-label"
                >
                    ✓ MISSÃO CONCLUÍDA
                </span>

                <span
                    v-else-if="task.failed"
                    class="failed-label"
                >
                    ✕ MISSÃO FALHOU
                </span>
            </div>
        </article>
    </div>
</template>

<style scoped>
.task-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.empty-state {
    min-height: 400px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;

    background: #121c2d;

    border: 1px dashed #3b4960;
    border-radius: 12px;
}

.empty-icon {
    color: #9e52ef;

    font-size: 42px;
}

.empty-state h2 {
    margin: 18px 0 7px;
}

.empty-state p {
    margin-bottom: 22px;

    color: #7e8a9e;
}

.empty-button {
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

.quest-card {
    padding: 20px;

    background: #151f30;

    border: 1px solid #354158;
    border-radius: 11px;

    transition: 0.2s;
}

.quest-card:hover {
    border-color: #62428c;
}

.quest-card.completed {
    border-color: #287e6b;
}

.quest-card.failed {
    border-color: #7f3b4d;
}

.quest-header {
    display: flex;
    justify-content: space-between;

    gap: 20px;
}

.title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    gap: 12px;
}

.title-row h2 {
    margin: 0;

    font-size: 17px;
}

.quest-header p {
    margin: 7px 0 0;

    color: #8e9aae;

    font-size: 13px;
}

.difficulty {
    padding: 4px 8px;

    border: 1px solid;
    border-radius: 20px;

    font-size: 9px;

    text-transform: uppercase;

    letter-spacing: 1px;
}

.difficulty.trivial {
    color: #9ba7ba;
}

.difficulty.easy {
    color: #6fd6ad;
}

.difficulty.medium {
    color: #e5c756;
}

.difficulty.hard {
    color: #ef7d70;
}

.difficulty.legendary {
    color: #c982ff;
}

.delete-button {
    width: 30px;
    height: 30px;

    color: #758196;

    background: transparent;

    border: none;

    font-size: 21px;

    cursor: pointer;
}

.delete-button:hover {
    color: #ff617a;
}

.deadline {
    margin-top: 15px;

    color: #8290a5;

    font-size: 11px;
}

.subtasks {
    display: flex;
    flex-direction: column;

    gap: 8px;

    margin-top: 20px;
}

.subtask {
    display: flex;
    align-items: center;

    gap: 10px;

    color: #a3adbc;

    font-size: 13px;

    cursor: pointer;
}

.checkbox {
    width: 18px;
    height: 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #0d1421;

    border: 1px solid #66748a;
    border-radius: 4px;
}

.checkbox.checked {
    color: #0d1421;

    background: #48d8a9;

    border-color: #48d8a9;
}

.crossed {
    text-decoration: line-through;

    opacity: 0.6;
}

.add-subtask {
    margin-top: 15px;

    padding: 8px 12px;

    color: #ad79e8;

    background: transparent;

    border: 1px dashed #62428c;
    border-radius: 6px;

    cursor: pointer;
}

.quest-actions {
    display: flex;

    gap: 10px;

    margin-top: 20px;
    padding-top: 15px;

    border-top: 1px solid #29364a;
}

.complete-button,
.fail-button {
    padding: 8px 13px;

    border-radius: 6px;

    font-size: 10px;
    font-weight: bold;

    cursor: pointer;
}

.complete-button {
    color: #5ce4b8;

    background: rgba(42, 137, 109, 0.1);

    border: 1px solid #287e6b;
}

.fail-button {
    color: #ff7187;

    background: rgba(160, 53, 76, 0.1);

    border: 1px solid #7f3b4d;
}

.completed-label {
    color: #48d8a9;

    font-size: 11px;
    letter-spacing: 1px;
}

.failed-label {
    color: #ff7187;

    font-size: 11px;
    letter-spacing: 1px;
}
</style>