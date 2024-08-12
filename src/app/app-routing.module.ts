import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailComponant } from './pages/detail/detail.component'
import { from } from 'rxjs';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, 
    
  },
  {
    path: 'pays/:country',
    component: DetailComponant
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
