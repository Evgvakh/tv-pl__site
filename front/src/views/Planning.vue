<template>
    <div class="planning__main-container" v-if="!isLoading">
        <aside class="planning__menu-main elevation-2">
            <div class="planning__menu-main__container">
                <DateFilter :disabledDates="formatDisabledDates" />
                <BlockDates :disabledDates="formatDisabledDates" />
                <UnblockDates :disabledDates="formatDisabledDates" />
                <Warnings @resceduleWarning="handleResceduleWarning" />
            </div>
        </aside>
        <div class="planning__table-main elevation-3" v-if="!isLoading"
            :aria-hidden="isDialogOpened || isApptDetailsOpened ? 'true' : 'false'">
            <div class="table ">
                <div class="table-row planning__table-header_row">
                    <div class="header-cell__header cell"></div>
                    <div class="header-cell cell" v-for="date in datesRange" :id="`${date}_header_cell`"
                        :key="`${date}_header_cell`">
                        <p class="pt-serif-regular">{{ formatDateDDMMYY(date) }}</p>
                        <p class="pt-serif-regular">{{ getDayOfWeekIntl(date) }}</p>
                    </div>
                </div>
                <div class="table-row visits-row" v-for="time in times">
                    <div class="visit-cell__header cell">
                        <p>{{ time }}</p>
                    </div>
                    <div class="visit-cell cell" v-for="date in datesRange" :id="`${date}_${time}_visit_cell`"
                        :key="`${date}_${time}_visit_cell`">
                        <div style="width: 100%; height: 100%">
                            <Cell :time="time" :date="date" @openDialog="handleOpenDialog"
                                @openApptDetails="handleOpenApptDetails" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Transition name="fade">
            <AddApptDialog :time="apptTime" :date="apptDate" class="dialog-main" v-if="isDialogOpened"
                @closeDialog="handleCloseDialog" />
        </Transition>
        <Transition name="fade">
            <AppointmentDetailsDialog v-if="isApptDetailsOpened"
                @closeApptDetails="isApptDetailsOpened = false; isRescheduleWindowsWindowOpened = false; isClientDetailsWindowOpened = false"
                :apptID="apptID" @openClientDetails="handleOpenClientDetails"
                @openRescheduleWindow="handleOpenRescheduleWindow" />
        </Transition>
        <Transition name="fade">
            <ClientDetails v-if="isClientDetailsWindowOpened" :clientID="clientID"
                @closeClientDetails="isClientDetailsWindowOpened = false" />
        </Transition>
        <Transition name="fade">
            <RescheduleWindow v-if="isRescheduleWindowsWindowOpened" :clientID="clientID" :apptID="apptID"
                :initialDate="apptToRescheduleDate" :disabledDates="formatDisabledDates"
                @closeRescheduleWindow="isRescheduleWindowsWindowOpened = false"
                @closeRescheduleWindowSuccess="handleRefreshAfterRescheduling" />
        </Transition>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Cell from '../components/PlanningComps/Cell.vue';
import AddApptDialog from '../components/PlanningComps/AddApptDialog.vue';
import { formatDateDDMMYY } from '../funcs/formatDateDDMMYY';
import { getDayOfWeekIntl } from '../funcs/getDayFromDate';
import AppointmentDetailsDialog from '../components/PlanningComps/AppointmentDetailsDialog.vue';
import ClientDetails from '../components/PlanningComps/ClientDetails.vue';
import DateFilter from '../components/PlanningComps/DateFilter.vue';
import RescheduleWindow from '../components/PlanningComps/RescheduleWindow.vue';
import BlockDates from '../components/PlanningComps/BlockDates.vue';
import UnblockDates from '../components/PlanningComps/UnblockDates.vue';
import Warnings from '../components/PlanningComps/Warnings.vue';
export default {
    emits: ['handleCloseDialog', 'handleOpenDialog', 'handleOpenApptDetails', 'handleOpenRescheduleWindow', 'closeRescheduleWindowSuccess'],
    components: {
        Cell,
        AddApptDialog,
        AppointmentDetailsDialog,
        ClientDetails,
        DateFilter,
        RescheduleWindow,
        BlockDates,
        UnblockDates,
        Warnings
    },
    data() {
        return {
            isDialogOpened: false,
            apptTime: null,
            apptDate: null,
            apptID: null,
            isApptDetailsOpened: false,
            isClientDetailsWindowOpened: false,
            clientID: null,
            isRescheduleWindowsWindowOpened: false,
            apptToRescheduleDate: null,
            isLoading: false
        }
    },
    methods: {
        ...mapActions({
            getAppts: 'planning/getAppts',
            getClients: 'client/getClients',
            getBlockedDates: 'planning/getBlockedDates',
            getApptsOnBlockedDates: 'planning/getApptsOnBlockedDates'
        }),
        formatDateDDMMYY, getDayOfWeekIntl,
        handleCloseDialog() {
            this.isDialogOpened = false
            this.apptDate = null,
            this.apptTime = null
        },
        handleOpenDialog(time, date) {
            this.apptTime = time
            this.apptDate = date
            this.isDialogOpened = true
        },
        handleOpenApptDetails(id) {
            this.isApptDetailsOpened = true
            this.apptID = id

        },
        handleOpenClientDetails(clientID) {
            this.isClientDetailsWindowOpened = true
            this.clientID = clientID;
        },
        handleOpenRescheduleWindow(date) {
            this.isRescheduleWindowsWindowOpened = true
            this.apptToRescheduleDate = date
        },
        async handleRefreshAfterRescheduling(id) {
            this.isClientDetailsWindowOpened = false
            this.isApptDetailsOpened = false
            await this.getAppts()
            await this.getClients()
            this.isRescheduleWindowsWindowOpened = false
            this.handleOpenApptDetails(id)
        },
        async handleResceduleWarning(appt) {
            console.log(appt)
            this.handleOpenRescheduleWindow(appt.date)
            this.handleOpenApptDetails(appt._id)

        }

    },
    computed: {
        ...mapState({
            dates: state => state.planning.datesToShow,
            times: state => state.planning.times,
            blockedDates: state => state.planning.blockedDates
        }),
        datesRange() {
            let currentDate = new Date(this.dates[0]);
            currentDate.setHours(12, 0, 0, 0); 
            const endDate = new Date(this.dates[1]);
            endDate.setHours(12, 0, 0, 0); 

            const datesArray = [];

            while (currentDate <= endDate) {
                datesArray.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return datesArray;
        },
        formatDisabledDates() {
            const formatedDates = this.blockedDates.map(date => new Date(date))
            return formatedDates
        }

    },
    async created() {
        this.isLoading = true
        await this.getAppts()
        await this.getClients()
        await this.getBlockedDates()
        await this.getApptsOnBlockedDates()
        this.isLoading = false
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s linear;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0);
}

[aria-hidden="true"] {
    pointer-events: none;
    opacity: 0.6;
}

.planning__main-container {
    position: relative;
    display: flex;
    gap: 5px;
    max-height: 94vh;
    min-height: 94vh;
    padding: 0.2em;
    background-color: #5d758b21;
    overflow-y: auto;
}

.planning__menu-main {
    width: 17vw;
    padding: 0.4em;
    background-color: rgba(218, 253, 227, 0.641);
    border-radius: 10px;
    border: 2px solid rgba(46, 27, 116, 0.199);
    height: 90vh;

    @media (max-width: 1700px) {
        width: 19vw;
    }

    @media (max-width: 1600px) {
        width: 20vw;
    }

    @media (max-width: 1400px) {
        width: 21vw;
    }

    @media (max-width: 1270px) {
        width: 23vw;
    }
}

.planning__menu-main__container {
    max-height: 100%;
}

.planning__table-main {
    width: fit-content;
    max-width: 83vw;
    overflow: auto;
    display: flex;
    border-radius: 10px;
    border: 2px solid rgba(46, 27, 116, 0.199);

    @media (max-width: 1700px) {
        width: 80vw;
    }

    @media (max-width: 1600px) {
        width: 79vw;
    }

    @media (max-width: 1400px) {
        width: 78vw;
    }

    @media (max-width: 1270px) {
        width: 75vw;
    }
}

.planning__menu-main,
.planning__table-main {
    height: 90vh;
}

.table {
    height: 87.6vh;
}

.table-row {
    display: flex;
}

.planning__table-header_row {
    position: sticky;
    top: 0;
    z-index: 30;
}

.table-row .visit-cell__header,
.table-row .header-cell__header {
    min-width: 4vw;
    max-width: 4vw;
    text-align: center;

    /* @media (max-width: 1700px) {
        min-width: 6vw;
        max-width: 6vw;
    } */

    @media (max-width: 1600px) {
        min-width: 5vw;
        max-width: 5vw;
    }

    @media (max-width: 1270px) {
        min-width: 6vw;
        max-width: 6vw;
    }
}

.visit-cell__header.cell {
    position: sticky;
    left: 0;
    z-index: 30;
    /* background-color: rgba(231, 242, 253, 0.829); */
    background: linear-gradient(90deg,
            rgb(231, 231, 231) 0%,
            rgb(247, 247, 247) 10%,
            rgb(255, 255, 255) 50%,
            rgb(241, 241, 241) 80%,
            rgb(233, 233, 233) 100%);

    p {
        color: rgb(63, 63, 63);
        font-size: 11px;
    }
}

.cell {
    min-width: 5vw;
    max-width: 5vw;
    border: 2px solid rgba(187, 178, 178, 0.22);

    @media (max-width: 1700px) {
        min-width: 5.5vw;
        max-width: 5.5vw;
    }

    @media (max-width: 1600px) {
        min-width: 6vw;
        max-width: 6vw;
    }

    @media (max-width: 1450px) {
        min-width: 7vw;
        max-width: 7vw;
    }
}

.cell p {
    font-size: 14px;
}

.header-cell {
    text-align: center;
    padding: 0.3em;
    background: linear-gradient(90deg,
            rgba(198, 233, 207, 0.641) 0%,
            rgba(208, 243, 217, 0.641) 20%,
            rgba(218, 253, 227, 0.741) 50%,
            rgba(208, 243, 217, 0.641) 80%,
            rgba(198, 233, 207, 0.641) 100%);

}

.header-cell p {
    text-transform: capitalize;
    color: #4e4e4ede;
    font-size: 11px;
}

.header-cell p:nth-of-type(1) {
    font-size: 14px;
    color: #111111e8;
    font-weight: 700;
}

.visits-row {
    height: 3.6vh;
}

.visits-row:nth-of-type(even)>.cell:not(.visit-cell__header) {
    background-color: rgba(170, 166, 166, 0.275);
}

.dialog-main {
    position: fixed;
    top: 7%;
    left: 35%;
    width: 22%;
    height: fit-content;
    border-radius: 20px;

    @media (max-width: 1700px) {
        width: 26%;
    }

    @media (max-width: 1600px) {
        width: 27%;
    }

    @media (max-width: 1460px) {
        width: 29%;
    }

    @media (max-width: 1360px) {
        width: 31%;
    }

    @media (max-width: 1270px) {
        width: 33%;
    }
}
</style>