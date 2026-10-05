import playerService from "./playerService"
import taskService from "./taskService"
import habitService from "./habitService"
import dailyService from "./dailyService"

import { difficulties } from "../data/difficulties"

const PROTECTION_ITEM_ID =
    "protectionAmulet"

const PROTECTION_PERCENTAGE =
    0.5

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

    /*
     * =========================
     * PROTEÇÃO
     * =========================
     */

    hasProtectionAmulet() {
        return (
            playerService.getItemQuantity(
                PROTECTION_ITEM_ID
            ) > 0
        )
    },

    calculateDamage(amount) {
        if (!this.hasProtectionAmulet()) {
            return {
                originalDamage: amount,
                finalDamage: amount,
                protected: false
            }
        }

        /*
         * O amuleto reduz 50%
         * do próximo dano.
         *
         * Math.ceil impede que um dano
         * pequeno vire zero.
         */
        const finalDamage =
            Math.ceil(
                amount *
                (1 - PROTECTION_PERCENTAGE)
            )

        return {
            originalDamage: amount,
            finalDamage,
            protected: true
        }
    },

    takeDamage(amount) {
        const player =
            playerService.getPlayer()

        const currentHealth =
            typeof player.health === "number"
                ? player.health
                : 100

        const damage =
            this.calculateDamage(
                amount
            )

        const newHealth =
            Math.max(
                0,
                currentHealth -
                damage.finalDamage
            )

        /*
         * Atualiza a vida primeiro.
         */
        playerService.updatePlayer({
            health: newHealth
        })

        /*
         * Se houve proteção,
         * o amuleto é consumido.
         */
        if (damage.protected) {
            playerService.removeItem(
                PROTECTION_ITEM_ID,
                1
            )
        }

        return {
            player:
                playerService.getPlayer(),

            originalDamage:
                damage.originalDamage,

            damageTaken:
                damage.finalDamage,

            protected:
                damage.protected
        }
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

        const damageResult =
            this.takeDamage(
                reward.damage
            )

        this.removeCoins(
            reward.coins
        )

        return {
            player:
                playerService.getPlayer(),

            damage:
                damageResult
        }
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

        const punishment =
            this.failTask(
                task.difficulty
            )

        return {
            success: true,

            player:
                punishment?.player ||
                punishment,

            damage:
                punishment?.damage
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

        const punishment =
            this.punishPlayer(
                habit.difficulty
            )

        return {
            success: true,

            habit:
                result?.habit ||
                result,

            player:
                punishment?.player ||
                punishment,

            damage:
                punishment?.damage
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
    },

    failDailyById(dailyId) {
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
            dailyService.failDaily(
                dailyId
            )

        if (!result.success) {
            return result
        }

        const punishment =
            this.punishPlayer(
                daily.difficulty
            )

        return {
            success: true,

            daily:
                result.daily,

            player:
                punishment?.player ||
                punishment,

            damage:
                punishment?.damage
        }
    }
}

/*
 * TEMPORÁRIO:
 * facilita os testes no console.
 */
if (typeof window !== "undefined") {
    window.gameService =
        gameService
}

export default gameService