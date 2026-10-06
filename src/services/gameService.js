import playerService from "./playerService"
import taskService from "./taskService"
import habitService from "./habitService"
import dailyService from "./dailyService"

import { difficulties } from "../data/difficulties"

const PROTECTION_PERCENTAGE =
    0.5

const gameService = {
    getDifficulty(difficulty) {
        return difficulties[
            difficulty
        ]
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
            (player.xp || 0) +
            amount

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
            (player.coins || 0) +
            amount

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
                currentCoins -
                amount
            )

        return playerService.updatePlayer({
            coins: newCoins
        })
    },

    /*
     * =========================
     * AMULETO
     * =========================
     */

    hasProtectionFor(
        targetType,
        targetId
    ) {
        const effect =
            playerService.getActiveEffect(
                "protection"
            )

        if (!effect) {
            return false
        }

        return (
            effect.targetType ===
                targetType &&
            effect.targetId ===
                targetId
        )
    },

    calculateDamage(
        amount,
        targetType,
        targetId
    ) {
        const protectedTarget =
            this.hasProtectionFor(
                targetType,
                targetId
            )

        if (!protectedTarget) {
            return {
                originalDamage:
                    amount,

                finalDamage:
                    amount,

                protected:
                    false
            }
        }

        const finalDamage =
            Math.ceil(
                amount *
                (
                    1 -
                    PROTECTION_PERCENTAGE
                )
            )

        return {
            originalDamage:
                amount,

            finalDamage,

            protected:
                true
        }
    },

    takeDamage(
        amount,
        targetType = null,
        targetId = null
    ) {
        const player =
            playerService.getPlayer()

        const currentHealth =
            typeof player.health ===
            "number"
                ? player.health
                : 100

        const damage =
            this.calculateDamage(
                amount,
                targetType,
                targetId
            )

        const newHealth =
            Math.max(
                0,
                currentHealth -
                damage.finalDamage
            )

        playerService.updatePlayer({
            health:
                newHealth
        })

        /*
         * A proteção já saiu da mochila
         * quando foi equipada.
         *
         * Agora apenas removemos o efeito.
         */
        if (damage.protected) {
            playerService.clearActiveEffect(
                "protection"
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
     * ELIXIR DE STREAK
     * =========================
     */

    hasStreakProtectionFor(
        dailyId
    ) {
        const effect =
            playerService.getActiveEffect(
                "streakProtection"
            )

        if (!effect) {
            return false
        }

        return (
            effect.targetType ===
                "daily" &&
            effect.targetId ===
                dailyId
        )
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

        return (
            playerService.getPlayer()
        )
    },

    /*
     * =========================
     * PENALIDADES
     * =========================
     */

    punishPlayer(
        difficulty,
        targetType,
        targetId
    ) {
        const reward =
            this.getDifficulty(
                difficulty
            )

        if (!reward) {
            return null
        }

        const damageResult =
            this.takeDamage(
                reward.damage,
                targetType,
                targetId
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
            task.subtasks || []

        const hasPendingSubtasks =
            subtasks.some(
                subtask =>
                    !subtask.completed
            )

        if (
            hasPendingSubtasks
        ) {
            return {
                success: false,
                reason:
                    "pending-subtasks"
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

        taskService.failTask(
            taskId
        )

        const punishment =
            this.punishPlayer(
                task.difficulty,
                "task",
                taskId
            )

        return {
            success: true,

            player:
                punishment?.player,

            damage:
                punishment?.damage
        }
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
                reason:
                    "habit-not-found"
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
            habit:
                result.habit,
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
                reason:
                    "habit-not-found"
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
                habit.difficulty,
                "habit",
                habitId
            )

        return {
            success: true,

            habit:
                result?.habit ||
                result,

            player:
                punishment?.player,

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
                reason:
                    "daily-not-found"
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
            daily:
                result.daily,
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
                reason:
                    "daily-not-found"
            }
        }

        const previousStreak =
            daily.streak || 0

        const streakProtected =
            previousStreak > 0 &&
            this.hasStreakProtectionFor(
                dailyId
            )

        const result =
            dailyService.failDaily(
                dailyId
            )

        if (!result.success) {
            return result
        }

        let updatedDaily =
            result.daily

        if (streakProtected) {
            updatedDaily =
                dailyService.updateDaily(
                    dailyId,
                    {
                        streak:
                            previousStreak
                    }
                )

            playerService.clearActiveEffect(
                "streakProtection"
            )
        }

        const punishment =
            this.punishPlayer(
                daily.difficulty,
                "daily",
                dailyId
            )

        return {
            success: true,

            daily:
                updatedDaily,

            player:
                punishment?.player,

            damage:
                punishment?.damage,

            streakProtected
        }
    }
}

if (typeof window !== "undefined") {
    window.gameService =
        gameService
}

export default gameService