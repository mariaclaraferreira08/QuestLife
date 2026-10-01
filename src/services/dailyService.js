import storageService from "./storageService"

const DAILIES_KEY = "dailies"

const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
]

function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear()

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0")

    const day = String(
        date.getDate()
    ).padStart(2, "0")

    return `${year}-${month}-${day}`
}

const dailyService = {
    getDailies() {
        return (
            storageService.get(
                DAILIES_KEY
            ) || []
        )
    },

    getDailyById(dailyId) {
        return this
            .getDailies()
            .find(
                daily =>
                    daily.id === dailyId
            )
    },

    addDaily(daily) {
        const dailies =
            this.getDailies()

        const newDaily = {
            ...daily,

            id: crypto.randomUUID(),

            completedDates: [],

            streak: 0,
            bestStreak: 0,

            createdAt:
                new Date().toISOString()
        }

        dailies.push(newDaily)

        storageService.save(
            DAILIES_KEY,
            dailies
        )

        return newDaily
    },

    updateDaily(
        dailyId,
        updatedData
    ) {
        const dailies =
            this.getDailies()

        const updatedDailies =
            dailies.map(daily => {
                if (
                    daily.id === dailyId
                ) {
                    return {
                        ...daily,
                        ...updatedData
                    }
                }

                return daily
            })

        storageService.save(
            DAILIES_KEY,
            updatedDailies
        )

        return this.getDailyById(
            dailyId
        )
    },

    removeDaily(dailyId) {
        const updatedDailies =
            this.getDailies().filter(
                daily =>
                    daily.id !== dailyId
            )

        storageService.save(
            DAILIES_KEY,
            updatedDailies
        )

        return updatedDailies
    },

    isScheduledToday(daily) {
        const today =
            new Date()

        const todayKey =
            getLocalDateKey(today)

        /*
         * Ainda não começou.
         */
        if (
            daily.startDate &&
            todayKey < daily.startDate
        ) {
            return false
        }

        const todayName =
            dayNames[
                today.getDay()
            ]

        const days =
            daily.daysOfWeek || []

        /*
         * Se nenhum dia estiver salvo,
         * consideramos todos os dias.
         */
        if (days.length === 0) {
            return true
        }

        return days.includes(
            todayName
        )
    },

    isCompletedToday(daily) {
        const today =
            getLocalDateKey()

        return (
            daily.completedDates || []
        ).includes(today)
    },

    canCompleteToday(dailyId) {
        const daily =
            this.getDailyById(
                dailyId
            )

        if (!daily) {
            return {
                success: false,
                reason:
                    "daily-not-found"
            }
        }

        if (
            !this.isScheduledToday(
                daily
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
                daily
            )
        ) {
            return {
                success: false,
                reason:
                    "already-completed-today"
            }
        }

        return {
            success: true
        }
    },

    completeDaily(dailyId) {
        const validation =
            this.canCompleteToday(
                dailyId
            )

        if (!validation.success) {
            return validation
        }

        const daily =
            this.getDailyById(
                dailyId
            )

        const today =
            getLocalDateKey()

        const completedDates = [
            ...(daily.completedDates || []),
            today
        ]

        const newStreak =
            (daily.streak || 0) + 1

        const bestStreak =
            Math.max(
                daily.bestStreak || 0,
                newStreak
            )

        const updatedDaily =
            this.updateDaily(
                dailyId,
                {
                    completedDates,
                    streak: newStreak,
                    bestStreak
                }
            )

        return {
            success: true,
            daily: updatedDaily
        }
    }
}

export default dailyService