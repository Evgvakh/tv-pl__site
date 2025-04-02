<template>
    <div class="tg-login__main">
        <div class="tg-login__wrapper">
            <div class="tg-login__header">
                <h2>Установить пароль личного кабинета</h2>
            </div>
            <div class="tg-login__body">
                <div class="tg-login__inputs">
                    <div class="tg-login__input">
                        <input type="password" placeholder="Введите пароль"
                            :class="['input-password', isValidPassword ? '' : 'error', 'elevation-1']"
                            v-model="password">
                        <p v-if="!isValidPassword">Введите не менее 6 символов</p>
                    </div>
                    <div class="tg-login__input">
                        <input type="password" placeholder="Подтвердитe пароль"
                            :class="['input-password', isMatchingpasswords ? '' : 'error', 'elevation-1']"
                            v-model="checkPassword">
                        <p v-if="!isMatchingpasswords">Пароли не совпадают</p>
                    </div>
                </div>
                <div class="tg-login__buttons">
                    <button :disabled="isButtonDisabled" v-elevation-hover @click="setPassword"
                        :class="[isButtonDisabled ? 'button-disabled' : 'button-accept elevation-1']">Установить пароль
                    </button>
                </div>
                <div :class="['password-popup', isDone ? 'active' : '']">
                    <p>Пароль изменен! <br> Закройте эту страницу или перейдите в наше <a
                            href="https://t.me/tvt_planning_bot">telegram-приложение</a> для работы с вашей учетной
                        записью. </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../../axios'
export default {
    data() {
        return {
            password: null,
            checkPassword: null,
            isDone: null
        }
    },
    methods: {
        async checkParamsAndAuth() {
            const userID = this.$route.params.id
            const token = this.$route.params.token
            const { data } = await axios.post('/token/create-user/check', {
                id: userID,
                token: token
            })
            console.log(data.isAuthOK)
            return data.isAuthOK
        },
        async setPassword() {
            const userID = this.$route.params.id            
            const isValidUser = await this.checkParamsAndAuth()
            if (isValidUser) {
                const { data } = await axios.patch('/user/change-password', {
                    userID: userID,
                    password: this.password
                })
                console.log(data)
                if (data.modifiedCount) {
                    this.password = this.checkPassword = null
                    this.isDone = true                                   
                }
            }
        }
    },
    computed: {
        isButtonDisabled() {
            return this.password === this.checkPassword && this.password && this.checkPassword && this.isValidPassword ? false : true
        },
        isValidPassword() {
            return this.password && this.password.length < 6 ? false : true
        },
        isMatchingpasswords() {
            return this.checkPassword && this.password !== this.checkPassword ? false : true
        }
    },
    async created() {
        const isCorrectLink = await this.checkParamsAndAuth()
        if (isCorrectLink) {
            return
        } else {
            this.$router.push('/no-page')
        }
    }
}
</script>

<style scoped>
.tg-login__header {
    padding: 1em;
    background-color: rgba(223, 223, 223, 0.158);
}

.tg-login__body {
    padding: 1em;
    position: relative;
}

.tg-login__inputs {
    width: 100%;

    .tg-login__input {
        width: 90%;
        margin: 0 auto;
        margin-block: 1em;
    }

    .input-password {
        background-color: rgb(255, 255, 233);
        border-radius: 5px;
        width: 100%;
        border: 1px solid #121212;
        padding: 0.5em;
    }

    .input-password:focus {
        outline: 1px solid rgb(14, 14, 14);
        background-color: rgb(255, 254, 249);
    }

    .input-password.error:focus {
        outline: 1px solid rgb(204, 37, 37);
        border-color: rgb(204, 37, 37);
        background-color: rgb(255, 254, 249);
    }

    p {
        color: rgb(204, 37, 37);
        font-size: 12px;
        font-style: italic;
        margin-top: 0.1em;
        padding: 0 0.2em;
    }

}

.tg-login__buttons {
    width: 60%;
    margin: 0 auto;
    margin-top: 2em;

    button {
        display: block;
        width: 100%;
        padding: 0.5em 1em;
        margin-bottom: 0.5em;
    }
}

.password-popup {
    position: absolute;
    top: 0; left: 0; z-index: 10;
    width: 100%; height: 100%;
    background-color: rgba(233, 253, 238, 0.96);
    border-radius: 5px;
    border: 2px solid rgba(158, 158, 158, 0.168);
    transform: rotateX(90deg);
    transition: all 0.3s ease ; 
    display: flex; align-items: center; justify-content: center;
    p {
        font-size: 24px;
        text-align: center;
    }   
    a {
        color: blue;
    }
}

.password-popup.active {
    transform: none;
}


</style>