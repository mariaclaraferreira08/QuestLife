<script setup>
import {
    computed,
    ref,
    watch
} from "vue"

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },

    item: {
        type: Object,
        default: null
    },

    targetsByType: {
        type: Object,
        default: () => ({
            task: [],
            habit: [],
            daily: []
        })
    }
})

const emit = defineEmits([
    "close",
    "confirm"
])

const selectedType =
    ref("task")

const selectedTargetId =
    ref("")

const availableTypes =
    computed(() => {
        if (
            props.item?.id ===
            "streakPotion"
        ) {
            return [
                {
                    value: "daily",
                    label: "Diária"
                }
            ]
        }

        return [
            {
                value: "task",
                label: "Tarefa"
            },
            {
                value: "habit",
                label: "Hábito"
            },
            {
                value: "daily",
                label: "Diária"
            }
        ]
    })

const availableTargets =
    computed(() => {
        return (
            props.targetsByType[
                selectedType.value
            ] || []
        )
    })

watch(
    () => props.item,
    item => {
        selectedTargetId.value = ""

        if (
            item?.id ===
            "streakPotion"
        ) {
            selectedType.value =
                "daily"
        } else {
            selectedType.value =
                "task"
        }
    }
)

function selectType(type) {
    selectedType.value =
        type

    selectedTargetId.value =
        ""
}

function confirm() {
    if (
        !props.item ||
        !selectedTargetId.value
    ) {
        return
    }

    const target =
        availableTargets.value.find(
            target =>
                target.id ===
                selectedTargetId.value
        )

    if (!target) {
        return
    }

    emit(
        "confirm",
        {
            itemId:
                props.item.id,

            targetType:
                selectedType.value,

            targetId:
                target.id,

            targetTitle:
                target.title
        }
    )
}
</script>

<template>
    <div
        v-if="show"
        class="modal-backdrop"
        @click.self="$emit('close')"
    >
        <section class="selector-modal">
            <header>
                <div>
                    <span>
                        USAR ITEM
                    </span>

                    <h3>
                        {{ item?.name }}
                    </h3>
                </div>

                <button
                    type="button"
                    class="close"
                    @click="$emit('close')"
                >
                    ×
                </button>
            </header>

            <p>
                Escolha onde deseja
                usar este item.
            </p>

            <div
                v-if="availableTypes.length > 1"
                class="type-selector"
            >
                <button
                    v-for="type in availableTypes"
                    :key="type.value"
                    type="button"
                    :class="{
                        active:
                            selectedType ===
                            type.value
                    }"
                    @click="
                        selectType(
                            type.value
                        )
                    "
                >
                    {{ type.label }}
                </button>
            </div>

            <div class="target-list">
                <label
                    v-for="target in availableTargets"
                    :key="target.id"
                    class="target-option"
                    :class="{
                        selected:
                            selectedTargetId ===
                            target.id
                    }"
                >
                    <input
                        v-model="selectedTargetId"
                        type="radio"
                        :value="target.id"
                    />

                    <span>
                        {{ target.title }}
                    </span>
                </label>

                <div
                    v-if="!availableTargets.length"
                    class="no-targets"
                >
                    Nenhuma missão disponível.
                </div>
            </div>

            <footer>
                <button
                    type="button"
                    class="cancel-button"
                    @click="$emit('close')"
                >
                    CANCELAR
                </button>

                <button
                    type="button"
                    class="confirm-button"
                    :disabled="!selectedTargetId"
                    @click="confirm"
                >
                    USAR ITEM
                </button>
            </footer>
        </section>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    place-items: center;
    padding: 20px;
    background: rgba(5, 10, 18, 0.78);
    backdrop-filter: blur(4px);
}

.selector-modal {
    width: 100%;
    max-width: 480px;
    padding: 22px;
    background: #151f30;
    border: 1px solid #4c3d62;
    border-radius: 14px;
    box-shadow:
        0 25px 70px
        rgba(0, 0, 0, 0.4);
}

.selector-modal header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
}

.selector-modal header span {
    color: #ad6df1;
    font-size: 8px;
    letter-spacing: 2px;
}

.selector-modal h3 {
    margin: 4px 0 0;
    color: #f3f5f9;
    font-size: 19px;
}

.selector-modal > p {
    margin: 12px 0 17px;
    color: #8290a5;
    font-size: 10px;
}

.close {
    color: #8190a6;
    background: transparent;
    border: 0;
    font-size: 20px;
    cursor: pointer;
}

.type-selector {
    margin-bottom: 14px;
    display: grid;
    grid-template-columns:
        repeat(3, 1fr);
    gap: 7px;
}

.type-selector button {
    padding: 9px;
    color: #8391a5;
    background: #101927;
    border: 1px solid #354158;
    border-radius: 6px;
    font-family: inherit;
    font-size: 9px;
    cursor: pointer;
}

.type-selector button.active {
    color: #d9b9f5;
    background:
        rgba(
            132,
            56,
            190,
            0.14
        );
    border-color: #8544b8;
}

.target-list {
    max-height: 230px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    overflow-y: auto;
}

.target-option {
    padding: 11px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #aeb7c6;
    background: #101927;
    border: 1px solid #2d394d;
    border-radius: 7px;
    font-size: 10px;
    cursor: pointer;
}

.target-option.selected {
    color: #e0c4f6;
    border-color: #8048ae;
}

.target-option input {
    accent-color: #a928ef;
}

.no-targets {
    padding: 18px;
    color: #718095;
    text-align: center;
    font-size: 10px;
}

.selector-modal footer {
    margin-top: 18px;
    display: flex;
    justify-content: flex-end;
    gap: 9px;
}

.cancel-button,
.confirm-button {
    padding: 9px 12px;
    border-radius: 6px;
    font-family: inherit;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
}

.cancel-button {
    color: #8996aa;
    background: #101927;
    border: 1px solid #354158;
}

.confirm-button {
    color: white;
    background:
        linear-gradient(
            90deg,
            #7227dc,
            #a928ef
        );
    border: 1px solid #a052e5;
}

.confirm-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
</style>