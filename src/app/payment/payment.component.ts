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
  dateIn: string = '';
  dateOut: string = '';

  @ViewChild('cardInfo')
  cardInfo!: ElementRef;
  _totalAmount: number = 0;
  card: any;
  cardHandler = this.onChange.bind(this);
  cardError: string = '';

  // Format the date as "dd/mm/yyyy"
  options = { day: '2-digit', month: '2-digit', year: 'numeric' };

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
    this.bookingForm.get('dateIn')?.valueChanges.subscribe((value) => {
      if (value) {
        this.dateIn = value.toLocaleDateString('en-GB', this.options);
      } else {
        this.dateIn = '';
      }
    });

    this.bookingForm.get('dateOut')?.valueChanges.subscribe((value) => {
      if (value) {
        this.dateOut = value.toLocaleDateString('en-GB', this.options);
      } else {
        this.dateOut = '';
      }
    });
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
