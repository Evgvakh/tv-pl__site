<template>
    <div class="handle-appts__item elevation-1">
        <div class="handle-appts__text">
            <p class="elevation-1">{{ formatDateDDMMYY(appointment.date) }}</p>
            <p class="elevation-1">{{ appointment.time }}</p>
        </div>
        <div class="handle-appts__buttons">
            <button v-elevation-hover class="button-accept elevation-1"
                @click="handleClick('Перенести', 'reschedule')">Перенести</button>
            <button v-elevation-hover class="button-reject elevation-1"
                @click="handleClick('Отменить', 'cancel')">Отменить</button>
        </div>
        <div class="handle-appts__item-hidden" :id="`appt-hover__${appointment._id}`">
            <div class="appts-hidden__wrapper">
                <v-icon icon="mdi-check-circle-outline" @click="handleAccept()"></v-icon>
                <button>{{ buttonText }}</button>
                <v-icon icon="mdi-close-circle-outline" @click="handleUndo"></v-icon>
            </div>
        </div>
    </div>
</template>

<script>
import { formatDateDDMMYY } from '../../../funcs/formatDateDDMMYY.js';
import axios from '../../../../axios.js';
export default {
    props: {
        appointment: Object
    },
    data() {
        return {
            buttonText: null,
            handleType: null
        }
    },
    methods: {
        formatDateDDMMYY,        
        handleClick(text, type) {
            document.querySelector(`#appt-hover__${this.appointment._id}`).classList.toggle('active')
            console.log(document.querySelector(`#appt-hover__${this.appointment._id}`))
            this.buttonText = text
            this.handleType = type
        },
        async handleAccept() {
            if (this.handleType === 'reschedule') {                
                this.$router.push(`/telegram/book/${this.appointment._id}`)
            } else {
                const {data} = await axios.delete(`/appointment/remove/${this.appointment._id}`)
                if (data) {
                    document.querySelectorAll('.handle-appts__item-hidden').forEach(el => {
                        if (el.classList.contains('active')) {
                            el.classList.remove('active')
                        }
                    })
                    this.$emit('refreshAfterAction')
                }
                
            }
        },
        handleUndo() {
            document.querySelector(`#appt-hover__${this.appointment._id}`).classList.toggle('active')
        }
    }
}
</script>

<style scoped>
.handle-appts__item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid rgba(16, 84, 87, 0.358);
    border-radius: 5px;
    margin-block: 0.3em;
    background-color: rgba(227, 255, 251, 0.753);
    padding: 0.5em 0.3em;

    .handle-appts__item-hidden {
        position: absolute;
        background-color: rgb(214, 255, 227);        
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform-origin: center center;
        transform: rotateX(90deg);
        transition: all 0.3s ease;
        border: 2px solid rgba(117, 114, 114, 0.278);
        border-radius: 3px;
    }

    .handle-appts__item-hidden.active {        
        z-index: 30;
        transform: rotateX(0);
    }

    .appts-hidden__wrapper {
        width: 100%; height: 100%;
        display: flex; justify-content: center; align-items: center; gap: 40px;
        button {
            width: 40%;
        }
    }
}

.handle-appts__text {
    display: flex;
    gap: 10px;

    p {
        font-size: 12px;
        border: 1px solid #121212;
        border-radius: 15px;
        padding: 0.3em 0.5em 0.2em 0.5em;
        background-color: white;
    }
}

.handle-appts__buttons {
    display: flex;
    gap: 22px;

    button {
        font-size: 12px;
        padding: 0.1em 0.5em;
    }
}
</style>