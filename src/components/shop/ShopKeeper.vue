<script setup>
defineProps({
    playerName: {
        type: String,
        default: "Aventureiro"
    }
})
</script>

<template>
    <section class="shopkeeper">
        <div class="shopkeeper-art">
            <div class="art-glow"></div>

            <img
                src="/assets/shop/shopkeeper.png"
                alt="Mippy, mercadora da Guilda"
                class="shopkeeper-image"
            />

            <div class="merchant-nameplate">
                <strong>
                    Mippy
                </strong>

                <span>
                    MERCADORA DA GUILDA
                </span>
            </div>
        </div>

        <div class="shopkeeper-content">
            <span class="shop-label">
                LOJA DA GUILDA
            </span>

            <h2>
                Oi, {{ playerName }}.
            </h2>

            <p class="intro">
                Mippy separou poções, relíquias e alguns
                artefatos para quando uma missão resolver
                dar mais trabalho do que deveria.
            </p>

            <div class="dialogue">
                <span class="quote">
                    “
                </span>

                <div>
                    <strong class="speaker">
                        Mippy
                    </strong>

                    <p>
                        Mippy recomenda dar uma olhada no
                        estoque antes de sair por aí tomando
                        dano. Mas Mippy não manda em ninguém.
                        Ainda.
                    </p>
                </div>
            </div>

            <div class="merchant-info">
                <span>✦ POÇÕES</span>
                <span>✦ RELÍQUIAS</span>
                <span>✦ ARTEFATOS</span>
            </div>
        </div>
    </section>
</template>

<style scoped>
.shopkeeper {
    min-height: 300px;
    display: grid;
    grid-template-columns: 320px minmax(0, 1fr);
    overflow: hidden;
    position: relative;
    background:
        linear-gradient(
            120deg,
            rgba(111, 38, 181, 0.15),
            transparent 42%
        ),
        #151f30;
    border: 1px solid #354158;
    border-radius: 15px;
}

.shopkeeper::before {
    content: "";
    position: absolute;
    top: -90px;
    right: -60px;
    width: 260px;
    height: 260px;
    background:
        radial-gradient(
            circle,
            rgba(139, 68, 212, 0.12),
            transparent 70%
        );
    pointer-events: none;
}

.shopkeeper-art {
    min-height: 300px;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
    background:
        radial-gradient(
            circle at 50% 65%,
            rgba(144, 82, 199, 0.21),
            transparent 58%
        ),
        linear-gradient(
            180deg,
            #121c2b,
            #101927
        );
    border-right: 1px solid #354158;
}

.art-glow {
    position: absolute;
    width: 220px;
    height: 220px;
    bottom: 10px;
    background:
        radial-gradient(
            circle,
            rgba(144, 78, 218, 0.16),
            transparent 65%
        );
    filter: blur(8px);
}

.shopkeeper-image {
    width: 100%;
    max-width: 300px;
    height: 295px;
    position: relative;
    z-index: 2;
    object-fit: contain;
    object-position: center bottom;
    filter:
        drop-shadow(
            0 12px 18px rgba(0, 0, 0, 0.38)
        );
}

.merchant-nameplate {
    position: absolute;
    left: 18px;
    bottom: 17px;
    z-index: 4;
    min-width: 125px;
    padding: 9px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: rgba(9, 15, 25, 0.88);
    border: 1px solid #65428a;
    border-radius: 8px;
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.22);
}

.merchant-nameplate strong {
    color: #f1ddff;
    font-size: 13px;
    font-weight: 800;
}

.merchant-nameplate span {
    color: #a66bd6;
    font-size: 7px;
    font-weight: 800;
    letter-spacing: 1px;
}

.shopkeeper-content {
    min-width: 0;
    padding: 38px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.shop-label {
    margin-bottom: 9px;
    color: #b96cff;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 2px;
}

.shopkeeper-content h2 {
    margin: 0;
    color: #f5f1fa;
    font-size: 27px;
}

.intro {
    max-width: 580px;
    margin: 12px 0 22px;
    color: #8e9bae;
    font-size: 12px;
    line-height: 1.7;
}

.dialogue {
    max-width: 590px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 15px 18px;
    background: rgba(13, 22, 36, 0.75);
    border: 1px solid #354158;
    border-left: 3px solid #a44ce7;
    border-radius: 9px;
}

.quote {
    flex-shrink: 0;
    color: #c573ff;
    font-family: Georgia, serif;
    font-size: 28px;
    line-height: 1;
}

.dialogue > div {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.speaker {
    color: #ce91ff;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.dialogue p {
    margin: 0;
    color: #b9c3d1;
    font-size: 11px;
    line-height: 1.7;
}

.merchant-info {
    margin-top: 19px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.merchant-info span {
    color: #6f7e94;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1px;
}

@media (max-width: 850px) {
    .shopkeeper {
        grid-template-columns: 250px minmax(0, 1fr);
    }

    .shopkeeper-art {
        min-height: 270px;
    }

    .shopkeeper-image {
        height: 265px;
    }

    .shopkeeper-content {
        padding: 28px;
    }
}

@media (max-width: 650px) {
    .shopkeeper {
        grid-template-columns: 1fr;
    }

    .shopkeeper-art {
        min-height: 250px;
        border-right: 0;
        border-bottom: 1px solid #354158;
    }

    .shopkeeper-image {
        height: 245px;
    }

    .shopkeeper-content {
        padding: 24px;
    }

    .shopkeeper-content h2 {
        font-size: 22px;
    }
}
</style>