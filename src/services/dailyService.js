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

/*
 * Retorna uma data no formato YYYY-MM-DD
 * usando a data LOCAL.
 */
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

/*
 * Converte YYYY-MM-DD para Date local.
 *
 * Evitamos:
 *
 * new Date("2026-10-04")
 *
 * porque strings nesse formato podem ser
 * interpretadas como UTC e causar diferenças
 * de data dependendo do fuso horário.
 */
function parseLocalDate(dateString) {
    if (!dateString) {
        return null
    }

    const [
        year,
        month,
        day
    ] = dateString
        .split("-")
        .map(Number)

    if (
        !year ||
        !month ||
        !day
    ) {
        return null
    }

    return new Date(
        year,
        month - 1,
        day
    )
}

/*
 * Cria uma cópia da data usando meio-dia.
 *
 * Isso ajuda a evitar problemas de cálculo
 * relacionados a alterações de horário.
 */
function normalizeDate(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12,
        0,
        0,
        0
    )
}

/*
 * Descobre o início da semana da data.
 *
 * Neste projeto consideramos:
 *
 * segunda = início da semana
 * domingo = final da semana
 */
function getStartOfWeek(date) {
    const normalized =
        normalizeDate(date)

    const day =
        normalized.getDay()

    /*
     * JavaScript:
     *
     * domingo = 0
     * segunda = 1
     * ...
     * sábado = 6
     *
     * Transformamos para:
     *
     * segunda = 0
     * terça = 1
     * ...
     * domingo = 6
     */
    const daysSinceMonday =
        (day + 6) % 7

    normalized.setDate(
        normalized.getDate() -
        daysSinceMonday
    )

    return normalized
}

/*
 * Calcula quantas semanas existem
 * entre duas datas.
 *
 * O cálculo é feito usando o começo
 * de cada semana.
 */
function getWeeksBetween(
    startDate,
    currentDate
) {
    const startWeek =
        getStartOfWeek(startDate)

    const currentWeek =
        getStartOfWeek(currentDate)

    const millisecondsPerWeek =
        7 * 24 * 60 * 60 * 1000

    return Math.floor(
        (
            currentWeek.getTime() -
            startWeek.getTime()
        ) /
        millisecondsPerWeek
    )
}

const dailyService = {
    /*
     * =========================
     * BUSCA
     * =========================
     */

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

    /*
     * =========================
     * CRUD
     * =========================
     */

    addDaily(daily) {
        const dailies =
            this.getDailies()

        const newDaily = {
            ...daily,

            id: crypto.randomUUID(),

            /*
             * Histórico.
             */
            completedDates: [],
            failedDates: [],

            /*
             * Sequências.
             */
            streak: 0,
            bestStreak: 0,

            /*
             * Garantimos que a repetição
             * nunca seja menor que 1.
             */
            repeatEvery:
                Math.max(
                    1,
                    Number(
                        daily.repeatEvery
                    ) || 1
                ),

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
            this
                .getDailies()
                .filter(
                    daily =>
                        daily.id !==
                        dailyId
                )

        storageService.save(
            DAILIES_KEY,
            updatedDailies
        )

        return updatedDailies
    },

    /*
     * =========================
     * AGENDAMENTO
     * =========================
     */

    isScheduledToday(daily) {
        const today =
            new Date()

        return this.isScheduledOnDate(
            daily,
            today
        )
    },

    /*
     * Verifica se uma diária deveria
     * acontecer em uma data específica.
     *
     * Esta função também será útil
     * posteriormente para detectar
     * diárias perdidas automaticamente.
     */
    isScheduledOnDate(
        daily,
        date
    ) {
        const currentDate =
            normalizeDate(date)

        const currentDateKey =
            getLocalDateKey(
                currentDate
            )

        /*
         * =========================
         * 1. DATA DE INÍCIO
         * =========================
         */

        if (
            daily.startDate &&
            currentDateKey <
                daily.startDate
        ) {
            return false
        }

        /*
         * =========================
         * 2. DIA DA SEMANA
         * =========================
         */

        const currentDayName =
            dayNames[
                currentDate.getDay()
            ]

        const days =
            daily.daysOfWeek || []

        /*
         * Compatibilidade com
         * diárias antigas.
         *
         * Se não existem dias salvos,
         * consideramos todos os dias.
         */
        const matchesWeekday =
            days.length === 0 ||
            days.includes(
                currentDayName
            )

        if (!matchesWeekday) {
            return false
        }

        /*
         * =========================
         * 3. INTERVALO DE SEMANAS
         * =========================
         */

        const repeatEvery =
            Math.max(
                1,
                Number(
                    daily.repeatEvery
                ) || 1
            )

        /*
         * A cada 1 semana significa
         * que todas as semanas são
         * válidas.
         */
        if (repeatEvery === 1) {
            return true
        }

        /*
         * Diárias antigas podem não
         * possuir startDate.
         *
         * Nesse caso não temos uma
         * referência para calcular
         * semanas alternadas.
         */
        if (!daily.startDate) {
            return true
        }

        const startDate =
            parseLocalDate(
                daily.startDate
            )

        if (!startDate) {
            return true
        }

        const weeksSinceStart =
            getWeeksBetween(
                startDate,
                currentDate
            )

        /*
         * Segurança adicional.
         */
        if (weeksSinceStart < 0) {
            return false
        }

        /*
         * Exemplo repeatEvery = 3:
         *
         * semana 0 → 0 % 3 = 0 ✓
         * semana 1 → 1 % 3 = 1 ✕
         * semana 2 → 2 % 3 = 2 ✕
         * semana 3 → 3 % 3 = 0 ✓
         */
        return (
            weeksSinceStart %
                repeatEvery ===
            0
        )
    },

    /*
     * =========================
     * ESTADO DE UMA DATA
     * =========================
     */

    isCompletedOnDate(
        daily,
        date
    ) {
        const dateKey =
            getLocalDateKey(date)

        return (
            daily.completedDates || []
        ).includes(dateKey)
    },

    isFailedOnDate(
        daily,
        date
    ) {
        const dateKey =
            getLocalDateKey(date)

        return (
            daily.failedDates || []
        ).includes(dateKey)
    },

    /*
     * =========================
     * ESTADO DE HOJE
     * =========================
     */

    isCompletedToday(daily) {
        return this.isCompletedOnDate(
            daily,
            new Date()
        )
    },

    isFailedToday(daily) {
        return this.isFailedOnDate(
            daily,
            new Date()
        )
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
     * VALIDAÇÃO DE CONCLUSÃO
     * =========================
     */

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

        if (
            this.isFailedToday(
                daily
            )
        ) {
            return {
                success: false,
                reason:
                    "already-failed-today"
            }
        }

        return {
            success: true
        }
    },

    /*
     * =========================
     * CONCLUIR
     * =========================
     */

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

        /*
         * Set evita qualquer
         * duplicação acidental.
         */
        const completedDates = [
            ...new Set([
                ...(
                    daily.completedDates ||
                    []
                ),
                today
            ])
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

                    streak:
                        newStreak,

                    bestStreak
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
     * VALIDAÇÃO DE FALHA
     * =========================
     */

    canFailToday(dailyId) {
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

        if (
            this.isFailedToday(
                daily
            )
        ) {
            return {
                success: false,
                reason:
                    "already-failed-today"
            }
        }

        return {
            success: true
        }
    },

    /*
     * =========================
     * FALHAR
     * =========================
     */

    failDaily(dailyId) {
        const validation =
            this.canFailToday(
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

        const failedDates = [
            ...new Set([
                ...(
                    daily.failedDates ||
                    []
                ),
                today
            ])
        ]

        /*
         * Falhar quebra a sequência
         * atual, mas preserva o recorde.
         */
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

export default dailyService