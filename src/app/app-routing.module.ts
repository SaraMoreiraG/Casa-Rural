import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAirbnbComponent } from './views/app-airbnb.component';
import { AppBookingComponent } from './views/app-booking.component';

const routes: Routes = [
  { path: '', component: AppAirbnbComponent },
  { path: 'booking', component: AppBookingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
