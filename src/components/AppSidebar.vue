<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

import playerService from "../services/playerService"
import authService from "../services/authService"
import CreateMissionMenu from "./CreateMissionMenu.vue"

defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(["toggle"])
const router = useRouter()
const player = playerService.player
const showCreateMenu = ref(false)

const xpPercentage = computed(() => {
    const xp = Number(player.value.xp) || 0
    return Math.min(100, Math.max(0, xp))
})

const healthPercentage = computed(() => {
    const health = Number(player.value.health) || 0
    const maxHealth = Number(player.value.maxHealth) || 100

    if (maxHealth <= 0) return 0

    return Math.min(
        100,
        Math.max(0, (health / maxHealth) * 100)
    )
})

function openCreateMenu() {
    showCreateMenu.value = true
}

function closeCreateMenu() {
    showCreateMenu.value = false
}

function selectMission(type) {
    closeCreateMenu()

    if (type === "task") {
        router.push("/tasks/new")
        return
    }

    if (type === "habit") {
        router.push("/habits")
        return
    }

    if (type === "daily") {
        router.push("/dailies")
    }
}

function logout() {
    playerService.clearCurrentPlayer()
    authService.logout()
    router.push("/login")
}
</script>

<template>
    <aside class="sidebar" :class="{ collapsed }">
        <button
            type="button"
            class="toggle-button"
            :title="collapsed ? 'Expandir menu' : 'Recolher menu'"
            @click="emit('toggle')"
        >
            <span>{{ collapsed ? "›" : "‹" }}</span>
        </button>

        <div class="brand">
            <div class="brand-icon">⚔</div>

            <span
                v-if="!collapsed"
                class="brand-name"
            >
                QuestLife
            </span>
        </div>

        <div
            v-if="!collapsed"
            class="player"
        >
            <div class="player-header">
                <span>
                    LEVEL {{ player.level }}
                </span>

                <span>
                    🪙 {{ player.coins }}
                </span>
            </div>

            <div class="stat">
                <div class="stat-label">
                    <span>XP</span>
                    <span>{{ player.xp }}/100</span>
                </div>

                <div class="bar">
                    <div
                        class="bar-fill xp"
                        :style="{ width: xpPercentage + '%' }"
                    ></div>
                </div>
            </div>

            <div class="stat">
                <div class="stat-label">
                    <span>HP</span>

                    <span>
                        {{ player.health }}/{{ player.maxHealth || 100 }}
                    </span>
                </div>

                <div class="bar">
                    <div
                        class="bar-fill hp"
                        :style="{ width: healthPercentage + '%' }"
                    ></div>
                </div>
            </div>
        </div>

        <div
            v-else
            class="collapsed-player"
            :title="`Nível ${player.level} • ${player.coins} moedas`"
        >
            <strong>
                {{ player.level }}
            </strong>

            <span>🪙</span>
        </div>

        <nav class="navigation">
            <RouterLink
                to="/"
                class="nav-item"
                title="Dashboard"
            >
                <span class="nav-icon">⌂</span>

                <span
                    v-if="!collapsed"
                    class="nav-label"
                >
                    Dashboard
                </span>
            </RouterLink>

            <RouterLink
                to="/tasks"
                class="nav-item"
                title="Tarefas"
            >
                <span class="nav-icon">☑</span>

                <span
                    v-if="!collapsed"
                    class="nav-label"
                >
                    Tarefas
                </span>
            </RouterLink>

            <RouterLink
                to="/habits"
                class="nav-item"
                title="Hábitos"
            >
                <span class="nav-icon">🔥</span>

                <span
                    v-if="!collapsed"
                    class="nav-label"
                >
                    Hábitos
                </span>
            </RouterLink>

            <RouterLink
                to="/dailies"
                class="nav-item"
                title="Diárias"
            >
                <span class="nav-icon">📅</span>

                <span
                    v-if="!collapsed"
                    class="nav-label"
                >
                    Diárias
                </span>
            </RouterLink>

            <RouterLink
                to="/shop"
                class="nav-item"
                title="Loja"
            >
                <span class="nav-icon">🧪</span>

                <span
                    v-if="!collapsed"
                    class="nav-label"
                >
                    Loja
                </span>
            </RouterLink>
        </nav>

        <div class="sidebar-bottom">
            <button
                type="button"
                class="new-quest"
                :title="collapsed ? 'Nova missão' : ''"
                @click="openCreateMenu"
            >
                <span class="new-quest-plus">+</span>

                <span v-if="!collapsed">
                    NOVA MISSÃO
                </span>
            </button>

            <button
                type="button"
                class="logout-button"
                :title="collapsed ? 'Sair da Guilda' : ''"
                @click="logout"
            >
                <span class="logout-icon">↪</span>

                <span v-if="!collapsed">
                    SAIR DA GUILDA
                </span>
            </button>
        </div>

        <CreateMissionMenu
            v-if="showCreateMenu"
            @close="closeCreateMenu"
            @select="selectMission"
        />
    </aside>
</template>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 260px;
    height: 100vh;
    box-sizing: border-box;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    color: #e8ecf5;
    background: #151d2d;
    border-right: 1px solid #354158;
    transition: width 0.25s ease, padding 0.25s ease;
    z-index: 20;
}

.sidebar.collapsed {
    width: 88px;
    padding: 18px 10px;
}

.toggle-button {
    position: absolute;
    top: 20px;
    right: -15px;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    color: white;
    background: linear-gradient(135deg, #7b2cff, #b13eff);
    border: 1px solid rgba(177, 110, 255, 0.55);
    border-radius: 999px;
    box-shadow: 0 10px 24px rgba(122, 44, 255, 0.35);
    cursor: pointer;
    transition: 0.2s;
    z-index: 30;
}

.toggle-button:hover {
    transform: translateY(-1px) scale(1.04);
    filter: brightness(1.08);
}

.toggle-button span {
    font-size: 21px;
    font-weight: 700;
    line-height: 1;
}

.brand {
    min-height: 42px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 6px 20px;
    color: #c38cff;
    font-weight: 700;
    letter-spacing: 1px;
}

.sidebar.collapsed .brand {
    height: 42px;
    padding: 0 0 20px;
    justify-content: center;
}

.brand-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    background: #8c2cff;
    border-radius: 12px;
    box-shadow: 0 0 18px rgba(170, 73, 255, 0.45);
    font-size: 17px;
}

.brand-name {
    white-space: nowrap;
    font-size: 14px;
}

.player {
    padding: 16px;
    background: #192335;
    border: 1px solid #334159;
    border-radius: 14px;
}

.player-header,
.stat-label {
    display: flex;
    justify-content: space-between;
    gap: 10px;
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
    border-radius: 999px;
}

.bar-fill {
    height: 100%;
    border-radius: inherit;
    transition: width 0.3s ease;
}

.xp {
    background: #36d69b;
}

.hp {
    background: #ff657d;
}

.collapsed-player {
    width: 50px;
    height: 50px;
    margin: 8px auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    color: #eef2f7;
    background: #192335;
    border: 1px solid #334159;
    border-radius: 12px;
    font-size: 11px;
}

.collapsed-player strong {
    color: #c88cff;
    font-size: 14px;
}

.navigation {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sidebar.collapsed .navigation {
    margin-top: 26px;
    gap: 12px;
}

.nav-item {
    min-height: 44px;
    box-sizing: border-box;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #b8c1d2;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: 10px;
    transition: 0.2s;
}

.nav-item:hover {
    color: white;
    background: #202c40;
}

.nav-icon {
    width: 20px;
    flex-shrink: 0;
    text-align: center;
    font-size: 16px;
    line-height: 1;
}

.nav-label {
    white-space: nowrap;
}

.router-link-exact-active {
    color: white;
    background: rgba(139, 55, 255, 0.22);
    border-color: #8844d9;
    box-shadow: inset 0 0 18px rgba(141, 58, 255, 0.08);
}

.sidebar.collapsed .nav-item {
    width: 50px;
    height: 50px;
    min-height: 50px;
    margin: 0 auto;
    padding: 0;
    justify-content: center;
    border-radius: 11px;
}

.sidebar.collapsed .nav-icon {
    width: auto;
    font-size: 18px;
}

.sidebar.collapsed .router-link-exact-active {
    background: rgba(139, 55, 255, 0.24);
    box-shadow: 0 0 14px rgba(139, 55, 255, 0.16);
}

.sidebar-bottom {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.new-quest,
.logout-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
}

.new-quest {
    min-height: 44px;
    padding: 12px;
    gap: 6px;
    color: white;
    background: linear-gradient(90deg, #7c2cff, #a928ef);
    border: 0;
    border-radius: 10px;
    box-shadow: 0 0 18px rgba(147, 44, 255, 0.24);
    font-size: 12px;
}

.new-quest:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 22px rgba(147, 44, 255, 0.38);
}

.new-quest-plus {
    font-size: 16px;
    line-height: 1;
}

.logout-button {
    min-height: 42px;
    padding: 10px 12px;
    gap: 8px;
    color: #8996aa;
    background: transparent;
    border: 1px solid #344158;
    border-radius: 9px;
    font-size: 10px;
    letter-spacing: 0.4px;
}

.logout-button:hover {
    color: #ff8298;
    background: rgba(255, 99, 133, 0.06);
    border-color: #754052;
}

.logout-icon {
    font-size: 15px;
}

.sidebar.collapsed .sidebar-bottom {
    gap: 9px;
}

.sidebar.collapsed .new-quest,
.sidebar.collapsed .logout-button {
    width: 50px;
    height: 50px;
    min-height: 50px;
    margin: 0 auto;
    padding: 0;
    border-radius: 11px;
}

.sidebar.collapsed .new-quest-plus {
    font-size: 20px;
}

.sidebar.collapsed .logout-icon {
    font-size: 18px;
}

@media (max-width: 700px) {
    .sidebar,
    .sidebar.collapsed {
        position: static;
        width: 100%;
        height: auto;
        padding: 14px;
        border-right: 0;
        border-bottom: 1px solid #354158;
    }

    .toggle-button {
        display: none;
    }

    .brand,
    .sidebar.collapsed .brand {
        height: auto;
        justify-content: flex-start;
        padding: 0 6px 14px;
    }

    .player,
    .collapsed-player {
        display: none;
    }

    .navigation,
    .sidebar.collapsed .navigation {
        margin-top: 0;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
    }

    .nav-item,
    .sidebar.collapsed .nav-item {
        width: auto;
        height: auto;
        min-width: 100px;
        min-height: 44px;
        flex: 1;
        margin: 0;
        padding: 12px;
        justify-content: center;
    }

    .sidebar-bottom,
    .sidebar.collapsed .sidebar-bottom {
        margin-top: 12px;
        gap: 8px;
    }

    .new-quest,
    .logout-button,
    .sidebar.collapsed .new-quest,
    .sidebar.collapsed .logout-button {
        width: 100%;
        height: auto;
        min-height: 44px;
        margin: 0;
        padding: 10px 12px;
    }
}
</style>