<template>
    <div :class="['empty-cell__content-wrapper', isDateBlocked ? 'blocked' : '']">
        <div class="hover-block" v-if="!isBooked && !isDateBlocked">
            <v-icon icon="mdi-plus-circle-outline" class="block-icon" @click="handleOpenDialog(time, date)"></v-icon>
            <!-- <v-icon icon="mdi-block-helper" class="block-icon" @click="handleOpenDialog(time, date)"></v-icon> -->
        </div>
        <Appointment v-if="isBooked" :apptID="apptID" @openApptDetails="openApptDetails" />
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex/dist/vuex.cjs.js';
import Appointment from './Appointment.vue';
export default {
    emits: ['openDialog', 'openApptDetails'],
    components: {
        Appointment
    },
    props: {
        time: String,
        date: String
    },
    methods: {
        handleOpenDialog(time, date) {
            this.$emit('openDialog', time, date)
        },
        openApptDetails(id) {            
            this.$emit('openApptDetails', id)
        }
    },
    computed: {
        ...mapState({
            appointments: state => state.planning.appointments,
            blockedDates: state => state.planning.blockedDates
        }),
        isBooked() {
            return this.appointments.some(appt => appt.time === this.time && appt.date === this.date)
        },
        apptID() {
            const appt = this.appointments.find(appt => appt.time === this.time && appt.date === this.date)
            return appt._id
        },
        isDateBlocked() {
            return this.blockedDates.some(date => date == this.date)
        }
    }
}
</script>

<style scoped>

.empty-cell__content-wrapper {
    width: 100%; height: 100%;
    background-color: rgba(238, 238, 213, 0.603);
}

.empty-cell__content-wrapper.blocked {
    background-color: rgba(159, 255, 183, 0.271);
}

.hover-block {
    width: 100%; height: 100%; 
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center; justify-content: center; gap: 15%;
}

.hover-block:hover {
    opacity: 1;
}

.block-icon {
    font-size: 22px;
    font-weight: 700;
}

</style>