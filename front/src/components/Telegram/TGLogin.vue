<template>
    <div class="tg-login__main">
        <div class="tg-login__wrapper">
            <div class="tg-login__header">
                <h2>Войти в учетную запись</h2>
            </div>
            <div class="tg-login__back">
                <button @click="$router.push('/telegram')"><v-icon class="icon" icon="mdi-arrow-left"></v-icon>На
                    главную</button>
            </div>
            <div :class="['wrong-data elevation-3', isWarning ? 'visible' : '']">
                <div class="wrong-data__header">
                    <v-icon class="icon" icon="mdi-alert-circle-outline"></v-icon>
                    <p>Ошибка</p>
                </div>
                <div class="wrong-data__body">
                    <p>Введены неверные данные</p>
                </div>
            </div>
            <div class="tg-login__body">
                <div :class="['tg-login__inputs']">
                    <input type="email" placeholder="Введите email" v-model="email">
                    <input v-if="!isForgottenPassword" type="password" placeholder="Введите пароль" v-model="password">
                </div>
                <div class="tg-login__buttons">
                    <button v-elevation-hover @click="hanldeClick" class="button-accept elevation-1">{{
                        isForgottenPassword ? 'Сбросить пароль' : 'Войти' }}</button>
                    <button class="button-forgot-password" @click="isForgottenPassword = !isForgottenPassword">{{
                        !isForgottenPassword ? 'забыли пароль?' : 'я помню пароль!' }}</button>
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
            isForgottenPassword: false,
            email: null,
            password: null,
            isWarning: false
        }
    },
    methods: {
        async hanldeClick() {
            if (this.isForgottenPassword) {
                const { data } = await axios.post('/user/send-reset-password-link', {
                    email: this.email,
                    url: window.location.origin
                })
                if (data.message) {
                    this.$router.push('/telegram/login')
                }
            } else {
                try {
                    const { data } = await axios.post('/user/login', {
                        email: this.email,
                        password: this.password
                    })
                    if (data.user) {
                        console.log(data.user)
                        localStorage.setItem('tvPlanToken', data.token)
                        localStorage.setItem('tvPlanUserID', data.user.id)
                        this.$router.push(`/telegram/client/${data.user.id}`)
                    }
                } catch (err) {
                    console.log(err.response);
                    this.isWarning = true
                    const timeout = setTimeout(() => {
                        this.isWarning = false
                    }, 2000)
                }
            }
        }
    }
}
</script>

<style scoped>
.wrong-data {
    position: fixed;
    top: 50%;
    left: 3%;
    z-index: 10;
    width: 94%;
    margin: 0 auto;
    border-radius: 2px;
    background-color: rgba(255, 0, 0, 0.377);

    .wrong-data__header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0.3em 0.6em;
        border-bottom: 2px solid white;

        .icon {
            font-size: 22px;
            margin-right: 0.3em;
            color: white;
        }

        p {
            font-size: 14px;
            color: white;
        }
    }

    .wrong-data__body {
        padding: 0.6em;

        p {
            font-size: 14px;
            color: white;
            font-weight: 700;
        }
    }
    opacity: 0;
    height: 0;
    transition: all 0.5s ease;
}

.wrong-data.visible {
    height: auto;
    opacity: 1;
}
.tg-login__header {
    padding: 1em;
    background-color: rgba(223, 223, 223, 0.158);
}

.tg-login__back {
    padding: 1em;

    button {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 0.2em 0;
        font-size: 14px;

        .icon {
            font-size: 12px;
            transform: translateX(6px);
            transition: all 0.3s ease;
        }
    }

    button:hover {
        .icon {
            transform: translateX(0);
        }
    }
}

.tg-login__body {
    padding: 1em;
}

.tg-login__inputs {
    width: 100%;
    text-align: center;

    input {
        background-color: rgb(255, 255, 233);
        border-radius: 5px;
        padding: 0.5em;
        width: 90%;
        margin-block: 1em;
        border: 1px solid #121212;
    }

    input:focus {
        outline: 1px solid black;
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

    .button-forgot-password {
        padding: 0.3em;
        margin-top: 3em;
        text-decoration: underline;
        text-transform: uppercase;
        font-style: italic;
        font-size: 10px;
    }
}
</style>