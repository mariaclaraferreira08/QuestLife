import playerService from "./playerService"
import habitService from "./habitService"
import { shopItems } from "../data/shopItems"

const shopService = {
    getItems() {
        return shopItems
    },

    canAfford(itemId) {
        const player = playerService.getPlayer()
        const item = shopItems[itemId]

        if (!item) {
            return false
        }

        return player.coins >= item.price
    },

    useRecoveryPotion(habitId) {
        const player = playerService.getPlayer()
        const habit = habitService.getHabitById(habitId)

        const potion = shopItems.recoveryPotion

        if (!habit) {
            return null
        }

        if (!habit.failed) {
            return null
        }

        if (player.coins < potion.price) {
            return null
        }

        const newCoins = player.coins - potion.price

        playerService.updatePlayer({
            coins: newCoins
        })

        return habitService.updateHabit(habitId, {
            streak: habit.previousStreak,
            previousStreak: 0,
            failed: false
        })
    }
}

export default shopService
