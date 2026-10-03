import playerService from "./playerService"
import taskService from "./taskService"
import habitService from "./habitService"
import dailyService from "./dailyService"

import { difficulties } from "../data/difficulties"

const gameService = {
    getDifficulty(difficulty) {
        return difficulties[difficulty]
    },

    /*
     * =========================
     * JOGADOR
     * =========================
     */

    addXP(amount) {
        const player =
            playerService.getPlayer()

        const newXP =
            (player.xp || 0) + amount

        playerService.updatePlayer({
            xp: newXP
        })

        return this.levelUp()
    },

    levelUp() {
        const player =
            playerService.getPlayer()

        let level =
            player.level || 1

        let xp =
            player.xp || 0

        while (xp >= 100) {
            xp -= 100
            level += 1
        }

        return playerService.updatePlayer({
            level,
            xp
        })
    },

    addCoins(amount) {
        const player =
            playerService.getPlayer()

        const newCoins =
            (player.coins || 0) + amount

        return playerService.updatePlayer({
            coins: newCoins
        })
    },

    removeCoins(amount) {
        const player =
            playerService.getPlayer()

        const currentCoins =
            player.coins || 0

        const newCoins =
            Math.max(
                0,
                currentCoins - amount
            )

        return playerService.updatePlayer({
            coins: newCoins
        })
    },

    takeDamage(amount) {
        const player =
            playerService.getPlayer()

        const currentHealth =
            typeof player.health === "number"
                ? player.health
                : 100

        const newHealth =
            Math.max(
                0,
                currentHealth - amount
            )

        return playerService.updatePlayer({
            health: newHealth
        })
    },

    /*
     * =========================
     * RECOMPENSAS
     * =========================
     */

    rewardPlayer(difficulty) {
        const reward =
            this.getDifficulty(
                difficulty
            )

        if (!reward) {
            return null
        }

        this.addXP(
            reward.xp
        )

        this.addCoins(
            reward.coins
        )

        return playerService.getPlayer()
    },

    /*
     * =========================
     * PENALIDADES
     * =========================
     */

    punishPlayer(difficulty) {
        const reward =
            this.getDifficulty(
                difficulty
            )

        if (!reward) {
            return null
        }

        this.takeDamage(
            reward.damage
        )

        this.removeCoins(
            reward.coins
        )

        return playerService.getPlayer()
    },

    /*
     * =========================
     * TAREFAS
     * =========================
     */

    completeTaskAndReward(task) {
        return this.rewardPlayer(
            task.difficulty
        )
    },

    completeTaskById(taskId) {
        const task =
            taskService.getTaskById(
                taskId
            )

        if (!task) {
            return {
                success: false,
                reason: "task-not-found"
            }
        }

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
            task.subtasks || []

        const hasPendingSubtasks =
            subtasks.some(
                subtask =>
                    !subtask.completed
            )

        if (hasPendingSubtasks) {
            return {
                success: false,
                reason: "pending-subtasks"
            }
        }

        taskService.completeTask(
            taskId
        )

        const player =
            this.completeTaskAndReward(
                task
            )

        return {
            success: true,
            player
        }
    },

    failTaskById(taskId) {
        const task =
            taskService.getTaskById(
                taskId
            )

        if (!task) {
            return {
                success: false,
                reason: "task-not-found"
            }
        }

        if (
            task.completed ||
            task.failed
        ) {
            return {
                success: false,
                reason: "task-finished"
            }
        }

        taskService.failTask(
            taskId
        )

        const player =
            this.failTask(
                task.difficulty
            )

        return {
            success: true,
            player
        }
    },

    failTask(difficulty) {
        return this.punishPlayer(
            difficulty
        )
    },

    /*
     * =========================
     * HÁBITOS
     * =========================
     */

    completeHabitById(habitId) {
        const habit =
            habitService.getHabitById(
                habitId
            )

        if (!habit) {
            return {
                success: false,
                reason: "habit-not-found"
            }
        }

        const result =
            habitService.completeHabit(
                habitId
            )

        if (!result.success) {
            return result
        }

        const player =
            this.rewardPlayer(
                habit.difficulty
            )

        return {
            success: true,
            habit: result.habit,
            player
        }
    },

    failHabitById(habitId) {
        const habit =
            habitService.getHabitById(
                habitId
            )

        if (!habit) {
            return {
                success: false,
                reason: "habit-not-found"
            }
        }

        const result =
            habitService.failHabit(
                habitId
            )

        if (
            result &&
            result.success === false
        ) {
            return result
        }

        const player =
            this.punishPlayer(
                habit.difficulty
            )

        return {
            success: true,
            habit:
                result?.habit ||
                result,
            player
        }
    },

    /*
     * =========================
     * DIÁRIAS
     * =========================
     */

    completeDailyById(dailyId) {
        const daily =
            dailyService.getDailyById(
                dailyId
            )

        if (!daily) {
            return {
                success: false,
                reason: "daily-not-found"
            }
        }

        const result =
            dailyService.completeDaily(
                dailyId
            )

        if (!result.success) {
            return result
        }

        const player =
            this.rewardPlayer(
                daily.difficulty
            )

        return {
            success: true,
            daily: result.daily,
            player
        }
    }
}

export default gameService