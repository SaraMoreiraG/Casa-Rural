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

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements AfterViewInit {
  // @Input() bookingData!: Booking;
  bookingData = {
    name: 'sd',
    email: 'string',
    phone: 'string',
    guests: 2,
    dateIn: new Date('23/09/2022'),
    dateOut: new Date('24-08-2029'),
    price: 2,
  };
  today = new Date();
  formatToday = this.datePipe.transform(this.today, 'dd-MM-yyyy');
  @ViewChild('stepper') stepper!: MatStepper;
  confirmedData: boolean = false;
  dateIn: string = '';
  dateOut: string = '';
  s1Completed: boolean = false;

  @ViewChild('cardInfo')
  cardInfo!: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  cardError: string = '';

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private datePipe: DatePipe,
    private scrollService: ScrollService
  ) {}

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
            console.log('Payment successful:', result);
          },
          error: (err) => {
            // Handle the error here
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

  onStepLabelClick(stepIndex: number) {
    // Determine the current step index
    const currentStepIndex = this.stepper.selectedIndex;

    // Add your logic to decide whether to allow moving to the next step or not
    const shouldPreventNextStep =
      (currentStepIndex === 0 && stepIndex !== 1) || // Prevent moving from Step 1 to Step 2
      (currentStepIndex === 1 && stepIndex === 0) || // Allow going back from Step 2 to Step 1
      currentStepIndex === 2; // Prevent moving from Step 3

    if (shouldPreventNextStep) {
      // Prevent moving to the next step
      return;
    }

    // If not prevented, move to the specified step
    this.stepper.selectedIndex = stepIndex;
  }
  scrollTo(sectionId: string) {
    this.scrollService.scrollToSection(sectionId);
  }
}
function newDate(arg0: string) {
  throw new Error('Function not implemented.');
}
