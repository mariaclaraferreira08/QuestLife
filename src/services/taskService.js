import storageService from "./storageService"

const TASKS_KEY = "tasks"

const taskService = {
    getTasks() {
        return storageService.get(TASKS_KEY) || []
    },

    getTaskById(taskId) {
        return this
            .getTasks()
            .find(
                task => task.id === taskId
            )
    },

    addTask(task) {
        const tasks = this.getTasks()

        const newTask = {
            ...task,

            id: crypto.randomUUID(),

            completed: false,
            failed: false,

            subtasks:
                task.subtasks || []
        }

        tasks.push(newTask)

        storageService.save(
            TASKS_KEY,
            tasks
        )

        return newTask
    },

    updateTask(
        taskId,
        updatedData
    ) {
        const tasks =
            this.getTasks()

        const updatedTasks =
            tasks.map(task => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        ...updatedData
                    }
                }

                return task
            })

        storageService.save(
            TASKS_KEY,
            updatedTasks
        )

        return updatedTasks.find(
            task => task.id === taskId
        )
    },

    completeTask(taskId) {
        return this.updateTask(
            taskId,
            {
                completed: true,
                failed: false
            }
        )
    },

    failTask(taskId) {
        const task =
            this.getTaskById(taskId)

        if (!task) {
            return null
        }

        /*
         * Ao falhar, as subtarefas são
         * desmarcadas.
         */
        const resetSubtasks =
            (task.subtasks || []).map(
                subtask => ({
                    ...subtask,
                    completed: false
                })
            )

        return this.updateTask(
            taskId,
            {
                failed: true,
                completed: false,
                subtasks: resetSubtasks
            }
        )
    },

    removeTask(taskId) {
        const tasks =
            this.getTasks()

        const updatedTasks =
            tasks.filter(
                task =>
                    task.id !== taskId
            )

        storageService.save(
            TASKS_KEY,
            updatedTasks
        )

        return updatedTasks
    },

    addSubtask(
        taskId,
        title
    ) {
        const task =
            this.getTaskById(taskId)

        if (!task) {
            return null
        }

        /*
         * Não deixa adicionar subtarefa
         * em missão finalizada.
         */
        if (
            task.completed ||
            task.failed
        ) {
            return null
        }

        const newSubtask = {
            id: crypto.randomUUID(),
            title,
            completed: false
        }

        const subtasks = [
            ...(task.subtasks || []),
            newSubtask
        ]

        return this.updateTask(
            taskId,
            {
                subtasks
            }
        )
    },

    toggleSubtask(
        taskId,
        subtaskId
    ) {
        const task =
            this.getTaskById(taskId)

        if (!task) {
            return {
                success: false,
                reason: "task-not-found"
            }
        }

        /*
         * Missão concluída ou falhada
         * não pode mais ser alterada.
         */
        if (
            task.completed ||
            task.failed
        ) {
            return {
                success: false,
                reason: "task-finished"
            }
        }

        const subtasks =
            (task.subtasks || []).map(
                subtask => {
                    if (
                        subtask.id ===
                        subtaskId
                    ) {
                        return {
                            ...subtask,

                            completed:
                                !subtask.completed
                        }
                    }

                    return subtask
                }
            )

        /*
         * Salva primeiro o novo estado
         * das subtarefas.
         */
        const updatedTask =
            this.updateTask(
                taskId,
                {
                    subtasks
                }
            )

        /*
         * Verifica se existem subtarefas
         * e se TODAS foram concluídas.
         */
        const allCompleted =
            subtasks.length > 0 &&
            subtasks.every(
                subtask =>
                    subtask.completed
            )

        return {
            success: true,
            task: updatedTask,
            allCompleted
        }
    }
}

export default taskService
