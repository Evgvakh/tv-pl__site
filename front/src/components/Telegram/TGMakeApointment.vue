<template>
    <div v-if="!isLoading" class="book-main">
        <div class="book-main-header">
            <h2>{{ isRescheduling ? 'Перенести визит' : 'Онлайн-запись' }}</h2>
        </div>
        <div class="book__name-block">
            <div class="book__name-block__item">
                <input v-if="!getClientByUserID" type="text" v-model="name" placeholder="Введите ФИО ребенка">
                <input v-if="!getClientByUserID" placeholder="Телефон для связи" v-model="phone">
                <p v-if="!getClientByUserID" class="notif">Вы не завели личный кабинет на нашем сайте или не вошли в
                    свою учетную
                    запись. Для управления своими записями рекомендуем вам зарегистрироваться и/или войти в
                    систему. Вы можете записаться на прием пропустив этот шаг, в таком случае при необходимости отменить
                    или перенести ваш визит, просим Вас сообщить нам об этом заблаговременно по
                    <a href="tel: ">телефону</a>.
                </p>
                <p v-else>ФИО: {{ getClientByUserID.name }}</p>
            </div>
        </div>
        <div class="book-header">
            <div class="date-picker elevation-1">
                <vue-date-picker v-model="date" locale="ru" :clearable="true" placeholder="Выберите дату"
                    :enable-time-picker="false" :disabled-dates="formatDisabledDates" auto-apply format="dd/MM/yyyy"
                    @update:model-value="checkAvailableTimesForDate"></vue-date-picker>
            </div>
            <div v-if="date" class="time-picker elevation-1">
                <p>{{ chosenTime === 'Time' ? 'Время' : chosenTime }}</p>
            </div>
        </div>
        <div class="appt-type">
            <div class="appt-type__items">
                <div
                    :class="['appt-type__checkbox-block', isRescheduling && apptType === 'notFirst' ? 'disabled' : '']">
                    <div class="appt-type__checkbox">
                        <input :disabled="isRescheduling && apptType === 'notFirst'" type="radio" name="checkbox" id="1"
                            value="first" v-model="apptType" @update:model-value="chosenTime = null">
                    </div>
                    <div class="appt-type__label">
                        <p>Первичный прием (1ч.)</p>
                    </div>
                </div>
                <div :class="['appt-type__checkbox-block', isRescheduling && apptType === 'first' ? 'disabled' : '']">
                    <div class="appt-type__checkbox">
                        <input :disabled="isRescheduling && apptType === 'first'" type="radio" name="checkbox" id="2"
                            value="notFirst" v-model="apptType" @update:model-value="chosenTime = null">
                    </div>
                    <div class="appt-type__label">
                        <p>Повторный прием (занятие) (30мин.)</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="availableTimes && date && apptType" class="book-body">
            <div :class="['book-body__items', themeClass, 'elevation-1']">
                <div v-if="apptType === 'notFirst'" class="book-body__items-item elevation-1"
                    v-for="time in availableTimes">
                    <p class="time-item" :data-time="time" @click="handleChooseTime">{{ time }}</p>
                </div>
                <div v-if="apptType === 'first'" class="book-body__items-item elevation-1"
                    v-for="time in isFirstVisitAvailable">
                    <p class="time-item" :data-time="time" @click="handleChooseTime">{{ time }}</p>
                </div>
            </div>
        </div>
        <div class="book-button">
            <button v-elevation-hover v-if="!isRescheduling" :disabled="isButtonDisabled"
                :class="[isButtonDisabled ? 'button-disabled' : 'button-accept', 'elevation-1']"
                @click="addAppointment">Записаться</button>
            <button v-elevation-hover v-if="isRescheduling" :disabled="isButtonDisabled"
                :class="[isButtonDisabled ? 'button-disabled' : 'button-accept', 'elevation-1']"
                @click="rescheduleAppointment">Перенести</button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import axios from '../../../axios';
import { checkToken } from '../../funcs/checkToken';
export default {
    data() {
        return {
            date: null,
            chosenTime: 'Time',
            availableTimes: null,
            colorScheme: null,
            name: null,
            phone: null,
            isRescheduling: false,
            isLoading: null,
            apptToReschedule: null,
            apptType: null
        }
    },
    methods: {
        checkToken,
        ...mapActions({
            getBlockedDates: 'planning/getBlockedDates',
            getApptByID: 'planning/getApptByID'
        }),
        ...mapMutations({
            setDateToCheck: 'planning/setDateToCheck',
            setUserID: 'client/setUserID'
        }),
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
        handleChooseTime(e) {
            this.chosenTime = e.target.getAttribute('data-time')
        },
        async addAppointment() {
            const formatedDate = new Date(this.date).toISOString().split('T')[0]
            const { data } = await axios.post('/appointment/add', {
                ...(this.getClientByUserID && { clientID: this.getClientByUserID._id }),
                ...(this.name ? { clientName: this.name } : { clientName: this.getClientByUserID.name }),
                ...(this.name && { commentary: `Телефон для связи: ${this.phone}` }),
                date: formatedDate,
                time: this.chosenTime,
                createdBy: 'user',
                type: this.apptType,
            })
            if (this.apptType === 'first') {
                var { data: data2 } = await axios.post('/appointment/add', {
                    ...(this.getClientByUserID && { clientID: this.getClientByUserID._id }),
                    ...(this.name ? { clientName: this.name } : { clientName: this.getClientByUserID.name }),
                    date: formatedDate,
                    time: this.timeToCheck,
                    createdBy: 'user',
                    type: 'addToFirst',
                    addedToApptID: data._id
                })
            }
            if (data && (this.apptType === 'notFirst' || data2)) {
                console.log(data)
                let clientRef = localStorage.getItem('tvPlanUserID')
                this.getClientByUserID ? this.$router.push(`/telegram/client/${clientRef}`) : this.$router.push('/telegram/confirm')
            }
        },
        async rescheduleAppointment() {
            const formatedDate = new Date(this.date).toISOString().split('T')[0]
            const oldEmptyApptTime = this.times[this.times.indexOf(this.apptByID.time) + 1]
            const newEmptyApptTime = this.times[this.times.indexOf(this.chosenTime) + 1]         
            const { data } = await axios.patch('/appointment/reschedule', {
                id: this.apptToReschedule,
                date: formatedDate,
                time: this.chosenTime,
                oldEmptyApptTime: oldEmptyApptTime,
                newEmptyApptTime: newEmptyApptTime,
                apptType: this.apptType                
            })
            if (data) {
                console.log(data)
                let clientRef = localStorage.getItem('tvPlanUserID')
                this.$router.push(`/telegram/client/${clientRef}`)
            }

        },
        async checkIfLogged() {
            if (localStorage.getItem('tvPlanToken') && localStorage.getItem('tvPlanUserID')) {
                const isLogged = await this.checkToken(localStorage.getItem('tvPlanUserID'))
                if (!isLogged) {
                    localStorage.setItem('tvPlanUserID', null)
                    localStorage.setItem('tvPlanToken', null)
                    this.setUserID(null)
                } else {
                    this.setUserID(localStorage.getItem('tvPlanUserID'))
                }
            } else {
                this.setUserID(null)
            }
        },
        async checkIfRescheduling() {
            if (this.$route.params.apptID) {
                console.log(this.$route.params.apptID)
                await this.getApptByID(this.$route.params.apptID)
                this.isRescheduling = true
                this.apptToReschedule = this.$route.params.apptID
                this.apptType = this.apptByID.type
            }
        }
    },
    computed: {
        setColorScheme() {
            if (window.Telegram && window.Telegram.WebApp) {
                this.colorScheme = window.Telegram.WebApp.colorScheme || 'light';
                window.Telegram.WebApp.onEvent('themeChanged', () => {
                    this.colorScheme = window.Telegram.WebApp.colorScheme || 'light';
                });
            } else {
                console.error('Telegram WebApp API недоступен.');
            }
        },
        ...mapState({
            blockedDates: state => state.planning.blockedDates,
            times: state => state.planning.times,
            isRescheduling: state => state.planning.isTelegramRescheduling,
            apptByID: state => state.planning.apptByID
        }),
        formatDisabledDates() {
            const formatedDates = this.blockedDates.map(date => new Date(date))
            return formatedDates
        },
        themeClass() {
            return this.colorScheme === 'dark' ? 'dark-theme' : 'light-theme';
        },
        isButtonDisabled() {
            return ((this.name && this.phone) || this.getClientByUserID?.name) && this.apptType && this.date && this.chosenTime !== 'Time' ? false : true
        },
        ...mapGetters({
            getClientByUserID: 'client/getClientByUserID'
        }),
        timeToCheck() {
            const index = this.times.indexOf(this.chosenTime)
            return this.times[index + 1] ? this.times[index + 1] : null
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
        await this.checkIfRescheduling()
        await this.checkIfLogged()
        await this.getBlockedDates()
        this.isLoading = false
    },
    watch: {
        chosenTime(newVal) {
            document.querySelectorAll('.active').forEach(elem => elem.classList.toggle('active'))
            document.querySelectorAll('.book-body__items-item').forEach(elem => elem.classList.toggle('elevation-1', true))
            const el = document.querySelector(`[data-time="${newVal}"]`)
            if (el) {
                el.classList.toggle('active')
                el.closest('.book-body__items-item').classList.toggle('elevation-1')
            }
        },
    }
}
</script>

<style scoped>
.book-main-header {
    padding: 1em;
    background-color: rgba(223, 223, 223, 0.158);
}

.book__name-block {
    padding: 0.7em;
    background-color: rgba(170, 228, 228, 0.664);

    input {
        background-color: rgb(255, 255, 233);
        border-radius: 5px;
        margin-bottom: 0.2em;
        width: 100%;
        padding: 0.5em;
        border: 1px solid #121212;
    }

    p {
        text-transform: capitalize;
        text-align: center;
        font-size: 18px;
        font-weight: 700;
        color: rgb(65, 8, 8);
    }

    p.notif {
        text-align: justify;
        font-size: 11px;
        text-transform: none;
        line-height: 0.9em;
        margin-top: 0.1em;
    }
}

.book-header {
    display: flex;
    padding: 1em;
    gap: 10%;
    justify-content: center;
    margin-bottom: 0.2em;

    .date-picker,
    .time-picker {
        width: 45%;
        border-radius: 6px;
    }

    .date-picker {
        background-color: transparent;
    }

    .time-picker {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(233, 253, 238, 0.74);
        color: #121212;
        border: 1px solid #c5bfbf;

        p {
            font-size: 15px;
            font-weight: 700;
        }
    }
}

.book-body {
    padding: 0 1em;
}

.book-body__items {
    display: flex;
    flex-wrap: wrap;
    gap: 6.666%;
    padding: 0.5em 1em;
    background-color: rgba(233, 253, 238, 0.74);
    border: 1px solid #c5bfbf;
    border-radius: 5px;

    .book-body__items-item {
        width: 20%;

        border-radius: 10px;
        margin-block: 2%;
        line-height: 0.9em;

        .time-item {
            width: 100%;
            height: 100%;
            border-radius: 9px;
            border: 1px solid #c5bfbf;
            background-color: #ffffff6c;
            padding: 0.3em 0.2em 0.1em 0.2em;

            text-align: center;
            cursor: pointer;
            transition: all 0.14s ease;
        }

        .time-item.active {
            border: 1px solid transparent;
            background-color: #0a74ff;
            color: white;
            padding: 0.3em 0.2em 0.1em 0.2em;
            text-align: center;
            cursor: pointer;
        }
    }
}

.book-body__items.dark-theme {
    .book-body__items-item {
        border: 2px solid #c5c5c5;

    }
}

.appt-type {
    padding: 1em;
    width: 100%;
    margin-bottom: 1em;
    background-color: rgba(233, 253, 238, 0.74);
    border-block: 2px solid rgba(170, 170, 170, 0.124);

    .appt-type__items {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 0 2em;

        .appt-type__checkbox-block {
            display: flex;
            align-items: center;
            gap: 5px;

            p {
                font-size: 12px;
            }

            .appt-type__checkbox {
                display: flex;
                align-items: center;
            }
        }

        .appt-type__checkbox-block.disabled {
            color: grey;

            input[type="radio"] {
                border: 2px solid #a5a2a294;
                background-color: #a5a2a294;
                cursor:not-allowed;
            }
        }


    }

    input[type="radio"] {
        width: 17px;
        height: 17px;
        appearance: none;
        border: 2px solid #555;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        transition: all .2s ease;
    }

    /* Стили для отмеченного состояния */
    input[type="radio"]:checked {
        background-color: rgba(170, 228, 228, 0.664);
        border-color: rgb(0, 129, 129);
    }

    /* Отрисовка галочки */
    input[type="radio"]:checked::after {
        content: '';
        position: absolute;
        left: 4px;
        top: 0px;
        width: 6px;
        height: 10px;
        border: solid rgb(0, 129, 129);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }
}

.book-button {
    width: 100%;
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
        display: block;
        width: 60%;
        margin: 0 auto;
        padding: 0.5em;
    }
}
</style>