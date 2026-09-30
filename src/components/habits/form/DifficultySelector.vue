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
        <div class="section-label">
            DIFICULDADE
        </div>

        <div class="difficulty-grid">
            <button
                v-for="item in difficulties"
                :key="item.id"
                type="button"
                class="difficulty-option"
                :class="{
                    selected:
                        modelValue === item.id
                }"
                @click="
                    selectDifficulty(item.id)
                "
            >
                <strong>
                    {{ item.stars }}
                </strong>

                <span>
                    {{ item.name }}
                </span>
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
    color: #ad6df1;

    font-size: 11px;
    letter-spacing: 2px;
}

.difficulty-grid {
    display: grid;

    grid-template-columns:
        repeat(5, 1fr);

    gap: 10px;
}

.difficulty-option {
    min-height: 85px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 9px;

    color: #8794a8;
    background: #101927;

    border: 1px solid #354158;
    border-radius: 9px;

    font-family: inherit;

    cursor: pointer;

    transition: 0.2s;
}

.difficulty-option:hover {
    border-color: #75509c;
}

.difficulty-option strong {
    color: #b484f1;

    font-size: 15px;
}

.difficulty-option.selected {
    color: white;

    background: #3c2861;

    border-color: #a45ce7;

    box-shadow:
        0 0 14px
        rgba(164, 92, 231, 0.08);
}

@media (max-width: 800px) {
    .difficulty-grid {
        grid-template-columns:
            repeat(3, 1fr);
    }
}

@media (max-width: 550px) {
    .difficulty-grid {
        grid-template-columns:
            repeat(2, 1fr);
    }
}
</style>
