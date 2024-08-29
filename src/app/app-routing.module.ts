import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailComponant } from './pages/detail/detail.component';
import { from } from 'rxjs';
/**
 * Routes configuration for the application.
 * Defines the navigation paths and their associated components.
 * @type {Routes}
 */
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'pays/:id',
    component: DetailComponant,
  },

  {
    path: '**', // wildcard
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
