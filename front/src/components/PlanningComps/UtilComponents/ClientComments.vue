<template>
    <div class="dialog-content__body-item__content">
        <h3 class="elevation-1">Комментарии из досье клиента:</h3>
        <p v-for="comment in client.commentaries" class="dialog-content__body-item__content__comment"><v-icon
                class="icon" icon="mdi-fountain-pen"></v-icon>
            <span>{{ formatDateDDMMYY(comment.createdAt) }}</span> <br> {{ comment.text }}
        </p>
        <div @click="isClientCommentTextOpened = !isClientCommentTextOpened"
            class="dialog-content__body-item__content__icon-block d-flex align-center">
            <v-icon class="icon"
                :icon="isClientCommentTextOpened ? 'mdi-minus-circle-outline' : 'mdi-plus-circle-outline'"></v-icon>
            <p>{{ isClientCommentTextOpened ? 'Закрыть' : 'Добавить комментарий' }} </p>
        </div>
        <textarea name="" id="" :class="['elevation-3', isClientCommentTextOpened ? 'opened' : 'closed']"
            v-model="clientCommentText"></textarea>
        <button class="button" v-if="isClientCommentTextOpened && clientCommentText"
            @click.prevent="addClientCommentary">Добавить</button>
    </div>
</template>

<script>
import { formatDateDDMMYY } from '../../../funcs/formatDateDDMMYY';
import axios from '../../../../axios';
import { mapActions } from 'vuex';
export default {
    props: {
        client: Object
    },
    data() {
        return {
            clientCommentText: '',
            isClientCommentTextOpened: false
        }
    },
    methods: {
        formatDateDDMMYY,
        ...mapActions({
            getClients: 'client/getClients'
        }),
        async addClientCommentary() {
            const data = await axios.patch('/client/add-comment', {
                clientID: this.client._id,
                text: this.clientCommentText
            })
            if (data.data) {
                console.log(data)
                this.clientCommentText = ''
                await this.getClients()
            }
        }
    }
}
</script>

<style scoped>
.dialog-content__body-item__content {
    width: 100%;
    .button {
        margin-bottom: 0.3em;
    }
    h3 {
        font-size: 14px;
        border-radius: 3px;
        font-weight: 500;
        display: flex;
        align-items: center;
        padding: 0.4em;
        background-color: rgba(90, 97, 97, 0.24);
    }
}

.dialog-content__body-item__content textarea:focus {
    outline: 1px solid black;
    background-color: rgb(248, 248, 246);
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

.dialog-content__body-item__content__comment {
    padding: 0.5em 0.5em;
    width: 100%;
    background-color: rgba(175, 175, 175, 0.288);
    border-radius: 3px;

    span {
        font-size: 12px;
        color: rgb(71, 63, 63);
        font-style: italic;
    }

    .icon {
        font-size: 18px;
        margin-right: 0.2em;
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