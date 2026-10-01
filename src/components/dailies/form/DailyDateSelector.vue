<script setup>
defineProps({
    modelValue: {
        type: String,
        required: true
    }
})

const emit = defineEmits([
    "update:modelValue"
])

const difficulties = [
    {
        id: "trivial",
        name: "Trivial",
        stars: "✦"
    },
    {
        id: "easy",
        name: "Fácil",
        stars: "✦✦"
    },
    {
        id: "medium",
        name: "Médio",
        stars: "✦✦✦"
    },
    {
        id: "hard",
        name: "Difícil",
        stars: "✦✦✦✦"
    },
    {
        id: "legendary",
        name: "Lendário",
        stars: "✦✦✦✦✦"
    }
]

function selectDifficulty(difficultyId) {
    emit(
        "update:modelValue",
        difficultyId
    )
}
</script>

<template>
    <section class="difficulty-selector">
        <span class="section-label">
            DIFICULDADE
        </span>

        <div class="difficulty-grid">
            <button
                v-for="item in difficulties"
                :key="item.id"
                type="button"
                class="difficulty-card"
                :class="{
                    active: modelValue === item.id
                }"
                @click="selectDifficulty(item.id)"
            >
                <span class="stars">
                    {{ item.stars }}
                </span>

                <strong>
                    {{ item.name }}
                </strong>
            </button>
        </div>
    </section>
</template>

<style scoped>
.difficulty-selector {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-label {
    color: #b15cf0;

    font-size: 10px;
    letter-spacing: 2px;
}

.difficulty-grid {
    display: grid;

    grid-template-columns:
        repeat(5, 1fr);

    gap: 10px;
}

.difficulty-card {
    min-height: 86px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 12px;

    color: #aeb9ca;

    background: #101927;

    border: 1px solid #354158;
    border-radius: 9px;

    font-family: inherit;

    cursor: pointer;

    transition: 0.2s;
}

.difficulty-card:hover {
    border-color: #765099;
}

.difficulty-card.active {
    color: white;

    background: #472c68;

    border-color: #ad5ae8;
}

.stars {
    color: #b56df1;

    font-size: 17px;
}

.difficulty-card strong {
    font-size: 14px;

    font-weight: 400;
}

@media (max-width: 750px) {
    .difficulty-grid {
        grid-template-columns:
            repeat(2, 1fr);
    }
}
</style>