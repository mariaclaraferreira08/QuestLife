import storageService from "./storageService"

const TASKS_KEY = "tasks"

const taskService = {
    getTasks() {
        return storageService.get(TASKS_KEY) || []
    },

    getTaskById(taskId) {
        return this.getTasks().find(task => task.id === taskId)
    },

    addTask(task) {
        const tasks = this.getTasks()

        const newTask = {
            ...task,
            id: crypto.randomUUID(),
            completed: false,
            failed: false,
            subtasks: []
        }

        tasks.push(newTask)

        storageService.save(TASKS_KEY, tasks)

        return newTask
    },

    updateTask(taskId, updatedData) {
        const tasks = this.getTasks()

        const updatedTasks = tasks.map(task =>
            task.id === taskId
                ? { ...task, ...updatedData }
                : task
        )

        storageService.save(TASKS_KEY, updatedTasks)

        return this.getTaskById(taskId)
    },

    completeTask(taskId) {
        return this.updateTask(taskId, {
            completed: true
        })
    },

    failTask(taskId) {
        return this.updateTask(taskId, {
            failed: true
        })
    },

    removeTask(taskId) {
        const tasks = this.getTasks()

        const updatedTasks = tasks.filter(
            task => task.id !== taskId
        )

        storageService.save(TASKS_KEY, updatedTasks)

        return updatedTasks
    },

    addSubtask(taskId, title) {
        const task = this.getTaskById(taskId)

        if (!task) {
            return null
        }

      const newSubtask = {
        id: crypto.randomUUID(),
        title: title,
        completed: false
}

        const subtasks = [
            ...(task.subtasks || []),
            newSubtask
        ]

        return this.updateTask(taskId, {
            subtasks: subtasks
        })
    },

    toggleSubtask(taskId, subtaskId) {
        const task = this.getTaskById(taskId)

        if (!task) {
            return null
        }

        const subtasks = (task.subtasks || []).map(subtask => {
            if (subtask.id === subtaskId) {
                return {
                    ...subtask,
                    completed: !subtask.completed
                }
            }

            return subtask
        })

        return this.updateTask(taskId, {
            subtasks: subtasks
        })
    }
}

export default taskService
