<script setup>
import {
    onMounted,
    onUnmounted
} from "vue"

const emit = defineEmits([
    "close",
    "select"
])

function closeMenu() {
    emit("close")
}

function selectMission(type) {
    emit("select", type)
}

function handleKeydown(event) {
    if (event.key === "Escape") {
        closeMenu()
    }
}

onMounted(() => {
    document.body.style.overflow = "hidden"

    window.addEventListener(
        "keydown",
        handleKeydown
    )
})

onUnmounted(() => {
    document.body.style.overflow = ""

    window.removeEventListener(
        "keydown",
        handleKeydown
    )
})
</script>

<template>
    <Teleport to="body">
        <div
            class="mission-overlay"
            @click.self="closeMenu"
        >
            <section
                class="mission-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mission-title"
            >
                <header class="modal-header">
                    <div>
                        <span class="eyebrow">
                            NEW QUEST
                        </span>

                        <h2 id="mission-title">
                            Nova missão
                        </h2>

                        <p>
                            O que você deseja criar?
                        </p>
                    </div>

                    <button
                        type="button"
                        class="close-button"
                        aria-label="Fechar"
                        @click="closeMenu"
                    >
                        ×
                    </button>
                </header>

                <div class="mission-options">
                    <!-- TAREFA -->

                    <button
                        type="button"
                        class="mission-option"
                        @click="
                            selectMission('task')
                        "
                    >
                        <div class="option-icon">
                            ☑
                        </div>

                        <div class="option-content">
                            <strong>
                                Tarefa
                            </strong>

                            <span>
                                Uma missão com objetivo
                                definido.
                            </span>
                        </div>

                        <span class="option-arrow">
                            →
                        </span>
                    </button>

                    <!-- HÁBITO -->

                    <button
                        type="button"
                        class="mission-option"
                        @click="
                            selectMission('habit')
                        "
                    >
                        <div class="option-icon">
                            🔥
                        </div>

                        <div class="option-content">
                            <strong>
                                Hábito
                            </strong>

                            <span>
                                Construa consistência e
                                sequências.
                            </span>
                        </div>

                        <span class="option-arrow">
                            →
                        </span>
                    </button>

                    <!-- DIÁRIA -->

                    <button
                        type="button"
                        class="mission-option"
                        @click="
                            selectMission('daily')
                        "
                    >
                        <div class="option-icon">
                            📅
                        </div>

                        <div class="option-content">
                            <strong>
                                Diária
                            </strong>

                            <span>
                                Uma missão que retorna
                                nos dias escolhidos.
                            </span>
                        </div>

                        <span class="option-arrow">
                            →
                        </span>
                    </button>
                </div>
            </section>
        </div>
    </Teleport>
</template>

<style scoped>
/*
 * ========================================
 * OVERLAY
 * ========================================
 *
 * O Teleport coloca este elemento
 * diretamente dentro do <body>.
 *
 * Isso evita que cards, sidebar ou
 * outros elementos escapem do blur.
 */

.mission-overlay {
    position: fixed;

    inset: 0;

    width: 100vw;
    height: 100vh;

    z-index: 99999;

    display: flex;

    align-items: center;
    justify-content: center;

    padding: 24px;

    box-sizing: border-box;

    /*
     * Escurece a página.
     */
    background:
        rgba(
            3,
            8,
            17,
            0.72
        );

    /*
     * Desfoca tudo que está
     * atrás do overlay.
     */
    backdrop-filter:
        blur(5px);

    -webkit-backdrop-filter:
        blur(5px);

    animation:
        overlay-enter
        0.18s ease;
}

/*
 * ========================================
 * MODAL
 * ========================================
 */

.mission-modal {
    position: relative;

    z-index: 100000;

    width: 100%;
    max-width: 470px;

    padding: 22px;

    box-sizing: border-box;

    color: #edf0f7;

    background: #151f30;

    border:
        1px solid #43516a;

    border-radius: 12px;

    box-shadow:
        0 25px 70px
        rgba(
            0,
            0,
            0,
            0.5
        );

    animation:
        modal-enter
        0.2s ease;
}

/*
 * ========================================
 * CABEÇALHO
 * ========================================
 */

.modal-header {
    display: flex;

    align-items: flex-start;
    justify-content: space-between;

    gap: 20px;

    margin-bottom: 20px;
}

.eyebrow {
    display: block;

    margin-bottom: 10px;

    color: #9b63cf;

    font-size: 9px;

    letter-spacing: 2px;
}

.modal-header h2 {
    margin: 0;

    color: #f2f4f8;

    font-size: 29px;

    font-weight: 400;

    line-height: 1.1;
}

.modal-header p {
    margin:
        10px 0 0;

    color: #8794a8;

    font-size: 11px;
}

/*
 * ========================================
 * BOTÃO FECHAR
 * ========================================
 */

.close-button {
    width: 30px;
    height: 30px;

    flex-shrink: 0;

    display: grid;

    place-items: center;

    padding: 0;

    color: #6d798d;

    background: transparent;

    border: 0;

    font-family: inherit;

    font-size: 20px;

    cursor: pointer;

    transition:
        color 0.2s,
        background 0.2s;
}

.close-button:hover {
    color: #ff7188;
}

/*
 * ========================================
 * OPÇÕES
 * ========================================
 */

.mission-options {
    display: flex;

    flex-direction: column;

    gap: 10px;
}

.mission-option {
    width: 100%;

    min-height: 74px;

    padding: 14px 16px;

    display: flex;

    align-items: center;

    gap: 14px;

    color: inherit;

    text-align: left;

    background: #101927;

    border:
        1px solid #354158;

    border-radius: 9px;

    font-family: inherit;

    cursor: pointer;

    transition:
        transform 0.18s,
        border-color 0.18s,
        background 0.18s,
        box-shadow 0.18s;
}

.mission-option:hover {
    transform:
        translateY(-1px);

    background: #172236;

    border-color: #7d46aa;

    box-shadow:
        0 0 18px
        rgba(
            137,
            61,
            198,
            0.08
        );
}

/*
 * ========================================
 * ÍCONES
 * ========================================
 */

.option-icon {
    width: 42px;
    height: 42px;

    flex-shrink: 0;

    display: grid;

    place-items: center;

    color: #f1e5ff;

    background: #291c3a;

    border:
        1px solid #60407b;

    border-radius: 7px;

    font-size: 18px;
}

/*
 * ========================================
 * TEXTO
 * ========================================
 */

.option-content {
    min-width: 0;

    flex: 1;

    display: flex;

    flex-direction: column;

    gap: 6px;
}

.option-content strong {
    color: #f0edf5;

    font-size: 13px;
}

.option-content span {
    color: #8290a5;

    font-size: 10px;

    line-height: 1.5;
}

/*
 * ========================================
 * SETA
 * ========================================
 */

.option-arrow {
    flex-shrink: 0;

    color: #bd68ee;

    font-size: 17px;

    transition:
        transform 0.18s;
}

.mission-option:hover
.option-arrow {
    transform:
        translateX(3px);
}

/*
 * ========================================
 * ANIMAÇÕES
 * ========================================
 */

@keyframes overlay-enter {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes modal-enter {
    from {
        opacity: 0;

        transform:
            translateY(8px)
            scale(0.98);
    }

    to {
        opacity: 1;

        transform:
            translateY(0)
            scale(1);
    }
}

/*
 * ========================================
 * RESPONSIVO
 * ========================================
 */

@media (
    max-width: 550px
) {
    .mission-overlay {
        padding: 14px;
    }

    .mission-modal {
        padding: 18px;
    }

    .modal-header h2 {
        font-size: 25px;
    }

    .mission-option {
        min-height: 70px;

        padding: 12px;
    }

    .option-icon {
        width: 39px;
        height: 39px;
    }
}
</style>