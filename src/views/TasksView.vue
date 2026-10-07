<script setup>
import {
    ref,
    computed,
    onMounted
} from "vue"

import TaskList from "../components/TaskList.vue"
import TaskFilters from "../components/tasks/TaskFilters.vue"
import TaskFeedback from "../components/tasks/TaskFeedback.vue"

import taskService from "../services/taskService"
import gameService from "../services/gameService"

const tasks = ref([])

const filters = ref({
    status: "all",
    difficulty: "all",
    order: "newest"
})

const feedback = ref({
    show: false,
    type: "info",
    title: "",
    message: ""
})

/*
 * =========================
 * FILTROS
 * =========================
 */

function isTaskToday(task) {
    if (!task.deadline) {
        return false
    }

    const deadline =
        new Date(
            `${task.deadline}T00:00:00`
        )

    const today =
        new Date()

    return (
        deadline.getFullYear() ===
            today.getFullYear() &&
        deadline.getMonth() ===
            today.getMonth() &&
        deadline.getDate() ===
            today.getDate()
    )
}

const filteredTasks =
    computed(() => {
        let result = [
            ...tasks.value
        ]

        if (
            filters.value.status ===
            "today"
        ) {
            result = result.filter(
                task =>
                    isTaskToday(
                        task
                    )
            )
        }

        if (
            filters.value.status ===
            "pending"
        ) {
            result = result.filter(
                task =>
                    !task.completed &&
                    !task.failed
            )
        }

        if (
            filters.value.status ===
            "completed"
        ) {
            result = result.filter(
                task =>
                    task.completed
            )
        }

        if (
            filters.value.status ===
            "failed"
        ) {
            result = result.filter(
                task =>
                    task.failed
            )
        }

        if (
            filters.value.difficulty !==
            "all"
        ) {
            result = result.filter(
                task =>
                    task.difficulty ===
                    filters.value.difficulty
            )
        }

        if (
            filters.value.order ===
            "newest"
        ) {
            result.reverse()
        }

        return result
    })

/*
 * =========================
 * FEEDBACK
 * =========================
 */

function showFeedback(
    type,
    title,
    message
) {
    feedback.value = {
        show: true,
        type,
        title,
        message
    }
}

function closeFeedback() {
    feedback.value.show =
        false
}

/*
 * =========================
 * TAREFAS
 * =========================
 */

function refreshTasks() {
    tasks.value = [
        ...taskService.getTasks()
    ]
}

function completeTask(
    taskId
) {
    const result =
        gameService.completeTaskById(
            taskId
        )

    if (!result) {
        return
    }

    if (
        result.success === false &&
        result.reason ===
            "pending-subtasks"
    ) {
        showFeedback(
            "warning",
            "Etapas pendentes",
            "Conclua todas as etapas antes de finalizar a missão."
        )

        refreshTasks()

        return
    }

    if (
        result.success === false &&
        result.reason ===
            "task-finished"
    ) {
        showFeedback(
            "warning",
            "Missão já encerrada",
            "Esta missão já foi concluída ou marcada como falha."
        )

        refreshTasks()

        return
    }

    if (
        result.success === false &&
        result.reason ===
            "task-not-found"
    ) {
        showFeedback(
            "error",
            "Missão não encontrada",
            "Não foi possível encontrar esta missão."
        )

        refreshTasks()

        return
    }

    refreshTasks()

    showFeedback(
        "success",
        "Missão concluída!",
        "Você recebeu XP e moedas pela conclusão desta missão."
    )
}

function failTask(
    taskId
) {
    const result =
        gameService.failTaskById(
            taskId
        )

    if (!result) {
        return
    }

    if (
        result.success === false
    ) {
        if (
            result.reason ===
            "task-finished"
        ) {
            showFeedback(
                "warning",
                "Missão já encerrada",
                "Esta missão já foi concluída ou marcada como falha."
            )
        } else if (
            result.reason ===
            "task-not-found"
        ) {
            showFeedback(
                "error",
                "Missão não encontrada",
                "Não foi possível encontrar esta missão."
            )
        } else {
            showFeedback(
                "error",
                "Não foi possível falhar a missão",
                "Ocorreu um problema ao registrar a falha."
            )
        }

        refreshTasks()

        return
    }

    refreshTasks()

    const damage =
        result.damage

    if (
        damage?.protected
    ) {
        showFeedback(
            "special",
            "Amuleto de Proteção ativado!",
            `O dano foi reduzido de ${damage.originalDamage} para ${damage.damageTaken} HP.`
        )

        return
    }

    showFeedback(
        "error",
        "Missão marcada como falha",
        "Você perdeu HP e moedas por esta missão."
    )
}

function removeTask(
    taskId
) {
    taskService.removeTask(
        taskId
    )

    refreshTasks()

    showFeedback(
        "info",
        "Missão removida",
        "A missão foi removida da sua lista."
    )
}

function addSubtask(
    taskId,
    title
) {
    taskService.addSubtask(
        taskId,
        title
    )

    refreshTasks()

    showFeedback(
        "info",
        "Etapa adicionada",
        "Uma nova etapa foi adicionada à missão."
    )
}

function toggleSubtask(
    taskId,
    subtaskId
) {
    const result =
        taskService.toggleSubtask(
            taskId,
            subtaskId
        )

    if (!result?.success) {
        refreshTasks()

        showFeedback(
            "error",
            "Não foi possível atualizar",
            "Ocorreu um problema ao atualizar esta etapa."
        )

        return
    }

    const updatedTask =
        taskService.getTaskById(
            taskId
        )

    if (!updatedTask) {
        refreshTasks()

        return
    }

    const subtasks =
        updatedTask.subtasks || []

    const shouldComplete =
        subtasks.length > 0 &&
        subtasks.every(
            subtask =>
                subtask.completed ===
                true
        ) &&
        !updatedTask.completed &&
        !updatedTask.failed

    if (shouldComplete) {
        const completionResult =
            gameService.completeTaskById(
                taskId
            )

        if (
            !completionResult?.success
        ) {
            console.error(
                "Erro ao concluir tarefa automaticamente:",
                completionResult
            )
        } else {
            showFeedback(
                "success",
                "Missão concluída!",
                "Todas as etapas foram concluídas e suas recompensas foram recebidas."
            )
        }
    }

    refreshTasks()
}

/*
 * =========================
 * INICIALIZAÇÃO
 * =========================
 */

onMounted(() => {
    refreshTasks()
})
</script>

<template>
    <section class="tasks-page">
        <header class="tasks-header">
            <div>
                <span class="eyebrow">
                    QUEST LOG
                </span>

                <h1>
                    Suas missões
                </h1>

                <p>
                    Complete missões para ganhar XP e moedas.
                </p>
            </div>

            <RouterLink
                to="/tasks/new"
                class="new-task-button"
            >
                + NOVA MISSÃO
            </RouterLink>
        </header>

        <TaskFeedback
            :feedback="feedback"
            @close="closeFeedback"
        />

        <TaskFilters
            v-model="filters"
            :total="filteredTasks.length"
        />

        <div
            v-if="
                tasks.length > 0 &&
                filteredTasks.length === 0
            "
            class="filter-empty"
        >
            Nenhuma missão encontrada com os filtros selecionados.
        </div>

        <TaskList
            v-else
            :tasks="filteredTasks"
            @complete-task="completeTask"
            @fail-task="failTask"
            @remove-task="removeTask"
            @add-subtask="addSubtask"
            @toggle-subtask="toggleSubtask"
        />
    </section>
</template>

<style scoped>
.tasks-page {
    width: 100%;
    max-width: 1050px;
    margin: 0 auto;
    color: #eef1f7;
}

.tasks-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 24px;
    padding-bottom: 22px;
    border-bottom: 1px solid #29364a;
}

.eyebrow {
    color: #ad6df1;
    font-size: 11px;
    letter-spacing: 2px;
}

.tasks-header h1 {
    margin: 5px 0 7px;
    font-size: 27px;
}

.tasks-header p {
    margin: 0;
    color: #8793a7;
    font-size: 13px;
}

.new-task-button {
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
    transition: 0.2s;
}

.new-task-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 15px rgba(147, 44, 255, 0.25);
}

.filter-empty {
    padding: 30px;
    color: #77869a;
    text-align: center;
    background: #101927;
    border: 1px dashed #354158;
    border-radius: 10px;
    font-size: 11px;
}

@media (max-width: 700px) {
    .tasks-header {
        align-items: stretch;
        flex-direction: column;
    }

    .new-task-button {
        text-align: center;
    }
}
</style>
