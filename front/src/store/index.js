import { createStore } from 'vuex'
import { planningModule } from './planning';
import { clientModule } from './client';
import { miscModule } from './misc';


export default createStore({
  modules: {
    planning: planningModule,
    client: clientModule,
    misc: miscModule
  }
})