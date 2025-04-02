<template>
    <div class="dialog-content__body-item__content">
        <h3 class="elevation-1">Комментарии к визитам:</h3>
        <p v-if="getApptCommentsByClientID.length" v-for="comment in getApptCommentsByClientID"
            class="dialog-content__body-item__content__comment">
            <v-icon class="icon" icon="mdi-fountain-pen"></v-icon>
            <span>{{ formatDateDDMMYY(getApptDateByID(comment.apptID)) }}</span> <br>
            {{ comment.commentary }}
        </p>
        <p v-else class="dialog-content__body-item__content__comment">Комментарии к визитам отсутствуют</p>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { formatDateDDMMYY } from '../../../funcs/formatDateDDMMYY';
export default {
    props: {
        client: Object
    },
    methods: {
        formatDateDDMMYY,
        getApptDateByID(apptID) {
            const appt = this.appointments.find(appt => appt._id === apptID)
            return appt.date
        },
    },
    computed: {
        ...mapGetters({
            getApptCommentsByClientID: 'planning/getApptCommentsByClientID'
        }),
        ...mapState({
            appointments: state => state.planning.appointments
        }),
    }
}
</script>

<style scoped>
.dialog-content__body-item__content {
    width: 100%;    
    h3 {
        font-size: 14px;
        border-radius: 3px;
        font-weight: 500;
        display: flex;
        align-items: center;
        padding: 0.4em;
        background-color: rgba(90, 97, 97, 0.24);
    }
}

.dialog-content__body-item__content__comment {
    padding: 0.5em 0.5em;
    width: 100%;
    background-color: rgba(175, 175, 175, 0.288);
    border-radius: 3px;
    span {
        font-size: 12px;
        color: rgb(71, 63, 63);
        font-style: italic;
    }
    .icon {
        font-size: 18px;
        margin-right: 0.2em;
    }
}

.dialog-content__body-item__content__icon-block {
    gap: 3px;
    cursor: pointer;
    margin-block: 0.3em;
    p {
        font-size: 12px;
    }
    .icon {
        font-size: 18px;
    }
}
</style>