import {
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  OnInit,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Booking } from '../shared/booking';
import { ScrollService } from '../scroll.service';
import { PaymentStatusService } from '../payment-status.service';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements AfterViewInit {
  @Input() bookingData!: Booking;
  today = new Date();
  formatToday = this.datePipe.transform(this.today, 'dd-MM-yyyy');
  paymentCompleted: boolean;
  paymentError: boolean = false;

  @ViewChild('cardInfo')
  cardInfo!: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  cardError: string = '';

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
  ) {this.paymentCompleted = this.paymentStatusService.isPaymentCompleted;}

  ngAfterViewInit() {
    this.initiateCardElement();
  }

  // Your component code
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

  onChange({ error }: { error: any }) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = '';
    }
    this.cd.detectChanges();
  }

  async createStripeToken() {
    const { token, error } = await stripe.createToken(this.card);
    if (token) {
      const info = this.bookingData;
      const paymentData = { token, info };
      console.log(paymentData);

      this.http
        .post(`http://localhost:3000/bookings/create-payment`, paymentData)
        .subscribe({
          next: (result) => {
            // Handle the successful response here
            this.paymentStatusService.setPaymentCompleted(true);
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

  onError(error: any) {
    if (error.message) {
      this.cardError = error.message;
    }
  }

  ngOnDestroy() {
    if (this.card) {
        // We remove event listener here to keep memory clean
        this.card.removeEventListener('change', this.cardHandler);
        this.card.destroy();
    }
}

  scrollTo(sectionId: string) {
    this.scrollService.scrollToSection(sectionId);
  }
}
