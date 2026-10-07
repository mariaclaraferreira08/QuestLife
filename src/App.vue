<script setup>
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import AppSidebar from "./components/AppSidebar.vue"

const route =
    useRoute()

const sidebarCollapsed =
    ref(false)

const publicRoutes = [
    "login",
    "register"
]

const showSidebar =
    computed(() =>
        !publicRoutes.includes(
            route.name
        )
    )

function toggleSidebar() {
    sidebarCollapsed.value =
        !sidebarCollapsed.value
}
</script>

<template>
    <div
        class="app-layout"
        :class="{
            'sidebar-collapsed':
                sidebarCollapsed,
            'without-sidebar':
                !showSidebar
        }"
    >
        <AppSidebar
            v-if="showSidebar"
            :collapsed="sidebarCollapsed"
            @toggle="toggleSidebar"
        />

        <main class="main-content">
            <RouterView />

            <footer
                v-if="showSidebar"
                class="app-footer"
            >
                <span>
                    © 2026 QuestLife
                </span>

                <span>
                    Desenvolvido por
                    Maria Clara Ferreira Alves
                </span>
            </footer>
        </main>
    </div>
</template>

<style>
.app-layout {
    min-height: 100vh;
}

.main-content {
    min-height: 100vh;
    margin-left: 260px;
    padding: 28px;
    box-sizing: border-box;
    background:
        radial-gradient(
            circle at top right,
            rgba(75, 47, 128, 0.12),
            transparent 35%
        ),
        #0d1421;
    transition:
        margin-left 0.25s ease;
}

.sidebar-collapsed .main-content {
    margin-left: 88px;
}

.without-sidebar .main-content {
    margin-left: 0;
    padding: 0;
}

.app-footer {
    width: 100%;
    max-width: 1280px;
    margin: 36px auto 0;
    padding: 18px 0 4px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    color: #526176;
    border-top:
        1px solid #202c3f;
    font-size: 8px;
    letter-spacing: 0.5px;
}

@media (max-width: 700px) {
    .main-content,
    .sidebar-collapsed .main-content {
        margin-left: 0;
        padding: 20px 14px;
    }

    .without-sidebar .main-content {
        padding: 0;
    }

    .app-footer {
        align-items: flex-start;
        flex-direction: column;
        gap: 5px;
    }
}
</style>
