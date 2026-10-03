<script setup>
import {
    ref,
    onMounted
} from "vue"

import TaskList from "../components/TaskList.vue"

import taskService from "../services/taskService"
import gameService from "../services/gameService"

const tasks = ref([])

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

    /*
     * A tarefa possui subtarefas
     * que ainda não foram concluídas.
     */
    if (
        result.success === false &&
        result.reason ===
            "pending-subtasks"
    ) {
        alert(
            "Conclua todas as etapas antes de finalizar a missão."
        )

        refreshTasks()

        return
    }

    /*
     * A tarefa já foi concluída
     * ou já falhou.
     */
    if (
        result.success === false &&
        result.reason ===
            "task-finished"
    ) {
        refreshTasks()

        return
    }

    refreshTasks()
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
        refreshTasks()

        return
    }

    refreshTasks()
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
    /*
     * Primeiro alteramos a subtarefa.
     *
     * O taskService salva essa alteração
     * no localStorage.
     */
    const result =
        taskService.toggleSubtask(
            taskId,
            subtaskId
        )

    /*
     * Se ocorreu algum problema,
     * apenas atualizamos a interface.
     */
    if (!result?.success) {
        refreshTasks()

        return
    }

    /*
     * IMPORTANTE:
     *
     * Depois de alterar a subtarefa,
     * buscamos novamente a tarefa
     * diretamente do localStorage.
     *
     * Assim não dependemos de
     * allCompleted ou
     * allSubtasksCompleted.
     */
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

    /*
     * A conclusão automática só acontece
     * quando:
     *
     * - existem subtarefas;
     * - todas estão marcadas;
     * - a tarefa ainda não foi concluída;
     * - a tarefa não falhou.
     */
    const shouldComplete =
        subtasks.length > 0 &&
        subtasks.every(
            subtask =>
                subtask.completed === true
        ) &&
        !updatedTask.completed &&
        !updatedTask.failed

    /*
     * Se todas as etapas terminaram,
     * usamos o gameService.
     *
     * Ele será responsável por:
     *
     * - concluir a tarefa;
     * - dar XP;
     * - dar moedas.
     */
    if (shouldComplete) {
        const completionResult =
            gameService.completeTaskById(
                taskId
            )

        /*
         * Esse console.error fica
         * temporariamente para diagnóstico.
         *
         * Se algo impedir a conclusão,
         * saberemos exatamente o motivo.
         */
        if (
            !completionResult?.success
        ) {
            console.error(
                "Erro ao concluir tarefa automaticamente:",
                completionResult
            )
        }
    }

    /*
     * Por último atualizamos a tela
     * com os dados atuais.
     */
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

    margin-bottom: 30px;
    padding-bottom: 22px;

    border-bottom:
        1px solid #29364a;
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

    border:
        1px solid #aa5cf2;

    border-radius: 7px;

    font-size: 12px;
    font-weight: bold;

    transition: 0.2s;
}

.new-task-button:hover {
    transform:
        translateY(-1px);

    box-shadow:
        0 0 15px
        rgba(
            147,
            44,
            255,
            0.25
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
}
</style>