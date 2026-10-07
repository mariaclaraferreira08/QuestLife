<script setup>
import {
    computed,
    ref,
    onBeforeUnmount
} from "vue"

import InventoryItem from "./inventory/InventoryItem.vue"
import ActiveEffects from "./inventory/ActiveEffects.vue"
import SpecialItemModal from "./inventory/SpecialItemModal.vue"

import { shopItems } from "../../data/shopItems"

import shopService from "../../services/shopService"
import taskService from "../../services/taskService"
import habitService from "../../services/habitService"
import dailyService from "../../services/dailyService"

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
const showSelector = ref(false)
const selectedItem = ref(null)

let messageTimer = null

const inventoryItems = computed(() => {
    const inventory =
        props.player?.inventory ||
        {}

    return Object.entries(
        inventory
    )
        .filter(
            ([, quantity]) =>
                quantity > 0
        )
        .map(
            ([itemId, quantity]) => {
                const item =
                    shopItems[itemId]

                if (!item) {
                    return null
                }

                return {
                    ...item,
                    quantity
                }
            }
        )
        .filter(Boolean)
})

const activeEffects = computed(() => {
    return (
        props.player
            ?.activeEffects ||
        {}
    )
})

const targetsByType = computed(() => {
    return {
        task:
            taskService
                .getTasks()
                .filter(
                    task =>
                        !task.completed &&
                        !task.failed
                )
                .map(task => ({
                    id: task.id,
                    title: task.title
                })),

        habit:
            habitService
                .getHabits()
                .map(habit => ({
                    id: habit.id,
                    title:
                        habit.title ||
                        habit.name ||
                        "Hábito"
                })),

        daily:
            dailyService
                .getDailies()
                .map(daily => ({
                    id: daily.id,
                    title:
                        daily.title ||
                        "Diária"
                }))
    }
})

/*
 * =========================
 * FEEDBACK
 * =========================
 */

function showMessage(text) {
    if (messageTimer) {
        clearTimeout(messageTimer)
    }

    message.value = text

    messageTimer =
        setTimeout(() => {
            message.value = ""
            messageTimer = null
        }, 2500)
}

function clearMessage() {
    if (messageTimer) {
        clearTimeout(messageTimer)
        messageTimer = null
    }

    message.value = ""
}

/*
 * =========================
 * USAR ITEM
 * =========================
 */

function handleUse(item) {
    clearMessage()

    if (
        item.type ===
        "consumable"
    ) {
        useConsumable(
            item.id
        )

        return
    }

    selectedItem.value =
        item

    showSelector.value =
        true
}

function useConsumable(itemId) {
    const result =
        shopService.useItem(
            itemId
        )

    if (!result.success) {
        if (
            result.reason ===
            "health-already-full"
        ) {
            showMessage(
                "Sua vida já está cheia."
            )
        } else {
            showMessage(
                "Não foi possível usar o item."
            )
        }

        return
    }

    showMessage(
        `${result.item.name} usado! +${result.healed} HP`
    )

    emit(
        "inventory-updated"
    )
}

/*
 * =========================
 * ITENS ESPECIAIS
 * =========================
 */

function activateSpecialItem(
    selection
) {
    clearMessage()

    const result =
        shopService
            .activateSpecialItem(
                selection.itemId,
                selection.targetType,
                selection.targetId,
                selection.targetTitle
            )

    if (!result.success) {
        if (
            result.reason ===
            "effect-already-active"
        ) {
            showMessage(
                "Você já possui uma proteção desse tipo ativa."
            )
        } else {
            showMessage(
                "Não foi possível ativar o item."
            )
        }

        return
    }

    if (
        selection.itemId ===
        "protectionAmulet"
    ) {
        showMessage(
            `Amuleto protegendo: ${selection.targetTitle}.`
        )
    } else {
        showMessage(
            `Sequência protegida: ${selection.targetTitle}.`
        )
    }

    closeSelector()

    emit(
        "inventory-updated"
    )
}

/*
 * =========================
 * CANCELAR EFEITO
 * =========================
 */

function cancelEffect(effectKey) {
    clearMessage()

    const result =
        shopService
            .cancelSpecialEffect(
                effectKey
            )

    if (!result.success) {
        showMessage(
            "Não foi possível cancelar a proteção."
        )

        return
    }

    showMessage(
        "Proteção cancelada. O item voltou para sua mochila."
    )

    emit(
        "inventory-updated"
    )
}

/*
 * =========================
 * MODAL
 * =========================
 */

function closeSelector() {
    showSelector.value =
        false

    selectedItem.value =
        null
}

/*
 * =========================
 * LIMPEZA
 * =========================
 */

onBeforeUnmount(() => {
    if (messageTimer) {
        clearTimeout(messageTimer)
    }
})
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

        <ActiveEffects
            :active-effects="activeEffects"
            @cancel="cancelEffect"
        />

        <div
            v-if="inventoryItems.length"
            class="inventory-list"
        >
            <InventoryItem
                v-for="item in inventoryItems"
                :key="item.id"
                :item="item"
                @use="handleUse"
            />
        </div>

        <div
            v-else
            class="empty-inventory"
        >
            <span>
                🎒
            </span>

            <p>
                Sua mochila está vazia.
            </p>

            <small>
                Visite a loja para conseguir itens.
            </small>
        </div>

        <SpecialItemModal
            :show="showSelector"
            :item="selectedItem"
            :targets-by-type="targetsByType"
            @close="closeSelector"
            @confirm="activateSpecialItem"
        />
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
}

.message {
    margin-bottom: 14px;
    padding: 9px 11px;
    color: #c9b1df;
    background:
        rgba(
            139,
            73,
            209,
            0.1
        );
    border: 1px solid #684090;
    border-radius: 7px;
    font-size: 10px;

    animation:
        message-enter
        0.2s ease;
}

.inventory-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
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

@keyframes message-enter {
    from {
        opacity: 0;
        transform:
            translateY(-3px);
    }

    to {
        opacity: 1;
        transform:
            translateY(0);
    }
}
</style>