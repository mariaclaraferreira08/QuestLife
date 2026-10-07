<script setup>
defineProps({
    playerName: {
        type: String,
        default: "Aventureiro"
    }
})

const emit =
    defineEmits([
        "claim"
    ])
</script>

<template>
    <div class="overlay">
        <section class="gift-modal">
            <div class="gift-icon">
                🎁
            </div>

            <span class="eyebrow">
                PRESENTE DA GUILDA
            </span>

            <h2>
                Bem-vindo ao QuestLife,
                {{ playerName }}!
            </h2>

            <p>
                Todo novo aventureiro precisa
                de alguns recursos antes de
                começar sua jornada.
            </p>

            <div class="reward">
                <span>🪙</span>

                <div>
                    <strong>
                        +50 MOEDAS
                    </strong>

                    <small>
                        Presente de boas-vindas
                    </small>
                </div>
            </div>

            <p class="message">
                Use-as com sabedoria. A Loja
                guarda artefatos capazes de
                mudar o destino de uma missão.
            </p>

            <button
                type="button"
                @click="emit('claim')"
            >
                RECOLHER RECOMPENSA
            </button>
        </section>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    padding: 20px;
    display: grid;
    place-items: center;
    background: rgba(4, 8, 15, 0.78);
    backdrop-filter: blur(5px);
}

.gift-modal {
    width: 100%;
    max-width: 410px;
    box-sizing: border-box;
    padding: 32px;
    color: #eef1f7;
    text-align: center;
    background:
        radial-gradient(
            circle at top,
            rgba(147, 66, 230, 0.2),
            transparent 42%
        ),
        #151f30;
    border: 1px solid #70449b;
    border-radius: 18px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}

.gift-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 17px;
    display: grid;
    place-items: center;
    background: #251a38;
    border: 1px solid #7547a1;
    border-radius: 18px;
    font-size: 30px;
}

.eyebrow {
    color: #c583ff;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
}

h2 {
    margin: 9px 0 10px;
    color: white;
    font-size: 20px;
}

p {
    margin: 0;
    color: #8d9bb0;
    font-size: 11px;
    line-height: 1.65;
}

.reward {
    margin: 22px 0;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 13px;
    background: #101927;
    border: 1px solid #71533c;
    border-radius: 12px;
}

.reward > span {
    font-size: 27px;
}

.reward div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.reward strong {
    color: #f3c967;
    font-size: 14px;
}

.reward small {
    margin-top: 3px;
    color: #847963;
    font-size: 8px;
}

.message {
    font-size: 9px;
}

button {
    width: 100%;
    margin-top: 23px;
    padding: 13px;
    color: white;
    background: linear-gradient(90deg, #7227dc, #a928ef);
    border: 1px solid #ad62ef;
    border-radius: 9px;
    font-family: inherit;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
}
</style>