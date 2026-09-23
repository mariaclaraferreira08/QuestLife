import playerService from "./playerService"
import taskService from "./taskService"
import { difficulties } from "../data/difficulties"

const gameService = {
    addXP(amount) {
        const player = playerService.getPlayer()

        const newXP = player.xp + amount

        playerService.updatePlayer({
            xp: newXP
        })

        return this.levelUp()
    },

    levelUp() {
        const player = playerService.getPlayer()

        let level = player.level
        let xp = player.xp

        while (xp >= 100) {
            xp = xp - 100
            level = level + 1
        }

        return playerService.updatePlayer({
            level: level,
            xp: xp
        })
    },

    addCoins(amount) {
        const player = playerService.getPlayer()

        const newCoins = player.coins + amount

        return playerService.updatePlayer({
            coins: newCoins
        })
    },

    takeDamage(amount) {
        const player = playerService.getPlayer()

        const newHealth = Math.max(0, player.health - amount)

        return playerService.updatePlayer({
            health: newHealth
        })
    },

    getDifficulty(difficulty) {
        return difficulties[difficulty]
    },

    completeTaskAndReward(task) {
        const reward = this.getDifficulty(task.difficulty)

        this.addXP(reward.xp)

        return this.addCoins(reward.coins)
    },

    completeTaskById(taskId) {
        const task = taskService.getTaskById(taskId)

        if (!task) {
            return null
        }

        if (task.completed || task.failed) {
            return null
        }

        taskService.completeTask(taskId)

        return this.completeTaskAndReward(task)
    },

    failTaskById(taskId) {
        const task = taskService.getTaskById(taskId)

        if (!task) {
            return null
        }

        if (task.completed || task.failed) {
            return null
        }

        taskService.failTask(taskId)

        return this.failTask(task.difficulty)
    },

    failTask(difficulty) {
        const reward = this.getDifficulty(difficulty)

        return this.takeDamage(reward.damage)
    }
}

export default gameService
