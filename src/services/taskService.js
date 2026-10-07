import storageService from "./storageService"
import authService from "./authService"

const LEGACY_KEY = "tasks"
const MIGRATION_KEY = "questlife_legacy_migrations"

function getTasksKey() {
    return authService.getUserStorageKey("tasks")
}

function getMigrationData() {
    const migrations =
        storageService.get(MIGRATION_KEY)

    return migrations &&
        typeof migrations === "object" &&
        !Array.isArray(migrations)
        ? migrations
        : {}
}

function migrateLegacyTasks() {
    const email =
        authService.getCurrentEmail()

    if (!email) {
        return []
    }

    const migrations =
        getMigrationData()

    if (migrations.tasks) {
        return []
    }

    const legacyTasks =
        storageService.get(
            LEGACY_KEY
        )

    migrations.tasks =
        email

    storageService.save(
        MIGRATION_KEY,
        migrations
    )

    if (
        !Array.isArray(
            legacyTasks
        ) ||
        legacyTasks.length === 0
    ) {
        storageService.save(
            getTasksKey(),
            []
        )

        return []
    }

    storageService.save(
        getTasksKey(),
        legacyTasks
    )

    return legacyTasks
}

const taskService = {
    /*
     * =========================
     * CRUD
     * =========================
     */

    getTasks() {
        if (
            !authService.isAuthenticated()
        ) {
            return []
        }

        const key =
            getTasksKey()

        const storedTasks =
            storageService.get(key)

        if (
            Array.isArray(
                storedTasks
            )
        ) {
            return storedTasks
        }

        return migrateLegacyTasks()
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

        const newTask = {
            ...task,
            id:
                task.id ||
                crypto.randomUUID(),
            completed: false,
            failed: false,
            subtasks:
                task.subtasks || [],
            createdAt:
                task.createdAt ||
                new Date()
                    .toISOString()
        }

        tasks.push(newTask)

        storageService.save(
            getTasksKey(),
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
                    task.id === taskId
                ) {
                    return {
                        ...task,
                        ...updatedData
                    }
                }

                return task
            })

        storageService.save(
            getTasksKey(),
            updatedTasks
        )

        return updatedTasks.find(
            task =>
                task.id === taskId
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
            this.getTaskById(
                taskId
            )

        if (!task) {
            return null
        }

        const resetSubtasks =
            (
                task.subtasks ||
                []
            ).map(
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
                subtasks:
                    resetSubtasks
            }
        )
    },

    removeTask(taskId) {
        const tasks =
            this.getTasks()

        const updatedTasks =
            tasks.filter(
                task =>
                    task.id !==
                    taskId
            )

        storageService.save(
            getTasksKey(),
            updatedTasks
        )

        return updatedTasks
    },

    /*
     * =========================
     * SUBTAREFAS
     * =========================
     */

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

        if (
            task.completed ||
            task.failed
        ) {
            return null
        }

        const newSubtask = {
            id:
                crypto.randomUUID(),
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

        if (
            task.completed ||
            task.failed
        ) {
            return {
                success: false,
                reason:
                    "task-finished"
            }
        }

        const subtasks =
            (
                task.subtasks ||
                []
            ).map(
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

        const updatedTask =
            this.updateTask(
                taskId,
                {
                    subtasks
                }
            )

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