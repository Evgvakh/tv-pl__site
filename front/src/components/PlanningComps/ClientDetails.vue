<template>
    <div class="client-details__main" draggable="false">
        <div class="cross"><v-icon icon="mdi-close-circle-outline" @click="handleCloseClientDetails"></v-icon></div>
        <div class="dialog-content">
            <div class="dialog-content__header elevation-7">
                <h2>Информация о клиенте</h2>
            </div>
            <div class="dialog-content__body elevation-7">
                <div class="dialog-content__body-item">
                    <ClientDetailsItem :client="getClientByID" :type="'age'" />
                </div>
                <div class="dialog-content__body-item">
                    <ClientDetailsItem :client="getClientByID" :type="'email'" />
                </div>
                <div class="dialog-content__body-item">
                    <ClientDetailsItem :client="getClientByID" :type="'phone'" />
                </div>
                <div class="dialog-content__body-item">
                    <ClientComments :client="getClientByID" />
                </div>
                <div class="dialog-content__body-item">
                    <ClientVisitComments :client="getClientByID" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex/dist/vuex.cjs.js';
import ClientDetailsItem from '../../components/PlanningComps/UtilComponents/ClientDetailsItem.vue'
import ClientComments from './UtilComponents/ClientComments.vue';
import ClientVisitComments from './UtilComponents/ClientVisitComments.vue';
export default {
    emits: ['closeClientDetails'],
    components: {
        ClientDetailsItem,
        ClientComments,
        ClientVisitComments
    },
    props: {
        clientID: String
    },
    data() {
        return {

        }
    },
    methods: {
        handleCloseClientDetails() {
            this.$emit('closeClientDetails')
        },
    },
    computed: {
        ...mapGetters({
            getClientByID: 'client/getClientByID'
        })
    },
}
</script>

<style scoped>
::-webkit-scrollbar {
    width: 5px;
    border-radius: 25px;
}

::-webkit-scrollbar-track {
    background: rgba(219, 217, 217, 0.342);
    border-radius: 25px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(111deg, rgba(87, 118, 122, 0.95) 20%, rgba(18, 115, 119, 0.94) 77%);
    border-radius: 25px;
}

.client-details__main {
    position: fixed;
    inset: 25vh 30vw;
    z-index: 20;
    width: 22vw;
    height: fit-content;
    background-color: rgba(0, 0, 0, 0.288);
    border-radius: 15px 15px 10px 10px;
    border: 4px solid rgb(47, 56, 60);

    @media (max-width: 1700px) {
        width: 23vw;
    }

    @media (max-width: 1600px) {
        width: 24vw;
    }

    @media (max-width: 1480px) {
        width: 25vw;
    }

    @media (max-width: 1370px) {
        width: 27vw;
    }

    @media (max-width: 1275px) {
        width: 29vw;
    }
}

.cross {
    position: absolute;
    top: 3px;
    right: 5px;
    font-size: 20px;
    color: rgba(249, 247, 232, 1)
}

.dialog-content {
    border-radius: 35px;
}

.dialog-content__header {
    background: rgb(87, 118, 122);
    background: linear-gradient(111deg, rgba(87, 118, 122, 0.95) 20%, rgba(18, 115, 119, 0.94) 77%);
    border-bottom: 4px solid rgb(47, 56, 60);
    padding: 0.5em 0.6em;
    color: rgba(249, 247, 232, 1);
    border-radius: 10px 10px 0 0;
}

h2 {
    font-size: 18px;
}

.dialog-content__body {
    background-color: rgb(224, 235, 231);
    padding: 0.5em 0.8em;
    border-radius: 3px 3px 10px 10px;
    max-height: 65vh;
    overflow-y: auto;
}

.dialog-content__body-item {
    display: flex;
    gap: 10px;
    margin-bottom: 0.3em;
    font-size: 15px;
}
</style>