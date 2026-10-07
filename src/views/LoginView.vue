<script setup>
import { ref } from "vue"

import {
    RouterLink,
    useRouter
} from "vue-router"

import authService from "../services/authService"
import playerService from "../services/playerService"

const router = useRouter()

const email = ref("")
const password = ref("")

const message = ref("")
const loading = ref(false)

async function login() {
    message.value = ""

    if (loading.value) {
        return
    }

    loading.value = true

    try {
        const result =
            await authService.login(
                email.value,
                password.value
            )

        if (!result.success) {
            message.value =
                result.message ||
                "Não foi possível entrar."

            return
        }

        playerService
            .loadCurrentPlayer()

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
                        SUA JORNADA CONTINUA
                    </span>
                </div>
            </div>

            <header class="auth-header">
                <span class="eyebrow">
                    PORTÃO DA GUILDA
                </span>

                <h2>
                    Bem-vindo de volta
                </h2>

                <p>
                    Entre usando o e-mail
                    cadastrado na sua conta.
                </p>
            </header>

            <form
                class="auth-form"
                @submit.prevent="login"
            >
                <label>
                    <span>
                        E-MAIL
                    </span>

                    <input
                        v-model="email"
                        type="email"
                        autocomplete="email"
                        inputmode="email"
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
                        autocomplete="current-password"
                        placeholder="Digite sua senha"
                        required
                    />
                </label>

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
                            ? "ENTRANDO..."
                            : "ENTRAR NA GUILDA"
                    }}
                </button>
            </form>

            <p class="switch-auth">
                Ainda não possui uma conta?

                <RouterLink to="/register">
                    Criar aventureiro
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
    width: min(100%, 440px);
    padding: 30px;
    background: #131d2d;
    border: 1px solid #354158;
    border-radius: 18px;
    box-shadow:
        0 24px 70px
        rgba(0, 0, 0, 0.28);
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
    background:
        linear-gradient(
            135deg,
            #7d3fd3,
            #b25aea
        );
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
    box-shadow:
        0 0 0 3px
        rgba(140, 75, 208, 0.1);
}

.message {
    margin: 0;
    padding: 10px 12px;
    color: #ff91a3;
    background:
        rgba(255, 97, 122, 0.07);
    border: 1px solid #6c3948;
    border-radius: 8px;
    font-size: 11px;
}

.primary-button {
    min-height: 45px;
    color: white;
    background:
        linear-gradient(
            135deg,
            #7431be,
            #a34cdd
        );
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
</style>