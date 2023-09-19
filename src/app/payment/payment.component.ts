import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stripe, loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  @Input() bookingForm!: FormGroup;
  dateIn: string = '';
  dateOut: string = '';
  stripePromise: Promise<Stripe | null>;

  // Format the date as "dd/mm/yyyy"
  options = { day: '2-digit', month: '2-digit', year: 'numeric' };

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor(private _formBuilder: FormBuilder) {
    this.stripePromise = loadStripe('pk_live_51Nrv2cGN89IRajaVrofIp1IEbv2h6xHLt86O02Zc6fbXAyusX80IFQMqK0OghGG3yB3ilwK0YuyxnWUI0GIGjoMf00VdgNEXpH'); // Reemplaza 'your-public-key' con tu clave pública de Stripe.
  }

  ngOnInit() {
    // Subscribe to the dateIn control's value changes
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

  async createPayment() {
    const stripe = await this.stripePromise;

    if (stripe) {
      // Recopila los datos de pago del usuario aquí, como el número de tarjeta, la fecha de vencimiento y el código CVC.

      // Crea un token de tarjeta de crédito con Stripe
      const result = await stripe.createToken(cardElement); // Reemplaza 'cardElement' con tu elemento de tarjeta de crédito.

      // Envía el token al servidor Node.js para realizar el pago
      if (result.token) {
        const response = await this.sendTokenToServer(result.token);

        // Maneja la respuesta del servidor y muestra un mensaje al usuario
        if (response.success) {
          console.log('Pago exitoso.');
        } else {
          console.error('Error al procesar el pago.');
        }
      }
    }
  }

  // Envía el token de tarjeta de crédito al servidor Node.js
  async sendTokenToServer(token: any): Promise<{ success: boolean }> {
    try {
      const response = await fetch('http://tu-servidor-nodejs.com/pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('Error al enviar el token al servidor:', error);
      return { success: false };
    }
  }
}


