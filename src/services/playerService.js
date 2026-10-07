import { ref } from "vue"
import storageService from "./storageService"
import authService from "./authService"
import { defaultPlayer } from "../data/player"

const emptyEffects = {
    protection: null,
    streakProtection: null
}

function getPlayerKey() {
    return authService.getUserStorageKey("player")
}

function normalizePlayer(
    storedPlayer = {},
    account = null
) {
    return {
        ...defaultPlayer,
        ...storedPlayer,
        name:
            account?.name ||
            storedPlayer.name ||
            "",
        email:
            account?.email ||
            storedPlayer.email ||
            "",
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
                },
        welcomeGiftClaimed:
            storedPlayer.welcomeGiftClaimed === true
    }
}

function createNewPlayer(account) {
    return normalizePlayer(
        {
            ...defaultPlayer,
            name: account?.name || "",
            email: account?.email || ""
        },
        account
    )
}

function createInitialPlayer() {
    const account =
        authService.getCurrentUser()

    if (!account) {
        return normalizePlayer(
            defaultPlayer
        )
    }

    const playerKey =
        getPlayerKey()

    const storedPlayer =
        storageService.get(
            playerKey
        )

    if (storedPlayer) {
        return normalizePlayer(
            storedPlayer,
            account
        )
    }

    const newPlayer =
        createNewPlayer(
            account
        )

    storageService.save(
        playerKey,
        newPlayer
    )

    return newPlayer
}

const player =
    ref(
        createInitialPlayer()
    )

function savePlayer(playerData) {
    if (
        !authService.isAuthenticated()
    ) {
        return
    }

    storageService.save(
        getPlayerKey(),
        playerData
    )
}

const playerService = {
    player,

    /*
     * =========================
     * PLAYER
     * =========================
     */

    getPlayer() {
        return player.value
    },

    loadCurrentPlayer() {
        player.value =
            createInitialPlayer()

        savePlayer(
            player.value
        )

        return player.value
    },

    clearCurrentPlayer() {
        player.value =
            normalizePlayer(
                defaultPlayer
            )
    },

    updatePlayer(updatedData) {
        const updatedPlayer = {
            ...player.value,
            ...updatedData
        }

        player.value =
            updatedPlayer

        savePlayer(
            updatedPlayer
        )

        return updatedPlayer
    },

    resetHealth() {
        const maxHealth =
            player.value.maxHealth ||
            100

        return this.updatePlayer({
            health: maxHealth
        })
    },

    /*
     * =========================
     * PRESENTE
     * =========================
     */

    claimWelcomeGift() {
        if (
            player.value
                .welcomeGiftClaimed
        ) {
            return {
                success: false,
                reason:
                    "already-claimed"
            }
        }

        const reward = 50

        this.updatePlayer({
            coins:
                (
                    player.value.coins ||
                    0
                ) +
                reward,
            welcomeGiftClaimed:
                true
        })

        return {
            success: true,
            reward
        }
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
            inventory[itemId] ||
            0

        inventory[itemId] =
            currentQuantity +
            quantity

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
            inventory[itemId] ||
            0

        if (
            currentQuantity <
            quantity
        ) {
            return false
        }

        const newQuantity =
            currentQuantity -
            quantity

        if (
            newQuantity === 0
        ) {
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
            player.value
                .activeEffects ||
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

if (
    typeof window !== "undefined"
) {
    window.playerService =
        playerService
}

export default playerService