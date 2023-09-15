import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.css'],
})
export class PhotoCardComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() images: string[] = [];
  @Input() cardPhoto: string = '';

  isFirstCard: boolean = true;
  isLastCard: boolean = false;

  ngOnInit() {
    this.cardPhoto = this.images[0];
  }

  prevImage() {
    const currentIndex = this.images.indexOf(this.cardPhoto);
    if (currentIndex !== 0) {
      const prevIndex = currentIndex - 1;
      this.cardPhoto = this.images[prevIndex];
      this.isFirstCard = prevIndex === 0;
      this.isLastCard = false;
    }
  }

  nextImage() {
    const currentIndex = this.images.indexOf(this.cardPhoto);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % this.images.length;
      this.cardPhoto = this.images[nextIndex];
      this.isFirstCard = false;
      this.isLastCard = nextIndex === this.images.length - 1;
    }
  }
}
