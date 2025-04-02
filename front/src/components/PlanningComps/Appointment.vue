<template>
    <div :class="[
        !isBlockedTime ? 'appt-main' : 'appt-main__blocked',
        isInternetBooking ? 'user' : '',
        appt.type === 'first' ? 'first' : '',
        'elevation-1'
    ]" :id="`blocked-time_${apptID}`" v-if="appt.type !== 'addToFirst'">
        <div :class="['appt-main__item']">
            <p v-if="!isBlockedTime" :class="[!clientByID ? 'not-in-base' : '']">{{ clientByID ? clientByID.name :
                appt.clientName }}</p>
            <p v-else>ЗАКРЫТО</p>
        </div>
        <div :id="apptID" class="appt-hover-block">
            <v-icon class="icon" :icon="isBlockedTime ? 'mdi-lock-open-variant-outline' : 'mdi-cog-outline'"
                color="white" @click="handleOpenApptDetails($event)"></v-icon>
        </div>
        <Dialog :position="{ top: '130%', left: '-10%' }" :header="'Разблокировать время'" :state="isDialogOpened"
            :parentId="`blocked-time_${apptID}`" @closeDialog="this.isDialogOpened = false"
            @handleAction="handleRemoveBlockedTime" />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Dialog from './UtilComponents/Dialog.vue';
import axios from '../../../axios';
export default {
    components: {
        Dialog
    },
    emits: ['openApptDetails'],
    props: {
        apptID: String
    },
    data() {
        return {
            isDialogOpened: false
        }
    },
    methods: {
        ...mapActions({
            getAppts: 'planning/getAppts'
        }),
        handleOpenApptDetails() {
            if (this.isBlockedTime) {
                this.isDialogOpened = true
            } else {
                this.$emit('openApptDetails', this.apptID)
            }
        },
        async handleRemoveBlockedTime() {
            const data = await axios.delete(`/appointment/remove/${this.apptID}`)
            if (data.data) {
                console.log(data)
                await this.getAppts()
            }
        }
    },
    computed: {
        ...mapState({
            appointments: state => state.planning.appointments,
            clients: state => state.client.clients
        }),
        appt() {
            return this.appointments.find(appt => appt._id === this.apptID)
        },
        clientByID() {
            return this.clients.find(client => client._id === this.appt.clientID)
        },
        isBlockedTime() {
            return this.appt.clientName === 'blocked' ? true : false
        },
        isInternetBooking() {
            return this.appt?.createdBy === 'user' ? true : false
        }
    }
}
</script>

<style scoped>
.appt-main {
    width: 100%;
    height: 100%;    
    background-color: #08AEEA;
    background-image: linear-gradient(57deg, #63d6ff 0%, #0af5ce 100%);
    border-radius: 7px;
    position: relative;
}

.appt-main.user {
    background-color: #08F5A5;
    background-image: linear-gradient(57deg, #63FFB5 0%, #0AF59A 100%);
}

.appt-main.first {    
    height: 212%;
}

.appt-main__blocked {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.418);
    border-radius: 3px;
    position: relative;
}

.appt-main__item {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.3em;

    p {
        width: 100%;
        text-align: center;
        font-size: 11px;
        overflow-wrap: break-word;
        text-transform: capitalize;
        font-weight: 700;
        color: #121212;
        line-height: 0.9em;
    }

    p.not-in-base {
        color: #25007c;
    }
}

.appt-hover-block {
    width: 100%;
    height: 100%;
    inset: 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    position: absolute;
    z-index: 10;
    background-color: black;
    opacity: 0;
    transform: scale(0);
    transition: all linear 0.1s;
}

.appt-main:hover>.appt-hover-block {
    background: rgb(47, 63, 68);
    background: linear-gradient(74deg, rgba(47, 63, 68, 0.7382528011204482) 16%, rgba(30, 32, 33, 0.4130427170868348) 89%);
    opacity: 1;
    transform: none;
}

.appt-main__blocked:hover>.appt-hover-block {
    background: rgb(47, 63, 68);
    background: linear-gradient(74deg, rgba(47, 63, 68, 0.7382528011204482) 16%, rgba(30, 32, 33, 0.4130427170868348) 89%);
    opacity: 1;
    transform: none;
}

.appt-main__blocked.blocked:hover>.appt-hover-block {
    opacity: 0;
    transform: none;
}

.icon {
    cursor: pointer;
}
</style>