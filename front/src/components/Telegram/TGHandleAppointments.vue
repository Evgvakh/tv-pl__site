<template>
    <div class="handle-appts__wrapper" v-if="!isLoading">
        <div class="client-body__handle-appts__head elevation-1">
            <p>Управление записями</p>
            <v-icon class="icon" :icon="`mdi-chevron-${chevron ? 'up' : 'down'}`" @click="handleOpenBody"></v-icon>
        </div>
        <div class="handle-appts__items">
            <TGHandleApptItem v-for="appt in cleanAppts" :appointment="appt" @refreshAfterAction="handleRefresh" />
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TGHandleApptItem from './TGUtils/TGHandleApptItem.vue';
export default {
    components: {
        TGHandleApptItem
    },
    props: {
        client: Object
    },
    data() {
        return {
            chevron: false,
            isLoading: false
        }
    },
    methods: {
        ...mapActions({
            getApptsByClientID: 'planning/getApptsByClientID'
        }),
        async handleRefresh() {
            await this.getApptsByClientID(this.client._id)
        },
        handleOpenBody() {
            document.querySelector('.handle-appts__items').classList.toggle('opened')
            this.chevron = !this.chevron
        }
    },
    computed: {
        ...mapState({
            apptsByClientID: state => state.planning.apptsByClientID
        }),
        cleanAppts() {
            return this.apptsByClientID.filter(appt => {return appt.type !== 'addToFirst'})
        }

    },
    async created() {
        this.isLoading = true
        await this.getApptsByClientID(this.client._id)
        this.isLoading = false
    }
}
</script>

<style scoped>
.handle-appts__wrapper {
    margin-block: 0.5em;
}
.client-body__handle-appts__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em 0.5em 0.3em 0.5em;
    background-color: rgba(184, 184, 184, 0.432);
    
    p {
        font-weight: 700;
    }

    .icon {
        font-size: 26px;
    }
}

.handle-appts__items {
    background-color: rgba(199, 199, 199, 0.125);    
    height: 0px;
    opacity: 0;
    overflow-y: hidden;
    transform-origin: top;
    transform: scaleY(0);
    transition: all 0.3s ease;
}

.handle-appts__items.opened {
    height: auto;
    opacity: 1;
    transform: scale(1);
    padding: 0.7em 0.5em 1em 0.5em;
}
</style>