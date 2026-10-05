<script setup>
import {
    computed,
    ref
} from "vue"

import shopService from "../../services/shopService"

const props = defineProps({
    player: {
        type: Object,
        required: true
    }
})

const emit = defineEmits([
    "inventory-updated"
])

const message = ref("")
const messageType = ref("")

/*
 * =========================
 * INVENTÁRIO
 * =========================
 */

const inventoryItems = computed(() => {
    const inventory =
        props.player.inventory || {}

    return Object.entries(inventory)
        .filter(([, quantity]) => {
            return quantity > 0
        })
        .map(([itemId, quantity]) => {
            const item =
                shopService.getItemById(
                    itemId
                )

            if (!item) {
                return null
            }

            return {
                ...item,
                quantity
            }
        })
        .filter(Boolean)
})

const hasItems = computed(() => {
    return inventoryItems.value.length > 0
})

/*
 * =========================
 * NOMES
 * =========================
 */

function getRarityName(rarity) {
    const names = {
        common: "COMUM",
        uncommon: "INCOMUM",
        rare: "RARO",
        epic: "ÉPICO",
        legendary: "LENDÁRIO"
    }

    return (
        names[rarity] ||
        "COMUM"
    )
}

/*
 * =========================
 * ÍCONES
 * =========================
 *
 * Por enquanto usamos símbolos
 * simples para não voltar ao
 * problema dos emojis artificiais.
 */

function getItemSymbol(item) {
    switch (item.icon) {
        case "flask":
            return "◇"

        case "shield":
            return "⬡"

        case "flame":
            return "♢"

        default:
            return "◆"
    }
}

/*
 * =========================
 * USAR ITEM
 * =========================
 */

function useItem(itemId) {
    const result =
        shopService.useItem(
            itemId
        )

    if (!result.success) {
        showErrorMessage(
            result
        )

        return
    }

    const item =
        result.item

    message.value =
        `${item.name} utilizado com sucesso!`

    messageType.value =
        "success"

    emit(
        "inventory-updated"
    )
}

/*
 * =========================
 * MENSAGENS
 * =========================
 */

function showErrorMessage(result) {
    switch (result.reason) {
        case "health-already-full":
            message.value =
                "Sua vida já está cheia."

            break

        case "item-not-owned":
            message.value =
                "Você não possui este item."

            break

        case "item-not-found":
            message.value =
                "Este item não existe."

            break

        case "item-not-usable":
            message.value =
                "Este item não pode ser usado diretamente."

            break

        default:
            message.value =
                "Não foi possível usar este item."
    }

    messageType.value =
        "error"
}

function clearMessage() {
    message.value = ""
    messageType.value = ""
}
</script>

<template>
    <section class="inventory">
        <!-- CABEÇALHO -->

        <header class="inventory-header">
            <div>
                <span class="eyebrow">
                    INVENTÁRIO
                </span>

                <h2>
                    Sua mochila
                </h2>

                <p>
                    Itens adquiridos durante
                    sua jornada.
                </p>
            </div>

            <div class="item-counter">
                <span>
                    ITENS
                </span>

                <strong>
                    {{
                        inventoryItems.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                item.quantity,
                            0
                        )
                    }}
                </strong>
            </div>
        </header>

        <!-- MENSAGEM -->

        <div
            v-if="message"
            class="message"
            :class="messageType"
        >
            <span>
                {{ message }}
            </span>

            <button
                type="button"
                title="Fechar"
                @click="clearMessage"
            >
                ×
            </button>
        </div>

        <!-- ITENS -->

        <div
            v-if="hasItems"
            class="inventory-grid"
        >
            <article
                v-for="item in inventoryItems"
                :key="item.id"
                class="inventory-item"
                :class="
                    `rarity-${item.rarity}`
                "
            >
                <!-- ÍCONE -->

                <div class="item-icon">
                    <span>
                        {{
                            getItemSymbol(
                                item
                            )
                        }}
                    </span>

                    <strong
                        v-if="
                            item.quantity > 1
                        "
                        class="quantity"
                    >
                        ×{{ item.quantity }}
                    </strong>
                </div>

                <!-- CONTEÚDO -->

                <div class="item-content">
                    <span
                        class="rarity"
                        :class="
                            item.rarity
                        "
                    >
                        {{
                            getRarityName(
                                item.rarity
                            )
                        }}
                    </span>

                    <h3>
                        {{ item.name }}
                    </h3>

                    <p>
                        {{ item.description }}
                    </p>
                </div>

                <!-- AÇÃO -->

                <div class="item-actions">
                    <span class="owned">
                        {{ item.quantity }}
                        {{
                            item.quantity === 1
                                ? "unidade"
                                : "unidades"
                        }}
                    </span>

                    <button
                        v-if="
                            item.type ===
                            'consumable'
                        "
                        type="button"
                        class="use-button"
                        @click="
                            useItem(
                                item.id
                            )
                        "
                    >
                        USAR
                    </button>

                    <span
                        v-else
                        class="special-item"
                    >
                        ESPECIAL
                    </span>
                </div>
            </article>
        </div>

        <!-- VAZIO -->

        <div
            v-else
            class="empty-inventory"
        >
            <div class="empty-symbol">
                ◇
            </div>

            <div>
                <strong>
                    Sua mochila está vazia
                </strong>

                <p>
                    Visite a loja para adquirir
                    poções e outros itens.
                </p>
            </div>

            <RouterLink
                to="/shop"
                class="shop-link"
            >
                Ir para a loja
            </RouterLink>
        </div>
    </section>
</template>

<style scoped>
.inventory {
    padding: 26px;

    background: #151f30;

    border: 1px solid #344158;
    border-radius: 14px;
}

/*
 * =========================
 * CABEÇALHO
 * =========================
 */

.inventory-header {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 20px;

    margin-bottom: 22px;
}

.eyebrow {
    color: #bd7cff;

    font-size: 11px;
    font-weight: 700;

    letter-spacing: 2px;
}

.inventory-header h2 {
    margin: 6px 0;

    color: #f2f5fb;

    font-size: 23px;
}

.inventory-header p {
    margin: 0;

    color: #8492a8;

    font-size: 12px;
}

.item-counter {
    min-width: 75px;

    padding: 10px 14px;

    display: flex;
    flex-direction: column;

    align-items: center;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 9px;
}

.item-counter span {
    color: #7f8ca0;

    font-size: 8px;

    letter-spacing: 1px;
}

.item-counter strong {
    margin-top: 2px;

    color: #f2f5fb;

    font-size: 20px;
}

/*
 * =========================
 * MENSAGEM
 * =========================
 */

.message {
    margin-bottom: 18px;

    padding: 12px 14px;

    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 15px;

    border-radius: 8px;

    font-size: 12px;
}

.message.success {
    color: #76dfbd;

    background:
        rgba(
            73,
            210,
            167,
            0.08
        );

    border: 1px solid #347e69;
}

.message.error {
    color: #ff8395;

    background:
        rgba(
            255,
            97,
            122,
            0.07
        );

    border: 1px solid #743747;
}

.message button {
    padding: 0;

    color: inherit;

    background: transparent;

    border: 0;

    font-size: 19px;
}

/*
 * =========================
 * GRID
 * =========================
 */

.inventory-grid {
    display: grid;

    grid-template-columns:
        repeat(
            2,
            minmax(0, 1fr)
        );

    gap: 13px;
}

/*
 * =========================
 * ITEM
 * =========================
 */

.inventory-item {
    min-width: 0;

    padding: 16px;

    display: grid;

    grid-template-columns:
        auto 1fr auto;

    align-items: center;

    gap: 15px;

    background: #101927;

    border: 1px solid #303e55;
    border-radius: 10px;

    transition: 0.2s;
}

.inventory-item:hover {
    transform:
        translateY(-1px);

    border-color: #5b476f;
}

/*
 * =========================
 * RARIDADES
 * =========================
 */

.inventory-item.rarity-uncommon {
    border-left:
        2px solid #49c997;
}

.inventory-item.rarity-rare {
    border-left:
        2px solid #a866e8;
}

.inventory-item.rarity-epic {
    border-left:
        2px solid #d26bea;
}

.inventory-item.rarity-legendary {
    border-left:
        2px solid #e1b85b;
}

/*
 * =========================
 * ÍCONE
 * =========================
 */

.item-icon {
    position: relative;

    width: 52px;
    height: 52px;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #bd7cff;

    background: #19172a;

    border: 1px solid #51356c;
    border-radius: 11px;

    font-size: 22px;
}

.quantity {
    position: absolute;

    right: -7px;
    bottom: -7px;

    min-width: 24px;
    height: 24px;

    padding: 0 5px;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #f2f5fb;

    background: #263247;

    border: 2px solid #101927;
    border-radius: 999px;

    font-size: 9px;
}

/*
 * =========================
 * CONTEÚDO
 * =========================
 */

.item-content {
    min-width: 0;
}

.rarity {
    font-size: 8px;
    font-weight: 700;

    letter-spacing: 1.3px;
}

.rarity.common {
    color: #8996a9;
}

.rarity.uncommon {
    color: #55d4aa;
}

.rarity.rare {
    color: #b978f2;
}

.rarity.epic {
    color: #d77bed;
}

.rarity.legendary {
    color: #e7c267;
}

.item-content h3 {
    margin: 4px 0;

    color: #edf1f7;

    font-size: 14px;
}

.item-content p {
    margin: 0;

    color: #77869b;

    font-size: 10px;
    line-height: 1.5;
}

/*
 * =========================
 * AÇÕES
 * =========================
 */

.item-actions {
    min-width: 72px;

    display: flex;
    flex-direction: column;

    align-items: flex-end;

    gap: 8px;
}

.owned {
    color: #718096;

    font-size: 9px;
}

.use-button {
    padding: 7px 12px;

    color: #e8d9fa;

    background:
        rgba(
            133,
            51,
            214,
            0.14
        );

    border: 1px solid #75439e;
    border-radius: 6px;

    font-size: 9px;
    font-weight: 700;

    letter-spacing: 0.7px;
}

.use-button:hover {
    color: white;

    background:
        rgba(
            133,
            51,
            214,
            0.27
        );

    border-color: #a45ce1;
}

.special-item {
    padding: 6px 9px;

    color: #8f9caf;

    border: 1px solid #3b485e;
    border-radius: 6px;

    font-size: 8px;
    font-weight: 700;

    letter-spacing: 0.8px;
}

/*
 * =========================
 * MOCHILA VAZIA
 * =========================
 */

.empty-inventory {
    min-height: 100px;

    padding: 18px;

    display: flex;

    align-items: center;

    gap: 15px;

    background: #101927;

    border: 1px dashed #354158;
    border-radius: 10px;
}

.empty-symbol {
    width: 45px;
    height: 45px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #8c62b4;

    border: 1px solid #51396a;
    border-radius: 10px;

    font-size: 20px;
}

.empty-inventory strong {
    color: #e8edf5;

    font-size: 13px;
}

.empty-inventory p {
    margin: 4px 0 0;

    color: #8190a6;

    font-size: 10px;
}

.shop-link {
    margin-left: auto;

    flex-shrink: 0;

    padding: 9px 13px;

    color: #d9b8f5;

    text-decoration: none;

    border: 1px solid #68428a;
    border-radius: 7px;

    font-size: 10px;
    font-weight: 700;
}

.shop-link:hover {
    color: white;

    background:
        rgba(
            137,
            55,
            214,
            0.12
        );
}

/*
 * =========================
 * RESPONSIVO
 * =========================
 */

@media (max-width: 850px) {
    .inventory-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    .inventory {
        padding: 18px;
    }

    .inventory-item {
        grid-template-columns:
            auto 1fr;
    }

    .item-actions {
        grid-column:
            1 / -1;

        width: 100%;

        flex-direction: row;

        align-items: center;
        justify-content: flex-end;
    }

    .empty-inventory {
        align-items: flex-start;

        flex-direction: column;
    }

    .shop-link {
        margin-left: 0;
    }
}
</style>