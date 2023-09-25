import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Import Angular Material modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScrollService } from './scroll.service';

import { AppAirbnbComponent } from './views/app-airbnb.component';
import { AppBookingComponent } from './views/app-booking.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ServicesComponent } from './services/services.component';
import { BannerComponent } from './banner/banner.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PhotoCardComponent } from './photo-card/photo-card.component';
import { BookingComponent } from './booking/booking.component';
import { PaymentComponent } from './booking/payment/payment.component';
import { InvoiceImgComponent } from './booking/payment/invoice-img/invoice-img.component';

@NgModule({
  declarations: [
    AppComponent,
    AppAirbnbComponent,
    HomeComponent,
    AboutComponent,
    GalleryComponent,
    ActivitiesComponent,
    ServicesComponent,
    BannerComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent,
    NavbarComponent,
    PhotoCardComponent,
    BookingComponent,
    PaymentComponent,
    InvoiceImgComponent,
    AppBookingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatIconModule
  ],
  providers: [ScrollService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
