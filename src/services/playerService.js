import storageService from "./storageService"
import { defaultPlayer } from "../data/player"

const PLAYER_KEY = "player"

const playerService = {
    getPlayer() {
        const player = storageService.get(PLAYER_KEY)

        if (!player) {
            storageService.save(PLAYER_KEY, defaultPlayer)

            return defaultPlayer
        }

        return player
    },

    updatePlayer(updatedData) {
        const player = this.getPlayer()

        const updatedPlayer = {
            ...player,
            ...updatedData
        }

        storageService.save(PLAYER_KEY, updatedPlayer)

        return updatedPlayer
    }
}

export default playerService
