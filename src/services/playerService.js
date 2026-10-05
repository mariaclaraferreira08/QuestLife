import { ref } from "vue"

import storageService from "./storageService"
import { defaultPlayer } from "../data/player"

const PLAYER_KEY = "player"

const storedPlayer =
    storageService.get(PLAYER_KEY)

/*
 * Cria o estado inicial do jogador.
 *
 * Se já existir um jogador salvo no
 * localStorage, preservamos os dados.
 *
 * Também garantimos compatibilidade
 * com jogadores criados antes da
 * implementação do inventário.
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
                : 100,

        inventory:
            storedPlayer.inventory &&
            typeof storedPlayer.inventory === "object" &&
            !Array.isArray(storedPlayer.inventory)
                ? storedPlayer.inventory
                : {}
    }
    : {
        ...defaultPlayer,

        health: 100,
        maxHealth: 100,

        inventory: {}
    }

/*
 * Salva a estrutura atualizada.
 *
 * Isso também adiciona inventory: {}
 * automaticamente para jogadores
 * antigos que ainda não possuíam
 * inventário.
 */
storageService.save(
    PLAYER_KEY,
    initialPlayer
)

/*
 * Estado reativo compartilhado.
 */
const player =
    ref(initialPlayer)

const playerService = {
    player,

    /*
     * Retorna o jogador atual.
     */
    getPlayer() {
        return player.value
    },

    /*
     * Atualiza somente os dados
     * informados.
     */
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

    /*
     * Recupera toda a vida.
     */
    resetHealth() {
        const maxHealth =
            player.value.maxHealth || 100

        return this.updatePlayer({
            health: maxHealth
        })
    },

    /*
     * Retorna o inventário atual.
     */
    getInventory() {
        return (
            player.value.inventory || {}
        )
    },

    /*
     * Retorna a quantidade que o
     * jogador possui de determinado
     * item.
     *
     * Exemplo:
     *
     * getItemQuantity("healthPotion")
     */
    getItemQuantity(itemId) {
        const inventory =
            this.getInventory()

        return (
            inventory[itemId] || 0
        )
    },

    /*
     * Adiciona determinada quantidade
     * de um item ao inventário.
     */
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

    /*
     * Remove determinada quantidade
     * de um item.
     *
     * Retorna false caso o jogador
     * não possua itens suficientes.
     */
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

        /*
         * Se chegou a zero, removemos
         * a propriedade do inventário.
         */
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
    }
}

export default playerService