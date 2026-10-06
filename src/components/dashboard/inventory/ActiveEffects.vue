<script setup>
defineProps({
    activeEffects: {
        type: Object,
        default: () => ({})
    }
})

defineEmits([
    "cancel"
])

function getTypeLabel(type) {
    const labels = {
        task: "Tarefa",
        habit: "Hábito",
        daily: "Diária"
    }

    return labels[type] || "Missão"
}
</script>

<template>
    <section
        v-if="
            activeEffects.protection ||
            activeEffects.streakProtection
        "
        class="active-effects"
    >
        <span class="effects-label">
            EFEITOS ATIVOS
        </span>

        <article
            v-if="activeEffects.protection"
            class="active-effect"
        >
            <div>
                <strong>
                    🛡 Proteção ativa
                </strong>

                <span>
                    {{
                        getTypeLabel(
                            activeEffects.protection.targetType
                        )
                    }}
                    —
                    {{
                        activeEffects.protection.targetTitle
                    }}
                </span>
            </div>

            <button
                type="button"
                @click="$emit('cancel', 'protection')"
            >
                CANCELAR
            </button>
        </article>

        <article
            v-if="activeEffects.streakProtection"
            class="active-effect"
        >
            <div>
                <strong>
                    🔥 Streak protegida
                </strong>

                <span>
                    {{
                        activeEffects
                            .streakProtection
                            .targetTitle
                    }}
                </span>
            </div>

            <button
                type="button"
                @click="
                    $emit(
                        'cancel',
                        'streakProtection'
                    )
                "
            >
                CANCELAR
            </button>
        </article>
    </section>
</template>

<style scoped>
.active-effects {
    margin-bottom: 17px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.effects-label {
    color: #ad6df1;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
}

.active-effect {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: #101927;
    border: 1px solid #65438a;
    border-radius: 8px;
}

.active-effect > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.active-effect strong {
    color: #d6b4f4;
    font-size: 9px;
}

.active-effect span {
    overflow: hidden;
    color: #7f8ca0;
    font-size: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.active-effect button {
    padding: 5px 7px;
    color: #a995bf;
    background: transparent;
    border: 1px solid #4d3a61;
    border-radius: 5px;
    font-family: inherit;
    font-size: 7px;
    cursor: pointer;
}
</style>