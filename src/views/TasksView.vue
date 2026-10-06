<script setup>
import {
    ref,
    onMounted
} from "vue"

import TaskList from "../components/TaskList.vue"

import taskService from "../services/taskService"
import gameService from "../services/gameService"

const tasks = ref([])

const feedback = ref({
    show: false,
    type: "info",
    title: "",
    message: ""
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
    feedback.value.show = false
}

/*
 * =========================
 * ATUALIZAR LISTA
 * =========================
 */

function refreshTasks() {
    tasks.value = [
        ...taskService.getTasks()
    ]
}

/*
 * =========================
 * CONCLUIR TAREFA
 * =========================
 */

function completeTask(taskId) {
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

/*
 * =========================
 * FALHAR TAREFA
 * =========================
 */

function failTask(taskId) {
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

    if (damage?.protected) {
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

/*
 * =========================
 * REMOVER TAREFA
 * =========================
 */

function removeTask(taskId) {
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

/*
 * =========================
 * ADICIONAR SUBTAREFA
 * =========================
 */

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

/*
 * =========================
 * MARCAR / DESMARCAR
 * SUBTAREFA
 * =========================
 */

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
                subtask.completed === true
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
                    Complete missões para
                    ganhar XP e moedas.
                </p>
            </div>

            <RouterLink
                to="/tasks/new"
                class="new-task-button"
            >
                + NOVA MISSÃO
            </RouterLink>
        </header>

        <div
            v-if="feedback.show"
            class="feedback"
            :class="feedback.type"
        >
            <div class="feedback-icon">
                <span v-if="feedback.type === 'success'">
                    ✓
                </span>

                <span v-else-if="feedback.type === 'warning'">
                    !
                </span>

                <span v-else-if="feedback.type === 'error'">
                    ×
                </span>

                <span v-else-if="feedback.type === 'special'">
                    ✦
                </span>

                <span v-else>
                    i
                </span>
            </div>

            <div class="feedback-content">
                <strong>
                    {{ feedback.title }}
                </strong>

                <p>
                    {{ feedback.message }}
                </p>
            </div>

            <button
                type="button"
                class="feedback-close"
                @click="closeFeedback"
            >
                ×
            </button>
        </div>

        <TaskList
            :tasks="tasks"
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

    background:
        linear-gradient(
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

    box-shadow:
        0 0 15px
        rgba(
            147,
            44,
            255,
            0.25
        );
}

/* =========================
   FEEDBACK
   ========================= */

.feedback {
    margin-bottom: 24px;
    padding: 14px 16px;

    display: grid;
    grid-template-columns:
        36px
        minmax(0, 1fr)
        auto;

    align-items: center;
    gap: 12px;

    background: #151f30;
    border: 1px solid #354158;
    border-radius: 10px;
}

.feedback-icon {
    width: 34px;
    height: 34px;

    display: grid;
    place-items: center;

    border-radius: 8px;

    font-size: 16px;
    font-weight: 800;
}

.feedback-content {
    min-width: 0;
}

.feedback-content strong {
    display: block;
    margin-bottom: 3px;

    color: #f2f5fb;

    font-size: 11px;
}

.feedback-content p {
    margin: 0;

    color: #929fb2;

    font-size: 10px;
    line-height: 1.5;
}

.feedback-close {
    padding: 4px;

    color: #768398;
    background: transparent;

    border: 0;

    font-size: 18px;
    cursor: pointer;
}

.feedback.success {
    border-color: #347e69;
}

.feedback.success .feedback-icon {
    color: #68e2b8;

    background:
        rgba(
            48,
            163,
            123,
            0.14
        );
}

.feedback.warning {
    border-color: #826a34;
}

.feedback.warning .feedback-icon {
    color: #f3c55b;

    background:
        rgba(
            206,
            158,
            54,
            0.13
        );
}

.feedback.error {
    border-color: #834456;
}

.feedback.error .feedback-icon {
    color: #ff7896;

    background:
        rgba(
            206,
            67,
            94,
            0.13
        );
}

.feedback.special {
    border-color: #75439f;

    background:
        linear-gradient(
            90deg,
            rgba(117, 67, 159, 0.13),
            #151f30 35%
        );
}

.feedback.special .feedback-icon {
    color: #ca82ff;

    background:
        rgba(
            160,
            73,
            222,
            0.14
        );

    box-shadow:
        0 0 14px
        rgba(
            165,
            73,
            226,
            0.13
        );
}

.feedback.info {
    border-color: #3f5674;
}

.feedback.info .feedback-icon {
    color: #8eb8ee;

    background:
        rgba(
            73,
            119,
            178,
            0.13
        );
}

@media (max-width: 700px) {
    .tasks-header {
        align-items: stretch;
        flex-direction: column;
    }

    .new-task-button {
        text-align: center;
    }

    .feedback {
        grid-template-columns:
            34px
            minmax(0, 1fr)
            auto;
    }
}
</style>