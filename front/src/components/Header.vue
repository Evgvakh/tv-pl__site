<template>
    <div class="header-main elevation-1">
        <div class="header-wrapper">
            <nav class="header-nav">
                <ul>
                    <li class="balsamiq-sans-regular" @click="$router.push('/planning')">РАСПИСАНИЕ</li>
                    <li class="balsamiq-sans-regular" @click="$router.push('/clients')">КЛИЕНТЫ</li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.header-main {
    padding: 1em 2em;
    background-color: rgba(218, 253, 227, 0.841);
    border-bottom: 2px solid rgba(46, 27, 116, 0.199); 
}

ul {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 2vw
}

li {
    text-transform: uppercase;
    cursor: pointer;
    font-size: 17px;
    text-shadow:    
    2px 2px 4px rgba(0, 0, 0, 0.15),
    3px 3px 6px rgba(0, 0, 0, 0.1);
}

li:hover {
    background-color: #061920;
    background-image: linear-gradient(57deg, #17c1ff 0%, #00ffd5 100%);
    -webkit-background-clip: text;
    background-clip: text;    
    -webkit-text-fill-color: #0619209c;
}
</style>