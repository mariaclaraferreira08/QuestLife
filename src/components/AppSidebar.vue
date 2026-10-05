<script setup>
import {
    ref,
    computed
} from "vue"

import {
    useRouter
} from "vue-router"

import playerService from "../services/playerService"

import CreateMissionMenu from "./CreateMissionMenu.vue"

const router =
    useRouter()

/*
 * O próprio playerService já possui
 * um ref reativo.
 *
 * Não precisamos mais ficar ouvindo
 * player-updated manualmente.
 */
const player =
    playerService.player

const showCreateMenu =
    ref(false)

const xpPercentage =
    computed(() => {
        const xp =
            Number(
                player.value.xp
            ) || 0

        return Math.min(
            100,
            Math.max(
                0,
                xp
            )
        )
    })

const healthPercentage =
    computed(() => {
        const health =
            Number(
                player.value.health
            ) || 0

        const maxHealth =
            Number(
                player.value.maxHealth
            ) || 100

        if (maxHealth <= 0) {
            return 0
        }

        return Math.min(
            100,
            Math.max(
                0,
                (
                    health /
                    maxHealth
                ) * 100
            )
        )
    })

function openCreateMenu() {
    showCreateMenu.value =
        true
}

function closeCreateMenu() {
    showCreateMenu.value =
        false
}

function selectMission(type) {
    closeCreateMenu()

    if (type === "task") {
        router.push(
            "/tasks/new"
        )

        return
    }

    if (type === "habit") {
        router.push(
            "/habits"
        )

        return
    }

    if (type === "daily") {
        router.push(
            "/dailies"
        )
    }
}
</script>

<template>
    <aside class="sidebar">
        <div class="brand">
            <div class="brand-icon">
                ⚔
            </div>

            <span>
                QuestLife
            </span>
        </div>

        <div class="player">
            <div class="player-header">
                <span>
                    LEVEL
                    {{ player.level }}
                </span>

                <span>
                    🪙
                    {{ player.coins }}
                </span>
            </div>

            <div class="stat">
                <div class="stat-label">
                    <span>
                        XP
                    </span>

                    <span>
                        {{ player.xp }}/100
                    </span>
                </div>

                <div class="bar">
                    <div
                        class="bar-fill xp"
                        :style="{
                            width:
                                xpPercentage +
                                '%'
                        }"
                    ></div>
                </div>
            </div>

            <div class="stat">
                <div class="stat-label">
                    <span>
                        HP
                    </span>

                    <span>
                        {{ player.health }}/{{
                            player.maxHealth ||
                            100
                        }}
                    </span>
                </div>

                <div class="bar">
                    <div
                        class="bar-fill hp"
                        :style="{
                            width:
                                healthPercentage +
                                '%'
                        }"
                    ></div>
                </div>
            </div>
        </div>

        <nav class="navigation">
            <RouterLink
                to="/"
                class="nav-item"
            >
                <span>
                    ⌂
                </span>

                Dashboard
            </RouterLink>

            <RouterLink
                to="/tasks"
                class="nav-item"
            >
                <span>
                    ☑
                </span>

                Tarefas
            </RouterLink>

            <RouterLink
                to="/habits"
                class="nav-item"
            >
                <span>
                    🔥
                </span>

                Hábitos
            </RouterLink>

            <RouterLink
                to="/dailies"
                class="nav-item"
            >
                <span>
                    📅
                </span>

                Diárias
            </RouterLink>

            <RouterLink
                to="/shop"
                class="nav-item"
            >
                <span>
                    🧪
                </span>

                Loja
            </RouterLink>
        </nav>

        <button
            type="button"
            class="new-quest"
            @click="
                openCreateMenu
            "
        >
            + NOVA MISSÃO
        </button>

        <CreateMissionMenu
            v-if="
                showCreateMenu
            "
            @close="
                closeCreateMenu
            "
            @select="
                selectMission
            "
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

    padding: 22px 18px;

    display: flex;
    flex-direction: column;

    color: #e8ecf5;

    background: #151d2d;

    border-right:
        1px solid #354158;
}

.brand {
    display: flex;

    align-items: center;

    gap: 12px;

    padding:
        0 8px 24px;

    color: #c38cff;

    font-weight: 700;

    letter-spacing: 1px;
}

.brand-icon {
    width: 38px;
    height: 38px;

    flex-shrink: 0;

    display: grid;

    place-items: center;

    background: #8c2cff;

    border-radius: 10px;

    box-shadow:
        0 0 18px
        rgba(
            170,
            73,
            255,
            0.6
        );
}

.player {
    padding: 16px;

    background: #192335;

    border:
        1px solid #334159;

    border-radius: 12px;
}

.player-header,
.stat-label {
    display: flex;

    justify-content:
        space-between;

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

    border-radius: 20px;
}

.bar-fill {
    height: 100%;

    border-radius: inherit;

    transition:
        width 0.3s ease;
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
    padding:
        12px 14px;

    display: flex;

    align-items: center;

    gap: 12px;

    color: #b8c1d2;

    text-decoration: none;

    border:
        1px solid transparent;

    border-radius: 8px;

    transition: 0.2s;
}

.nav-item:hover {
    color: white;

    background: #202c40;
}

.router-link-exact-active {
    color: white;

    background:
        rgba(
            139,
            55,
            255,
            0.22
        );

    border-color: #8844d9;

    box-shadow:
        inset 0 0 18px
        rgba(
            141,
            58,
            255,
            0.08
        );
}

.new-quest {
    width: 100%;

    margin-top: auto;

    padding: 13px;

    color: white;

    text-align: center;

    font-family: inherit;

    font-weight: 600;

    background:
        linear-gradient(
            90deg,
            #7c2cff,
            #a928ef
        );

    border: 0;

    border-radius: 8px;

    box-shadow:
        0 0 15px
        rgba(
            147,
            44,
            255,
            0.25
        );

    cursor: pointer;

    transition: 0.2s;
}

.new-quest:hover {
    transform:
        translateY(-1px);

    box-shadow:
        0 0 20px
        rgba(
            147,
            44,
            255,
            0.4
        );
}

@media (
    max-width: 800px
) {
    .sidebar {
        width: 220px;
    }
}
</style>