<script setup>
import { computed } from "vue"

const props = defineProps({
    habit: {
        type: Object,
        required: true
    }
})

/*
 * Frequência do hábito.
 *
 * Hábitos antigos que não possuem
 * frequency serão tratados como diários.
 */
const frequency = computed(() => {
    return props.habit.frequency || "daily"
})

/*
 * Retorna a unidade correta da sequência
 * de acordo com a frequência.
 *
 * daily   -> dia / dias
 * weekly  -> semana / semanas
 * monthly -> mês / meses
 */
function streakUnit(value) {
    if (frequency.value === "weekly") {
        return value === 1
            ? "semana"
            : "semanas"
    }

    if (frequency.value === "monthly") {
        return value === 1
            ? "mês"
            : "meses"
    }

    return value === 1
        ? "dia"
        : "dias"
}

/*
 * Valores protegidos para evitar
 * undefined na interface.
 */
const currentStreak = computed(() => {
    return props.habit.streak || 0
})

const bestStreak = computed(() => {
    return props.habit.bestStreak || 0
})
</script>

<template>
    <section class="habit-stats">

        <!-- =====================
             SEQUÊNCIA ATUAL
             ===================== -->

        <div class="stat-card">
            <span class="stat-label">
                SEQUÊNCIA ATUAL
            </span>

            <div class="stat-value">
                <span class="icon">
                    🔥
                </span>

                <strong>
                    {{ currentStreak }}
                </strong>

                <small>
                    {{
                        streakUnit(
                            currentStreak
                        )
                    }}
                </small>
            </div>
        </div>

        <!-- =====================
             MELHOR SEQUÊNCIA
             ===================== -->

        <div class="stat-card">
            <span class="stat-label">
                MELHOR SEQUÊNCIA
            </span>

            <div class="stat-value">
                <span class="icon">
                    🏆
                </span>

                <strong>
                    {{ bestStreak }}
                </strong>

                <small>
                    {{
                        streakUnit(
                            bestStreak
                        )
                    }}
                </small>
            </div>
        </div>

    </section>
</template>

<style scoped>
.habit-stats {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 12px;
}

.stat-card {
    padding: 14px;

    background: #101927;

    border: 1px solid #2e3a4d;
    border-radius: 8px;
}

.stat-label {
    display: block;

    margin-bottom: 8px;

    color: #78869b;

    font-size: 9px;

    letter-spacing: 1px;
}

.stat-value {
    display: flex;

    align-items: center;

    gap: 7px;
}

.icon {
    font-size: 17px;
}

.stat-value strong {
    color: #eef1f7;

    font-size: 20px;
}

.stat-value small {
    color: #758196;

    font-size: 10px;
}

@media (max-width: 550px) {
    .habit-stats {
        grid-template-columns: 1fr;
    }
}
</style>
