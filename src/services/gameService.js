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
    },

    takeDamage(amount) {
        const player = playerService.getPlayer()

        console.log("Player:", player)
        console.log("Health:", player.health)
        console.log("Amount:", amount)

        const result = player.health - amount

        console.log("Resultado da subtração:", result)

        const newHealth = Math.max(0, result)

        console.log("New Health:", newHealth)

        return playerService.updatePlayer({
            health: newHealth
        })
    }
}

export default gameService