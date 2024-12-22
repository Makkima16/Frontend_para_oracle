import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AuthGuard } from '../../guards/auth.guard';

//Rutas para ir hacia las diferentes partes de la Pagina
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },

    {
        path : 'clients', 
        loadChildren:() => import('../../pages/clients/clients.module').then(m=>m.ClientsModule)
    },

    {
        path : 'payments',
        loadChildren:() => import('../../pages/payment/payment.module').then(m=>m.PaymentModule)
    },

    {
        path: 'equipos',
        loadChildren: () => import('../../pages/equipos/equipos.module').then(m => m.EquiposModule)
      },

      {
        path: 'partidos',
        loadChildren: () => import('../../pages/partidos/partidos.module').then(m => m.PartidosModule)
      },

      {
        path: 'transacciones',
        loadChildren: () => import('../../pages/recargar/recargar.module').then(m => m.RecargarModule)
      },
      {
        path: 'pagar',
        loadChildren: () => import('../../pages/pagos/pagos.module').then(m => m.PagosModule)
      },
      {
        path: 'apuesta',
        loadChildren: () => import('../../pages/apuestas/apuestas.module').then(m => m.ApuestasModule)
      } 



    
    





    



    



];
