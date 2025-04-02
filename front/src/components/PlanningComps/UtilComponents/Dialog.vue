<template>
    <div :class="['reschedule__confirmation-dialog', 'elevation-4', isOpened ? 'dialog-enabled' : 'dialog-disabled']"
        :style="position">
        <div class="reschedule__confirmation-dialog__header">
            <p>{{ header }}?</p>
        </div>
        <div class="reschedule__confirmation-dialog__button-block">
            <button v-elevation-hover class="button-accept elevation-1" @click="handleAction">Да</button>
            <button v-elevation-hover class="button-reject elevation-1" @click="handleCloseDialog">Нет</button>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        state: Boolean,
        parentId: String,
        header: String,
        position: Object
    },
    methods: {
        handleAction() {
            this.$emit('handleAction')
        }, 
        handleCloseDialog() {
            this.$emit('closeDialog')
        }
    },
    computed: {
        isOpened() {
            return this.state
        }
    },    
    watch: {
        state(newVal) {
            this.parentId ? newVal ? document.getElementById(this.parentId).classList.add('blocked') : document.getElementById(this.parentId).classList.remove('blocked') : false
        }
    }
}
</script>

<style scoped>
.reschedule__confirmation-dialog {
    z-index: 60;
    position: absolute;
    min-width: 9vw;
    padding: 0.6em;
    text-align: center;
    background-color: rgba(247, 247, 247, 0.99);
    border-radius: 3px;
    transition: all 0.2s ease;

    p {
        padding: 0.2em;
        font-size: 15px;
        margin-bottom: 0.3em;
    }

    button {
        display: block;
        width: 35%;
    }
}

.reschedule__confirmation-dialog::after {
    position: absolute;
    content: '\25B2';
    top: -13%;
    left: 29%;
    color: rgba(247, 247, 247, 0.99);
}

.reschedule__confirmation-dialog__button-block {
    display: flex;
    gap: 1em;
    justify-content: center;

    button {
        padding: 0.2em 0.4em;
    }
}

.reschedule__confirmation-dialog.dialog-enabled {
    transform: none;
}

.reschedule__confirmation-dialog.dialog-disabled {
    /* transform: scale(0); */
    transform: scale(0, 0);
    transform-origin: top;
}
</style>