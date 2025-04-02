<template>
    <div :class="['telegram-main', themeClass]">
        <BackButton @click="handleBackButton" />
        <!-- <div>
            <h2>{{ telegramID }}</h2>
        </div>
        <div>
            <h2>{{ colorScheme }}</h2>
        </div> -->
        <div class="telegram-main__wrapper">
            <TGHeader @setRoute="handleSetRoute" />
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { Alert, ShareWidget, BackButton } from 'vue-tg'
import { mapActions } from 'vuex';
import TGHeader from './TGHeader.vue';

export default {
    components: {
        Alert,
        ShareWidget,
        BackButton,
        TGHeader
    },
    data() {
        return {
            colorScheme: 'light',
            date: new Date(),
            telegramID: null
        }
    },
    methods: {
        handleBackButton() {
            this.$router.go(-1);
        },
        ...mapActions({
            getClients: 'client/getClients',
            getUsers: 'client/getUsers'
        }),
        handleSetRoute(path) {
            this.$router.push(`/telegram/${path}`)
        }
    },
    computed: {
        themeClass() {
            return this.colorScheme === 'dark' ? 'dark-theme' : 'light-theme';
        }
    },
    async mounted() {
        await this.getClients()
        await this.getUsers()
        if (window.Telegram && window.Telegram.WebApp) {
            this.colorScheme = window.Telegram.WebApp.colorScheme || 'light';
            window.Telegram.WebApp.onEvent('themeChanged', () => {
                this.colorScheme = window.Telegram.WebApp.colorScheme || 'light';
            });
        } else {
            console.error('Telegram WebApp API недоступен.');
        }
        console.log('Main TG Mounted')
        // if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        //     const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;
        //     this.telegramID = telegramId
        //     console.log('Telegram ID:', telegramId);
        // } else {
        //     console.log('Данные Telegram недоступны');
        // }
    }
};
</script>

<style scoped>
.telegram-main {
    min-height: 100vh;
    min-width: 100vw;
    background-color: rgba(189, 224, 213, 0.178);    
}
.telegram-main.dark-theme {    
    background-color: rgba(13, 21, 37, 0.438);
    color: white;
}

</style>