<template>
    <div class="client-body__items-item elevation-1">
        <div class="client-body__items-head elevation-1">
            <v-icon class="icon" :icon="header_icon"></v-icon>
            <p>{{ header }}</p>
        </div>
        <div class="client-body__items-body">
            <p v-if="!isEdited" :class="[dbField === 'name' ? 'capitalize' : '', dbField === 'name' && value === 'tba' ? 'warning' : '']">{{ value !== 'tba' ? value :
                'Необходимо ввести ФИО ребенка' }} </p>
            <input v-if="isEdited" :type="dbField === 'age' ? 'number' : 'text'" v-model="val"
                @keydown.enter="handleSaveChanges">
            <div class="handling-buttons">
                <button v-if="!isEdited && dbField !== 'email'" @click="handleEditButton">изменить</button>
                <div v-if="isEdited" class="handling-buttons__icons">
                    <v-icon class="icon" @click="handleSaveChanges" icon="mdi-content-save-outline"></v-icon>
                    <v-icon @click="handleEditButton" class="icon" icon="mdi-close"></v-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../../../axios'
export default {
    props: {
        header: String,
        header_icon: String,
        value: String || Number,
        dbField: String,
        clientID: String
    },
    data() {
        return {
            isEdited: false,
            val: null
        }
    },
    methods: {
        handleEditButton() {
            if (this.value !== 'tba') { this.val = this.value }
            this.isEdited = !this.isEdited
        },
        async handleSaveChanges() {
            const data = await axios.patch('/client/edit-one-field', {
                field: this.dbField,
                value: this.val,
                id: this.clientID
            })
            console.log(data)
            this.isEdited = false
            this.$emit('refreshAfterUpdate')
        }
    }
}
</script>

<style scoped>
.client-body__items-item {
    border-bottom: 2px solid rgba(187, 179, 179, 0.719);
    margin-bottom: 0.6em;
    width: 100%;

    .client-body__items-head {
        padding: 0.2em 0.5em;
        display: flex;
        align-items: center;
        background-color: rgba(184, 184, 184, 0.432);

        .icon {
            color: rgba(11, 56, 46, 0.808);
            margin-right: 3px;
            font-size: 18px;
            line-height: 1.5em;
        }

        p {
            padding: 0.3em 0;
            font-size: 14px;
        }
    }

    .client-body__items-body {
        width: 100%;
        padding: 1em 0.5em 0.6em 0.5em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgba(227, 255, 251, 0.753);

        p {
            font-size: 14px;
        }

        p.capitalize {
            text-transform: capitalize;
        }

        p.warning,
        p.capitalize.warning {
            text-transform: uppercase;
            color: rgb(211, 9, 9);
            font-weight: 700;
        }

        input {
            background-color: rgb(255, 255, 233);
            border-radius: 5px;
            padding: 0.2em 0.5em;
            width: 70%;
            border: 1px solid #121212;
            outline: 1px solid transparent;
        }

        input[type='number'] {
            width: 20%;
        }

        input:focus {
            outline: 1px solid black;
        }

        .handling-buttons {
            button {
                font-size: 12px;
                padding: 0.3em 0;
            }

            .handling-buttons__icons {
                display: flex;
                gap: 20px;
                justify-content: space-between;
                color: rgba(15, 73, 59, 0.808);
            }
        }

    }
}
</style>