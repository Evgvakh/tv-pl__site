<template>
    <div v-if="true" class="dialog-content__body-item__content">
        <h3 class="elevation-1">
            <v-icon class="icon" :icon="type === 'age' ? 'mdi-calendar-account-outline' :
                type === 'phone' ? 'mdi-phone-classic' :
                    type === 'email' ? 'mdi-email' : ''">
            </v-icon>
            {{ getHeader }}
        </h3>
        <div v-if="!field.isEdited" class="dialog-content__body-item__content-sub">
            <p>{{ client[type] }} {{ type === 'age' && correctAgeGrammar ? correctAgeGrammar : '' }} </p>
            <v-icon class="icon" icon="mdi-pencil" @click.stop="handleEditField(client[type])"></v-icon>
        </div>
        <div v-if="field.isEdited" class="dialog-content__body-item__content-sub__edit">
            <input :type="type === 'age' ? 'number' : type === 'email' ? 'email' : type === 'phone' ? 'phone' : 'text'"
                v-model="field.value">
            <v-icon class="icon" icon="mdi-content-save" @click="handleSaveEditField()"></v-icon>
        </div>
    </div>
</template>

<script>
import axios from '../../../../axios.js'
import { mapActions } from 'vuex';
export default {
    props: {
        client: Object,
        type: String
    },
    data() {
        return {
            field: {
                isEdited: false,
                value: null
            },
            fieldNames: {
                age: 'Возраст',
                phone: 'Телефон',
                email: 'Эл. почта'
            }
        }
    },
    methods: {
        ...mapActions({
            getClients: 'client/getClients'
        }),
        handleEditField(value) {
            this.field.isEdited = !this.field.isEdited
            this.field.value = value
        },
        async handleSaveEditField() {
            const data = await axios.patch('/client/edit-one-field', {
                id: this.client._id,
                value: this.field.value,
                field: this.type
            })
            if (data.data.message) {
                this.field.isEdited = false
                await this.getClients()
            }
        }
    },
    computed: {
        correctAgeGrammar() {
            if (this.client && this.client.age) {
                let lastDigit = this.client.age.toString().split('')
                if (lastDigit[lastDigit.length - 1] === '5' || lastDigit[lastDigit.length - 1] === '6' || lastDigit[lastDigit.length - 1] === '7' || lastDigit[lastDigit.length - 1] === '8' || lastDigit[lastDigit.length - 1] === '9' || lastDigit[lastDigit.length - 1] === '0') {
                    return 'лет'
                } else {
                    return 'года'
                }
            } else {
                return false
            }
        },
        getHeader() {
            return this.fieldNames[this.type]
        }
    }
}
</script>

<style scoped>
.dialog-content__body-item__content {
    width: 100%;
    h3 {
        font-size: 14px;
        border-radius: 3px;
        font-weight: 500;
        display: flex;
        align-items: center;
        padding: 0.4em;
        background-color: rgba(90, 97, 97, 0.24);
        .icon {
            color: rgba(18, 115, 119, 1);
            margin-right: 0.3em;
        }
    }
}

.dialog-content__body-item__content .dialog-content__body-item__content-sub,
.dialog-content__body-item__content-sub__edit {
    display: flex;
    align-items: center;
    background-color: rgba(175, 175, 175, 0.288);
    padding: 0.5em 0.8em 0.4em 0.2em;
    .icon {
        font-size: 18px;        
        cursor: pointer;
    }
}

.dialog-content__body-item__content-sub {
    .icon {
        margin-left: auto;
    }
}

.dialog-content__body-item__content-sub__edit {
    .icon {
        margin-left: 10px;
    }

    input {
        width: 40%;
        padding: 0.1em 0.5em;
        background-color: rgb(228, 228, 228);
        border: 1px solid #9b9b9b;
        border-radius: 10px;
    }

    input[type="number"] {
        width: 10%;
    }

    input:focus {
        outline: 1px solid #121212;
    }
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
</style>