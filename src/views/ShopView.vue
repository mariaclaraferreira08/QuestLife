<script setup>
import { ref, computed, onMounted } from "vue"
import ShopKeeper from "../components/shop/ShopKeeper.vue"
import shopService from "../services/shopService"
import playerService from "../services/playerService"

const items = ref([])
const player = ref(null)
const message = ref("")

function refreshShop() {
    items.value = shopService.getItems()
    player.value = playerService.getPlayer()
}

function getOwnedQuantity(itemId) {
    return shopService.getOwnedQuantity(itemId)
}

function canBuy(itemId) {
    return shopService.canBuyItem(itemId).success
}

function buyItem(itemId) {
    const result = shopService.buyItem(itemId)

    if (!result.success) {
        if (result.reason === "not-enough-coins") {
            message.value = "Você não possui moedas suficientes."
        } else if (result.reason === "item-not-found") {
            message.value = "Esse item não foi encontrado."
        } else {
            message.value = "Não foi possível realizar a compra."
        }

        return
    }

    message.value = `${result.item.name} foi adicionado à sua mochila.`
    refreshShop()
}

const coins = computed(() => player.value?.coins || 0)

const playerName = computed(() =>
    player.value?.name || "Aventureiro"
)

const rarityNames = {
    common: "COMUM",
    uncommon: "INCOMUM",
    rare: "RARO",
    epic: "ÉPICO",
    legendary: "LENDÁRIO"
}

function getRarityName(rarity) {
    return rarityNames[rarity] || "COMUM"
}

onMounted(() => {
    refreshShop()
})
</script>

<template>
    <section class="shop-page">
        <header class="page-header">
            <div>
                <span class="eyebrow">
                    QUEST MARKET
                </span>

                <h1>Loja</h1>

                <p>
                    Prepare-se para os próximos desafios da sua jornada.
                </p>
            </div>

            <div class="wallet">
                <span>SEU SALDO</span>
                <strong>🪙 {{ coins }}</strong>
            </div>
        </header>

        <ShopKeeper
            :player-name="playerName"
        />

        <div
            v-if="message"
            class="shop-message"
        >
            <span>{{ message }}</span>

            <button
                type="button"
                @click="message = ''"
            >
                ×
            </button>
        </div>

        <section class="catalog">
            <div class="catalog-header">
                <div>
                    <span class="section-label">
                        CATÁLOGO
                    </span>

                    <h2>
                        Itens disponíveis
                    </h2>
                </div>

                <span class="item-count">
                    {{ items.length }}
                    {{ items.length === 1 ? "ITEM" : "ITENS" }}
                </span>
            </div>

            <div class="item-grid">
                <article
                    v-for="item in items"
                    :key="item.id"
                    class="item-card"
                    :class="item.rarity"
                >
                    <div class="item-art">
                        <img
                            :src="item.image"
                            :alt="item.name"
                            class="item-image"
                        />

                        <span
                            class="rarity"
                            :class="item.rarity"
                        >
                            {{ getRarityName(item.rarity) }}
                        </span>
                    </div>

                    <div class="item-info">
                        <h3>
                            {{ item.name }}
                        </h3>

                        <p>
                            {{ item.description }}
                        </p>
                    </div>

                    <div class="owned">
                        <span>
                            NA MOCHILA
                        </span>

                        <strong>
                            {{ getOwnedQuantity(item.id) }}
                        </strong>
                    </div>

                    <footer class="item-footer">
                        <div class="price">
                            <span>PREÇO</span>

                            <strong>
                                🪙 {{ item.price }}
                            </strong>
                        </div>

                        <button
                            type="button"
                            class="buy-button"
                            :disabled="!canBuy(item.id)"
                            @click="buyItem(item.id)"
                        >
                            {{
                                canBuy(item.id)
                                    ? "COMPRAR"
                                    : "SEM MOEDAS"
                            }}
                        </button>
                    </footer>
                </article>
            </div>
        </section>
    </section>
</template>

<style scoped>
.shop-page {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    color: #eef1f7;
}

/* CABEÇALHO */

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 25px;
    padding-bottom: 22px;
    border-bottom: 1px solid #29364a;
}

.eyebrow,
.section-label {
    color: #ad6df1;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
}

.page-header h1 {
    margin: 5px 0;
    font-size: 38px;
}

.page-header p {
    margin: 0;
    color: #8190a6;
    font-size: 12px;
}

.wallet {
    min-width: 130px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 13px 17px;
    background: #151f30;
    border: 1px solid #354158;
    border-radius: 9px;
}

.wallet span {
    color: #8190a6;
    font-size: 9px;
    letter-spacing: 1px;
}

.wallet strong {
    color: #f3c55b;
    font-size: 17px;
}

/* MENSAGEM */

.shop-message {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 18px;
    padding: 13px 16px;
    color: #d1b8ef;
    background: rgba(129, 65, 201, 0.1);
    border: 1px solid #684090;
    border-radius: 8px;
    font-size: 12px;
}

.shop-message button {
    color: #a995bf;
    background: transparent;
    border: 0;
    font-size: 20px;
    cursor: pointer;
}

/* CATÁLOGO */

.catalog {
    margin-top: 30px;
}

.catalog-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 16px;
}

.catalog-header h2 {
    margin: 5px 0 0;
    font-size: 22px;
}

.item-count {
    color: #ad6df1;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
}

/* CARDS */

.item-grid {
    display: grid;
    grid-template-columns: repeat(
        auto-fit,
        minmax(280px, 1fr)
    );
    gap: 16px;
}

.item-card {
    min-height: 390px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 18px;
    overflow: hidden;
    background: #151f30;
    border: 1px solid #354158;
    border-radius: 14px;
    transition:
        transform 0.2s,
        border-color 0.2s,
        box-shadow 0.2s;
}

.item-card:hover {
    transform: translateY(-3px);
    border-color: #68498b;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.16);
}

.item-card.uncommon {
    border-top-color: #398a72;
}

.item-card.rare {
    border-top-color: #8952c1;
}

/* ARTE DO ITEM */

.item-art {
    position: relative;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background:
        radial-gradient(
            circle at center,
            rgba(139, 73, 209, 0.11),
            transparent 65%
        ),
        #101927;
    border: 1px solid #2d394d;
    border-radius: 11px;
}

.item-image {
    width: 100%;
    height: 100%;
    padding: 8px;
    object-fit: contain;
    transition: transform 0.25s;
}

.item-card:hover .item-image {
    transform: scale(1.04);
}

.rarity {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 9px;
    color: #8e9bae;
    background: rgba(11, 19, 32, 0.88);
    border: 1px solid #46536a;
    border-radius: 20px;
    backdrop-filter: blur(5px);
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1px;
}

.rarity.uncommon {
    color: #53d2aa;
    border-color: #347e69;
}

.rarity.rare {
    color: #bd79ff;
    border-color: #75439f;
}

/* INFORMAÇÕES */

.item-info {
    flex: 1;
}

.item-info h3 {
    margin: 0 0 8px;
    color: #f1f4f9;
    font-size: 16px;
}

.item-info p {
    margin: 0;
    color: #8592a6;
    font-size: 11px;
    line-height: 1.6;
}

/* INVENTÁRIO */

.owned {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #101927;
    border-radius: 7px;
}

.owned span {
    color: #6f7e94;
    font-size: 8px;
    letter-spacing: 1px;
}

.owned strong {
    color: #dce3ee;
    font-size: 13px;
}

/* COMPRA */

.item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding-top: 14px;
    border-top: 1px solid #29364a;
}

.price {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.price span {
    color: #6f7e94;
    font-size: 8px;
    letter-spacing: 1px;
}

.price strong {
    color: #f3c55b;
    font-size: 15px;
}

.buy-button {
    min-width: 105px;
    padding: 10px 13px;
    color: white;
    background: linear-gradient(
        90deg,
        #7227dc,
        #a928ef
    );
    border: 1px solid #aa5cf2;
    border-radius: 7px;
    font-family: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
}

.buy-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 0 14px rgba(153, 46, 234, 0.2);
}

.buy-button:disabled {
    color: #69768a;
    background: #101927;
    border-color: #354158;
    cursor: not-allowed;
}

/* RESPONSIVO */

@media (max-width: 700px) {
    .page-header {
        align-items: stretch;
        flex-direction: column;
    }

    .wallet {
        width: 100%;
    }

    .item-grid {
        grid-template-columns: 1fr;
    }

    .item-art {
        height: 210px;
    }
}
</style>