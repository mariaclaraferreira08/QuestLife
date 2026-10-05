<script setup>
import TaskList from "../TaskList.vue"

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

function completeTask(taskId) {
    emit(
        "complete-task",
        taskId
    )
}

function failTask(taskId) {
    emit(
        "fail-task",
        taskId
    )
}

function removeTask(taskId) {
    emit(
        "remove-task",
        taskId
    )
}

function addSubtask(
    taskId,
    title
) {
    emit(
        "add-subtask",
        taskId,
        title
    )
}

function toggleSubtask(
    taskId,
    subtaskId
) {
    emit(
        "toggle-subtask",
        taskId,
        subtaskId
    )
}
</script>

<template>
    <section class="quests">
        <div class="section-header">
            <div>
                <span class="eyebrow">
                    ACTIVE QUESTS
                </span>

                <h2>
                    Missões ativas
                </h2>

                <p>
                    Continue avançando nas
                    missões que ainda estão
                    pendentes.
                </p>
            </div>

            <RouterLink
                to="/tasks/new"
                class="create-button"
            >
                + Nova missão
            </RouterLink>
        </div>

        <TaskList
            v-if="tasks.length > 0"
            :tasks="tasks"
            @complete-task="completeTask"
            @fail-task="failTask"
            @remove-task="removeTask"
            @add-subtask="addSubtask"
            @toggle-subtask="toggleSubtask"
        />

        <div
            v-else
            class="empty-state"
        >
            <span class="empty-icon">
                ✓
            </span>

            <div>
                <strong>
                    Nenhuma missão ativa
                </strong>

                <p>
                    Você concluiu suas missões
                    atuais ou ainda não criou
                    uma nova.
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.quests {
    padding: 28px;

    background:
        rgba(
            21,
            31,
            48,
            0.92
        );

    border: 1px solid #2d3a51;
    border-radius: 14px;
}

.section-header {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 25px;

    margin-bottom: 20px;
}

.eyebrow {
    color: #bd7cff;

    font-size: 11px;
    font-weight: 700;

    letter-spacing: 2px;
}

.section-header h2 {
    margin: 6px 0;

    color: #f2f5fb;

    font-size: 23px;
}

.section-header p {
    margin: 0;

    color: #8f9caf;

    font-size: 12px;
}

.create-button {
    flex-shrink: 0;

    padding: 11px 16px;

    color: white;

    text-decoration: none;

    background:
        linear-gradient(
            90deg,
            #7628df,
            #a52bed
        );

    border: 1px solid #a867f2;
    border-radius: 8px;

    font-size: 12px;
    font-weight: 700;

    transition: 0.2s;
}

.create-button:hover {
    color: white;

    transform:
        translateY(-1px);

    box-shadow:
        0 7px 18px
        rgba(
            145,
            48,
            231,
            0.2
        );
}

/*
 * =========================
 * ESTADO VAZIO
 * =========================
 */

.empty-state {
    min-height: 100px;

    padding: 20px;

    display: flex;

    align-items: center;

    gap: 15px;

    background: #101927;

    border: 1px dashed #354158;
    border-radius: 10px;
}

.empty-icon {
    width: 42px;
    height: 42px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #49d2a7;

    border: 1px solid #347e69;
    border-radius: 50%;

    font-size: 18px;
}

.empty-state strong {
    color: #e8edf5;
}

.empty-state p {
    margin: 4px 0 0;

    color: #8190a6;

    font-size: 12px;
}

@media (max-width: 700px) {
    .section-header {
        align-items: stretch;

        flex-direction: column;
    }

    .create-button {
        text-align: center;
    }
}
</style>