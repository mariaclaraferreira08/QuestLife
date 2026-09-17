import storageService from "./storageService"

const TASKS_KEY = "tasks"

const taskService = {
    getTasks() {
        const tasks = storageService.get(TASKS_KEY)

        if (!tasks) {
            return []
        }

        return tasks
    },

    addTask(task) {
    const tasks = this.getTasks()

    const newTask = {
        ...task,
        id: Date.now()
    }

    tasks.push(newTask)

    storageService.save(TASKS_KEY, tasks)

    return tasks
    },

    updateTask(taskId, updatedData) {
        const tasks = this.getTasks()

        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    ...updatedData
                }
            }

            return task
        })

        storageService.save(TASKS_KEY, updatedTasks)

        return updatedTasks
    },

    completeTask(taskId) {
    return this.updateTask(taskId, {
        completed: true
    })
},

    removeTask(taskId) {
        const tasks = this.getTasks()

        const updatedTasks = tasks.filter(task => task.id !== taskId)

        storageService.save(TASKS_KEY, updatedTasks)

        return updatedTasks
    }
}

export default taskService
