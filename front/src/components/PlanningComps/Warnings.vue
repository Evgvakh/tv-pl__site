<template>
    <div class="warnings-main">
        <div class="warnings-wrapper">
            <div class="warnings__main-container">
                <div class="warnings-header elevation-2">
                    <div class="warnings-header__content">
                        <div class="warnings-header__content-item">
                            <h4>Предупреждения</h4>
                            <v-icon v-if="isApptsArrayEmpty" class="icon-alert" icon="mdi-alert-circle"></v-icon>
                        </div>
                        <div class="warnings-header__content-item">
                            <v-icon :icon="isListOpened ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="hanldeToggle"></v-icon>
                        </div>
                    </div>
                </div>
                <div class="warnings-body">
                    <div class="warnings-body__content">
                        <div class="warnings-body__content-item">
                            <div class="warnings-body__content-item__header"><h4>{{ isApptsArrayEmpty ? 'Визиты в заблокированную дату' : 'Нет предупреждений'}}</h4></div>
                            <div class="warnings-body__content-item__appts">
                                <div class="warnings-body__content-item__appts-item" v-for="appt in apptsOnBlockedDates" :key="appt" :id="`${appt._id}__warning`">
                                    <p class="appts-item__name">{{ clientByID(appt.clientID) ? clientByID(appt.clientID).name : appt.clientName }}</p>
                                    <p class="appts-item__date">{{ formatDateDDMMYY(appt.date) }}</p>
                                    <p class="appts-item__time">{{ appt.time }}</p>
                                    <button v-elevation-hover class="button-reject elevation-1" @click="handleRescheduleWarning(appt)">Перенести</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatDateDDMMYY } from '../../funcs/formatDateDDMMYY';
export default {
    data() {
        return {
            isListOpened: null
        }
    },
    methods: {
        formatDateDDMMYY,
        clientByID(clientID) {
            return this.clients.find(client => client._id === clientID)
        },
        hanldeToggle() {
            this.isListOpened = !this.isListOpened
            const content = document.querySelector('.warnings-body')
            content.classList.toggle('expanded')            
        },
        handleRescheduleWarning(appt) {            
            this.$emit('resceduleWarning', appt)
        }
    },
    computed: {
        ...mapState({
            apptsOnBlockedDates: state => state.planning.apptsOnBlockedDates,
            clients: state => state.client.clients
        }),
        isApptsArrayEmpty() {
            return this.apptsOnBlockedDates ? (this.apptsOnBlockedDates.length > 0 ? true : false) : false
        }
        
    }
}
</script>

<style scoped>
.warnings-header {
    padding: 0.5em;
    background-color: rgba(177, 249, 255, 0.548);
    border: 1px solid rgba(8, 34, 8, 0.116);    
}
.warnings-header__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h4 {
        font-size: 14px;
        font-weight: 700;
        color: rgba(12, 12, 12, 0.664);
    }  
}

.warnings-header__content-item {
    display: flex;
    align-items: center;
    gap: 5px;
    .icon-alert {
        color: rgb(196, 19, 19);
        font-size: 14px;        
        animation: pulse 1s ease infinite;
    }
}

@keyframes pulse {
    0% {
        color: rgb(184, 20, 20);
        transform: scale(1);
    }
    25% {
        color:  rgb(204, 19, 19);
        transform: scale(1.02);
    }
    50% {
        color:  rgb(228, 17, 17);
        transform: scale(1.04);
    }
    75% {
        color:  rgb(185, 15, 15);
        transform: scale(1.02);
    }
    100% {
        color:  rgb(141, 11, 11);
        transform: scale(1);
    }
}

.warnings-body {
    transform: scaleY(0); opacity: 0;
    transform-origin: top;    
    transition: transform 0.2s ease, opacity 0.1s linear;
    border: 1px solid rgba(8, 34, 8, 0.116);    
    border-bottom: 3px solid #6464645e;     
    background-color: rgba(230, 255, 255, 0.849);    
}

.warnings-body.expanded {
    opacity: 1;
    transform: none; 
    max-width: 100%; 
}

.warnings-body__content-item__header {
    padding: 0.5em 0.3em;
    h4 {
        font-size: 14px;
        font-weight: 700;
        color: rgba(12, 12, 12, 0.664);
        text-align: center;
    }  
}

.warnings-body__content-item__appts {
    height: fit-content;
    max-height: 37vh;
    overflow-y: auto;
}

.warnings-body__content-item__appts-item {
    width: 100%;
    display: flex; align-items: center; justify-content: space-between;
    gap: 2px;
    padding: 0.2em;
    background-color: rgba(212, 212, 212, 0.63);
    p {
        text-transform: capitalize;
        font-size: 11px;
    }    
    .appts-item__name {
        width: 26%;
        font-size: 13px;
        font-weight: 700;
    }
    .appts-item__date {
        width: 19%;
    }
    .appts-item__time {
        width: 12%;
    }
    button {
        font-size: 11px;
        display: block;
        /* margin-right: auto; */
        justify-self: flex-end;
        padding: 0.1em 0.4em;        
    }
}

.warnings-body__content-item__appts-item:nth-last-of-type(even) {
    background-color: rgba(212, 212, 212, 0.277);
}
</style>