import storageService from "./storageService"

const TASKS_KEY = "tasks"

const taskService = {
    getTasks() {
        return (
            storageService.get(
                TASKS_KEY
            ) || []
        )
    },

    getTaskById(taskId) {
        return this
            .getTasks()
            .find(
                task =>
                    task.id === taskId
            )
    },

    addTask(task) {
        const tasks =
            this.getTasks()

        /*
         * Preserva subtarefas que possam
         * ter sido criadas no formulário.
         */
        const subtasks =
            (task.subtasks || [])
                .map(subtask => {
                    /*
                     * Caso o formulário ainda
                     * envie apenas strings.
                     */
                    if (
                        typeof subtask ===
                        "string"
                    ) {
                        return {
                            id:
                                crypto.randomUUID(),

                            title:
                                subtask,

                            completed:
                                false
                        }
                    }

                    /*
                     * Caso já envie objetos.
                     */
                    return {
                        id:
                            subtask.id ||
                            crypto.randomUUID(),

                        title:
                            subtask.title,

                        completed:
                            Boolean(
                                subtask.completed
                            )
                    }
                })

        const newTask = {
            ...task,

            id:
                crypto.randomUUID(),

            completed:
                false,

            failed:
                false,

            subtasks,

            createdAt:
                new Date()
                    .toISOString()
        }

        tasks.push(
            newTask
        )

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
                if (
                    task.id !== taskId
                ) {
                    return task
                }

                return {
                    ...task,
                    ...updatedData
                }
            })

        storageService.save(
            TASKS_KEY,
            updatedTasks
        )

        return this.getTaskById(
            taskId
        )
    },

    completeTask(taskId) {
        const task =
            this.getTaskById(
                taskId
            )

        if (!task) {
            return null
        }

        if (
            task.completed ||
            task.failed
        ) {
            return task
        }

        return this.updateTask(
            taskId,
            {
                completed: true,

                completedAt:
                    new Date()
                        .toISOString()
            }
        )
    },

    failTask(taskId) {
        const task =
            this.getTaskById(
                taskId
            )

        if (!task) {
            return null
        }

        if (
            task.completed ||
            task.failed
        ) {
            return task
        }

        return this.updateTask(
            taskId,
            {
                failed: true,

                failedAt:
                    new Date()
                        .toISOString()
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
            this.getTaskById(
                taskId
            )

        if (!task) {
            return null
        }

        /*
         * Não permite adicionar etapas
         * depois da missão terminar.
         */
        if (
            task.completed ||
            task.failed
        ) {
            return task
        }

        const cleanTitle =
            title.trim()

        if (!cleanTitle) {
            return task
        }

        const newSubtask = {
            id:
                crypto.randomUUID(),

            title:
                cleanTitle,

            completed:
                false
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
            this.getTaskById(
                taskId
            )

        if (!task) {
            return {
                success: false,
                reason:
                    "task-not-found"
            }
        }

        /*
         * Missão finalizada não pode
         * mais ter subtarefas alteradas.
         */
        if (
            task.completed ||
            task.failed
        ) {
            return {
                success: false,
                reason:
                    "task-finished",

                task
            }
        }

        const subtasks =
            (task.subtasks || [])
                .map(subtask => {
                    if (
                        subtask.id !==
                        subtaskId
                    ) {
                        return subtask
                    }

                    return {
                        ...subtask,

                        completed:
                            !subtask.completed
                    }
                })

        /*
         * Primeiro salvamos o novo estado
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
         * Só considera conclusão automática
         * quando realmente existem subtarefas.
         */
        const hasSubtasks =
            subtasks.length > 0

        const allSubtasksCompleted =
            hasSubtasks &&
            subtasks.every(
                subtask =>
                    subtask.completed
            )

        return {
            success: true,

            task:
                updatedTask,

            allSubtasksCompleted
        }
    },

    areAllSubtasksCompleted(
        taskId
    ) {
        const task =
            this.getTaskById(
                taskId
            )

        if (!task) {
            return false
        }

        const subtasks =
            task.subtasks || []

        if (
            subtasks.length === 0
        ) {
            return false
        }

        return subtasks.every(
            subtask =>
                subtask.completed
        )
    }
}

export default taskService
