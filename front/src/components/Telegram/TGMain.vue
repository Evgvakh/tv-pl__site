<template>
    <div class="telegram-main__wrapper">
        <div class="telegram-header">
            <div class="telegram-header__item">
                <h2>Уважаемый клиент!</h2>
                <p>Здесь вы можете записаться на прием в Нейростудию Татьяны Тикуновой&#169.</p>
                <p> Введите ваш email для управления записями (записаться/перенести/отменить). 
                    Уведомление о создании вашей учетной записи будет отправлен на указанный адрес, вам будет необходимо лишь активировать её.
                </p>
            </div>
        </div>
        <div :class="['telegram-email', themeClass]">
            <div :class="['telegram-email__inputs', themeClass]">
                <div class="telegram-email__inputs-item">
                    <input :class="[isValidEmail ? 'alert' : '', 'elevation-1']" type="email"
                        placeholder="Введите email для создания личного кабинета" v-model="email">
                    <div v-if="isValidEmail" class="telegram-email__inputs-item__hint">
                        <p>Неверный формат электронной почты</p>
                    </div>
                </div>
                <div class="telegram-email__inputs-item">
                    <input :class="[isMatchingAlert ? 'alert' : '', 'elevation-1']" type="email"
                        placeholder="Подтвердите email" v-model="emailMatch">
                    <div v-if="isMatchingAlert" class="telegram-email__inputs-item__hint">
                        <p>Адреса электронной почты не совпадают</p>
                    </div>
                </div>
            </div>
            <div :class="['telegram-email__buttons', themeClass]">
                <button v-elevation-hover :disabled="isButtonBlocked"
                    :class="[isButtonBlocked ? 'button-disabled' : 'button-accept elevation-1', 'accept']"
                    @click="sendPassword">Создать личный кабинет</button>
                <p>или</p>
                <button v-elevation-hover class="button-accept accept elevation-1"
                    @click="$router.push('/telegram/login')">Войти в учетую запись</button>
                <button class="reject" @click="$router.push('/telegram/book')">Пропустить*</button>
            </div>
            <div class="hint">
                <p>* - пропустив этот шаг вы не сможете управлять своими записями. В этом случае при необходимости
                    отмены или переноса визита просим вас заблаговременно сообщить нам об этом по
                    <a href="tel: ">телефону</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../../axios';
export default {
    data() {
        return {
            colorScheme: null,
            email: null,
            emailMatch: null
        }
    },
    methods: {
        async sendPassword() {
            try {
                if (this.isMatchingAlert || !this.email) { return }
                const baseUrl = import.meta.env.MODE === 'production'
                    ? 'https://neurostudio-tvt.site'
                    : window.location.origin;
                
                const { data } = await axios.post('/user/add', {
                    email: this.email,
                    role: 'user',
                    url: window.location.origin
                })
                if (data) {
                    const newClient = await axios.post('/client/add', {
                        userID: data.userData._id,
                        name: 'TBA',
                        email: data.userData.email
                    }
                    )
                    console.log(data)
                    console.log(newClient)
                    localStorage.setItem('tvPlanToken', data.token)
                    localStorage.setItem('tvPlanUserID', data.userData._id)
                    localStorage.setItem('tvPlanEmail', data.userData.email)
                    this.$router.push(`/telegram/client/${data.userData._id}`)
                }
            } catch (error) {
                console.log(error.response)
            }
        }
    },
    computed: {
        themeClass() {
            return this.colorScheme === 'dark' ? 'dark-theme' : 'light-theme';
        },
        isMatchingAlert() {
            return this.emailMatch && this.email !== this.emailMatch;
        },
        isValidEmail() {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!emailRegex.test(this.email) && this.email) {
                return true
            } else { return false }
        },
        isButtonBlocked() {
            return !this.email || (this.email && !this.emailMatch) || this.isMatchingAlert
        }
    },
    mounted() {
        if (window.Telegram && window.Telegram.WebApp) {
            this.colorScheme = window.Telegram.WebApp.colorScheme || 'light';
            window.Telegram.WebApp.onEvent('themeChanged', () => {
                this.colorScheme = window.Telegram.WebApp.colorScheme || 'light';
            });
        } else {
            console.error('Telegram WebApp API недоступен.');
        }
        console.log(import.meta.env.MODE)
    }
}
</script>

<style scoped>
.telegram-main__wrapper {
    padding: 1em;
}

.telegram-header {
    margin-bottom: 1em;
}

.telegram-header__item {
    h2 {
        margin-bottom: 1.2em;
    }

    p {
        margin-bottom: 1em;
        text-align: justify;
    }
}

.telegram-email {
    width: 100%;

    .telegram-email__inputs-item {
        width: 90%;
        margin: 0 auto;
        margin-bottom: 1em;

        .telegram-email__inputs-item__hint {
            p {
                text-align: left;
                font-size: 12px;
                color: rgb(173, 49, 49);
            }
        }
    }

    input {
        background-color: rgb(255, 255, 233);
        border-radius: 5px;
        margin-bottom: 0.2em;
        width: 100%;
        padding: 0.5em;
        border: 1px solid #121212;
    }

    input.alert {
        border: 1px solid transparent;
        outline: 1px solid rgba(226, 35, 35, 0.685);
    }

    input.alert:focus {
        border: 1px solid transparent;
        outline: 2px solid rgba(226, 35, 35, 0.685);
    }

    input:focus {
        border: 1px solid transparent;
        outline: 2px solid black;
    }

    .telegram-email__inputs {
        margin: 1em 0 2em 0;
    }
}

.telegram-email.dark-theme {
    input {
        background-color: rgb(255, 255, 233);
    }
}

.telegram-email__buttons {
    p {
        margin-block: 1em;
        text-align: center;
    }

    button {
        display: block;
        width: 70%;
        margin: 0 auto;
        margin-block: 0.3em;
    }

    button.accept {
        padding: 0.5em 1em;
    }

    button.reject {
        width: fit-content;
        margin-block: 2em 1em;
        padding: 0.1em 1em;
        font-size: 12px;
        border: 1px solid rgba(255, 255, 255, 0.616);
        border-radius: 5px;
    }
}

.hint {
    p {
        text-align: left;
        font-size: 10px;
    }

    a {
        text-decoration: underline;
    }
}
</style>