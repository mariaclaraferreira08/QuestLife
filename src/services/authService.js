import storageService from "./storageService"

const ACCOUNTS_KEY = "questlife_accounts"
const ACTIVE_USER_KEY = "questlife_active_user"

function normalizeEmail(email) {
    return String(email || "")
        .trim()
        .toLowerCase()
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    )
}

function validatePassword(password) {
    return {
        minLength:
            password.length >= 8,

        uppercase:
            /[A-Z]/.test(password),

        lowercase:
            /[a-z]/.test(password),

        number:
            /\d/.test(password),

        special:
            /[^A-Za-z0-9]/.test(
                password
            )
    }
}

function isStrongPassword(password) {
    const validation =
        validatePassword(password)

    return Object.values(
        validation
    ).every(Boolean)
}

async function hashPassword(password) {
    const data =
        new TextEncoder().encode(
            password
        )

    const hash =
        await crypto.subtle.digest(
            "SHA-256",
            data
        )

    return Array
        .from(
            new Uint8Array(hash)
        )
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("")
}

function getAccounts() {
    const accounts =
        storageService.get(
            ACCOUNTS_KEY
        )

    if (
        !accounts ||
        typeof accounts !==
            "object" ||
        Array.isArray(accounts)
    ) {
        return {}
    }

    return accounts
}

function saveAccounts(accounts) {
    storageService.save(
        ACCOUNTS_KEY,
        accounts
    )
}

function createStorageIdentity(email) {
    return encodeURIComponent(
        normalizeEmail(email)
    )
}

const authService = {
    /*
     * =========================
     * CONTA ATUAL
     * =========================
     */

    getCurrentEmail() {
        return (
            storageService.get(
                ACTIVE_USER_KEY
            ) || ""
        )
    },

    getCurrentUser() {
        const email =
            this.getCurrentEmail()

        if (!email) {
            return null
        }

        const accounts =
            getAccounts()

        return (
            accounts[email] ||
            null
        )
    },

    isAuthenticated() {
        return Boolean(
            this.getCurrentUser()
        )
    },

    /*
     * =========================
     * ARMAZENAMENTO
     * =========================
     */

    getUserStorageKey(baseKey) {
        const email =
            this.getCurrentEmail()

        if (!email) {
            return baseKey
        }

        return `questlife_${baseKey}_${createStorageIdentity(email)}`
    },

    /*
     * =========================
     * SENHA
     * =========================
     */

    validatePassword(password) {
        return validatePassword(
            password
        )
    },

    isStrongPassword(password) {
        return isStrongPassword(
            password
        )
    },

    /*
     * =========================
     * CADASTRO
     * =========================
     */

    async register({
        name,
        email,
        password,
        confirmPassword
    }) {
        const normalizedName =
            String(name || "").trim()

        const normalizedEmail =
            normalizeEmail(email)

        if (
            normalizedName.length <
            2
        ) {
            return {
                success: false,
                reason:
                    "invalid-name",
                message:
                    "Informe um nome de aventureiro válido."
            }
        }

        if (
            !isValidEmail(
                normalizedEmail
            )
        ) {
            return {
                success: false,
                reason:
                    "invalid-email",
                message:
                    "Informe um e-mail válido."
            }
        }

        if (
            !isStrongPassword(
                password
            )
        ) {
            return {
                success: false,
                reason:
                    "weak-password",
                message:
                    "A senha deve ter pelo menos 8 caracteres, com letra maiúscula, letra minúscula, número e símbolo."
            }
        }

        if (
            password !==
            confirmPassword
        ) {
            return {
                success: false,
                reason:
                    "password-mismatch",
                message:
                    "As senhas não coincidem."
            }
        }

        const accounts =
            getAccounts()

        if (
            accounts[
                normalizedEmail
            ]
        ) {
            return {
                success: false,
                reason:
                    "email-already-exists",
                message:
                    "Já existe uma conta cadastrada com este e-mail."
            }
        }

        const passwordHash =
            await hashPassword(
                password
            )

        accounts[
            normalizedEmail
        ] = {
            name:
                normalizedName,
            email:
                normalizedEmail,
            passwordHash,
            createdAt:
                new Date()
                    .toISOString()
        }

        saveAccounts(accounts)

        storageService.save(
            ACTIVE_USER_KEY,
            normalizedEmail
        )

        return {
            success: true,
            user:
                accounts[
                    normalizedEmail
                ]
        }
    },

    /*
     * =========================
     * LOGIN
     * =========================
     */

    async login(
        email,
        password
    ) {
        const normalizedEmail =
            normalizeEmail(email)

        if (
            !isValidEmail(
                normalizedEmail
            )
        ) {
            return {
                success: false,
                reason:
                    "invalid-email",
                message:
                    "Informe um e-mail válido."
            }
        }

        const accounts =
            getAccounts()

        const account =
            accounts[
                normalizedEmail
            ]

        if (!account) {
            return {
                success: false,
                reason:
                    "account-not-found",
                message:
                    "Nenhuma conta encontrada com este e-mail."
            }
        }

        const passwordHash =
            await hashPassword(
                password
            )

        if (
            passwordHash !==
            account.passwordHash
        ) {
            return {
                success: false,
                reason:
                    "incorrect-password",
                message:
                    "Senha incorreta."
            }
        }

        storageService.save(
            ACTIVE_USER_KEY,
            normalizedEmail
        )

        return {
            success: true,
            user: account
        }
    },

    /*
     * =========================
     * LOGOUT
     * =========================
     */

    logout() {
        storageService.save(
            ACTIVE_USER_KEY,
            ""
        )
    }
}

export default authService