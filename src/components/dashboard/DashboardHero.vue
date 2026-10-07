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
                QUE BOM TER VOCÊ DE VOLTA,
                {{ player.name?.toUpperCase() || "AVENTUREIRO" }}!
            </span>

            <h1>
                QuestLife
            </h1>

            <p>
                Organize o que precisa fazer,
                complete suas missões e continue evoluindo.
            </p>
        </div>

        <div class="player-summary">
            <strong>
                {{ player.name || "Aventureiro" }}
            </strong>

            <span class="email">
                {{ player.email }}
            </span>

            <span class="level">
                Nível {{ player.level || 1 }}
            </span>
        </div>
    </section>
</template>

<style scoped>
.dashboard-hero {
    min-height: 168px;
    padding: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    background:
        linear-gradient(
            120deg,
            rgba(111, 38, 181, 0.12),
            transparent 45%
        ),
        #151f30;
    border: 1px solid #354158;
    border-radius: 15px;
}

.hero-content {
    min-width: 0;
}

.eyebrow {
    color: #c36fff;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.8px;
}

.hero-content h1 {
    margin: 10px 0 8px;
    color: #f5f1fa;
    font-size: 36px;
}

.hero-content p {
    max-width: 650px;
    margin: 0;
    color: #9ba8bb;
    font-size: 14px;
    line-height: 1.6;
}

.player-summary {
    width: 190px;
    flex-shrink: 0;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: #101927;
    border: 1px solid #354158;
    border-radius: 10px;
}

.player-summary strong {
    color: #f2f4f8;
    font-size: 14px;
}

.email {
    overflow: hidden;
    color: #77879d;
    font-size: 9px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.level {
    margin-top: 3px;
    color: #c362ff;
    font-size: 10px;
    font-weight: 700;
}

@media (max-width: 750px) {
    .dashboard-hero {
        align-items: flex-start;
        flex-direction: column;
    }

    .player-summary {
        width: 100%;
        box-sizing: border-box;
    }

    .hero-content h1 {
        font-size: 30px;
    }
}
</style>