<script setup>
import playerService from "../services/playerService"

const player = playerService.player
</script>

<template>
    <aside class="sidebar">
        <div class="brand">
            <div class="brand-icon">
                ⚔
            </div>

            <span>HABIT QUEST</span>
        </div>

        <div class="player">
            <div class="player-header">
                <span>LEVEL {{ player.level }}</span>
                <span>🪙 {{ player.coins }}</span>
            </div>

            <div class="stat">
                <div class="stat-label">
                    <span>XP</span>
                    <span>{{ player.xp }}/100</span>
                </div>

                <div class="bar">
                    <div
                        class="bar-fill xp"
                        :style="{ width: player.xp + '%' }"
                    ></div>
                </div>
            </div>

            <div class="stat">
                <div class="stat-label">
                    <span>HP</span>
                    <span>{{ player.health }}/100</span>
                </div>

                <div class="bar">
                    <div
                        class="bar-fill hp"
                        :style="{ width: player.health + '%' }"
                    ></div>
                </div>
            </div>
        </div>

        <nav class="navigation">
            <RouterLink to="/" class="nav-item">
                <span>⌂</span>
                Dashboard
            </RouterLink>

            <RouterLink to="/tasks" class="nav-item">
                <span>☑</span>
                Tarefas
            </RouterLink>

            <RouterLink to="/habits" class="nav-item">
                <span>🔥</span>
                Hábitos
            </RouterLink>

            <RouterLink to="/shop" class="nav-item">
                <span>🧪</span>
                Loja
            </RouterLink>
        </nav>

        <RouterLink
            to="/tasks/new"
            class="new-quest"
        >
            + NOVA MISSÃO
        </RouterLink>
    </aside>
</template>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;

    width: 260px;
    height: 100vh;

    padding: 22px 18px;

    background: #151d2d;
    border-right: 1px solid #354158;

    display: flex;
    flex-direction: column;

    color: #e8ecf5;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 0 8px 24px;

    font-weight: 700;
    letter-spacing: 1px;

    color: #c38cff;
}

.brand-icon {
    width: 38px;
    height: 38px;

    display: grid;
    place-items: center;

    border-radius: 10px;

    background: #8c2cff;
    box-shadow: 0 0 18px rgba(170, 73, 255, 0.6);
}

.player {
    padding: 16px;

    background: #192335;
    border: 1px solid #334159;
    border-radius: 12px;
}

.player-header,
.stat-label {
    display: flex;
    justify-content: space-between;
}

.player-header {
    margin-bottom: 16px;
    font-size: 13px;
}

.stat {
    margin-top: 12px;
}

.stat-label {
    margin-bottom: 5px;

    color: #aab4c8;
    font-size: 12px;
}

.bar {
    height: 7px;

    overflow: hidden;

    background: #0c1320;
    border-radius: 20px;
}

.bar-fill {
    height: 100%;
    border-radius: inherit;
}

.xp {
    background: #36d69b;
}

.hp {
    background: #ff657d;
}

.navigation {
    display: flex;
    flex-direction: column;
    gap: 7px;

    margin-top: 28px;
}

.nav-item {
    padding: 12px 14px;

    display: flex;
    align-items: center;
    gap: 12px;

    color: #b8c1d2;
    text-decoration: none;

    border: 1px solid transparent;
    border-radius: 8px;

    transition: 0.2s;
}

.nav-item:hover {
    color: white;
    background: #202c40;
}

.router-link-exact-active {
    color: white;

    background: rgba(139, 55, 255, 0.22);

    border-color: #8844d9;

    box-shadow:
        inset 0 0 18px rgba(141, 58, 255, 0.08);
}

.new-quest {
    margin-top: auto;

    padding: 12px;

    text-align: center;
    text-decoration: none;
    font-weight: 600;

    color: white;

    border-radius: 8px;

    background: linear-gradient(
        90deg,
        #7c2cff,
        #a928ef
    );

    box-shadow: 0 0 15px rgba(147, 44, 255, 0.25);
}

.new-quest:hover {
    color: white;
}
</style>
