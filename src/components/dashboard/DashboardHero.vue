<script setup>
defineProps({
    player: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <section class="dashboard-hero">
        <div class="hero-content">
            <span class="eyebrow">
                BEM-VINDA DE VOLTA, AVENTUREIRA!
            </span>

            <h1>
                QuestLife
            </h1>

            <p>
                Continue sua jornada e transforme
                suas tarefas em missões.
            </p>
        </div>

        <div class="hero-player">
            <span class="player-name">
                {{ player.name || "Aventureira" }}
            </span>

            <span class="player-level">
                Nível {{ player.level || 1 }}
            </span>
        </div>
    </section>
</template>

<style scoped>
.dashboard-hero {
    min-height: 170px;

    padding: 28px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 30px;

    background:
        linear-gradient(
            135deg,
            rgba(128, 44, 227, 0.14),
            rgba(21, 31, 48, 0.92) 45%
        );

    border: 1px solid #2d3a51;
    border-radius: 14px;
}

.hero-content {
    min-width: 0;
}

.eyebrow {
    display: block;

    margin-bottom: 8px;

    color: #bd7cff;

    font-size: 11px;
    font-weight: 700;

    letter-spacing: 2px;
}

.dashboard-hero h1 {
    margin: 0;

    color: #f2f5fb;

    font-size: 36px;
    line-height: 1.1;
}

.dashboard-hero p {
    max-width: 520px;

    margin: 12px 0 0;

    color: #9da9bd;

    font-size: 14px;
    line-height: 1.6;
}

.hero-player {
    flex-shrink: 0;

    min-width: 150px;

    padding: 16px 20px;

    display: flex;
    flex-direction: column;

    gap: 4px;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 10px;
}

.player-name {
    color: #f2f5fb;

    font-size: 15px;
    font-weight: 700;
}

.player-level {
    color: #bd7cff;

    font-size: 12px;
    font-weight: 600;
}

@media (max-width: 700px) {
    .dashboard-hero {
        padding: 22px;

        flex-direction: column;
        align-items: stretch;
    }

    .dashboard-hero h1 {
        font-size: 30px;
    }

    .hero-player {
        width: 100%;
    }
}
</style>