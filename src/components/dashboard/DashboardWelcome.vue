<script setup>
defineProps({
    activeQuests: {
        type: Number,
        default: 0
    }
})
</script>

<template>
    <section class="welcome-card">
        <div class="welcome-content">
            <span class="eyebrow">
                BEM-VINDA DE VOLTA, AVENTUREIRA!
            </span>

            <p>
                Continue sua jornada.
                Você tem
                <strong>{{ activeQuests }}</strong>
                {{ activeQuests === 1 ? "missão ativa" : "missões ativas" }}
                esperando por você.
            </p>
        </div>

        <div class="welcome-decoration">
            ✦
        </div>
    </section>
</template>

<style scoped>
.welcome-card {
    position: relative;

    min-height: 120px;
    padding: 26px 28px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    overflow: hidden;

    background:
        linear-gradient(
            120deg,
            #151f30 0%,
            #131b2b 100%
        );

    border: 1px solid #344158;
    border-radius: 14px;
}

.welcome-content {
    position: relative;
    z-index: 1;
}

.eyebrow {
    display: block;

    margin-bottom: 12px;

    color: #bd7cff;

    font-size: 12px;
    font-weight: 700;

    letter-spacing: 2px;
}

.welcome-card p {
    margin: 0;

    color: #a8b3c5;

    font-size: 14px;
    line-height: 1.6;
}

.welcome-card strong {
    color: #eef1f7;
}

.welcome-decoration {
    position: absolute;

    right: 30px;

    color: #8c2cff;

    font-size: 58px;

    opacity: 0.16;

    transform: rotate(15deg);
}

@media (max-width: 700px) {
    .welcome-card {
        padding: 22px;
    }

    .welcome-decoration {
        display: none;
    }
}
</style>