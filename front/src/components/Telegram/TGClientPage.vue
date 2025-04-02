<template>
    <div v-if="!isLoading" class="client-main">
        <div class="client-wrapper">
            <div class="client-header">
                <h2>Страница клиента</h2>
            </div>
            <div class="client-body">
                <div class="client-button">
                    <button v-elevation-hover :disabled="isBookButtonDisabled" :class="[isBookButtonDisabled ? 'button-disabled' : 'button-accept elevation-1']"
                        @click="$router.push('/telegram/book')">Записаться на
                        прием</button>
                </div>
                <div class="client-body__items">
                    <TGDetailsItem :header="'Эл. Почта'" :header_icon="'mdi-email-outline'" :dbField="'email'"
                        :value="getClientByUserID.email" :clientID="getClientByUserID._id" />
                    <TGDetailsItem :header="'ФИО Ребенка'" :header_icon="'mdi-account-circle-outline'" :dbField="'name'"
                        :value="getClientByUserID.name" :clientID="getClientByUserID._id"
                        @refreshAfterUpdate="grabDBChanges" />
                    <TGDetailsItem :header="'Возраст Ребенка'" :header_icon="'mdi-calendar-range'" :dbField="'age'"
                        :value="getClientByUserID.age" :clientID="getClientByUserID._id"
                        @refreshAfterUpdate="grabDBChanges" />
                    <TGDetailsItem :header="'Телефон'" :header_icon="'mdi-phone'" :dbField="'phone'"
                        :value="getClientByUserID.phone" :clientID="getClientByUserID._id"
                        @refreshAfterUpdate="grabDBChanges" />
                </div>
                <div class="client-body__handle-appts">
                    <TGChangePassword :client="getClientByUserID" :user="userByID"/>
                </div>
                <div class="client-body__handle-appts">
                    <TGHandleAppointments :client="getClientByUserID" @refreshAfterAction="grabDBChanges" />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import TGDetailsItem from './TGUtils/TGDetailsItem.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import {checkToken} from '../../funcs/checkToken.js'
import TGHandleAppointments from './TGHandleAppointments.vue';
import TGChangePassword from './TGUtils/TGChangePassword.vue';
export default {
    components: {
        TGDetailsItem,
        TGHandleAppointments,
        TGChangePassword
    },
    data() {
        return {
            isLoading: null
        }
    },
    methods: {
        ...mapActions({
            getOneUser: 'client/getOneUser',
            getClients: 'client/getClients'
        }),
        ...mapMutations({
            setUserID: 'client/setUserID'
        }),
        async grabDBChanges() {
            await this.getClients()
            this.setUserID(this.$route.params.id)
            await this.getOneUser(this.$route.params.id)
        }
    },
    computed: {
        ...mapState({
            userByID: state => state.client.userByID
        }),
        ...mapGetters({
            getClientByUserID: 'client/getClientByUserID'
        }),
        isBookButtonDisabled() {
            return this.getClientByUserID.name === 'tba' ? true : false
        }
    },
    async created() {
        this.isLoading = true
        await this.getClients()        
        if (await checkToken(this.$route.params.id)) {
            this.setUserID(this.$route.params.id)
            await this.getOneUser(this.$route.params.id)
            if (!this.userByID) {
                this.$router.push('/telegram/login')
            }
        } else {
            this.$router.push('/telegram/login')
        }
        this.isLoading = false 
    }
}
</script>

<style scoped>

.client-header {
    padding: 1em;
    background-color: rgba(223, 223, 223, 0.158);
}

.client-body__items {
    padding: 0.2em 1em;
}

.client-body__handle-appts {
    padding: 0 1em ;
}

.client-button {
    padding: 0.2em 1em;
    margin-bottom: 0.5em;
    button {
        display: block;
        padding: 1em 1em 0.9em 1em;
        font-size: 18px;
        width: 100%;
        text-transform: uppercase;
        margin: 0 auto;
        border-radius: 7px !important;
    }
}
</style>