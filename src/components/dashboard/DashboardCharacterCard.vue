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
        Math.max(
            0,
            (value / max) * 100
        )
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
            {{ player.name?.charAt(0) || "Q" }}
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
    margin-bottom: 24px;
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
    font-size: 9px;
    font-weight: 700;
}

.avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto 15px;
    display: grid;
    place-items: center;
    color: white;
    background:
        linear-gradient(
            135deg,
            #7626dc,
            #a526ef
        );
    border: 1px solid #bd70ff;
    border-radius: 22px;
    box-shadow:
        0 0 25px
        rgba(165, 38, 239, 0.18);
    font-size: 38px;
    font-weight: 800;
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
</style>