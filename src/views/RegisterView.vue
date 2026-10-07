<script setup>
import { computed, ref } from "vue"
import { RouterLink, useRouter } from "vue-router"

import authService from "../services/authService"
import playerService from "../services/playerService"

const router = useRouter()

const name = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const message = ref("")
const loading = ref(false)

const passwordRules = computed(() => {
    return authService.validatePassword(
        password.value
    )
})

const passwordsMatch = computed(() => {
    if (!confirmPassword.value) {
        return false
    }

    return (
        password.value ===
        confirmPassword.value
    )
})

async function register() {
    message.value = ""

    if (loading.value) return

    loading.value = true

    try {
        const result =
            await authService.register({
                name: name.value,
                email: email.value,
                password: password.value,
                confirmPassword:
                    confirmPassword.value
            })

        if (!result.success) {
            message.value =
                result.message ||
                "Não foi possível criar a conta."

            return
        }

        playerService.loadCurrentPlayer()
        router.push("/")
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <main class="auth-page">
        <section class="auth-card">
            <div class="brand">
                <div class="brand-symbol">
                    Q
                </div>

                <div>
                    <h1>
                        QuestLife
                    </h1>

                    <span>
                        SUA AVENTURA COMEÇA AQUI
                    </span>
                </div>
            </div>

            <header class="auth-header">
                <span class="eyebrow">
                    NOVO AVENTUREIRO
                </span>

                <h2>
                    Comece sua aventura
                </h2>

                <p>
                    Crie sua conta e transforme
                    tarefas em missões.
                </p>
            </header>

            <form
                class="auth-form"
                @submit.prevent="register"
            >
                <label>
                    <span>
                        NOME DO AVENTUREIRO
                    </span>

                    <input
                        v-model="name"
                        type="text"
                        autocomplete="name"
                        placeholder="Como deseja ser chamado?"
                        minlength="2"
                        required
                    />
                </label>

                <label>
                    <span>
                        E-MAIL
                    </span>

                    <input
                        v-model="email"
                        type="email"
                        autocomplete="email"
                        placeholder="seuemail@exemplo.com"
                        required
                    />
                </label>

                <label>
                    <span>
                        SENHA
                    </span>

                    <input
                        v-model="password"
                        type="password"
                        autocomplete="new-password"
                        placeholder="Crie uma senha forte"
                        required
                    />
                </label>

                <div
                    v-if="password"
                    class="password-rules"
                >
                    <span
                        :class="{
                            valid:
                                passwordRules.minLength
                        }"
                    >
                        {{
                            passwordRules.minLength
                                ? "✓"
                                : "○"
                        }}
                        Pelo menos 8 caracteres
                    </span>

                    <span
                        :class="{
                            valid:
                                passwordRules.uppercase
                        }"
                    >
                        {{
                            passwordRules.uppercase
                                ? "✓"
                                : "○"
                        }}
                        Uma letra maiúscula
                    </span>

                    <span
                        :class="{
                            valid:
                                passwordRules.lowercase
                        }"
                    >
                        {{
                            passwordRules.lowercase
                                ? "✓"
                                : "○"
                        }}
                        Uma letra minúscula
                    </span>

                    <span
                        :class="{
                            valid:
                                passwordRules.number
                        }"
                    >
                        {{
                            passwordRules.number
                                ? "✓"
                                : "○"
                        }}
                        Um número
                    </span>

                    <span
                        :class="{
                            valid:
                                passwordRules.special
                        }"
                    >
                        {{
                            passwordRules.special
                                ? "✓"
                                : "○"
                        }}
                        Um símbolo
                    </span>
                </div>

                <label>
                    <span>
                        CONFIRMAR SENHA
                    </span>

                    <input
                        v-model="confirmPassword"
                        type="password"
                        autocomplete="new-password"
                        placeholder="Digite a senha novamente"
                        required
                    />
                </label>

                <span
                    v-if="
                        confirmPassword &&
                        passwordsMatch
                    "
                    class="password-match"
                >
                    ✓ As senhas coincidem
                </span>

                <p
                    v-if="message"
                    class="message"
                >
                    {{ message }}
                </p>

                <button
                    type="submit"
                    class="primary-button"
                    :disabled="loading"
                >
                    {{
                        loading
                            ? "CRIANDO..."
                            : "CRIAR AVENTUREIRO"
                    }}
                </button>
            </form>

            <p class="switch-auth">
                Já possui uma conta?

                <RouterLink to="/login">
                    Entrar
                </RouterLink>
            </p>
        </section>

        <footer>
            © 2026 QuestLife · Desenvolvido por
            Maria Clara Ferreira Alves
        </footer>
    </main>
</template>

<style scoped>
.auth-page {
    min-height: 100vh;
    padding: 45px 20px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #eef1f7;
    background:
        radial-gradient(
            circle at top,
            rgba(125, 62, 190, 0.15),
            transparent 38%
        ),
        #09111d;
}

.auth-card {
    width: min(100%, 460px);
    padding: 30px;
    background: #131d2d;
    border: 1px solid #354158;
    border-radius: 18px;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
}

.brand-symbol {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    color: white;
    background: linear-gradient(135deg, #7d3fd3, #b25aea);
    border-radius: 12px;
    font-size: 20px;
    font-weight: 900;
}

.brand h1 {
    margin: 0;
    font-size: 20px;
}

.brand span {
    color: #8c9aaf;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 1.6px;
}

.auth-header {
    margin-bottom: 24px;
}

.eyebrow {
    color: #bd79ff;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.8px;
}

.auth-header h2 {
    margin: 7px 0;
    font-size: 27px;
}

.auth-header p {
    margin: 0;
    color: #8e9bae;
    font-size: 13px;
    line-height: 1.55;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 17px;
}

.auth-form label {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.auth-form label > span {
    color: #8997ab;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.2px;
}

.auth-form input {
    width: 100%;
    box-sizing: border-box;
    padding: 13px 14px;
    color: #f0f3f8;
    background: #0d1624;
    border: 1px solid #354158;
    border-radius: 9px;
    outline: none;
    font: inherit;
    font-size: 13px;
}

.auth-form input:focus {
    border-color: #8c4bd0;
    box-shadow: 0 0 0 3px rgba(140, 75, 208, 0.1);
}

.password-rules {
    margin-top: -7px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px 12px;
    color: #69778d;
    font-size: 10px;
}

.password-rules span.valid {
    color: #58d5aa;
}

.password-match {
    margin-top: -7px;
    color: #58d5aa;
    font-size: 10px;
}

.message {
    margin: 0;
    padding: 10px 12px;
    color: #ff91a3;
    background: rgba(255, 97, 122, 0.07);
    border: 1px solid #6c3948;
    border-radius: 8px;
    font-size: 11px;
}

.primary-button {
    min-height: 45px;
    color: white;
    background: linear-gradient(135deg, #7431be, #a34cdd);
    border: 0;
    border-radius: 9px;
    font-family: inherit;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.8px;
    cursor: pointer;
}

.primary-button:hover:not(:disabled) {
    filter: brightness(1.08);
}

.primary-button:disabled {
    opacity: 0.55;
    cursor: wait;
}

.switch-auth {
    margin: 23px 0 0;
    color: #7f8ca0;
    text-align: center;
    font-size: 11px;
}

.switch-auth a {
    color: #c78cff;
    font-weight: 800;
    text-decoration: none;
}

footer {
    margin-top: 25px;
    color: #556176;
    text-align: center;
    font-size: 9px;
}

@media (max-width: 520px) {
    .auth-card {
        padding: 23px;
    }

    .password-rules {
        grid-template-columns: 1fr;
    }
}
</style>