import { ref } from "vue"

import storageService from "./storageService"
import { defaultPlayer } from "../data/player"

const PLAYER_KEY = "player"

const emptyEffects = {
    protection: null,
    streakProtection: null
}

const storedPlayer =
    storageService.get(PLAYER_KEY)

const initialPlayer =
    storedPlayer
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
                    : 100,

            inventory:
                storedPlayer.inventory &&
                typeof storedPlayer.inventory === "object" &&
                !Array.isArray(storedPlayer.inventory)
                    ? storedPlayer.inventory
                    : {},

            activeEffects:
                storedPlayer.activeEffects &&
                typeof storedPlayer.activeEffects === "object"
                    ? {
                        ...emptyEffects,
                        ...storedPlayer.activeEffects
                    }
                    : {
                        ...emptyEffects
                    }
        }
        : {
            ...defaultPlayer,
            health: 100,
            maxHealth: 100,
            inventory: {},
            activeEffects: {
                ...emptyEffects
            }
        }

storageService.save(
    PLAYER_KEY,
    initialPlayer
)

const player = ref(
    initialPlayer
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

        player.value =
            updatedPlayer

        storageService.save(
            PLAYER_KEY,
            updatedPlayer
        )

        return updatedPlayer
    },

    resetHealth() {
        const maxHealth =
            player.value.maxHealth || 100

        return this.updatePlayer({
            health: maxHealth
        })
    },

    /*
     * =========================
     * INVENTÁRIO
     * =========================
     */

    getInventory() {
        return (
            player.value.inventory ||
            {}
        )
    },

    getItemQuantity(itemId) {
        const inventory =
            this.getInventory()

        return (
            inventory[itemId] ||
            0
        )
    },

    addItem(
        itemId,
        quantity = 1
    ) {
        if (
            !itemId ||
            quantity <= 0
        ) {
            return player.value
        }

        const inventory = {
            ...this.getInventory()
        }

        const currentQuantity =
            inventory[itemId] || 0

        inventory[itemId] =
            currentQuantity + quantity

        return this.updatePlayer({
            inventory
        })
    },

    removeItem(
        itemId,
        quantity = 1
    ) {
        if (
            !itemId ||
            quantity <= 0
        ) {
            return false
        }

        const inventory = {
            ...this.getInventory()
        }

        const currentQuantity =
            inventory[itemId] || 0

        if (
            currentQuantity < quantity
        ) {
            return false
        }

        const newQuantity =
            currentQuantity - quantity

        if (newQuantity === 0) {
            delete inventory[itemId]
        } else {
            inventory[itemId] =
                newQuantity
        }

        this.updatePlayer({
            inventory
        })

        return true
    },

    /*
     * =========================
     * EFEITOS ATIVOS
     * =========================
     */

    getActiveEffects() {
        return (
            player.value.activeEffects ||
            {
                ...emptyEffects
            }
        )
    },

    getActiveEffect(effectKey) {
        return (
            this.getActiveEffects()[
                effectKey
            ] || null
        )
    },

    setActiveEffect(
        effectKey,
        effect
    ) {
        const activeEffects = {
            ...this.getActiveEffects(),
            [effectKey]: effect
        }

        return this.updatePlayer({
            activeEffects
        })
    },

    clearActiveEffect(effectKey) {
        const activeEffects = {
            ...this.getActiveEffects(),
            [effectKey]: null
        }

        return this.updatePlayer({
            activeEffects
        })
    }
}

if (typeof window !== "undefined") {
    window.playerService =
        playerService
}

export default playerService