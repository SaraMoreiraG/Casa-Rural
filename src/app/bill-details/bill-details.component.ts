import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.css']
})
export class BillDetailsComponent {
  // @Input() bookingData!: Booking;
  bookingData = {
    name: "Paula",
    email: "paulams@gmail.com",
    phone: 698475834,
    guests: 2,
    dateIn: new Date("23/09/2022") ,
    dateOut: new Date("24-08-2029"),
    price: 20
  }
  today = new Date()
  formatToday = this.datePipe.transform(
    this.today,
    'dd-MM-yyyy'
  );
  constructor(
    private datePipe: DatePipe
  ) {
  }
}
