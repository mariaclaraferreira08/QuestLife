import playerService from "./playerService"
import { shopItems } from "../data/shopItems"

const shopService = {
    getItems() {
        return Object.values(
            shopItems
        )
    },

    getItemById(itemId) {
        if (!itemId) {
            return null
        }

        return (
            shopItems[itemId] ||
            null
        )
    },

    /*
     * =========================
     * COMPRA
     * =========================
     */

    canBuyItem(itemId) {
        const item =
            this.getItemById(
                itemId
            )

        if (!item) {
            return {
                success: false,
                reason: "item-not-found"
            }
        }

        const player =
            playerService.getPlayer()

        const currentCoins =
            typeof player.coins ===
            "number"
                ? player.coins
                : 0

        if (
            currentCoins <
            item.price
        ) {
            return {
                success: false,
                reason:
                    "not-enough-coins",

                item,

                required:
                    item.price,

                current:
                    currentCoins,

                missing:
                    item.price -
                    currentCoins
            }
        }

        return {
            success: true,
            item
        }
    },

    buyItem(itemId) {
        const validation =
            this.canBuyItem(
                itemId
            )

        if (!validation.success) {
            return validation
        }

        const item =
            validation.item

        const player =
            playerService.getPlayer()

        const currentCoins =
            typeof player.coins ===
            "number"
                ? player.coins
                : 0

        playerService.updatePlayer({
            coins:
                currentCoins -
                item.price
        })

        playerService.addItem(
            item.id,
            1
        )

        return {
            success: true,
            item,

            quantity:
                playerService.getItemQuantity(
                    item.id
                ),

            player:
                playerService.getPlayer()
        }
    },

    getOwnedQuantity(itemId) {
        return (
            playerService.getItemQuantity(
                itemId
            )
        )
    },

    /*
     * =========================
     * POÇÕES DE VIDA
     * =========================
     */

    canUseItem(itemId) {
        const item =
            this.getItemById(
                itemId
            )

        if (!item) {
            return {
                success: false,
                reason: "item-not-found"
            }
        }

        if (
            playerService.getItemQuantity(
                itemId
            ) <= 0
        ) {
            return {
                success: false,
                reason: "item-not-owned"
            }
        }

        if (
            !item.effect?.health &&
            !item.effect?.fullHealth
        ) {
            return {
                success: false,
                reason:
                    "effect-not-implemented"
            }
        }

        const player =
            playerService.getPlayer()

        const maxHealth =
            player.maxHealth || 100

        const currentHealth =
            typeof player.health ===
            "number"
                ? player.health
                : maxHealth

        if (
            currentHealth >= maxHealth
        ) {
            return {
                success: false,
                reason:
                    "health-already-full"
            }
        }

        return {
            success: true,
            item
        }
    },

    useItem(itemId) {
        const validation =
            this.canUseItem(
                itemId
            )

        if (!validation.success) {
            return validation
        }

        const item =
            validation.item

        const player =
            playerService.getPlayer()

        const maxHealth =
            player.maxHealth || 100

        const healthBefore =
            typeof player.health ===
            "number"
                ? player.health
                : maxHealth

        let healthAfter =
            healthBefore

        if (
            item.effect?.fullHealth
        ) {
            healthAfter =
                maxHealth
        } else if (
            item.effect?.health
        ) {
            healthAfter =
                Math.min(
                    maxHealth,
                    healthBefore +
                    item.effect.health
                )
        }

        playerService.updatePlayer({
            health:
                healthAfter
        })

        playerService.removeItem(
            itemId,
            1
        )

        return {
            success: true,
            item,

            healthBefore,
            healthAfter,

            healed:
                healthAfter -
                healthBefore,

            quantity:
                playerService.getItemQuantity(
                    itemId
                ),

            player:
                playerService.getPlayer()
        }
    },

    /*
     * =========================
     * ITENS ESPECIAIS
     * =========================
     */

    getEffectKey(itemId) {
        if (
            itemId ===
            "protectionAmulet"
        ) {
            return "protection"
        }

        if (
            itemId ===
            "streakPotion"
        ) {
            return "streakProtection"
        }

        return null
    },

    activateSpecialItem(
        itemId,
        targetType,
        targetId,
        targetTitle
    ) {
        const item =
            this.getItemById(
                itemId
            )

        if (!item) {
            return {
                success: false,
                reason: "item-not-found"
            }
        }

        if (
            playerService.getItemQuantity(
                itemId
            ) <= 0
        ) {
            return {
                success: false,
                reason: "item-not-owned"
            }
        }

        const effectKey =
            this.getEffectKey(
                itemId
            )

        if (!effectKey) {
            return {
                success: false,
                reason:
                    "invalid-special-item"
            }
        }

        if (
            itemId ===
            "protectionAmulet" &&
            ![
                "task",
                "habit",
                "daily"
            ].includes(
                targetType
            )
        ) {
            return {
                success: false,
                reason:
                    "invalid-target-type"
            }
        }

        if (
            itemId ===
            "streakPotion" &&
            targetType !== "daily"
        ) {
            return {
                success: false,
                reason:
                    "invalid-target-type"
            }
        }

        const currentEffect =
            playerService.getActiveEffect(
                effectKey
            )

        if (currentEffect) {
            return {
                success: false,
                reason:
                    "effect-already-active",

                effect:
                    currentEffect
            }
        }

        const removed =
            playerService.removeItem(
                itemId,
                1
            )

        if (!removed) {
            return {
                success: false,
                reason:
                    "item-not-owned"
            }
        }

        const effect = {
            itemId,
            targetType,
            targetId,
            targetTitle:
                targetTitle ||
                "Missão",

            activatedAt:
                new Date()
                    .toISOString()
        }

        playerService.setActiveEffect(
            effectKey,
            effect
        )

        return {
            success: true,
            item,
            effect,
            player:
                playerService.getPlayer()
        }
    },

    /*
     * Cancela uma proteção antes que ela
     * seja ativada e devolve o item.
     */
    cancelSpecialEffect(
        effectKey
    ) {
        const effect =
            playerService.getActiveEffect(
                effectKey
            )

        if (!effect) {
            return {
                success: false,
                reason:
                    "effect-not-found"
            }
        }

        playerService.clearActiveEffect(
            effectKey
        )

        playerService.addItem(
            effect.itemId,
            1
        )

        return {
            success: true,
            effect,
            player:
                playerService.getPlayer()
        }
    }
}

if (typeof window !== "undefined") {
    window.shopService =
        shopService
}

export default shopService