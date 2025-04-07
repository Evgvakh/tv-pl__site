<template>
  <div class="main-container">
    <header>
      <Header v-if="!isBlockedHeader"/>
    </header>
    <main>
      <!-- <div><p>{{ userAgent }}</p></div> -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Header from './components/Header.vue';
import { useWebApp } from 'vue-tg';
export default {
  components: {    
    Header
  },
  data() {
    return {
      userAgent: null
    }
  },
  methods: {
    ...mapMutations({
      setEnv: 'misc/setEnv'
    })    
  },
  computed: {
    isBlockedHeader() {
      const segments = this.$route.path.split('/').filter(Boolean)
      return segments.includes('telegram') || segments.includes('reset-password') || segments.includes('no-page')  ? true : false
    },
    ...mapState({
      env: state => state.misc.env      
    })
  },
  created() {
    const tg = useWebApp()
    tg.ready()
    this.userAgent = tg.isActive
    console.log(window.location.origin)
    this.setEnv(import.meta.env.MODE) 
  }
}
</script>

<style scoped>

</style>
