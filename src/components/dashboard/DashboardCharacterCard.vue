<script setup>
defineProps({
    player: {
        type: Object,
        required: true
    }
})

function percentage(value, max) {
    if (!max) return 0

    return Math.min(
        100,
        Math.max(0, (value / max) * 100)
    )
}
</script>

<template>
    <section class="character-card">
        <header class="character-header">
            <span>PERSONAGEM</span>

            <button type="button">
                CUSTOMIZAR
            </button>
        </header>

        <div class="avatar">
            <img
                src="/assets/player/player-cat.png"
                alt="Personagem do jogador"
                class="avatar-image"
            />
        </div>

        <h2>
            {{ player.name || "Aventureira" }}
        </h2>

        <p class="level">
            NÍVEL {{ player.level || 1 }}
        </p>

        <div class="status">
            <div class="status-item">
                <div class="status-label">
                    <span>XP</span>

                    <strong>
                        {{ player.xp || 0 }}/100
                    </strong>
                </div>

                <div class="bar">
                    <div
                        class="fill xp"
                        :style="{
                            width:
                                percentage(
                                    player.xp || 0,
                                    100
                                ) + '%'
                        }"
                    ></div>
                </div>
            </div>

            <div class="status-item">
                <div class="status-label">
                    <span>HP</span>

                    <strong>
                        {{ player.health ?? 100 }}/{{ player.maxHealth || 100 }}
                    </strong>
                </div>

                <div class="bar">
                    <div
                        class="fill hp"
                        :style="{
                            width:
                                percentage(
                                    player.health ?? 100,
                                    player.maxHealth || 100
                                ) + '%'
                        }"
                    ></div>
                </div>
            </div>
        </div>

        <div class="coins">
            <span>MOEDAS</span>

            <strong>
                🪙 {{ player.coins || 0 }}
            </strong>
        </div>
    </section>
</template>

<style scoped>
.character-card {
    padding: 22px;
    background: #151f30;
    border: 1px solid #344158;
    border-radius: 14px;
}

.character-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 22px;
}

.character-header span {
    color: #bd7cff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
}

.character-header button {
    padding: 7px 10px;
    color: #d6dde8;
    background: #101927;
    border: 1px solid #3a475c;
    border-radius: 7px;
    font-family: inherit;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
}

.character-header button:hover {
    border-color: #8652b3;
    color: white;
}

.avatar {
    width: 180px;
    height: 180px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;

    background:
        radial-gradient(
            circle at center,
            rgba(166, 82, 219, 0.18),
            transparent 65%
        ),
        #101927;

    border: 1px solid #4b3c60;
    border-radius: 18px;
}

.avatar::after {
    content: "";
    position: absolute;
    left: 20%;
    right: 20%;
    bottom: 10px;
    height: 12px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 50%;
    filter: blur(5px);
}

.avatar-image {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    object-fit: contain;
    object-position: center;
    filter:
        drop-shadow(
            0 8px 10px
            rgba(0, 0, 0, 0.25)
        );
}

.character-card h2 {
    margin: 0;
    color: #f2f5fb;
    text-align: center;
    font-size: 20px;
}

.level {
    margin: 5px 0 22px;
    color: #a66adb;
    text-align: center;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
}

.status {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.status-item {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.status-label {
    display: flex;
    justify-content: space-between;
    color: #8996aa;
    font-size: 10px;
}

.status-label strong {
    color: #cbd3df;
}

.bar {
    height: 8px;
    overflow: hidden;
    background: #0b1320;
    border-radius: 999px;
}

.fill {
    height: 100%;
    border-radius: inherit;
    transition: width 0.25s;
}

.fill.xp {
    background: #44d3a5;
}

.fill.hp {
    background: #ff6385;
}

.coins {
    margin-top: 22px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #101927;
    border: 1px solid #344158;
    border-radius: 8px;
}

.coins span {
    color: #7f8ca0;
    font-size: 9px;
    letter-spacing: 1px;
}

.coins strong {
    color: #f3c969;
}

@media (max-width: 1050px) {
    .avatar {
        width: 200px;
        height: 200px;
    }
}

@media (max-width: 700px) {
    .avatar {
        width: 170px;
        height: 170px;
    }
}
</style>