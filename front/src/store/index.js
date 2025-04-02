import { createStore } from 'vuex'
import { planningModule } from './planning';
import { clientModule } from './client';


export default createStore({
  modules: {
    planning: planningModule,
    client: clientModule    
  }
})