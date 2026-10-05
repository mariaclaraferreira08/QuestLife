import playerService from "./playerService"
import { shopItems } from "../data/shopItems"

const shopService = {
    /*
     * =========================
     * CATÁLOGO
     * =========================
     */

    getItems() {
        return Object.values(shopItems)
    },

    getItemById(itemId) {
        if (!itemId) {
            return null
        }

        return shopItems[itemId] || null
    },

    /*
     * =========================
     * COMPRA
     * =========================
     */

    canBuyItem(itemId) {
        const item =
            this.getItemById(itemId)

        if (!item) {
            return {
                success: false,
                reason: "item-not-found"
            }
        }

        const player =
            playerService.getPlayer()

        const currentCoins =
            typeof player.coins === "number"
                ? player.coins
                : 0

        if (currentCoins < item.price) {
            return {
                success: false,
                reason: "not-enough-coins",
                item,
                required: item.price,
                current: currentCoins,
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
            this.canBuyItem(itemId)

        if (!validation.success) {
            return validation
        }

        const item =
            validation.item

        const player =
            playerService.getPlayer()

        const currentCoins =
            typeof player.coins === "number"
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

    /*
     * =========================
     * INVENTÁRIO
     * =========================
     */

    getOwnedQuantity(itemId) {
        return playerService.getItemQuantity(
            itemId
        )
    },

    canUseItem(itemId) {
        const item =
            this.getItemById(itemId)

        if (!item) {
            return {
                success: false,
                reason: "item-not-found"
            }
        }

        const quantity =
            this.getOwnedQuantity(
                itemId
            )

        if (quantity <= 0) {
            return {
                success: false,
                reason: "item-not-owned",
                item
            }
        }

        /*
         * Nesta primeira versão,
         * apenas consumíveis de cura
         * podem ser usados.
         */
        const isHealthItem =
            typeof item.effect?.health ===
                "number" ||
            item.effect?.fullHealth === true

        if (!isHealthItem) {
            return {
                success: false,
                reason: "effect-not-implemented",
                item
            }
        }

        const player =
            playerService.getPlayer()

        const currentHealth =
            typeof player.health === "number"
                ? player.health
                : 100

        const maxHealth =
            typeof player.maxHealth === "number"
                ? player.maxHealth
                : 100

        /*
         * Não desperdiça uma poção
         * quando o HP já está cheio.
         */
        if (currentHealth >= maxHealth) {
            return {
                success: false,
                reason: "health-already-full",
                item
            }
        }

        return {
            success: true,
            item
        }
    },

    useItem(itemId) {
        const validation =
            this.canUseItem(itemId)

        if (!validation.success) {
            return validation
        }

        const item =
            validation.item

        const player =
            playerService.getPlayer()

        const currentHealth =
            typeof player.health === "number"
                ? player.health
                : 100

        const maxHealth =
            typeof player.maxHealth === "number"
                ? player.maxHealth
                : 100

        let newHealth =
            currentHealth

        /*
         * Elixir Vital:
         * restaura completamente o HP.
         */
        if (
            item.effect?.fullHealth === true
        ) {
            newHealth =
                maxHealth
        }

        /*
         * Poções normais:
         * somam HP sem ultrapassar
         * o máximo.
         */
        else if (
            typeof item.effect?.health ===
            "number"
        ) {
            newHealth =
                Math.min(
                    maxHealth,
                    currentHealth +
                        item.effect.health
                )
        }

        /*
         * Atualiza o jogador primeiro.
         */
        playerService.updatePlayer({
            health: newHealth
        })

        /*
         * Remove uma unidade
         * do inventário.
         */
        playerService.removeItem(
            item.id,
            1
        )

        return {
            success: true,

            item,

            healthBefore:
                currentHealth,

            healthAfter:
                newHealth,

            healed:
                newHealth -
                currentHealth,

            quantity:
                playerService.getItemQuantity(
                    item.id
                ),

            player:
                playerService.getPlayer()
        }
    },

    /*
     * =========================
     * MENSAGENS DE COMPRA
     * =========================
     */

    getPurchaseMessage(result) {
        if (!result) {
            return "Não foi possível realizar a compra."
        }

        if (result.success) {
            return `${result.item.name} comprado com sucesso!`
        }

        switch (result.reason) {
            case "item-not-found":
                return "Este item não existe."

            case "not-enough-coins":
                return (
                    `Você precisa de mais ` +
                    `${result.missing} moeda` +
                    `${result.missing === 1 ? "" : "s"} ` +
                    `para comprar este item.`
                )

            default:
                return "Não foi possível realizar a compra."
        }
    },

    /*
     * =========================
     * MENSAGENS DE USO
     * =========================
     */

    getUseMessage(result) {
        if (!result) {
            return "Não foi possível usar este item."
        }

        if (result.success) {
            return (
                `${result.item.name} usado! ` +
                `Você recuperou ` +
                `${result.healed} HP.`
            )
        }

        switch (result.reason) {
            case "item-not-found":
                return "Este item não existe."

            case "item-not-owned":
                return "Você não possui este item."

            case "health-already-full":
                return "Seu HP já está cheio."

            case "effect-not-implemented":
                return (
                    "O efeito deste item ainda " +
                    "não está disponível."
                )

            default:
                return "Não foi possível usar este item."
        }
    }
}

/*
 * TEMPORÁRIO:
 * permite testar pelo console.
 */
if (typeof window !== "undefined") {
    window.shopService =
        shopService
}

export default shopService