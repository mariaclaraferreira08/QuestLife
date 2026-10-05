export const shopItems = {
    healthPotion: {
        id: "healthPotion",
        name: "Poção de Vida",
        description: "Uma poção restauradora para aventureiros cansados. Recupera 20 HP.",
        price: 15,
        type: "consumable",
        effect: {
            health: 20
        },
        image: "/assets/shop/health-potion.png",
        rarity: "common"
    },

    greaterHealthPotion: {
        id: "greaterHealthPotion",
        name: "Poção de Vida Grande",
        description: "Uma mistura mais potente que recupera 50 HP.",
        price: 30,
        type: "consumable",
        effect: {
            health: 50
        },
        image: "/assets/shop/greater-health-potion.png",
        rarity: "uncommon"
    },

    fullRestorePotion: {
        id: "fullRestorePotion",
        name: "Elixir Vital",
        description: "Um elixir raro que restaura completamente seus pontos de vida.",
        price: 55,
        type: "consumable",
        effect: {
            fullHealth: true
        },
        image: "/assets/shop/full-restore-potion.png",
        rarity: "rare"
    },

    protectionAmulet: {
        id: "protectionAmulet",
        name: "Amuleto de Proteção",
        description: "Protege o aventureiro de parte da próxima penalidade recebida.",
        price: 40,
        type: "special",
        effect: {
            protection: 0.5
        },
        image: "/assets/shop/protection-amulet.png",
        rarity: "uncommon"
    },

    streakPotion: {
        id: "streakPotion",
        name: "Elixir da Persistência",
        description: "Preserva uma sequência quando uma diária for perdida.",
        price: 45,
        type: "special",
        effect: {
            protectStreak: true
        },
        image: "/assets/shop/streak-potion.png",
        rarity: "rare"
    }
}