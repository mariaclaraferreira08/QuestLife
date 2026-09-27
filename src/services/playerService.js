import { ref } from "vue"

import storageService from "./storageService"
import { defaultPlayer } from "../data/player"

const PLAYER_KEY = "player"

const storedPlayer = storageService.get(PLAYER_KEY)

if (!storedPlayer) {
    storageService.save(PLAYER_KEY, defaultPlayer)
}

const player = ref(
    storedPlayer || { ...defaultPlayer }
)

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
    }
}

export default playerService
