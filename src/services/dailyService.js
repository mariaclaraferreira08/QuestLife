import storageService from "./storageService"

const DAILIES_KEY = "dailies"

const dailyService = {
    getDailies() {
        return storageService.get(DAILIES_KEY) || []
    },

    getDailyById(dailyId) {
        return this.getDailies().find(
            daily => daily.id === dailyId
        )
    },

    addDaily(daily) {
        const dailies = this.getDailies()

        const newDaily = {
            ...daily,
            id: daily.id || crypto.randomUUID(),
            title: daily.title || "",
            description: daily.description || "",
            difficulty: daily.difficulty || "easy",
            startDate: daily.startDate || null,
            repeatEvery: daily.repeatEvery || 1,
            daysOfWeek: daily.daysOfWeek || [],
            completedDates: daily.completedDates || [],
            failedDates: daily.failedDates || [],
            streak: daily.streak || 0,
            bestStreak: daily.bestStreak || 0
        }

        dailies.push(newDaily)

        storageService.save(
            DAILIES_KEY,
            dailies
        )

        return newDaily
    },

    updateDaily(dailyId, updatedData) {
        const dailies = this.getDailies()

        const updatedDailies =
            dailies.map(daily => {
                if (daily.id === dailyId) {
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
        const dailies =
            this.getDailies()

        const updatedDailies =
            dailies.filter(
                daily =>
                    daily.id !== dailyId
            )

        storageService.save(
            DAILIES_KEY,
            updatedDailies
        )

        return updatedDailies
    },

    /*
     * =========================
     * DATAS
     * =========================
     */

    getTodayKey() {
        const today = new Date()

        const year =
            today.getFullYear()

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0")

        const day =
            String(
                today.getDate()
            ).padStart(2, "0")

        return `${year}-${month}-${day}`
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
     * =========================
     * AGENDA
     * =========================
     */

    isScheduledToday(daily) {
        if (!daily) {
            return false
        }

        const todayKey =
            this.getTodayKey()

        if (
            daily.startDate &&
            todayKey < daily.startDate
        ) {
            return false
        }

        const daysOfWeek =
            daily.daysOfWeek || []

        /*
         * Compatibilidade:
         * diárias antigas sem dias definidos
         * continuam válidas todos os dias.
         */
        if (daysOfWeek.length === 0) {
            return true
        }

        const todayName =
            this.getTodayName()

        return daysOfWeek.includes(
            todayName
        )
    },

    /*
     * =========================
     * ESTADO DO DIA
     * =========================
     */

    isCompletedToday(daily) {
        if (!daily) {
            return false
        }

        const today =
            this.getTodayKey()

        return (
            daily.completedDates || []
        ).includes(today)
    },

    isFailedToday(daily) {
        if (!daily) {
            return false
        }

        const today =
            this.getTodayKey()

        return (
            daily.failedDates || []
        ).includes(today)
    },

    isFinishedToday(daily) {
        return (
            this.isCompletedToday(daily) ||
            this.isFailedToday(daily)
        )
    },

    /*
     * =========================
     * VALIDAÇÃO
     * =========================
     */

    canCompleteToday(dailyId) {
        const daily =
            this.getDailyById(
                dailyId
            )

        if (!daily) {
            return {
                allowed: false,
                reason: "not-found"
            }
        }

        if (
            !this.isScheduledToday(
                daily
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
                daily
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
                daily
            )
        ) {
            return {
                allowed: false,
                reason:
                    "already-failed-today"
            }
        }

        return {
            allowed: true
        }
    },

    canFailToday(dailyId) {
        const daily =
            this.getDailyById(
                dailyId
            )

        if (!daily) {
            return {
                allowed: false,
                reason: "not-found"
            }
        }

        if (
            !this.isScheduledToday(
                daily
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
                daily
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
                daily
            )
        ) {
            return {
                allowed: false,
                reason:
                    "already-failed-today"
            }
        }

        return {
            allowed: true
        }
    },

    /*
     * =========================
     * CONCLUIR DIÁRIA
     * =========================
     */

    completeDaily(dailyId) {
        const daily =
            this.getDailyById(
                dailyId
            )

        if (!daily) {
            return {
                success: false,
                reason: "not-found"
            }
        }

        const permission =
            this.canCompleteToday(
                dailyId
            )

        if (!permission.allowed) {
            return {
                success: false,
                reason:
                    permission.reason
            }
        }

        const today =
            this.getTodayKey()

        const completedDates = [
            ...(daily.completedDates || []),
            today
        ]

        const newStreak =
            (daily.streak || 0) + 1

        const newBestStreak =
            Math.max(
                daily.bestStreak || 0,
                newStreak
            )

        const updatedDaily =
            this.updateDaily(
                dailyId,
                {
                    completedDates,
                    streak:
                        newStreak,
                    bestStreak:
                        newBestStreak
                }
            )

        return {
            success: true,
            daily: updatedDaily
        }
    },

    /*
     * =========================
     * FALHAR DIÁRIA
     * =========================
     */

    failDaily(dailyId) {
        const daily =
            this.getDailyById(
                dailyId
            )

        if (!daily) {
            return {
                success: false,
                reason: "not-found"
            }
        }

        const permission =
            this.canFailToday(
                dailyId
            )

        if (!permission.allowed) {
            return {
                success: false,
                reason:
                    permission.reason
            }
        }

        const today =
            this.getTodayKey()

        const failedDates = [
            ...(daily.failedDates || []),
            today
        ]

        const updatedDaily =
            this.updateDaily(
                dailyId,
                {
                    failedDates,
                    streak: 0
                }
            )

        return {
            success: true,
            daily: updatedDaily
        }
    }
}

/*
 * TEMPORÁRIO:
 * permite testar o serviço
 * no console do navegador.
 */

if (typeof window !== "undefined") {
    window.dailyService =
        dailyService
}

export default dailyService