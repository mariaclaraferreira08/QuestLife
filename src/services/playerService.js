import { ref } from "vue"

import storageService from "./storageService"
import { defaultPlayer } from "../data/player"

const PLAYER_KEY = "player"

const storedPlayer = storageService.get(PLAYER_KEY)

/*
 * Se já existe jogador salvo, preservamos os dados.
 *
 * Se health estiver ausente ou inválido,
 * corrigimos para 100.
 */
const initialPlayer = storedPlayer
    ? {
        ...defaultPlayer,
        ...storedPlayer,

        health:
            typeof storedPlayer.health === "number"
                ? storedPlayer.health
                : 100,

        maxHealth:
            typeof storedPlayer.maxHealth === "number"
                ? storedPlayer.maxHealth
                : 100
    }
    : {
        ...defaultPlayer,
        health: 100,
        maxHealth: 100
    }

storageService.save(
    PLAYER_KEY,
    initialPlayer
)

const player = ref(initialPlayer)

const playerService = {
    player,

    getPlayer() {
        return player.value
    },

    updatePlayer(updatedData) {
        const updatedPlayer = {
            ...player.value,
            ...updatedData
        }

        player.value = updatedPlayer

        storageService.save(
            PLAYER_KEY,
            updatedPlayer
        )

        return updatedPlayer
    },

    resetHealth() {
        return this.updatePlayer({
            health:
                player.value.maxHealth || 100
        })
    }
}

export default playerService
