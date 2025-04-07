<template>
    <div class="add-client__main">
        <div class="add-client__content-wrapper elevation-2">
            <div class="add-client__content">
                <div class="add-client__content-item">
                    <div class="add-client__content-item__header">
                        <h4>ФИО</h4>
                    </div>
                    <input type="text" v-model="name" placeholder="Введите ФИО клиента"
                        class="add-client__content-item__input">
                </div>
                <div class="add-client__content-item">
                    <div class="add-client__content-item__header">
                        <h4>Эл. почта</h4>
                    </div>
                    <input type="email" placeholder="Введите email" v-model="email"                       
                        :class="['add-client__content-item__input', !isValidEmail ? 'not-valid' : '']">
                </div>
                <div class="add-client__content-item">
                    <div class="add-client__content-item__header">
                        <h4>Телефон</h4>
                    </div>
                    <input type="phone" placeholder="Формат +79ххххххххх" v-model="phone"
                        @update:model-value="console.log('test')"
                        :class="['add-client__content-item__input', !isValidPhone ? 'not-valid' : '']">
                </div>
                <div class="add-client__content-item">
                    <div class="add-client__content-item__header">
                        <h4>Возраст</h4>
                    </div>
                    <input type="number" placeholder="Возраст" v-model="age"
                        :class="['add-client__content-item__input', !isValidPhone ? 'not-valid' : '']">
                </div>
            </div>
            <div>
                <v-checkbox label="Создать учетную запись пользователя и уведомить по эл. почте" density="compact" v-model="isCreatingUser"
                    :value="true" hide-details></v-checkbox>
            </div>
            <div class="add-client__content-textarea">
                <div class="add-client__content-textarea__header">
                    <h4>Комментарий в досье клиента</h4>
                </div>
                <textarea v-model="clientCommentary"></textarea>
            </div>
            <div class="add-client__content-button">
                <button v-elevation-hover @click="addClientFunc" :disabled="isButtonDisabled"
                    :class="[isButtonDisabled || !this.name ? 'button-disabled' : 'button-accept', 'elevation-2']">Добавить</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex/dist/vuex.cjs.js';
import axios from '../../../axios';
import { mapState } from 'vuex';
export default {
    props: {
        clientName: String
    },
    data() {
        return {
            name: null,
            email: null,
            phone: null,
            age: null,
            clientCommentary: null,
            isCreatingUser: false
        }
    },
    methods: {
        ...mapActions({
            getClients: 'client/getClients'
        }),
        async addNewClientIdToExistingAppts(name, clientID) {
            const data = await axios.post('/appointment/add-id-if-name-exists', {
                name: name,
                clientID: clientID
            })
            console.log(data)
            return data.data
        },
        async addClientFunc() {            
            const {data} = await axios.post('/client/add', {
                name: this.name,
                ...(this.email && { email: this.email }),
                ...(this.phone && { phone: this.phone }),
                ...(this.clientCommentary && { commentary: this.clientCommentary }),
                ...(this.age && { age: this.age })                
            })
            console.log(data)
            if (this.isCreatingUser) {
                const url = this.env === 'development' ? window.location.origin : 'https://neurostudio-tvt.site'
                const { data: user } = await axios.post('/user/add', {
                    email: this.email,
                    role: 'user',
                    url: url
                })
                console.log({addedUser: user})
                const addedUserId = await axios.patch('/client/edit-one-field', {
                    id: data.client._id,
                    field: 'userID',
                    value: user.userData._id
                }) 
                console.log({modifiedClient: addedUserId})
            }
            if (data.client && this.$route.params.clientName) {
                await this.addNewClientIdToExistingAppts(data.client.name, data.client._id)
                this.$router.push('/planning')
            } else { await this.getClients() }
        },
    },
    computed: {
        isValidEmail() {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (emailRegex.test(this.email) || !this.email) {
                return true
            } else { return false }
        },
        isValidPhone() {
            const phoneRegex = /^\+\d{11}$/;
            if (phoneRegex.test(this.phone) || !this.phone) {
                return true
            } else { return false }
        },
        isButtonDisabled() {
            return this.isValidEmail && this.isValidPhone && this.name ? false : true
        },
        ...mapState({
            env: state => state.misc.env
        })
    },
    created() {
        if (this.clientName) {
            this.name = this.clientName
        }
    }
}

</script>

<style scoped>
.add-client__main {
    background-color: #5d758b17;
    min-height: 88vh;
    padding: 1em 0;
}

.add-client__content-wrapper {
    width: 50%;
    margin-left: 3em;
    padding: .5em;
    background-color: rgb(224, 235, 231);
    border-radius: 15px;
    border: 2px solid rgb(47, 56, 60);
    position: relative;
}

.add-client__content {
    display: flex;
    flex-wrap: wrap;
    gap: 2%;
}

.add-client__content-item {
    width: 49%;
}

.add-client__content-item__header,
.add-client__content-textarea__header {
    padding: 0.1em 0.7em;
    h4 {
        font-size: 14px;
        font-weight: 700;
    }
}

.add-client__content-item__input {
    width: 100%;
    display: block;
    border-radius: 20px;
    background-color: rgb(243, 245, 237);
    border: 1px solid rgb(47, 56, 60);
    padding: 0.2em 0.7em; margin-bottom: 0.5em;
    line-height: 0.8em;
    font-size: 14px;
}

.add-client__content-textarea {
    margin-top: 1em; 
    textarea {
        background-color: rgb(243, 245, 237);
        width: 100%;
        padding: 0.5em;
        border: 2px solid rgb(47, 56, 60);
        border-radius: 5px;
    }    
}

.add-client__content-item__input[type="email"].not-valid:focus,
.add-client__content-item__input[type="phone"].not-valid:focus {
    outline: 1px solid rgb(173, 49, 49);
    border-color: rgb(173, 49, 49);
}

.add-client__content-item__input[type="text"]:not(.not-valid):focus,
.add-client__content-item__input[type="email"]:focus,
.add-client__content-item__input[type="phone"]:focus,
.add-client__content-item__input[type="number"]:focus,
.add-client__content-textarea textarea:focus {
    outline: 1px solid black;
    background-color: rgb(248, 248, 246);
}

.add-client__content-button {
    margin: 1em 0;
    button {
        padding: 0.3em 1em;
    }
}


.dialog-content__body-item__content textarea:focus {
    outline: 1px solid black;
    background-color: rgb(248, 248, 246);
}
</style>