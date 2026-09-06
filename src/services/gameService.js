import playerService from "./playerService"

const gameService = {
    addXP(amount) {
        const player = playerService.getPlayer()

        const newXP = player.xp + amount

        return playerService.updatePlayer({
            xp: newXP
        })
    },

    addCoins(amount) {
        const player = playerService.getPlayer()

        const newCoins = player.coins + amount

        return playerService.updatePlayer({
            coins: newCoins
        })
    }
}

export default gameService
