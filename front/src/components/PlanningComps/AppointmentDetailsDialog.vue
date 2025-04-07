<template>
    <div class="appt-details__main">
        <div class="cross"><v-icon icon="mdi-close-circle-outline" @click="handleCloseApptDetails"></v-icon></div>
        <div class="dialog-content">
            <div class="dialog-content__header elevation-7">
                <h2>Информация о приеме</h2>
            </div>
            <div class="dialog-content__body elevation-7">
                <div class="dialog-content__body-item">
                    <p class="dialog-content__body-item__item elevation-3">{{ appointment.time }}</p>
                    <p class="dialog-content__body-item__item elevation-3">{{ formatDateDDMMYY(appointment.date) }}</p>
                    <p class="dialog-content__body-item__item elevation-3">{{ getDayOfWeekIntl(appointment.date) }}</p>
                </div>
                <div class="dialog-content__body-item">
                    <div class="client-name__block">
                        <p @click="handleOpenClientDetails">{{ clientByID ? clientByID.name : appointment.clientName
                            }}{{ clientByID && clientByID.age ? `, ${clientByID?.age} ${correctAgeGrammar}` : '' }}
                        </p>
                        <button v-if="!clientByID" @click="handleAddClient">добавить клиента в базу</button>
                    </div>
                </div>
                <div class="dialog-content__body-item">
                    <div class="dialog-content__body-item__content">
                        <h3 class="dialog-content__body-item__content-header">Комментарий к визиту:</h3>
                        <p v-for="comment in appointment.commentaries"
                            class="dialog-content__body-item__content__comment"><v-icon class="icon"
                                icon="mdi-fountain-pen"></v-icon>
                            <span>{{ formatDateDDMMYY(comment.createdAt) }}</span> <br> {{ comment.text }}
                        </p>
                        <div @click="isCommentTextOpened = !isCommentTextOpened"
                            class="dialog-content__body-item__content__icon-block d-flex align-center">
                            <v-icon class="icon"
                                :icon="isCommentTextOpened ? 'mdi-minus-circle-outline' : 'mdi-plus-circle-outline'"></v-icon>
                            <p>{{ isCommentTextOpened ? 'Закрыть' : 'Добавить комментарий' }} </p>
                        </div>
                        <textarea name="" id="" :class="['elevation-3', isCommentTextOpened ? 'opened' : 'closed']"
                            v-model="apptCommentText"></textarea>
                        <button class="button" v-if="isCommentTextOpened && apptCommentText"
                            @click.prevent="addApptCommentary">Добавить</button>
                    </div>
                </div>
                <div class="buttons-block">
                    <div :id="`blocked-time_${apptID}`">
                        <button v-elevation-hover @click="handleOpenDialog" class="elevation-3 button-reject">
                            Удалить прием
                        </button>
                        <Dialog :position="{top: '130%', left: '5%'}" :state="isDialogOpened" :header="'Удалить прием'"
                            :parentId="`blocked-time_${apptID}`" @closeDialog="isDialogOpened = false" @handleAction="handleRemoveAppt" />
                    </div>
                    <div><button v-elevation-hover @click="handleRescheduleAppt"
                            class="elevation-3 button-accept">Перенести прием</button></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex/dist/vuex.cjs.js';
import { formatDateDDMMYY } from '../../funcs/formatDateDDMMYY';
import { getDayOfWeekIntl } from '../../funcs/getDayFromDate';
import axios from '../../../axios';
import Dialog from './UtilComponents/Dialog.vue';
export default {
    props: {
        apptID: String
    },
    components: {
        Dialog
    },
    data() {
        return {
            isCommentTextOpened: false,
            apptCommentText: '',
            isDialogOpened: false
        }
    },
    methods: {
        formatDateDDMMYY, getDayOfWeekIntl,
        ...mapActions({
            getAppts: 'planning/getAppts'
        }),
        ...mapMutations({
            setClientID: 'client/setClientID',
            setClientSearchQueryID: 'planning/setClientSearchQueryID'
        }),
        handleCloseApptDetails() {
            this.$emit('closeApptDetails')
        },
        handleOpenClientDetails() {
            if (this.appointment.clientID) {
                this.setClientID(this.appointment.clientID)
                this.setClientSearchQueryID(this.appointment.clientID)
                this.$emit('openClientDetails', this.appointment.clientID)
            } else {

            }
        },
        handleRescheduleAppt() {
            this.$emit('openRescheduleWindow', this.appointment.date)
        },
        async addApptCommentary() {
            const commentData = await axios.patch('/appointment/add-comment', {
                id: this.apptID,
                text: this.apptCommentText
            })
            if (commentData) {
                this.apptCommentText = ''

                this.isCommentTextOpened = false
                await this.getAppts()
            }
            console.log(commentData)
        },
        async handleRemoveAppt() {
            const data = await axios.delete(`/appointment/remove/${this.apptID}`)
            if (data.data) {
                console.log(data)
                await this.getAppts()
                this.$emit('closeApptDetails')
            }
        },
        handleAddClient() {
            this.$router.push({ name: 'AddClient', params: { clientName: this.appointment.clientName } })
        },
        handleOpenDialog() {
            this.isDialogOpened = true
        }
    },
    computed: {
        ...mapState({
            appointments: state => state.planning.appointments,
            clients: state => state.client.clients
        }),
        appointment() {
            return this.appointments.find(appt => appt._id === this.apptID)
        },
        clientByID() {
            if (this.appointment.clientID) {
                return this.clients.find(client => client._id === this.appointment.clientID)
            } else {
                return false
            }
        },
        correctAgeGrammar() {
            if (this.clientByID && this.clientByID.age) {
                let lastDigit = this.clientByID.age.toString().split('')
                if (lastDigit[lastDigit.length - 1] === '5' || lastDigit[lastDigit.length - 1] === '6' || lastDigit[lastDigit.length - 1] === '7' || lastDigit[lastDigit.length - 1] === '8' || lastDigit[lastDigit.length - 1] === '9' || lastDigit[lastDigit.length - 1] === '0') {
                    return 'лет'
                } else {
                    return 'года'
                }
            } else {
                return false
            }
        }
    }

}
</script>

<style scoped>
.appt-details__main {
    position: fixed;
    inset: 10vh 40vw;
    z-index: 10;
    width: 20vw;
    height: fit-content;
    background-color: rgba(0, 0, 0, 0.288);
    border-radius: 20px;
    border: 4px solid rgb(47, 56, 60);
    @media (max-width: 1700px) {
            width: 23vw;
        }
    
        @media (max-width: 1600px) {
            width: 25vw;
        }
    
        @media (max-width: 1480px) {
            width: 27vw;
        }
    
        @media (max-width: 1370px) {
            width: 29vw;
        }
    
        @media (max-width: 1275px) {
            width: 30vw;
        }
}

.cross {
    position: absolute;
    top: 2px;
    right: 5px;
    font-size: 16px;
    color: rgba(249, 247, 232, 1)
}

.dialog-content {
    border-radius: 20px;
}

.dialog-content__header {
    background: rgb(87, 118, 122);
    background: linear-gradient(111deg, rgba(87, 118, 122, 0.75) 20%, rgba(18, 115, 119, 0.74) 77%);
    border-bottom: 4px solid rgb(47, 56, 60);
    padding: 0.3em 0.6em;
    color: rgba(249, 247, 232, 1);
    border-radius: 15px 15px 0 0;
}

h2 {
    font-size: 16px;
}

.dialog-content__body {
    background-color: rgb(224, 235, 231);
    padding: 0.5em 0.8em;
    border-radius: 3px 3px 15px 15px;
}

.dialog-content__body-item {
    display: flex;
    gap: 10px;
    margin-bottom: 1em;
    font-size: 15px;
}

.dialog-content__body-item__item {
    background-color: rgb(243, 245, 237);
    padding: 0.2em 0.4em 0.1em 0.4em;
    border-radius: 20px;
    text-align: center;
    border: 2px solid rgb(47, 56, 60);
    text-transform: capitalize;
    font-size: 14px;
}

.client__item {
    width: 100%;
}

.client__item-header {
    width: 100%;
    display: flex;
    margin-bottom: 0.5em;
}

.client-name__block {
    padding: 0.5em;
    width: 100%;
    text-align: center;
    background-color: rgba(218, 210, 210, 0.466);
    /* border: 2px solid #121212; */
    border-radius: 3px;

    p {
        text-transform: capitalize;
        font-weight: 700;
        font-size: 20px;
        font-style: italic;
        cursor: pointer;
    }

    p:hover {
        -webkit-background-clip: text;
        background-clip: text;
        background-image: linear-gradient(111deg, rgb(132, 178, 184) 20%, rgb(28, 175, 180) 77%);
        -webkit-text-fill-color: #0619208e;
    }

    button {
        margin-top: 0.5em;
        padding: 0 1em;
        font-size: 10px;
        text-transform: uppercase;
        border: 1px solid #580c18;
        border-radius: 3px;
    }
}

.client__item-header__item {
    width: 50%;
    text-align: center;
    padding: 0.7em;
    cursor: pointer;
    font-size: 14px;
    text-transform: capitalize;
}

.client__item-header__item.active {
    font-weight: 700;
    text-transform: uppercase;
    -webkit-box-shadow: inset 0px 0px 19px -4px rgba(0, 0, 0, 0.61);
    box-shadow: inset 0px 0px 12px -4px rgba(0, 0, 0, 0.61);
    font-size: 12px;
    border: 1px solid rgb(47, 56, 60);
    border-radius: 4px;
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
.dialog-content__body-item__content textarea:focus {
    outline: 1px solid black;
    background-color: rgb(248, 248, 246);
}

.dialog-content__body-item__content {
    width: 100%;

    button {
        padding: 0.2em 0.1em;
    }

    button:hover {
        color: #770c1d;
    }
}

.dialog-content__body-item__content__comment {
    padding: 0.5em 0.5em;
    width: 100%;
    background-color: rgba(175, 175, 175, 0.288);
    border-radius: 3px;
    line-height: 1.1em;

    span {
        font-size: 12px;
        color: rgb(71, 63, 63);
        font-style: italic;

    }

    .icon {
        font-size: 20px;
        margin-right: 0.2em;
    }
}



.dialog-content__body-item__content h3 {
    /* margin-bottom: 0.4em; */
    font-size: 14px;
    background-color: rgba(90, 97, 97, 0.24);
    padding: 0.5em 0.3em;
    border-radius: 3px;
    font-weight: 500;
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

.dialog-content__body-item__content textarea {
    background-color: rgb(243, 245, 237);
    width: 100%;
    padding: 0.5em;
    border: 2px solid rgb(47, 56, 60);
    border-radius: 5px;
    transition: all linear 0.1s;
}

.dialog-content__body-item__content textarea.closed {
    height: 0;
    transform: scaleY(0);
    resize: none;
}

.dialog-content__body-item__content textarea.opened {
    height: initial;
    transform: none;
}

.buttons-block {
    display: flex; position: relative;
    gap: 1em;
    justify-content: space-between;
    margin-bottom: 0.5em;
    font-size: 14px;
    button {
        padding: 0.3em 1.5em;
    }
}
</style>