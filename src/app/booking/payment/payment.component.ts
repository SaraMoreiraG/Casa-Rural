import {
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Booking } from '../../shared/booking';
import { ScrollService } from '../../scroll.service';
import { PaymentStatusService } from '../payment-status.service';
import { ApiResponse } from './api-response';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements AfterViewInit, OnDestroy {
  // Input property to receive booking data
  @Input() bookingData!: Booking;

  // Payment status flags
  paymentCompleted: boolean;
  paymentError: boolean = false;

  bookingId: number;

  // Reference to the card element
  @ViewChild('cardInfo')
  cardInfo!: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  cardError: string = '';

  // Payment form with validation
  paymentForm = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private datePipe: DatePipe,
    private scrollService: ScrollService,
    private paymentStatusService: PaymentStatusService
  ) {
    // Initialize paymentCompleted flag from the paymentStatusService
    this.paymentCompleted = this.paymentStatusService.isPaymentCompleted;

    // Subscribe to check paymentCompleted value
    this.paymentStatusService.paymentCompleted$.subscribe((value) => {
      this.paymentCompleted = value;
    });
  }

  ngAfterViewInit() {
    // Initialize card element
    if (!this.paymentCompleted) this.initiateCardElement();
  }

  // Initialize the Stripe card element
  initiateCardElement() {
    this.card = elements.create('card', {
      classes: {
        base: 'card-element', // Apply the CSS class here
        invalid: 'card-element-invalid', // Add another class for the invalid state if needed
      },
    });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  // Handle card element changes
  onChange({ error }: { error: any }) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = '';
    }
    this.cd.detectChanges();
  }

  // Create a Stripe token and perform payment
  async createStripeToken() {
    const { token, error } = await stripe.createToken(this.card);
    if (token) {
      const info = this.bookingData;
      const paymentData = { token, info };

      this.http
        .post(`https://xjprsr7xyi.us-east-1.awsapprunner.com/dynamodb/create-payment`, paymentData)
        .subscribe({
          next: (result: ApiResponse) => {
            // Handle the successful response here
            this.paymentStatusService.setPaymentCompleted(true);
            this.bookingId = result.bookingId;
            this.scrollService.scrollToSection("booking");
            console.log('Payment successful:', result);
          },
          error: (err) => {
            this.paymentError = true;
            console.error('Payment error:', err);
          },
        });
    } else {
      this.onError(error);
    }
  }

  // Handle card element errors
  onError(error: any) {
    if (error.message) {
      this.cardError = error.message;
    }
  }

  // Clean up card element on component destruction
  ngOnDestroy() {
    if (this.card) {
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }

  // Scroll to a specified section
  scrollTo(sectionId: string) {
    this.scrollService.scrollToSection(sectionId);
  }
}
