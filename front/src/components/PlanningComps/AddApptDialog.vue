<template>
    <div class="dialog-main__wrapper elevation-5">
        <div class="cross"><v-icon icon="mdi-close-circle-outline" @click="handleCloseDialog"></v-icon></div>
        <div class="dialog-content">
            <div class="dialog-content__header elevation-7">
                <h2>Добавить прием</h2>
            </div>
            <div class="dialog-content__body elevation-7">
                <div class="dialog-content__body-item">
                    <p class="dialog-content__body-item__item elevation-3">{{ time }}</p>
                    <p class="dialog-content__body-item__item elevation-3">{{ formatDateDDMMYY(date) }}</p>
                    <p class="dialog-content__body-item__item elevation-3">{{ getDayOfWeekIntl(date) }}</p>
                    <button v-elevation-hover @click="isBlockDateDialogOpened = true"
                        :class="['dialog-content__body-item__button', isBlockDateDialogOpened ? 'button-disabled' : 'button-reject', 'elevation-3']">
                        Заблокировать
                    </button>
                    <div v-if="isBlockDateDialogOpened" class="dialog-content__body-item__dialog elevation-1">
                        <p>Заблокировать время?</p>
                        <div class="dialog-content__body-item__dialog__buttons">
                            <button v-elevation-hover class="button-accept elevation-1"
                                @click="handleBlockTime">Да</button>
                            <button v-elevation-hover @click="isBlockDateDialogOpened = false"
                                class="button-reject elevation-1">Нет</button>
                        </div>
                    </div>
                </div>
                <div class="dialog-content__body-item">
                    <div class="client__item">
                        <div class="client__item-header">
                            <div :class="['client__item-header__item', !isExistingClient ? 'active' : '']"
                                @click="isExistingClient = false; clientID = null">
                                <p>новый клиент</p>
                            </div>
                            <div :class="['client__item-header__item', isExistingClient ? 'active' : '']"
                                @click="isExistingClient = true; addNewClient = false; clientName = '', age = null, isNotifyingClient = false">
                                <p>уже клиент</p>
                            </div>
                        </div>
                        <div class="client__item-content" v-if="!isExistingClient">
                            <input type="text" placeholder="Введите ФИО клиента"
                                class="dialog-content__body-item__input elevation-2" v-model="clientName">
                        </div>
                        <div class="client__item-content" v-if="isExistingClient">
                            <v-autocomplete :items="clients" item-value="_id" item-title="name" variant="outlined"
                                rounded density="compact" base-color="transparent" bg-color="rgb(243, 245, 237)"
                                hide-details placeholder="Выберите клиента из списка"
                                v-model="clientID"></v-autocomplete>
                        </div>
                    </div>
                </div>
                <div class="checkbox" v-if="isExistingClient">
                    <v-checkbox label="Уведомить клиента по эл. почте" density="compact" v-model="isNotifyingClient"
                        :value="true"></v-checkbox>
                </div>
                <div class="appt-type">
                    <div class="appt-type__items">
                        <div class="appt-type__checkbox-block" v-if="isFirstVisitAvailable">
                            <div class="appt-type__checkbox">
                                <input type="radio" name="checkbox" id="1" value="first" v-model="apptType">
                            </div>
                            <div class="appt-type__label">
                                <p>Первичный прием (1ч.)</p>
                            </div>
                        </div>
                        <div class="appt-type__checkbox-block">
                            <div class="appt-type__checkbox">
                                <input type="radio" name="checkbox" id="2" value="notFirst" v-model="apptType">
                            </div>
                            <div class="appt-type__label">
                                <p>Занятие (30мин.)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialog-content__body-item">
                    <div class="dialog-content__body-item__content">
                        <h3>Комментарии к визиту <span>(Если необходимо)</span>:</h3>
                        <textarea class="elevation-3" v-model="visitCommentary"></textarea>
                    </div>
                </div>
                <div v-if="isExistingClient" class="dialog-content__body-item">
                    <div class="dialog-content__body-item__content">
                        <h3>Добавить комментарий в досье клиента<span>(Если необходимо)</span>:</h3>
                        <textarea class="elevation-3" v-model="clientCommentary"></textarea>
                    </div>
                </div>
                <div class="checkbox" v-if="!isExistingClient">
                    <v-checkbox label="Создать карточку клиента" density="compact" v-model="addNewClient"
                        :value="true"></v-checkbox>
                </div>
                <div class="new-client__container elevation-1" v-if="addNewClient">
                    <div class="dialog-content__body-item">
                        <div class="dialog-content__body-item__content">
                            <h3>Email:</h3>
                            <input type="email" placeholder="Введите эл. почту"
                                class="dialog-content__body-item__input elevation-2" v-model="email">
                        </div>
                    </div>
                    <div class="dialog-content__body-item">
                        <div class="dialog-content__body-item__content">
                            <h3>Телефон для связи:</h3>
                            <input type="phone" placeholder="Введите номер телефона"
                                class="dialog-content__body-item__input elevation-2" v-model="phone">
                        </div>
                    </div>
                    <div class="dialog-content__body-item">
                        <div class="dialog-content__body-item__content">
                            <h3>Возраст:</h3>
                            <input type="number" placeholder="Введите возраст ребенка"
                                class="dialog-content__body-item__input elevation-2" v-model="age">
                        </div>
                    </div>
                    <div class="dialog-content__body-item">
                        <div class="dialog-content__body-item__content">
                            <h3>Добавить комментарий в досье клиента<span>(Если необходимо)</span>:</h3>
                            <textarea name="" id="" class="elevation-3" v-model="clientCommentary"></textarea>
                        </div>
                    </div>
                </div>
                <button v-elevation-hover :class="['', 'button-accept elevation-2', 'mb-2']" @click.prevent="handleCreateAppt"
                    v-if="(clientID && apptType) || (clientName && apptType)">Добавить Прием</button>
            </div>
        </div>
    </div>
</template>

<script>
import { formatDateDDMMYY } from '../../funcs/formatDateDDMMYY';
import { getDayOfWeekIntl } from '../../funcs/getDayFromDate';
import axios from '../../../axios.js'
import { mapActions, mapState } from 'vuex/dist/vuex.cjs.js';
export default {
    emits: ['closeDialog'],
    props: {
        time: String,
        date: String
    },
    data() {
        return {
            isExistingClient: false,
            addNewClient: false,
            isBlockDateDialogOpened: false,
            clientName: null,
            clientID: null,
            visitCommentary: null,
            clientCommentary: null,
            email: null,
            phone: null,
            age: null,
            isNotifyingClient: false,
            apptType: null
        }
    },
    methods: {
        formatDateDDMMYY, getDayOfWeekIntl,
        ...mapActions({
            getAppts: 'planning/getAppts',
            getClients: 'client/getClients'
        }),
        handleCloseDialog() {
            this.$emit('closeDialog')
        },
        async createApptFunc(isAddingClient) {
            const data = await axios.post('/appointment/add', {
                time: this.time,
                date: this.date,
                ...(!isAddingClient && !this.isExistingClient && { clientName: this.clientName }),
                ...((isAddingClient || this.isExistingClient) ? { clientID: this.clientID } : {}),
                ...(this.visitCommentary && { commentary: this.visitCommentary }),
                createdBy: 'admin',
                isNotificationNeeded: this.isNotifyingClient,
                recipientEmail: this.existingClientEmail,
                type: this.apptType,
                timeToCheck: this.timeToCheck
            })
            return data
        },
        async blockTimeForFirstVisit(parentApptID, isAddingClient) {
            const data = await axios.post('/appointment/add', {
                time: this.timeToCheck,
                date: this.date,
                ...(!isAddingClient && !this.isExistingClient && { clientName: this.clientName }),
                ...((isAddingClient || this.isExistingClient) ? { clientID: this.clientID } : {}),
                createdBy: 'admin',
                isNotificationNeeded: false,
                recipientEmail: null,
                type: 'addToFirst',
                addedToApptID: parentApptID
            })
            return data
        },
        async addClientFunc() {
            const data = await axios.post('/client/add', {
                name: this.clientName,
                ...(this.email && { email: this.email }),
                ...(this.phone && { phone: this.phone }),
                ...(this.clientCommentary && { commentary: this.clientCommentary }),
                ...(this.age && { age: this.age }),
            })
            await this.getClients()
            return data
        },
        async handleCreateAppt() {
            let newAppt, newClient
            if (!this.addNewClient) {
                newAppt = await this.createApptFunc(this.addNewClient);
                console.log(newAppt)
            } else if (this.addNewClient) {
                newClient = await this.addClientFunc();
                this.clientID = newClient.data.client._id
                newAppt = await this.createApptFunc(this.addNewClient);
                console.log(newAppt, newClient)
            }
            if (!this.addNewClient && this.clientCommentary) {
                const newClientComment = await axios.patch('/client/add-comment', {
                    clientID: this.clientID,
                    text: this.clientCommentary,
                    appointmentID: this.appointmentID
                })
                console.log(newClientComment)
            }
            if (this.apptType === 'first') {
                const data = await this.blockTimeForFirstVisit(newAppt.data._id, this.addNewClient)
                console.log(data)
            }
            await this.getAppts()
            await this.getClients()
            this.$emit('closeDialog')
        },
        async handleBlockTime() {
            this.isAddingClient = this.isExistingClient = false
            this.visitCommentary = null
            this.clientName = 'blocked'
            this.apptType = 'notFirst'
            const data = await this.createApptFunc(false)
            this.visitCommentary = this.clientName = this.apptType =  null
            console.log(data)
            await this.getAppts()
            await this.getClients()
            this.$emit('closeDialog')
        }
    },
    computed: {
        ...mapState({
            clients: state => state.client.clients,
            times: state => state.planning.times,
            appointments: state => state.planning.appointments
        }),
        existingClientEmail() {
            if (this.clientID) {
                const client = this.clients.find(client => client._id == this.clientID)
                return client.email
            } else { return null }
        },
        timeToCheck() {
            const index = this.times.indexOf(this.time)
            return this.times[index + 1] ? this.times[index + 1] : null
        },
        isFirstVisitAvailable() {
            return this.appointments.find(appt => appt.time === this.timeToCheck && appt.date === this.date) ? false : true
        }
    }
}

</script>

<style scoped>
.dialog-main__wrapper {
    width: 100%;
    height: 100%;
    background-color: rgb(244, 255, 239);
    border-radius: 20px;
    border: 4px solid rgb(47, 56, 60);
    position: relative;
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
    background: linear-gradient(111deg, rgba(87, 118, 122, 0.85) 20%, rgba(18, 115, 119, 0.84) 77%);
    border-bottom: 4px solid rgb(47, 56, 60);
    padding: 0.5em 0.6em;
    color: rgba(249, 247, 232, 1);
    border-radius: 15px 15px 0 0;
}

h2 {
    font-size: 18px;
}

.dialog-content__body {
    background-color: rgb(224, 235, 231);
    padding: 0.4em;
    border-radius: 3px 3px 15px 15px;
    position: relative;

    button {
        padding: 0.4em 1em;
    }
}

.dialog-content__body-item {
    display: flex;
    gap: 5px;
    margin-bottom: 1.1em;
    font-size: 14px;
}

.dialog-content__body-item__item {
    background-color: rgb(243, 245, 237);
    padding: 0.2em 0.4em;
    border-radius: 20px;
    text-align: center;
    border: 2px solid rgb(47, 56, 60);
    text-transform: capitalize;
    font-size: 14px;

}

.dialog-content__body-item__button {
    padding: 0.1em 0.2em;
    font-size: 13px;
    flex-grow: 1;
}

.dialog-content__body-item__dialog {
    position: absolute;
    right: -5%;
    top: 10%;
    z-index: 60;
    padding: 0.5em;
    text-align: center;
    background-color: rgba(247, 247, 247, 0.99);
    border-radius: 3px;
    transition: all 0.2s ease;

    p {
        padding: 0.6em;
        font-size: 15px;
        margin-bottom: 0.5em;
    }

    button {
        display: block;
        width: 35%;
    }
}

.dialog-content__body-item__dialog::after {
    position: absolute;
    z-index: 81;
    content: '\25B2';
    top: -17%;
    left: 40%;
    color: rgba(247, 247, 247, 0.99);
}

.dialog-content__body-item__dialog__buttons {
    display: flex;
    gap: 1em;
    justify-content: center;

    button {
        padding: 0.2em 0.4em;
    }
}

.client__item {
    width: 100%;
}

.client__item-header {
    width: 100%;
    display: flex;
    margin-bottom: 0.5em;
}

.client__item-header__item {
    width: 50%;
    text-align: center;
    padding: 0.7em;
    cursor: pointer;
    font-size: 14px;
    text-transform: capitalize;
}

.appt-type {
    padding: 1em;
    width: calc(100% + 0.8em);
    margin-bottom: 0.5em;
    margin-left: -0.4em; margin-right: -0.4em;
    background-color: rgba(148, 148, 148, 0.181);
    border-block: 1px solid rgba(170, 170, 170, 0.174);

    .appt-type__items {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10%;

        .appt-type__checkbox-block {
            display: flex;
            align-items: center;
            gap: 5px;
            width: 45%;

            p {
                font-size: 12px;
            }

            .appt-type__checkbox {
                display: flex;
                align-items: center;
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
        background-color: rgb(243, 243, 243);
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

.client__item-header__item.active {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
    position: relative;
    border-bottom: 2px solid rgba(72, 111, 117, 0.603);

    p {
        font-weight: 700;
        color: rgb(41, 62, 65);
    }
}

.dialog-content__body-item__input {
    width: 100%;
    display: block;
    border-radius: 20px;
    background-color: rgb(243, 245, 237);
    border: 2px solid rgb(47, 56, 60);
    padding: 0.5em 0.7em;
}

.dialog-content__body-item__input[type="text"]:focus,
.dialog-content__body-item__input[type="email"]:focus,
.dialog-content__body-item__input[type="phone"]:focus,
.dialog-content__body-item__input[type="number"]:focus,
.dialog-content__body-item__content textarea:focus {
    outline: 1px solid black;
    background-color: rgb(248, 248, 246);
}

.dialog-content__body-item__content {
    width: 100%;
}

.dialog-content__body-item__content h3 {
    margin-bottom: 0.4em;
    font-size: 14px;
}

.dialog-content__body-item__content textarea {
    background-color: rgb(243, 245, 237);
    width: 100%;
    padding: 0.5em;
    border: 2px solid rgb(47, 56, 60);
    border-radius: 5px;
}

.checkbox {
    font-size: 12px;
}

.new-client__container {
    border: 2px solid rgb(47, 56, 60);
    border-radius: 15px;
    padding: 1em;
    margin-bottom: 1em;
}
</style>