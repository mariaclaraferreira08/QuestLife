<script setup>
defineProps({
    player: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <section class="player-status">
        <div class="player-info">
            <h2>{{ player.name }}</h2>
            <span>Nível {{ player.level }}</span>
        </div>

        <div class="status">
            <label>
                ❤️ Vida: {{ player.health }}/100
            </label>

            <div class="progress">
                <div
                    class="progress-bar bg-danger"
                    :style="{ width: player.health + '%' }"
                ></div>
            </div>
        </div>

        <div class="status">
            <label>
                ⭐ XP: {{ player.xp }}/100
            </label>

            <div class="progress">
                <div
                    class="progress-bar"
                    :style="{ width: player.xp + '%' }"
                ></div>
            </div>
        </div>

        <div class="coins">
            🪙 {{ player.coins }} moedas
        </div>
    </section>
</template>

<style scoped>
.player-status {
    max-width: 500px;
    padding: 20px;
    border-radius: 12px;
    background: #212529;
    color: white;
}

.player-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.status {
    margin-top: 15px;
}

.coins {
    margin-top: 15px;
    font-weight: bold;
}
</style>
