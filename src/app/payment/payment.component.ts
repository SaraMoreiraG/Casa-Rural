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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() bookingForm!: FormGroup;
  @Input() confirmedData: boolean = false;
  dateIn: string = '';
  dateOut: string = '';

  // Format the date as "dd/mm/yyyy"
  options = { day: '2-digit', month: '2-digit', year: 'numeric' };

  formattedDates: { [key: string]: string } = {};

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
  isLinear = false;

  constructor(
    private _formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.updateFormattedDates();

    this.bookingForm.get('dateIn')?.valueChanges.subscribe((value) => {
      if (value) {
        this.dateIn = value.toLocaleDateString('en-GB', this.options);
        this.formattedDates['dateIn'] = this.dateIn;
      } else {
        this.dateIn = '';
        this.formattedDates['dateIn'] = '';
      }
    });

    this.bookingForm.get('dateOut')?.valueChanges.subscribe((value) => {
      if (value) {
        this.dateOut = value.toLocaleDateString('en-GB', this.options);
        this.formattedDates['dateOut'] = this.dateOut;
      } else {
        this.dateOut = '';
        this.formattedDates['dateOut'] = '';
      }
    });
  }

  private updateFormattedDates() {
    const dateInControl = this.bookingForm.get('dateIn');
    const dateOutControl = this.bookingForm.get('dateOut');

    if (dateInControl && dateInControl.value) {
      this.dateIn = dateInControl.value.toLocaleDateString('en-GB', this.options);
      this.formattedDates['dateIn'] = this.dateIn;
    }

    if (dateOutControl && dateOutControl.value) {
      this.dateOut = dateOutControl.value.toLocaleDateString('en-GB', this.options);
      this.formattedDates['dateOut'] = this.dateOut;
    }
  }

  confirmingData(){
    this.confirmedData = !this.confirmedData;
    console.log(this.confirmedData);
    console.log(this.bookingForm)
    const formControls = this.bookingForm.controls;

    if (this.confirmedData) {
      // Disable all form controls if confirmedData is true
      Object.keys(formControls).forEach(controlName => {
        formControls[controlName].disable();
      });
    } else {
      // Enable all form controls if confirmedData is false
      Object.keys(formControls).forEach(controlName => {
        formControls[controlName].enable();
      });
    }
  }

  ngOnDestroy() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }

  ngAfterViewInit() {
    this.initiateCardElement();
  }

  initiateCardElement() {
    // Giving a base style here, but most of the style is in scss file
    const cardStyle = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    this.card = elements.create('card', { cardStyle });
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
      console.log(token);
    } else {
      this.onError(error);
    }
  }

  onError(error: any) {
    if (error.message) {
      this.cardError = error.message;
    }
  }
}
