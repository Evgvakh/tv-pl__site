<template>
    <div class="change-pass__main">
        <div class="change-pass__wrapper">
            <div class="change-pass__head elevation-1">
                <p>Изменить пароль</p>
                <v-icon class="icon" :icon="`mdi-chevron-${chevron ? 'up' : 'down'}`" @click="handleOpenBody"></v-icon>
            </div>
            <div class="change-pass__items">
                <div class="change-pass__items-inputs">
                    <div class="change-pass__items-inputs__input-block">
                        <div class="change-pass__items-inputs__input">
                            <input type="password" v-model="password" placeholder="Введите новый пароль">
                            <v-icon class="icon" icon="mdi-eye-outline" @click="changeInputType"></v-icon>
                        </div>
                        <p class="hint" v-if="!isValidPassword">Минимум 6 символов</p>
                    </div>
                    <div class="change-pass__items-inputs__input-block">
                        <div class="change-pass__items-inputs__input">
                            <input type="password" v-model="confirmPassword" placeholder="Подтвердите пароль">
                            <v-icon class="icon" icon="mdi-eye-outline" @click="changeInputType"></v-icon>
                        </div>
                        <p class="hint" v-if="!isMatchingPassword">Пароли не совпадают</p>
                    </div>
                </div>
                <div class="change-pass__items-buttons">
                    <button v-elevation-hover :disabled="isButtonDisabled && !isValidPassword" @click="handleResetPassword"
                        :class="[!isButtonDisabled && isValidPassword ? 'button-reject elevation-1' : 'button-disabled']">
                        Сменить пароль
                    </button>
                </div>
                <div class="change-pass__items-confirmation">
                    <p>Пароль изменен</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../../../axios.js'
export default {
    props: {
        client: Object,
        user: Object
    },
    data() {
        return {
            password: null,
            confirmPassword: null,
            chevron: false
        }
    },
    methods: {
        changeInputType(e) {
            const input = e.target.previousElementSibling
            input.getAttribute('type') === 'text' ? input.setAttribute('type', 'password') : input.setAttribute('type', 'text')
        },
        handleOpenBody() {
            document.querySelector('.change-pass__items').classList.toggle('opened')
            this.chevron = !this.chevron
        },
        async handleResetPassword() {
            const { data } = await axios.patch('/user/change-password', {
                password: this.password,
                userID: this.user._id
            })
            if (data.modifiedCount > 0) {
                document.querySelector('.change-pass__items-confirmation').classList.toggle('visible')
                this.password = this.confirmPassword = null
                const timer = setTimeout(() => {
                    document.querySelector('.change-pass__items-confirmation').classList.toggle('visible')
                }, 1500)
                const timer2 = setTimeout(() => {
                    document.querySelector('.change-pass__items').classList.toggle('opened')
                    this.chevron = !this.chevron
                }, 1900)
            }
        }
    },
    computed: {
        isButtonDisabled() {
            return this.password && this.confirmPassword && this.confirmPassword === this.password ? false : true
        },
        isValidPassword() {
            return this.password && this.password.length >= 6 ? true : false
        },
        isMatchingPassword() {
            return this.confirmPassword && this.confirmPassword !== this.password ? false : true
        }
    }
}
</script>

<style scoped>
.change-pass__head {
    padding: 0.5em 0.5em 0.3em 0.5em;
    background-color: rgba(184, 184, 184, 0.432);
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
        font-weight: 700;
    }

    .icon {
        font-size: 26px;
    }
}

.change-pass__items {
    background-color: rgba(199, 199, 199, 0.125);
    margin-bottom: 0.5em;

    .change-pass__items-inputs {
        display: flex;
        gap: 5%;
        width: 100%;

        input {
            background-color: rgb(255, 255, 233);
            text-align: center;
            width: 100%;
            border-radius: 10px;
            padding: 0.2em 0.7em;
            line-height: 0.9em;
            border: 1px solid #121212;
            font-size: 14px;
        }

        .change-pass__items-inputs__input-block {
            width: 47.5%;

            .change-pass__items-inputs__input {
                position: relative;

                .icon {
                    position: absolute;
                    top: 15.5%;
                    right: 4%;
                    font-size: 18px;
                    color: #5e5e5ecc;
                    cursor: pointer;
                }
            }

            .hint {
                padding: 0.1em 0.7em;
                font-size: 12px;
                color: rgb(173, 49, 49);
            }
        }
    }

    .change-pass__items-buttons {
        font-size: 10px;
        margin-top: 1em;

        button {
            padding: 0.6em 1em 0.3em 1em;
            text-transform: uppercase;
            display: block;
            margin: 0 auto;
            width: 50%;
        }
    }

    height: 0px;
    opacity: 0;
    overflow-y: hidden;
    transform-origin: top;
    transform: scaleY(0);
    transition: all 0.3s ease;

    .change-pass__items-confirmation {
        opacity: 0;
    }
}

.change-pass__items.opened {
    height: auto;
    opacity: 1;
    position: relative;
    transform: scale(1);
    padding: 0.7em 0.5em 1em 0.5em;

    .change-pass__items-confirmation {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 50;
        width: 100%;
        height: 100%;
        background-color: rgba(214, 255, 227, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 3px solid rgba(241, 203, 203, 0.466);
        border-radius: 5px;
        p {
            font-weight: 700;
            text-transform: uppercase;
        }
        transform-origin: center center;
        transform: rotateX(90deg);
        transition: all 0.4s ease;
    }

    .change-pass__items-confirmation.visible {
        transform: none;
        opacity: 1;
    }
}


input::placeholder {
    font-size: 12px;
    text-align: left;
}
</style>