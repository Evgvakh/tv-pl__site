<template>
    <div class="appt-details__main" v-if="!isLoading">
        <div class="cross"><v-icon icon="mdi-close-circle-outline" @click="handleCloseRescheduleWindow"></v-icon></div>
        <div class="dialog-content">
            <div class="dialog-content__header elevation-7">
                <h2>Перенести прием</h2>
            </div>
            <div class="dialog-content__body elevation-7">
                <div class="dialog-content__body-item">
                    <div class="dialog-content__body-item__content">
                        <div class="dialog-content__body-item__date-picker">
                            <vue-date-picker :disabled="isDialogOpened" v-model="date" :clearable="true"
                                format="dd-MM-yyyy" utc="preserve" locale="ru"
                                @update:model-value="checkAvailableTimesForDate" auto-apply placeholder="Дата"
                                :enable-time-picker="false" :disabled-dates="disabledDates"></vue-date-picker>
                        </div>
                        <div
                            :class="['dialog-content__body-item__time-picker', chosenTime === 'Time' ? 'placeholder' : '']">
                            <p>{{ chosenTime === 'Time' ? 'Время' : chosenTime }}</p>
                        </div>
                        <div class="dialog-content__body-item__button">
                            <div @click="handleOpenDialog"
                                :class="['dialog-content__body-item__button-item', isButtonDisabled ? 'disabled' : '']">
                                <button><v-icon icon="mdi-content-save-all"></v-icon></button>
                                <p>Перенести</p>
                            </div>
                            <div
                                :class="['reschedule__confirmation-dialog', 'elevation-4', isDialogOpened ? 'dialog-enabled' : 'dialog-disabled']">
                                <div class="reschedule__confirmation-dialog__header">
                                    <p>Перенести прием?</p>
                                </div>
                                <div class="reschedule__confirmation-dialog__button-block">
                                    <button v-elevation-hover class="button-accept elevation-1"
                                        @click="handleConfirmRescheduling">Да</button>
                                    <button v-elevation-hover class="button-reject elevation-1"
                                        @click="handleCloseDialog">Нет</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="clientByID" class="notify-client">
                        <div>
                            <v-checkbox label="Уведомить клиента по эл.почте" density="compact"
                                v-model="isNotificationEnabled" :value="true" hide-details></v-checkbox>
                        </div>
                    </div>
                    <div class="times" :aria-hidden="isDialogOpened ? 'true' : 'false'">
                        <div v-if="apptByID.type === 'first'" class="time elevation-2"
                            v-for="time in isFirstVisitAvailable" :key="time">
                            <p class="time-item" :data-time="time" @click="handleChooseTime">{{ time }}</p>
                        </div>
                        <div v-if="apptByID.type !== 'first'" class="time elevation-2" v-for="time in availableTimes"
                            :key="time">
                            <p class="time-item" :data-time="time" @click="handleChooseTime">{{ time }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../../axios';
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
    emits: ['closeRescheduleWindow', 'closeRescheduleWindowSuccess'],
    props: {
        initialDate: String,
        apptID: String,
        disabledDates: Array
    },
    data() {
        return {
            date: null,
            chosenTime: 'Time',
            availableTimes: null,
            isDialogOpened: false,
            isNotificationEnabled: false,
            isLoading: false
        }
    },
    methods: {
        ...mapMutations({
            setDateToCheck: 'planning/setDateToCheck'
        }),
        ...mapActions({
            getApptsOnBlockedDates: 'planning/getApptsOnBlockedDates'
        }),
        handleCloseRescheduleWindow() {
            this.$emit('closeRescheduleWindow')
        },
        handleChooseTime(e) {
            this.chosenTime = e.target.getAttribute('data-time')
        },
        async checkAvailableTimesForDate() {
            this.setDateToCheck(this.date)
            this.chosenTime = 'Time'
            const data = await axios.post('/appointment/get-taken-times', {
                date: this.date
            })
            this.availableTimes = this.times.filter(time => {
                return !data.data.includes(time)
            })
        },
        handleOpenDialog() {
            !this.isButtonDisabled ? this.isDialogOpened = true : ''
        },
        handleCloseDialog() {
            this.isDialogOpened = false
        },
        async handleConfirmRescheduling() {
            const data = await axios.patch('/appointment/reschedule', {
                date: new Date(this.date).toISOString().split('T')[0],
                time: this.chosenTime,
                id: this.apptID,
                isNotificationNeeded: this.isNotificationEnabled,
                email: this.clientByID.email,
                old_time: this.apptByID.time,
                old_date: this.apptByID.date,
                oldEmptyApptTime: this.times[this.times.indexOf(this.apptByID.time) + 1],
                newEmptyApptTime: this.times[this.times.indexOf(this.chosenTime) + 1],
                apptType: this.apptByID.type
            })
            if (data) {
                this.isDialogOpened = false
                await this.getApptsOnBlockedDates()
                this.$emit('closeRescheduleWindowSuccess', this.apptID)
            }
        }
    },
    computed: {
        ...mapState({
            times: state => state.planning.times,
            appts: state => state.planning.appointments,
            clients: state => state.client.clients
        }),
        isButtonDisabled() {
            if (!(this.date && this.chosenTime !== 'Time')) {
                return true
            } else { return false }
        },
        apptByID() {
            return this.appts.find(appt => appt._id == this.apptID)
        },
        clientByID() {
            if (this.apptByID.clientID) {
                return this.clients.find(client => client._id === this.apptByID.clientID)
            } else {
                return false
            }
        },
        isFirstVisitAvailable() {
            function add30Minutes(timeStr) {
                const [hours, minutes] = timeStr.split(':').map(Number);
                let newMinutes = minutes + 30;
                let newHours = hours;
                if (newMinutes >= 60) {
                    newHours += Math.floor(newMinutes / 60);
                    newMinutes = newMinutes % 60;
                }
                const hoursStr = newHours < 10 ? '0' + newHours : String(newHours);
                const minutesStr = newMinutes < 10 ? '0' + newMinutes : String(newMinutes);
                return `${hoursStr}:${minutesStr}`;
            }

            return this.availableTimes.filter(time => this.availableTimes.includes(add30Minutes(time)));
        },

    },
    async created() {
        this.isLoading = true
        this.date = new Date(this.initialDate)
        await this.checkAvailableTimesForDate()
        this.isLoading = false
    },
    watch: {
        chosenTime(newVal) {
            document.querySelectorAll('.active').forEach(elem => elem.classList.toggle('active'))
            document.querySelectorAll('.time').forEach(elem => elem.classList.toggle('elevation-2', true))
            const el = document.querySelector(`[data-time="${newVal}"]`)
            if (el) {
                el.classList.toggle('active')
                el.closest('.time').classList.toggle('elevation-2')
            }
        },
        initialDate(newVal) {
            this.date = new Date(newVal)
        }
    }
}
</script>

<style scoped>
[aria-hidden="true"] {
    pointer-events: none;
    opacity: 0.6;
}

.appt-details__main {
    position: fixed;
    inset: 40vh 45vw;
    z-index: 50;
    width: 20vw;
    height: fit-content;
    overflow: visible;
    background-color: rgba(0, 0, 0, 0.288);
    border-radius: 15px 15px 10px 10px;
    border: 4px solid rgb(47, 56, 60);

    @media (max-width: 1700px) {
        width: 22vw;
    }

    @media (max-width: 1600px) {
        width: 23vw;
    }

    @media (max-width: 1480px) {
        width: 25vw;
    }

    @media (max-width: 1370px) {
        width: 27vw;
    }

    @media (max-width: 1275px) {
        width: 30vw;
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
    border-radius: 20px;
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
    overflow: visible;
}

.dialog-content__body-item {
    gap: 10px;
    margin-bottom: 0.3em;
    font-size: 15px;
}

.dialog-content__body-item__content {
    display: flex;
    gap: 10px;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 0.5em;
}

.dialog-content__body-item__date-picker {
    width: 45%;
}

.dialog-content__body-item__time-picker {
    width: 25%;
    border: 1px solid #c5bfbf;
    border-radius: 5px;
    background-color: rgba(218, 253, 227, 0.841);
    display: flex;
    align-items: center;
    justify-content: center;

    p {
        font-weight: 700;
        font-size: 13px;
        color: #2f463c
    }
}

.dialog-content__body-item__time-picker.placeholder {
    p {
        color: #959595;
    }
}

.dialog-content__body-item__button {
    position: relative;
    width: 25%;
    align-self: center;
    text-align: center;

    button {
        font-size: 13px;
    }

    p {
        font-size: 9px;
    }
}

.dialog-content__body-item__button-item.disabled {
    button {
        color: #959595;
    }

    p {
        color: #959595;
    }
}

.dialog-content__body-item__button-item {
    cursor: pointer;
    transition: all 0.1s ease-in;
}

.dialog-content__body-item__button-item:hover {
    transform: translateX(-1px) translateY(1px) scale(96%);
}

.dialog-content__body-item__button-item.disabled:hover {
    transform: none;
}

.reschedule__confirmation-dialog {
    left: -15%;
    bottom: -245%;
    z-index: 60;
    position: absolute;
    padding: 0.5em;
    width: 9vw;
    text-align: center;
    background-color: rgba(247, 247, 247, 0.99);
    border-radius: 3px;
    transition: all 0.2s ease;

    @media (max-width: 1700px) {
        width: 9.5vw;
        left: -14%;
    }

    @media (max-width: 1600px) {
        width: 10.5vw;
        left: -17%;
    }

    @media (max-width: 1460px) {
        width: 11.5vw;
        left: -17%;
    }

    @media (max-width: 1360px) {
        width: 12vw;
        left: -17%;
    }

    @media (max-width: 1270px) {
        width: 12.5vw;
        left: -14%;
    }

    p {
        padding: 0.2em;
        font-size: 15px;
        margin-bottom: 0.5em;
    }

    button {
        display: block;
        width: 35%;
    }
}

.reschedule__confirmation-dialog::after {
    position: absolute;
    content: '\25B2';
    top: -13%;
    left: 29%;
    color: rgba(247, 247, 247, 0.99);
}

.reschedule__confirmation-dialog__button-block {
    display: flex;
    gap: 1em;
    justify-content: center;

    button {
        padding: 0.2em 0.4em;
    }
}

.reschedule__confirmation-dialog.dialog-enabled {
    transform: none;
}

.reschedule__confirmation-dialog.dialog-disabled {
    /* transform: scale(0); */
    transform: scale(0, 0);
    transform-origin: top;
}

.times {
    padding: 3%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 2%;
    border: 1px solid #c5bfbf;
    border-radius: 5px;
    background-color: rgba(218, 253, 227, 0.841);

    .time {
        margin-bottom: 2%;
    }
}

.time {
    cursor: pointer;
    width: 23.5%;
    border-radius: 20px;
}

.time-item {
    width: 100%;
    background-color: rgb(243, 245, 237);
    padding: 0.2em 0.4em;
    border-radius: 20px;
    text-align: center;
    border: 1px solid rgb(47, 56, 60);
    transition: all 0.2s ease;

}

.time-item.active {
    background: rgb(18, 115, 119, 0.94);
    background: linear-gradient(90deg, rgba(80, 120, 126, 0.85) 20%, rgba(18, 115, 119, 0.94) 67%);
    color: white;
    font-weight: 700;
    border: 1px solid transparent;
}

.time-item:not(.active):hover {
    background-color: rgba(194, 196, 190, 0.396);
    font-weight: 700;
    color: #121212;
}
</style>