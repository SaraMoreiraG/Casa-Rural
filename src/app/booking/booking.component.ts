import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PaymentStatusService } from './payment-status.service';

@Component({
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnDestroy {
  bookingForm: FormGroup;
  bookingData: any;
  bookedDates: any[] = [];
  errorFetchingBookings: boolean = false;
  nights: number = 0;
  roomPrice: number = 0;
  totalRoom: number = 0;
  totalPrice: number = 0;
  formOk: boolean = false;
  paymentCompleted: boolean = false;

  // Declare a subscription variable to handle the booked dates subscription
  private bookedDatesSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private datePipe: DatePipe,
    private paymentStatusService: PaymentStatusService
  ) {
    // Initialize the booking form
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      guests: ['', [Validators.required, Validators.max(4)]],
      dateIn: [null, Validators.required],
      dateOut: [null, Validators.required],
      price: [null],
    });

    // Fetch booked dates from the server
    this.fetchBookedDates();

    // Subscribe to check paymentCompleted value
    this.paymentStatusService.paymentCompleted$.subscribe((value) => {
      this.paymentCompleted = value;
    });
  }

  // Fetch booked dates from the server
  fetchBookedDates() {
    const backendUrl = 'https://xjprsr7xyi.us-east-1.awsapprunner.com/dynamodb/get-all-booked-dates';

    // Unsubscribe from any previous subscriptions to avoid memory leaks
    if (this.bookedDatesSubscription) {
      this.bookedDatesSubscription.unsubscribe();
    }

    this.bookedDatesSubscription = this.http.get<any[]>(backendUrl).subscribe(
      (response: any[]) => {
        this.bookedDates = response;
        console.log(this.bookedDates)
      },
      (error) => {
        this.errorFetchingBookings = true;
        console.error('Error fetching booked dates:', error);
        this.bookingForm.get('dateIn')?.disable();
        this.bookingForm.get('dateOut')?.disable();
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
    const endDateValue = this.bookingForm.get('dateOut')?.value; // Get the endDate value

    // Prevent selecting dates before the current date and after the endDate
    return (
      d !== null &&
      d >= currentDate &&
      (!endDateValue || d <= endDateValue) && // Check if startDate is before or equal to endDate
      !this.isDateInBookedRange(d)
    );
  };

  // Filter function for the end date
  endDateFilter = (d: Date | null): boolean => {
    const currentDate = new Date();
    const startDateValue = this.bookingForm.get('dateIn')?.value;

    // Prevent selecting dates before the current date and before the start date
    const selectedDate = d || currentDate;
    const isOverlapping =
      startDateValue !== null &&
      this.isDateOverlapping(startDateValue, selectedDate);
    return (
      selectedDate >= currentDate &&
      startDateValue !== null &&
      selectedDate >= startDateValue &&
      !isOverlapping
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

  // Function to check if a date range overlaps with any booked date range
  isDateOverlapping(startDate: Date, endDate: Date): boolean {
    for (const bookedDateRange of this.bookedDates) {
      const bookedStartDate = new Date(bookedDateRange.startDate);
      const bookedEndDate = new Date(bookedDateRange.endDate);

      // Check if the provided date range overlaps with the booked date range
      if (
        (startDate <= bookedEndDate && startDate >= bookedStartDate) ||
        (endDate >= bookedStartDate && endDate <= bookedEndDate) ||
        (startDate <= bookedStartDate && endDate >= bookedEndDate)
      ) {
        return true;
      }
    }
    return false;
  }

  // Function to calculate the number of nights and price
  calculatePrice() {
    const startDateValue = this.bookingForm.get('dateIn')?.value;
    const endDateValue = this.bookingForm.get('dateOut')?.value;

    // Calculate nights number
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
        (startMonth >= 6 && startMonth <= 11) ||
        (endMonth >= 6 && endMonth <= 11)
      ) {
        // Between July and September
        this.roomPrice = 98;
      }

      this.totalRoom = this.nights * this.roomPrice;
      this.totalPrice = this.totalRoom + 25;

      // Update the price field in the form control
      this.bookingForm.get('price')?.setValue(this.totalPrice);
    } else {
      this.nights = 0;
    }
  }

  // Handle form submission
  onSubmit() {
    if (this.bookingForm.valid) {
      // Disable form inputs
      const formControls = this.bookingForm.controls;
      Object.keys(formControls).forEach((controlName) => {
        formControls[controlName].disable();
      });
      // Update bookingData variable and format dateIn and dateOut
      this.bookingData = this.bookingForm.value;
      if (this.bookingData.dateIn) {
        const dateIn = new Date(this.bookingData.dateIn);
        this.bookingData.dateIn = this.datePipe.transform(dateIn, 'dd-MM-yyyy');
      }
      if (this.bookingData.dateOut) {
        const dateOut = new Date(this.bookingData.dateOut);
        this.bookingData.dateOut = this.datePipe.transform(
          dateOut,
          'dd-MM-yyyy'
        );
      }
      console.log(this.bookingData)
      // Set form to Ok
      this.formOk = true;
    } else {
      console.log('There are errors in the form');
      console.log(this.bookingForm.value);
    }
  }

  // Function to enable input forms
  modifyData() {
    // Enable form inputs
    const formControls = this.bookingForm.controls;
    Object.keys(formControls).forEach((controlName) => {
      formControls[controlName].enable();
    });
    // Set form to false
    this.formOk = false;
  }
}
