import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

export interface Booking {
  name: string;
  email: string;
  phone: string;
  guests: number;
  dateIn: Date;
  dateOut: Date;
}

@Component({
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  bookingForm: FormGroup;
  bookedDates: any[] = [];
  nights: number = 0;
  roomPrice: number = 0;
  totalRoom: number = 0;
  totalPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      guests: ['', [Validators.required, Validators.max(4)]],
      dateIn: [null, Validators.required],
      dateOut: [null, Validators.required],
    });

    // Fetch booked dates from the server
    this.fetchBookedDates();
  }

  // Declare a subscription variable to handle the subscription
  private bookedDatesSubscription: Subscription | undefined;

  // Fetch booked dates from the server
  fetchBookedDates() {
    const backendUrl = 'http://localhost:3000/bookings/get-all-booked-dates';

    // Unsubscribe from any previous subscriptions to avoid memory leaks
    if (this.bookedDatesSubscription) {
      this.bookedDatesSubscription.unsubscribe();
    }

    this.bookedDatesSubscription = this.http.get<any[]>(backendUrl).subscribe(
      (response: any[]) => {
        this.bookedDates = response;
      },
      (error) => {
        console.error('Error fetching booked dates:', error);
      }
    );
  }

  // Ensure to unsubscribe when the component is destroyed
  ngOnDestroy() {
    if (this.bookedDatesSubscription) {
      this.bookedDatesSubscription.unsubscribe();
    }
  }

  // Filter function for the start date
  startDateFilter = (d: Date | null): boolean => {
    const currentDate = new Date();
    // Prevent selecting dates before the current date
    return d !== null && d >= currentDate && !this.isDateInBookedRange(d);
  };

  // Filter function for the end date
  endDateFilter = (d: Date | null): boolean => {
    const currentDate = new Date();
    const startDateValue = this.bookingForm.get('dateIn')?.value;

    // Prevent selecting dates before the current date and before the start date
    // Also, prevent selecting dates within booked date ranges
    return (
      d !== null &&
      d >= currentDate &&
      startDateValue !== null &&
      d >= startDateValue &&
      !this.isDateInBookedRange(d)
    );
  };

  // Function to check if a date is within a booked date range
  isDateInBookedRange(date: Date): boolean {
    for (const bookedDateRange of this.bookedDates) {
      const startDate = new Date(bookedDateRange.startDate);
      const endDate = new Date(bookedDateRange.endDate);
      if (date >= startDate && date <= endDate) {
        return true;
      }
    }
    return false;
  }

  // Function to calculate the number of nights
  calculatePrice() {
    const startDateValue = this.bookingForm.get('dateIn')?.value;
    const endDateValue = this.bookingForm.get('dateOut')?.value;

    if (startDateValue && endDateValue) {
      const startTime = startDateValue.getTime();
      const endTime = endDateValue.getTime();
      const timeDiff = endTime - startTime;
      this.nights = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

      // Calculate room price based on the selected dates
      const startMonth = startDateValue.getMonth();
      const endMonth = endDateValue.getMonth();

      if (
        (startMonth >= 0 && startMonth <= 2) ||
        (endMonth >= 0 && endMonth <= 2)
      ) {
        // Between January and March
        this.roomPrice = 68;
      } else if (
        (startMonth >= 3 && startMonth <= 5) ||
        (endMonth >= 3 && endMonth <= 5)
      ) {
        // Between April and June
        this.roomPrice = 87;
      } else if (
        (startMonth >= 6 && startMonth <= 8) ||
        (endMonth >= 6 && endMonth <= 8)
      ) {
        // Between July and September
        this.roomPrice = 98;
      }

      this.totalRoom = this.nights * this.roomPrice;
      this.totalPrice = this.totalRoom + 25;
    } else {
      this.nights = 0;
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      // Format date values before sending to the backend
      const formattedBooking = {
        ...this.bookingForm.value,
        dateIn: this.datePipe.transform(
          this.bookingForm.value.dateIn,
          'yyyy-MM-dd HH:mm:ss'
        ),
        dateOut: this.datePipe.transform(
          this.bookingForm.value.dateOut,
          'yyyy-MM-dd HH:mm:ss'
        ),
      };

      // Handle form submission here, e.g., send the data to your backend
      console.log('Booking submitted:', formattedBooking);
      const backendUrl = 'http://localhost:3000/bookings/create-booking';

      // Send the data to the backend
      this.http.post(backendUrl, formattedBooking).subscribe(
        (response: any) => {
          console.log('Response:', response);

          // Handle the response from the backend as needed
        },
        (error) => {
          console.error('Error:', error);

          // Handle errors from the backend
        }
      );
    } else {
      // Handle invalid form
    }
  }
}
