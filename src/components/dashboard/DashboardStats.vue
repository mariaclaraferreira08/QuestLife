<script setup>
defineProps({
    completedQuests: {
        type: Number,
        default: 0
    },

    activeQuests: {
        type: Number,
        default: 0
    },

    habits: {
        type: Number,
        default: 0
    },

    coins: {
        type: Number,
        default: 0
    }
})
</script>

<template>
    <section class="stats-panel">
        <div class="stats-header">
            <div>
                <span class="eyebrow">
                    SUA JORNADA
                </span>

                <h2>Progresso</h2>
            </div>

            <span class="period">
                ESTA SEMANA
            </span>
        </div>

        <div class="stats-grid">
            <article class="stat-card completed">
                <div class="stat-icon">
                    ✓
                </div>

                <div class="stat-content">
                    <span class="stat-label">
                        MISSÕES CONCLUÍDAS
                    </span>

                    <strong>
                        {{ completedQuests }}
                    </strong>

                    <small>
                        Continue avançando
                    </small>
                </div>
            </article>

            <article class="stat-card active">
                <div class="stat-icon">
                    ◇
                </div>

                <div class="stat-content">
                    <span class="stat-label">
                        MISSÕES ATIVAS
                    </span>

                    <strong>
                        {{ activeQuests }}
                    </strong>

                    <small>
                        Aguardando conclusão
                    </small>
                </div>
            </article>

            <article class="stat-card habits">
                <div class="stat-icon">
                    ♨
                </div>

                <div class="stat-content">
                    <span class="stat-label">
                        HÁBITOS
                    </span>

                    <strong>
                        {{ habits }}
                    </strong>

                    <small>
                        Na sua rotina
                    </small>
                </div>
            </article>

            <article class="stat-card coins">
                <div class="stat-icon">
                    ●
                </div>

                <div class="stat-content">
                    <span class="stat-label">
                        MOEDAS
                    </span>

                    <strong>
                        {{ coins }}
                    </strong>

                    <small>
                        Disponíveis para gastar
                    </small>
                </div>
            </article>
        </div>
    </section>
</template>

<style scoped>
.stats-panel {
    padding: 24px;

    background: #151f30;

    border: 1px solid #344158;
    border-radius: 14px;
}

.stats-header {
    margin-bottom: 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

.eyebrow {
    color: #bd7cff;

    font-size: 11px;
    font-weight: 700;

    letter-spacing: 2px;
}

.stats-header h2 {
    margin: 5px 0 0;

    color: #eef1f7;

    font-size: 20px;
}

.period {
    color: #75839b;

    font-size: 10px;
    font-weight: 700;

    letter-spacing: 1px;
}

.stats-grid {
    display: grid;

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap: 12px;
}

.stat-card {
    min-height: 150px;

    padding: 18px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    background: #111a29;

    border: 1px solid #354158;
    border-radius: 11px;

    transition:
        transform 0.2s ease,
        border-color 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);

    border-color: #765099;
}

.stat-icon {
    width: 38px;
    height: 38px;

    display: grid;
    place-items: center;

    border-radius: 9px;

    font-size: 20px;
    font-weight: 700;
}

.completed .stat-icon {
    color: #48ddb0;
    background: rgba(72, 221, 176, 0.1);
}

.active .stat-icon {
    color: #71a7ff;
    background: rgba(113, 167, 255, 0.1);
}

.habits .stat-icon {
    color: #d89cff;
    background: rgba(216, 156, 255, 0.1);
}

.coins .stat-icon {
    color: #f3c969;
    background: rgba(243, 201, 105, 0.1);
}

.stat-content {
    display: flex;
    flex-direction: column;
}

.stat-label {
    margin-bottom: 6px;

    color: #8f9caf;

    font-size: 10px;
    font-weight: 700;

    letter-spacing: 0.8px;
}

.stat-content strong {
    color: #f2f5fb;

    font-size: 27px;
    line-height: 1;
}

.stat-content small {
    margin-top: 8px;

    color: #65738b;

    font-size: 11px;
}

@media (max-width: 1000px) {
    .stats-grid {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .period {
        display: none;
    }
}
</style>