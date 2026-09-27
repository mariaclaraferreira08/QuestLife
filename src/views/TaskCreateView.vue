<template>
    <section class="create-page">
        <header>
            <RouterLink to="/tasks">
                ← Voltar
            </RouterLink>

            <div>
                <span>NEW QUEST</span>
                <h1>Criar missão</h1>
            </div>
        </header>

        <div class="coming-next">
            Formulário de criação da missão
        </div>
    </section>
</template>

<style scoped>
.create-page {
    max-width: 900px;
    margin: auto;
    color: white;
}

.create-page header {
    display: flex;
    gap: 25px;
    align-items: center;
}

.create-page a {
    color: #bd7cff;
    text-decoration: none;
}

.create-page span {
    color: #bd7cff;
    font-size: 12px;
    letter-spacing: 2px;
}

.coming-next {
    margin-top: 30px;
    padding: 40px;

    background: #151f30;

    border: 1px solid #35425a;
    border-radius: 12px;

    color: #9ba7ba;
}
</style>