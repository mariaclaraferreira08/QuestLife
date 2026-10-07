import storageService from "./storageService"
import authService from "./authService"

const LEGACY_KEY = "dailies"
const MIGRATION_KEY = "questlife_legacy_migrations"

function getDailiesKey() {
    return authService.getUserStorageKey("dailies")
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

function migrateLegacyDailies() {
    const email =
        authService.getCurrentEmail()

    if (!email) {
        return []
    }

    const migrations =
        getMigrationData()

    if (
        migrations.dailies
    ) {
        return []
    }

    const legacyDailies =
        storageService.get(
            LEGACY_KEY
        )

    migrations.dailies =
        email

    storageService.save(
        MIGRATION_KEY,
        migrations
    )

    if (
        !Array.isArray(
            legacyDailies
        ) ||
        legacyDailies.length ===
            0
    ) {
        storageService.save(
            getDailiesKey(),
            []
        )

        return []
    }

    storageService.save(
        getDailiesKey(),
        legacyDailies
    )

    return legacyDailies
}

const dailyService = {
    /*
     * =========================
     * CRUD
     * =========================
     */

    getDailies() {
        if (
            !authService.isAuthenticated()
        ) {
            return []
        }

        const key =
            getDailiesKey()

        const storedDailies =
            storageService.get(key)

        if (
            Array.isArray(
                storedDailies
            )
        ) {
            return storedDailies
        }

        return migrateLegacyDailies()
    },

    getDailyById(dailyId) {
        return this
            .getDailies()
            .find(
                daily =>
                    daily.id ===
                    dailyId
            )
    },

    addDaily(daily) {
        const dailies =
            this.getDailies()

        const newDaily = {
            ...daily,
            id:
                daily.id ||
                crypto.randomUUID(),
            title:
                daily.title || "",
            description:
                daily.description ||
                "",
            difficulty:
                daily.difficulty ||
                "easy",
            startDate:
                daily.startDate ||
                null,
            repeatEvery:
                Number(
                    daily.repeatEvery
                ) || 1,
            daysOfWeek:
                daily.daysOfWeek ||
                [],
            completedDates:
                daily.completedDates ||
                [],
            failedDates:
                daily.failedDates ||
                [],
            streak:
                daily.streak || 0,
            bestStreak:
                daily.bestStreak ||
                0,
            createdAt:
                daily.createdAt ||
                new Date()
                    .toISOString()
        }

        dailies.push(
            newDaily
        )

        storageService.save(
            getDailiesKey(),
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
            dailies.map(
                daily => {
                    if (
                        daily.id ===
                        dailyId
                    ) {
                        return {
                            ...daily,
                            ...updatedData
                        }
                    }

                    return daily
                }
            )

        storageService.save(
            getDailiesKey(),
            updatedDailies
        )

        return updatedDailies.find(
            daily =>
                daily.id ===
                dailyId
        )
    },

    removeDaily(dailyId) {
        const dailies =
            this.getDailies()

        const updatedDailies =
            dailies.filter(
                daily =>
                    daily.id !==
                    dailyId
            )

        storageService.save(
            getDailiesKey(),
            updatedDailies
        )

        return updatedDailies
    },

    /*
     * =========================
     * DATAS
     * =========================
     */

    getDateKey(
        date = new Date()
    ) {
        const year =
            date.getFullYear()

        const month =
            String(
                date.getMonth() +
                    1
            ).padStart(
                2,
                "0"
            )

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            )

        return `${year}-${month}-${day}`
    },

    getTodayKey() {
        return this.getDateKey(
            new Date()
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
     * =========================
     * AGENDA
     * =========================
     */

    isScheduledToday(daily) {
        if (!daily) {
            return false
        }

        const today =
            new Date()

        const todayKey =
            this.getDateKey(
                today
            )

        if (
            daily.startDate &&
            todayKey <
                daily.startDate
        ) {
            return false
        }

        const daysOfWeek =
            daily.daysOfWeek ||
            []

        if (
            daysOfWeek.length >
            0
        ) {
            const todayName =
                this.getTodayName()

            if (
                !daysOfWeek.includes(
                    todayName
                )
            ) {
                return false
            }
        }

        const repeatEvery =
            Math.max(
                1,
                Number(
                    daily.repeatEvery
                ) || 1
            )

        if (
            repeatEvery === 1 ||
            !daily.startDate
        ) {
            return true
        }

        const startDate =
            new Date(
                `${daily.startDate}T00:00:00`
            )

        const currentDate =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            )

        const difference =
            currentDate.getTime() -
            startDate.getTime()

        if (
            difference < 0
        ) {
            return false
        }

        const differenceDays =
            Math.floor(
                difference /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            )

        return (
            differenceDays %
                repeatEvery ===
            0
        )
    },

    /*
     * =========================
     * ESTADO DO DIA
     * =========================
     */

    isCompletedToday(
        daily
    ) {
        if (!daily) {
            return false
        }

        const today =
            this.getTodayKey()

        return (
            daily.completedDates ||
            []
        ).includes(today)
    },

    isFailedToday(daily) {
        if (!daily) {
            return false
        }

        const today =
            this.getTodayKey()

        return (
            daily.failedDates ||
            []
        ).includes(today)
    },

    isFinishedToday(daily) {
        return (
            this.isCompletedToday(
                daily
            ) ||
            this.isFailedToday(
                daily
            )
        )
    },

    /*
     * =========================
     * VALIDAÇÃO
     * =========================
     */

    canCompleteToday(
        dailyId
    ) {
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
     * CONCLUIR
     * =========================
     */

    completeDaily(
        dailyId
    ) {
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

        if (
            !permission.allowed
        ) {
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
            (
                daily.streak ||
                0
            ) +
            1

        const newBestStreak =
            Math.max(
                daily.bestStreak ||
                    0,
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
            daily:
                updatedDaily
        }
    },

    /*
     * =========================
     * FALHAR
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

        if (
            !permission.allowed
        ) {
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
            daily:
                updatedDaily
        }
    }
}

if (
    typeof window !==
    "undefined"
) {
    window.dailyService =
        dailyService
}

export default dailyService