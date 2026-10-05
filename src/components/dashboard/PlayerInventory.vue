<script setup>
import { computed, ref } from "vue"
import { shopItems } from "../../data/shopItems"
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

const inventoryItems = computed(() => {
    const inventory =
        props.player?.inventory || {}

    return Object.entries(inventory)
        .filter(([, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => {
            const item = shopItems[itemId]

            if (!item) return null

            return {
                ...item,
                quantity
            }
        })
        .filter(Boolean)
})

function canUse(item) {
    return (
        item.type === "consumable" &&
        (
            item.effect?.health ||
            item.effect?.fullHealth
        )
    )
}

function useItem(itemId) {
    const result =
        shopService.useItem(itemId)

    if (!result.success) {
        if (
            result.reason ===
            "health-already-full"
        ) {
            message.value =
                "Sua vida já está cheia."
        } else if (
            result.reason ===
            "item-not-owned"
        ) {
            message.value =
                "Você não possui esse item."
        } else {
            message.value =
                "Não foi possível usar o item."
        }

        return
    }

    message.value =
        `${result.item.name} usado! +${result.healed} HP`

    emit("inventory-updated")
}
</script>

<template>
    <section class="inventory-card">
        <header class="inventory-header">
            <div>
                <span class="label">
                    MOCHILA
                </span>

                <h2>
                    Inventário
                </h2>
            </div>

            <span class="item-count">
                {{ inventoryItems.length }}
            </span>
        </header>

        <div
            v-if="message"
            class="message"
        >
            {{ message }}
        </div>

        <div
            v-if="inventoryItems.length"
            class="inventory-list"
        >
            <article
                v-for="item in inventoryItems"
                :key="item.id"
                class="inventory-item"
            >
                <div class="item-image-box">
                    <img
                        :src="item.image"
                        :alt="item.name"
                    />

                    <span class="quantity">
                        ×{{ item.quantity }}
                    </span>
                </div>

                <div class="item-info">
                    <strong>
                        {{ item.name }}
                    </strong>

                    <span>
                        {{
                            item.type ===
                            "consumable"
                                ? "Consumível"
                                : "Especial"
                        }}
                    </span>
                </div>

                <button
                    v-if="canUse(item)"
                    type="button"
                    class="use-button"
                    @click="useItem(item.id)"
                >
                    USAR
                </button>

                <span
                    v-else
                    class="passive"
                >
                    PASSIVO
                </span>
            </article>
        </div>

        <div
            v-else
            class="empty-inventory"
        >
            <span>🎒</span>

            <p>
                Sua mochila está vazia.
            </p>

            <small>
                Visite a loja para conseguir itens.
            </small>
        </div>
    </section>
</template>

<style scoped>
.inventory-card {
    padding: 20px;
    background: #151f30;
    border: 1px solid #344158;
    border-radius: 14px;
}

.inventory-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 18px;
}

.label {
    color: #ad6df1;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
}

.inventory-header h2 {
    margin: 4px 0 0;
    color: #f1f4f9;
    font-size: 18px;
}

.item-count {
    min-width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    color: #bd79ff;
    background: #101927;
    border: 1px solid #4b3c60;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 700;
}

.message {
    margin-bottom: 14px;
    padding: 9px 11px;
    color: #c9b1df;
    background: rgba(139, 73, 209, 0.1);
    border: 1px solid #684090;
    border-radius: 7px;
    font-size: 10px;
}

.inventory-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.inventory-item {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr) auto;
    align-items: center;
    gap: 11px;
    padding: 10px;
    background: #101927;
    border: 1px solid #2d394d;
    border-radius: 9px;
}

.item-image-box {
    width: 52px;
    height: 52px;
    position: relative;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: #0c1421;
    border-radius: 8px;
}

.item-image-box img {
    width: 100%;
    height: 100%;
    padding: 3px;
    object-fit: contain;
}

.quantity {
    position: absolute;
    right: 3px;
    bottom: 3px;
    min-width: 18px;
    padding: 2px 4px;
    color: white;
    background: rgba(8, 13, 22, 0.85);
    border-radius: 5px;
    font-size: 8px;
    text-align: center;
}

.item-info {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.item-info strong {
    overflow: hidden;
    color: #e8edf5;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-info span {
    color: #748398;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.7px;
}

.use-button {
    padding: 7px 9px;
    color: white;
    background: linear-gradient(
        90deg,
        #7227dc,
        #a928ef
    );
    border: 1px solid #9f54e6;
    border-radius: 6px;
    font-family: inherit;
    font-size: 8px;
    font-weight: 700;
    cursor: pointer;
}

.use-button:hover {
    transform: translateY(-1px);
}

.passive {
    color: #6f7e94;
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.8px;
}

.empty-inventory {
    padding: 25px 15px;
    color: #738196;
    text-align: center;
    background: #101927;
    border: 1px dashed #344158;
    border-radius: 9px;
}

.empty-inventory > span {
    display: block;
    margin-bottom: 8px;
    font-size: 27px;
}

.empty-inventory p {
    margin: 0 0 4px;
    color: #a8b2c1;
    font-size: 11px;
}

.empty-inventory small {
    font-size: 9px;
}
</style>