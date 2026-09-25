import storageService from "./storageService"

const HABITS_KEY = "habits"

const habitService = {
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
            streak: 0,
            bestStreak: 0,
            lastCompletedAt: null,
            failed: false
        }

        habits.push(newHabit)

        storageService.save(HABITS_KEY, habits)

        return newHabit
    },

    updateHabit(habitId, updatedData) {
        const habits = this.getHabits()

        const updatedHabits = habits.map(habit => {
            if (habit.id === habitId) {
                return {
                    ...habit,
                    ...updatedData
                }
            }

            return habit
        })

        storageService.save(HABITS_KEY, updatedHabits)

        return this.getHabitById(habitId)
    },

    removeHabit(habitId) {
        const habits = this.getHabits()

        const updatedHabits = habits.filter(
            habit => habit.id !== habitId
        )

        storageService.save(HABITS_KEY, updatedHabits)

        return updatedHabits
    },

    canCompleteToday(habitId) {
        const habit = this.getHabitById(habitId)

        if (!habit) {
            return false
        }

        if (!habit.lastCompletedAt) {
            return true
        }

        const lastCompleted = new Date(
            habit.lastCompletedAt
        )

        const today = new Date()

        const sameDay =
            lastCompleted.getFullYear() === today.getFullYear() &&
            lastCompleted.getMonth() === today.getMonth() &&
            lastCompleted.getDate() === today.getDate()

        return !sameDay
    },

    completeHabit(habitId) {
        const habit = this.getHabitById(habitId)

        if (!habit) {
            return null
        }

        if (!this.canCompleteToday(habitId)) {
            return null
        }

        const newStreak = habit.streak + 1

        const newBestStreak = Math.max(
            habit.bestStreak,
            newStreak
        )

        return this.updateHabit(habitId, {
            streak: newStreak,
            bestStreak: newBestStreak,
            lastCompletedAt: new Date().toISOString(),
            failed: false
        })
    },

    failHabit(habitId) {
        const habit = this.getHabitById(habitId)

        if (!habit) {
            return null
        }

        return this.updateHabit(habitId, {
            streak: 0,
            failed: true
        })
    }
}

export default habitService
