<template>
    <div class="filter-main elevation-2">
        <div class="filter-header">
            <h4>Даты</h4>
        </div>
        <vue-date-picker v-model="dates" locale="ru" @update:model-value="handleDates(dates)" range :clearable="true" auto-apply
            placeholder="Выберите даты" :enable-time-picker="false" :disabled-dates="disabledDates" format="dd/MM/yyyy"></vue-date-picker>
    </div>
</template>

<script>
import { mapMutations } from 'vuex/dist/vuex.cjs.js';
export default {
    props: {
        disabledDates: Array
    },
    data() {
        return {
            dates: []
        }
    },
    methods: {
        ...mapMutations({
            setDates: 'planning/setDatesToShow'
        }),
        handleDates() {
            this.dates ? this.setDates(this.dates) : this.setDates([new Date().toISOString().split('T')[0], new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0]])
        } 
    }
}
</script>

<style scoped>

.filter-main {
    margin-block: 0.3em;
    background-color: #08aeea36;
    background-image: linear-gradient(57deg, #63d5ff83 0%, #0af5ce71 100%);
    padding: 0.5em;
    border: 1px solid rgba(8, 34, 8, 0.116);
    border-radius: 3px;
    button {
        padding: 0.3em 0.6em;
        margin-block: 0.3em;
    }
}

.filter-header {
    padding-block: 0.3em; margin-bottom: 0.3em;
    border-bottom: 2px solid rgba(180, 174, 174, 0.358);
    h4 {
        font-size: 14px;
        font-weight: 700;
        color: rgba(68, 68, 68, 0.801);
        
    }    
}

</style>