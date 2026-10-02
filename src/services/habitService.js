import storageService from "./storageService"

const HABITS_KEY = "habits"

const habitService = {
    // ==========================================
    // CRUD
    // ==========================================

    getHabits() {
        return storageService.get(HABITS_KEY) || []
    },

    getHabitById(habitId) {
        return this.getHabits().find(
            habit => habit.id === habitId
        )
    },

    addHabit(habit) {
        const habits = this.getHabits()

        const newHabit = {
            ...habit,

            id: crypto.randomUUID(),

            frequency:
                habit.frequency || "daily",

            daysOfWeek:
                habit.daysOfWeek || [],

            weeklyGoal:
                habit.weeklyGoal || null,

            monthlyGoal:
                habit.monthlyGoal || null,

            /*
             * Guarda o histórico das conclusões.
             *
             * Cada item é uma data ISO.
             */
            completions: [],

            streak: 0,
            bestStreak: 0,
            previousStreak: 0,

            lastCompletedAt: null,

            failed: false
        }

        habits.push(newHabit)

        storageService.save(
            HABITS_KEY,
            habits
        )

        return newHabit
    },

    updateHabit(habitId, updatedData) {
        const habits = this.getHabits()

        const updatedHabits = habits.map(
            habit => {
                if (habit.id === habitId) {
                    return {
                        ...habit,
                        ...updatedData
                    }
                }

                return habit
            }
        )

        storageService.save(
            HABITS_KEY,
            updatedHabits
        )

        return this.getHabitById(habitId)
    },

    removeHabit(habitId) {
        const habits = this.getHabits()

        const updatedHabits =
            habits.filter(
                habit =>
                    habit.id !== habitId
            )

        storageService.save(
            HABITS_KEY,
            updatedHabits
        )

        return updatedHabits
    },

    // ==========================================
    // DATAS
    // ==========================================

    isSameDay(dateA, dateB) {
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

    /*
     * Descobre se o hábito pode ser
     * realizado no dia atual.
     *
     * DIÁRIO
     * - sem dias escolhidos:
     *   todos os dias.
     *
     * - com dias escolhidos:
     *   apenas nesses dias.
     *
     * SEMANAL
     * - respeita os dias escolhidos.
     *
     * MENSAL
     * - pode ser realizado em qualquer
     *   dia até atingir a meta do mês.
     */
    isScheduledForToday(habitId) {
        const habit =
            this.getHabitById(habitId)

        if (!habit) {
            return false
        }

        const frequency =
            habit.frequency || "daily"

        /*
         * Mensal não depende de
         * dias específicos.
         */
        if (frequency === "monthly") {
            return true
        }

        /*
         * Diário ou semanal sem
         * dias selecionados.
         *
         * Mantemos como disponível
         * para compatibilidade com
         * hábitos antigos.
         */
        if (
            !habit.daysOfWeek ||
            habit.daysOfWeek.length === 0
        ) {
            return true
        }

        const today =
            this.getTodayName()

        return habit.daysOfWeek.includes(
            today
        )
    },

    // ==========================================
    // SEMANA
    // ==========================================

    /*
     * Segunda-feira é considerada
     * o início da semana.
     */
    getWeekStart(date = new Date()) {
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

    getWeekCompletions(habit) {
        const start =
            this.getWeekStart()

        return (
            habit.completions || []
        ).filter(completion => {
            const date =
                new Date(completion)

            return date >= start
        }).length
    },

    // ==========================================
    // MÊS
    // ==========================================

    getMonthCompletions(habit) {
        const today =
            new Date()

        return (
            habit.completions || []
        ).filter(completion => {
            const date =
                new Date(completion)

            return (
                date.getFullYear() ===
                    today.getFullYear() &&

                date.getMonth() ===
                    today.getMonth()
            )
        }).length
    },

    // ==========================================
    // PROGRESSO
    // ==========================================

    getCurrentProgress(habitId) {
        const habit =
            this.getHabitById(habitId)

        if (!habit) {
            return {
                current: 0,
                goal: 0
            }
        }

        if (
            habit.frequency === "weekly"
        ) {
            return {
                current:
                    this.getWeekCompletions(
                        habit
                    ),

                goal:
                    habit.weeklyGoal || 1
            }
        }

        if (
            habit.frequency === "monthly"
        ) {
            return {
                current:
                    this.getMonthCompletions(
                        habit
                    ),

                goal:
                    habit.monthlyGoal || 1
            }
        }

        return {
            current: 0,
            goal: 1
        }
    },

    // ==========================================
    // PERMISSÃO PARA CONCLUIR
    // ==========================================

    canCompleteToday(habitId) {
        const habit =
            this.getHabitById(habitId)

        if (!habit) {
            return {
                allowed: false,
                reason: "not-found"
            }
        }

        /*
         * Primeiro verificamos se
         * hoje é um dia permitido.
         */
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

        /*
         * Máximo de uma conclusão
         * por dia.
         */
        const today =
            new Date()

        const completedToday =
            (
                habit.completions || []
            ).some(completion => {
                return this.isSameDay(
                    new Date(completion),
                    today
                )
            })

        /*
         * Compatibilidade com hábitos
         * antigos que ainda não tinham
         * completions[].
         */
        let legacyCompletedToday = false

        if (
            habit.lastCompletedAt &&
            (
                !habit.completions ||
                habit.completions.length === 0
            )
        ) {
            legacyCompletedToday =
                this.isSameDay(
                    new Date(
                        habit.lastCompletedAt
                    ),
                    today
                )
        }

        if (
            completedToday ||
            legacyCompletedToday
        ) {
            return {
                allowed: false,
                reason:
                    "already-completed-today"
            }
        }

        /*
         * Se a meta semanal já foi
         * concluída, não permite novas
         * conclusões nesta semana.
         */
        if (
            habit.frequency === "weekly"
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

        /*
         * O mesmo vale para a meta
         * mensal.
         */
        if (
            habit.frequency === "monthly"
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

    // ==========================================
    // CONCLUIR HÁBITO
    // ==========================================

    completeHabit(habitId) {
        const habit =
            this.getHabitById(habitId)

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

        if (!permission.allowed) {
            return {
                success: false,
                reason:
                    permission.reason
            }
        }

        const now =
            new Date().toISOString()

        const completions = [
            ...(habit.completions || []),
            now
        ]

        let newStreak =
            habit.streak || 0

        const frequency =
            habit.frequency || "daily"

        // ======================================
        // DIÁRIO
        // ======================================

        /*
         * Uma conclusão válida
         * representa um dia concluído.
         */
        if (frequency === "daily") {
            newStreak++
        }

        // ======================================
        // SEMANAL
        // ======================================

        /*
         * A streak semanal aumenta
         * SOMENTE quando a meta daquela
         * semana é alcançada.
         */
        if (frequency === "weekly") {
            const currentBefore =
                this.getWeekCompletions(
                    habit
                )

            const goal =
                habit.weeklyGoal || 1

            const currentAfter =
                currentBefore + 1

            if (
                currentBefore < goal &&
                currentAfter >= goal
            ) {
                newStreak++
            }
        }

        // ======================================
        // MENSAL
        // ======================================

        /*
         * A streak mensal aumenta
         * SOMENTE quando a meta daquele
         * mês é alcançada.
         */
        if (frequency === "monthly") {
            const currentBefore =
                this.getMonthCompletions(
                    habit
                )

            const goal =
                habit.monthlyGoal || 1

            const currentAfter =
                currentBefore + 1

            if (
                currentBefore < goal &&
                currentAfter >= goal
            ) {
                newStreak++
            }
        }

        const newBestStreak =
            Math.max(
                habit.bestStreak || 0,
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

                    failed: false
                }
            )

        return {
            success: true,
            habit: updatedHabit
        }
    },

    // ==========================================
    // FALHAR HÁBITO
    // ==========================================

    failHabit(habitId) {
        const habit =
            this.getHabitById(habitId)

        if (!habit) {
            return {
                success: false,
                reason: "not-found"
            }
        }

        const updatedHabit =
            this.updateHabit(
                habitId,
                {
                    previousStreak:
                        habit.streak || 0,

                    streak: 0,

                    failed: true
                }
            )

        return {
            success: true,
            habit: updatedHabit
        }
    }
}

export default habitService