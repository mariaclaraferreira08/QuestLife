import { ref } from "vue"

import storageService from "./storageService"
import { defaultPlayer } from "../data/player"

const PLAYER_KEY = "player"

const CURRENT_PLAYER_VERSION = 2

const storedPlayer =
    storageService.get(PLAYER_KEY)

/*
 * Cria o jogador inicial.
 *
 * Se já houver jogador salvo,
 * preservamos os dados existentes.
 */
let initialPlayer = storedPlayer
    ? {
        ...defaultPlayer,
        ...storedPlayer
    }
    : {
        ...defaultPlayer
    }

/*
 * ========================================
 * MIGRAÇÃO DOS DADOS ANTIGOS
 * ========================================
 *
 * Nas versões antigas do projeto,
 * o HP podia ser salvo inicialmente
 * como 0.
 *
 * Essa correção acontece somente uma vez.
 */
const playerVersion =
    Number(
        initialPlayer.dataVersion || 1
    )

if (playerVersion < 2) {
    initialPlayer = {
        ...initialPlayer,

        health: 100,
        maxHealth: 100,

        dataVersion: 2
    }
}

/*
 * Garante que maxHealth seja válido.
 */
if (
    typeof initialPlayer.maxHealth !==
        "number" ||
    initialPlayer.maxHealth <= 0
) {
    initialPlayer.maxHealth = 100
}

/*
 * Garante que health exista.
 */
if (
    typeof initialPlayer.health !==
    "number"
) {
    initialPlayer.health =
        initialPlayer.maxHealth
}

/*
 * Mantém o HP entre 0 e o máximo.
 */
initialPlayer.health =
    Math.min(
        initialPlayer.maxHealth,

        Math.max(
            0,
            initialPlayer.health
        )
    )

initialPlayer.dataVersion =
    CURRENT_PLAYER_VERSION

/*
 * Salva o jogador já normalizado.
 */
storageService.save(
    PLAYER_KEY,
    initialPlayer
)

const player =
    ref(initialPlayer)

const playerService = {
    player,

    getPlayer() {
        return player.value
    },

    updatePlayer(updatedData) {
        const updatedPlayer = {
            ...player.value,
            ...updatedData,

            dataVersion:
                CURRENT_PLAYER_VERSION
        }

        /*
         * Garante um maxHealth válido.
         */
        if (
            typeof updatedPlayer.maxHealth !==
                "number" ||
            updatedPlayer.maxHealth <= 0
        ) {
            updatedPlayer.maxHealth = 100
        }

        /*
         * Impede HP negativo ou acima
         * do máximo.
         */
        if (
            typeof updatedPlayer.health ===
            "number"
        ) {
            updatedPlayer.health =
                Math.min(
                    updatedPlayer.maxHealth,

                    Math.max(
                        0,
                        updatedPlayer.health
                    )
                )
        }

        player.value =
            updatedPlayer

        storageService.save(
            PLAYER_KEY,
            updatedPlayer
        )

        /*
         * A AppSidebar escuta este evento
         * para atualizar XP, moedas e HP.
         */
        window.dispatchEvent(
            new CustomEvent(
                "player-updated"
            )
        )

        return updatedPlayer
    },

    resetHealth() {
        return this.updatePlayer({
            health:
                player.value.maxHealth ||
                100
        })
    }
}

export default playerService
