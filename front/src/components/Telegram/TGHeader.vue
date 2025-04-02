<template>
    <div class="tg-header__main">
        <div class="tg-header__wrapper">
            <nav class="tg-header__nav">
                <ul>
                    <li @click="handleSetRoute('client')">Личный кабинет</li>
                    <li @click="handleSetRoute('book')">Записаться</li>
                    <li @click="handleSetRoute('')">Главная</li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        handleSetRoute(path) {
            if (path === 'client') {
                const newPath = `${path}/${localStorage.getItem('tvPlanUserID')}`
                console.log(newPath)
                this.$emit('setRoute', newPath)
            } else { this.$emit('setRoute', path) }
            
        }
    }
}
</script>

<style scoped>
.tg-header__main {
    padding: 1em;
    background-color: rgba(62, 162, 255, 0.342);

    nav {
        ul {
            display: flex;
            list-style: none;
            gap: 20px;

            li {                
                font-size: 11px;
            }
        }
    }
}
</style>