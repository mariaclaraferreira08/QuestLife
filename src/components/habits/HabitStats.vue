<script setup>
defineProps({
    habit: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <section class="habit-stats">
        <div class="stat-card">
            <span class="stat-label">
                SEQUÊNCIA ATUAL
            </span>

            <div class="stat-value">
                <span class="icon">🔥</span>

                <strong>
                    {{ habit.streak || 0 }}
                </strong>

                <small>
                    {{
                        (habit.streak || 0) === 1
                            ? "dia"
                            : "dias"
                    }}
                </small>
            </div>
        </div>

        <div class="stat-card">
            <span class="stat-label">
                MELHOR SEQUÊNCIA
            </span>

            <div class="stat-value">
                <span class="icon">🏆</span>

                <strong>
                    {{ habit.bestStreak || 0 }}
                </strong>

                <small>
                    {{
                        (habit.bestStreak || 0) === 1
                            ? "dia"
                            : "dias"
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