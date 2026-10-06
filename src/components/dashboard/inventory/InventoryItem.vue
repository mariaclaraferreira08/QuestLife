<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    }
})

defineEmits([
    "use"
])
</script>

<template>
    <article class="inventory-item">
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
                {{ item.type === "consumable" ? "Consumível" : "Especial" }}
            </span>
        </div>

        <button
            type="button"
            class="use-button"
            :class="{ special: item.type !== 'consumable' }"
            @click="$emit('use', item)"
        >
            USAR
        </button>
    </article>
</template>

<style scoped>
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
    padding: 2px 4px;
    color: white;
    background: rgba(8, 13, 22, 0.85);
    border-radius: 5px;
    font-size: 8px;
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

.use-button.special {
    background: linear-gradient(
        90deg,
        #533176,
        #8136b7
    );
}

.use-button:hover {
    transform: translateY(-1px);
}
</style>