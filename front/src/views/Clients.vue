<template>
    <div>
        <div class="clients-header elevation-1">
            <nav class="clients-header__nav">
                <div class="clients-header__nav-item">
                    <router-link to="/all-clients" class="balsamiq-sans-regular">Клиенты</router-link>
                </div>
                <div class="clients-header__nav-item">
                    <router-link to="/add-client" class="balsamiq-sans-regular">Добавить Клиента</router-link>
                </div>
            </nav>
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.clients-header {
    padding: 0.6em 2em;    
    background-color: rgba(218, 253, 250, 0.493);
    /* border-bottom: 2px solid rgba(46, 27, 116, 0.199); */
}

.clients-header__nav {    
    display: flex;
    gap: 1vw;
}

.clients-header__nav-item {
    text-transform: uppercase;
    cursor: pointer;
    font-size: 12px;    
    text-shadow:
        2px 2px 4px rgba(0, 0, 0, 0.15),
        3px 3px 6px rgba(0, 0, 0, 0.1);
}
</style>