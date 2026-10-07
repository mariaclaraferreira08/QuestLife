import storageService from "./storageService"
import authService from "./authService"

const LEGACY_KEY = "habits"
const MIGRATION_KEY = "questlife_legacy_migrations"

function getHabitsKey() {
    return authService.getUserStorageKey("habits")
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

function migrateLegacyHabits() {
    const email =
        authService.getCurrentEmail()

    if (!email) {
        return []
    }

    const migrations =
        getMigrationData()

    if (
        migrations.habits
    ) {
        return []
    }

    const legacyHabits =
        storageService.get(
            LEGACY_KEY
        )

    migrations.habits =
        email

    storageService.save(
        MIGRATION_KEY,
        migrations
    )

    if (
        !Array.isArray(
            legacyHabits
        ) ||
        legacyHabits.length ===
            0
    ) {
        storageService.save(
            getHabitsKey(),
            []
        )

        return []
    }

    storageService.save(
        getHabitsKey(),
        legacyHabits
    )

    return legacyHabits
}

const habitService = {
    /*
     * =========================
     * CRUD
     * =========================
     */

    getHabits() {
        if (
            !authService.isAuthenticated()
        ) {
            return []
        }

        const key =
            getHabitsKey()

        const storedHabits =
            storageService.get(key)

        if (
            Array.isArray(
                storedHabits
            )
        ) {
            return storedHabits
        }

        return migrateLegacyHabits()
    },

    getHabitById(habitId) {
        return this
            .getHabits()
            .find(
                habit =>
                    habit.id ===
                    habitId
            )
    },

    addHabit(habit) {
        const habits =
            this.getHabits()

        const newHabit = {
            ...habit,
            id:
                habit.id ||
                crypto.randomUUID(),
            frequency:
                habit.frequency ||
                "daily",
            daysOfWeek:
                habit.daysOfWeek ||
                [],
            weeklyGoal:
                habit.weeklyGoal ||
                null,
            monthlyGoal:
                habit.monthlyGoal ||
                null,
            completions:
                habit.completions ||
                [],
            streak:
                habit.streak || 0,
            bestStreak:
                habit.bestStreak ||
                0,
            previousStreak:
                habit.previousStreak ||
                0,
            lastCompletedAt:
                habit.lastCompletedAt ||
                null,
            failed:
                habit.failed ||
                false,
            failedAt:
                habit.failedAt ||
                null,
            createdAt:
                habit.createdAt ||
                new Date()
                    .toISOString()
        }

        habits.push(newHabit)

        storageService.save(
            getHabitsKey(),
            habits
        )

        return newHabit
    },

    updateHabit(
        habitId,
        updatedData
    ) {
        const habits =
            this.getHabits()

        const updatedHabits =
            habits.map(
                habit => {
                    if (
                        habit.id ===
                        habitId
                    ) {
                        return {
                            ...habit,
                            ...updatedData
                        }
                    }

                    return habit
                }
            )

        storageService.save(
            getHabitsKey(),
            updatedHabits
        )

        return updatedHabits.find(
            habit =>
                habit.id ===
                habitId
        )
    },

    removeHabit(habitId) {
        const habits =
            this.getHabits()

        const updatedHabits =
            habits.filter(
                habit =>
                    habit.id !==
                    habitId
            )

        storageService.save(
            getHabitsKey(),
            updatedHabits
        )

        return updatedHabits
    },

    /*
     * =========================
     * DATAS
     * =========================
     */

    isSameDay(
        dateA,
        dateB
    ) {
        return (
            dateA.getFullYear() ===
                dateB.getFullYear() &&
            dateA.getMonth() ===
                dateB.getMonth() &&
            dateA.getDate() ===
                dateB.getDate()
        )
    },

    getTodayName() {
        const days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ]

        return days[
            new Date().getDay()
        ]
    },

    isCompletedToday(habit) {
        if (!habit) {
            return false
        }

        const today =
            new Date()

        const completions =
            habit.completions ||
            []

        const completed =
            completions.some(
                completion =>
                    this.isSameDay(
                        new Date(
                            completion
                        ),
                        today
                    )
            )

        if (completed) {
            return true
        }

        if (
            habit.lastCompletedAt
        ) {
            return this.isSameDay(
                new Date(
                    habit.lastCompletedAt
                ),
                today
            )
        }

        return false
    },

    isFailedToday(habit) {
        if (
            !habit ||
            !habit.failed
        ) {
            return false
        }

        if (
            !habit.failedAt
        ) {
            return false
        }

        return this.isSameDay(
            new Date(
                habit.failedAt
            ),
            new Date()
        )
    },

    isScheduledForToday(habitId) {
        const habit =
            this.getHabitById(
                habitId
            )

        if (!habit) {
            return false
        }

        const frequency =
            habit.frequency ||
            "daily"

        if (
            frequency ===
            "monthly"
        ) {
            return true
        }

        if (
            !habit.daysOfWeek ||
            habit.daysOfWeek.length ===
                0
        ) {
            return true
        }

        const today =
            this.getTodayName()

        return habit.daysOfWeek
            .includes(today)
    },

    /*
     * =========================
     * SEMANA
     * =========================
     */

    getWeekStart(
        date = new Date()
    ) {
        const result =
            new Date(date)

        result.setHours(
            0,
            0,
            0,
            0
        )

        const day =
            result.getDay()

        const difference =
            day === 0
                ? -6
                : 1 - day

        result.setDate(
            result.getDate() +
                difference
        )

        return result
    },

    getWeekCompletions(
        habit
    ) {
        const start =
            this.getWeekStart()

        return (
            habit.completions ||
            []
        ).filter(
            completion => {
                const date =
                    new Date(
                        completion
                    )

                return (
                    date >= start
                )
            }
        ).length
    },

    /*
     * =========================
     * MÊS
     * =========================
     */

    getMonthCompletions(
        habit
    ) {
        const today =
            new Date()

        return (
            habit.completions ||
            []
        ).filter(
            completion => {
                const date =
                    new Date(
                        completion
                    )

                return (
                    date.getFullYear() ===
                        today.getFullYear() &&
                    date.getMonth() ===
                        today.getMonth()
                )
            }
        ).length
    },

    /*
     * =========================
     * PROGRESSO
     * =========================
     */

    getCurrentProgress(
        habitId
    ) {
        const habit =
            this.getHabitById(
                habitId
            )

        if (!habit) {
            return {
                current: 0,
                goal: 0
            }
        }

        if (
            habit.frequency ===
            "weekly"
        ) {
            return {
                current:
                    this.getWeekCompletions(
                        habit
                    ),
                goal:
                    habit.weeklyGoal ||
                    1
            }
        }

        if (
            habit.frequency ===
            "monthly"
        ) {
            return {
                current:
                    this.getMonthCompletions(
                        habit
                    ),
                goal:
                    habit.monthlyGoal ||
                    1
            }
        }

        return {
            current:
                this.isCompletedToday(
                    habit
                )
                    ? 1
                    : 0,
            goal: 1
        }
    },

    /*
     * =========================
     * VALIDAÇÃO
     * =========================
     */

    canCompleteToday(
        habitId
    ) {
        const habit =
            this.getHabitById(
                habitId
            )

        if (!habit) {
            return {
                allowed: false,
                reason: "not-found"
            }
        }

        if (
            !this.isScheduledForToday(
                habitId
            )
        ) {
            return {
                allowed: false,
                reason:
                    "not-scheduled-today"
            }
        }

        if (
            this.isCompletedToday(
                habit
            )
        ) {
            return {
                allowed: false,
                reason:
                    "already-completed-today"
            }
        }

        if (
            this.isFailedToday(
                habit
            )
        ) {
            return {
                allowed: false,
                reason:
                    "already-failed-today"
            }
        }

        if (
            habit.frequency ===
                "weekly" ||
            habit.frequency ===
                "monthly"
        ) {
            const progress =
                this.getCurrentProgress(
                    habitId
                )

            if (
                progress.current >=
                progress.goal
            ) {
                return {
                    allowed: false,
                    reason:
                        "goal-completed"
                }
            }
        }

        return {
            allowed: true
        }
    },

    /*
     * =========================
     * CONCLUIR
     * =========================
     */

    completeHabit(habitId) {
        const habit =
            this.getHabitById(
                habitId
            )

        if (!habit) {
            return {
                success: false,
                reason: "not-found"
            }
        }

        const permission =
            this.canCompleteToday(
                habitId
            )

        if (
            !permission.allowed
        ) {
            return {
                success: false,
                reason:
                    permission.reason
            }
        }

        const now =
            new Date()
                .toISOString()

        const completions = [
            ...(habit.completions || []),
            now
        ]

        let newStreak =
            habit.streak || 0

        const frequency =
            habit.frequency ||
            "daily"

        if (
            frequency === "daily"
        ) {
            newStreak++
        }

        if (
            frequency ===
            "weekly"
        ) {
            const currentBefore =
                this.getWeekCompletions(
                    habit
                )

            const goal =
                habit.weeklyGoal ||
                1

            if (
                currentBefore <
                    goal &&
                currentBefore + 1 >=
                    goal
            ) {
                newStreak++
            }
        }

        if (
            frequency ===
            "monthly"
        ) {
            const currentBefore =
                this.getMonthCompletions(
                    habit
                )

            const goal =
                habit.monthlyGoal ||
                1

            if (
                currentBefore <
                    goal &&
                currentBefore + 1 >=
                    goal
            ) {
                newStreak++
            }
        }

        const newBestStreak =
            Math.max(
                habit.bestStreak ||
                    0,
                newStreak
            )

        const updatedHabit =
            this.updateHabit(
                habitId,
                {
                    completions,
                    streak:
                        newStreak,
                    bestStreak:
                        newBestStreak,
                    lastCompletedAt:
                        now,
                    failed: false,
                    failedAt: null
                }
            )

        return {
            success: true,
            habit:
                updatedHabit
        }
    },

    /*
     * =========================
     * FALHAR
     * =========================
     */

    failHabit(habitId) {
        const habit =
            this.getHabitById(
                habitId
            )

        if (!habit) {
            return {
                success: false,
                reason: "not-found"
            }
        }

        if (
            !this.isScheduledForToday(
                habitId
            )
        ) {
            return {
                success: false,
                reason:
                    "not-scheduled-today"
            }
        }

        if (
            this.isCompletedToday(
                habit
            )
        ) {
            return {
                success: false,
                reason:
                    "already-completed-today"
            }
        }

        if (
            this.isFailedToday(
                habit
            )
        ) {
            return {
                success: false,
                reason:
                    "habit-already-failed"
            }
        }

        const updatedHabit =
            this.updateHabit(
                habitId,
                {
                    previousStreak:
                        habit.streak ||
                        0,
                    streak: 0,
                    failed: true,
                    failedAt:
                        new Date()
                            .toISOString()
                }
            )

        return {
            success: true,
            habit:
                updatedHabit
        }
    }
}

export default habitService