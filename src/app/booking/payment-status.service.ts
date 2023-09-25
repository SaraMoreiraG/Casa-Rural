import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentStatusService {
  private paymentCompletedSubject = new BehaviorSubject<boolean>(false);

  // Observable to subscribe to changes in paymentCompleted
  paymentCompleted$ = this.paymentCompletedSubject.asObservable();

  // Getter to access paymentCompleted status
  get isPaymentCompleted(): boolean {
    return this.paymentCompletedSubject.value;
  }

  // Setter to update paymentCompleted status
  setPaymentCompleted(status: boolean) {
    this.paymentCompletedSubject.next(status);
  }
}
