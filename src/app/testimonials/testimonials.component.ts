import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {

  constructor(private router: Router) { }

  navigateToBookings() {
    this.router.navigate(['/booking']);
  }
}
