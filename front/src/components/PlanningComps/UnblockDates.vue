<template>
    <div class="filter-main elevation-2">
        <div class="filter-header">
            <h4>Разблокировать дату(ы)</h4>
        </div>
        <vue-date-picker v-model="dates" locale="ru" multi-dates
            :clearable="true" placeholder="Выберите дату(ы)" :enable-time-picker="false"
            :allowed-dates="disabledDates" format="dd/MM/yyyy"></vue-date-picker>
        <button v-elevation-hover @click="unblockDates" :class="['elevation-1', isButtonDisabled ? 'button-disabled' : 'button-accept']">Разблокировать</button>
    </div>
</template>

<script>
import { mapActions } from 'vuex/dist/vuex.cjs.js';
import axios from '../../../axios'
export default {
    props: {
        disabledDates: Array
    },
    data() {
        return {
            dates: null
        }
    },
    methods: { 
        ...mapActions({
            getBlockedDates: 'planning/getBlockedDates',
            getApptsOnBlockedDates: 'planning/getApptsOnBlockedDates'
        }),      
        async unblockDates() {
            if (this.isButtonDisabled) {return}
            const data = await axios.post('/dates/unblock-dates', {
                dates: this.dates
            })
            await this.getBlockedDates()
            await this.getApptsOnBlockedDates()
            this.dates = null
            console.log(data)
        },        
    },
    computed: {
        isButtonDisabled() {
            return this.dates ? false : true
        }
    }
}
</script>

<style scoped>
.filter-main {
    margin-block: 0.5em;
    background-color: rgba(177, 249, 255, 0.548); 
    padding: 0.3em;
    border: 1px solid rgba(8, 34, 8, 0.116);
    border-radius: 3px;
    button {
        padding: 0.5em 0.8em;
        margin-top: 0.4em;
        font-size: 10px;
        text-transform: uppercase;
        line-height: 0.8em;
    }
}

.filter-header {
    padding-block: 0.3em; margin-bottom: 0.3em;
    border-bottom: 2px solid rgba(180, 174, 174, 0.358);
    h4 {
        font-size: 14px;
        font-weight: 700;
        color: rgba(12, 12, 12, 0.664);
    }    
}
</style>