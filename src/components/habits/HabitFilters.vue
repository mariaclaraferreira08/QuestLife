<script setup>
import { computed, ref } from "vue"

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    total: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits([
    "update:modelValue"
])

const open = ref(false)

const statusOptions = [
    { id: "all", label: "Todos" },
    { id: "today", label: "Hoje" },
    { id: "pending", label: "Pendentes" },
    { id: "completed", label: "Concluídos" },
    { id: "failed", label: "Falhos" }
]

const frequencyOptions = [
    { id: "all", label: "Todas" },
    { id: "daily", label: "Diário" },
    { id: "weekly", label: "Semanal" },
    { id: "monthly", label: "Mensal" }
]

const difficultyOptions = [
    { id: "all", label: "Todas" },
    { id: "trivial", label: "Trivial" },
    { id: "easy", label: "Fácil" },
    { id: "medium", label: "Médio" },
    { id: "hard", label: "Difícil" },
    { id: "legendary", label: "Lendário" }
]

const orderOptions = [
    { id: "newest", label: "Mais recentes" },
    { id: "oldest", label: "Mais antigos" }
]

const activeFilters = computed(() => {
    let amount = 0

    if (props.modelValue.status !== "all") {
        amount++
    }

    if (props.modelValue.frequency !== "all") {
        amount++
    }

    if (props.modelValue.difficulty !== "all") {
        amount++
    }

    if (props.modelValue.order !== "newest") {
        amount++
    }

    return amount
})

function updateFilter(key, value) {
    emit(
        "update:modelValue",
        {
            ...props.modelValue,
            [key]: value
        }
    )
}

function clearFilters() {
    emit(
        "update:modelValue",
        {
            status: "all",
            frequency: "all",
            difficulty: "all",
            order: "newest"
        }
    )
}
</script>

<template>
    <div class="filter-wrapper">
        <div class="filter-top">
            <button
                type="button"
                class="filter-trigger"
                :class="{ active: activeFilters > 0 }"
                @click="open = !open"
            >
                <span class="filter-symbol">◇</span>
                <span>FILTRAR</span>

                <span
                    v-if="activeFilters"
                    class="filter-count"
                >
                    {{ activeFilters }}
                </span>

                <span class="filter-arrow">
                    {{ open ? "▲" : "▼" }}
                </span>
            </button>

            <span class="result-count">
                {{ total }}
                {{ total === 1 ? "HÁBITO" : "HÁBITOS" }}
            </span>
        </div>

        <div
            v-if="open"
            class="filter-panel"
        >
            <section class="filter-section">
                <span class="section-label">
                    STATUS
                </span>

                <div class="options">
                    <button
                        v-for="option in statusOptions"
                        :key="option.id"
                        type="button"
                        class="option"
                        :class="{
                            selected:
                                modelValue.status === option.id
                        }"
                        @click="updateFilter('status', option.id)"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </section>

            <section class="filter-section">
                <span class="section-label">
                    FREQUÊNCIA
                </span>

                <div class="options">
                    <button
                        v-for="option in frequencyOptions"
                        :key="option.id"
                        type="button"
                        class="option"
                        :class="{
                            selected:
                                modelValue.frequency === option.id
                        }"
                        @click="updateFilter('frequency', option.id)"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </section>

            <section class="filter-section">
                <span class="section-label">
                    DIFICULDADE
                </span>

                <div class="options">
                    <button
                        v-for="option in difficultyOptions"
                        :key="option.id"
                        type="button"
                        class="option difficulty"
                        :class="[
                            option.id,
                            {
                                selected:
                                    modelValue.difficulty === option.id
                            }
                        ]"
                        @click="updateFilter('difficulty', option.id)"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </section>

            <section class="filter-section">
                <span class="section-label">
                    ORDENAR
                </span>

                <div class="options">
                    <button
                        v-for="option in orderOptions"
                        :key="option.id"
                        type="button"
                        class="option"
                        :class="{
                            selected:
                                modelValue.order === option.id
                        }"
                        @click="updateFilter('order', option.id)"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </section>

            <div class="filter-footer">
                <button
                    type="button"
                    class="clear-button"
                    @click="clearFilters"
                >
                    LIMPAR FILTROS
                </button>

                <button
                    type="button"
                    class="apply-button"
                    @click="open = false"
                >
                    PRONTO
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.filter-wrapper {
    position: relative;
    margin-bottom: 20px;
}

.filter-top {
    display: flex;
    align-items: center;
    gap: 12px;
}

.filter-trigger {
    min-height: 38px;
    padding: 8px 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #aeb9ca;
    background: #111a28;
    border: 1px solid #344258;
    border-radius: 9px;
    font-family: inherit;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1px;
    cursor: pointer;
    transition: 0.2s;
}

.filter-trigger:hover,
.filter-trigger.active {
    color: #e2b5ff;
    background: #211735;
    border-color: #8b49ca;
}

.filter-symbol {
    color: #ba72f2;
    font-size: 14px;
}

.filter-count {
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    display: grid;
    place-items: center;
    color: white;
    background: #8b32d8;
    border-radius: 999px;
    font-size: 8px;
}

.filter-arrow {
    color: #728197;
    font-size: 7px;
}

.result-count {
    color: #68778d;
    font-size: 9px;
    letter-spacing: 1px;
}

.filter-panel {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: min(540px, calc(100vw - 40px));
    z-index: 50;
    padding: 18px;
    background: #151f30;
    border: 1px solid #4a3b61;
    border-radius: 12px;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.38);
}

.filter-section + .filter-section {
    margin-top: 18px;
    padding-top: 17px;
    border-top: 1px solid #29364a;
}

.section-label {
    display: block;
    margin-bottom: 10px;
    color: #a96be7;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1.6px;
}

.options {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
}

.option {
    padding: 7px 11px;
    color: #8997aa;
    background: #101927;
    border: 1px solid #303d50;
    border-radius: 20px;
    font-family: inherit;
    font-size: 9px;
    cursor: pointer;
    transition: 0.2s;
}

.option:hover {
    color: white;
    border-color: #68418e;
}

.option.selected {
    color: #e1b4ff;
    background: #2a1943;
    border-color: #914fd0;
}

.option.difficulty.trivial.selected {
    color: #bec7d4;
}

.option.difficulty.easy.selected {
    color: #68dab0;
}

.option.difficulty.medium.selected {
    color: #ebce64;
}

.option.difficulty.hard.selected {
    color: #ff8077;
}

.option.difficulty.legendary.selected {
    color: #d38cff;
}

.filter-footer {
    margin-top: 20px;
    padding-top: 15px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    border-top: 1px solid #29364a;
}

.clear-button,
.apply-button {
    padding: 9px 13px;
    border-radius: 7px;
    font-family: inherit;
    font-size: 8px;
    font-weight: 700;
    cursor: pointer;
}

.clear-button {
    color: #8997aa;
    background: transparent;
    border: 1px solid #344258;
}

.apply-button {
    color: white;
    background: linear-gradient(90deg, #7227dc, #a928ef);
    border: 1px solid #a75ae8;
}

@media (max-width: 600px) {
    .filter-top {
        align-items: flex-start;
        flex-direction: column;
    }

    .filter-panel {
        width: calc(100vw - 56px);
    }
}
</style>