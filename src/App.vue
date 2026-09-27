<script setup>
import AppSidebar from "./components/AppSidebar.vue"
</script>

<template>
    <div class="app-layout">
        <AppSidebar />

        <main class="main-content">
            <RouterView />
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
    padding: 32px;

    background:
        radial-gradient(
            circle at top right,
            rgba(75, 47, 128, 0.12),
            transparent 35%
        ),
        #0d1421;
}
</style>
