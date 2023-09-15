import { Component, Input } from '@angular/core';

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  card1Images: string[] = [
    '../../assets/images/vistas1.jpg',
    '../../assets/images/vistas2.jpg'
  ];
  card2Images: string[] = [
    '../../assets/images/comedor.jpg',
    '../../assets/images/cocina.jpg'
  ];
  card3Images: string[] = [
    '../../assets/images/lago.jpg',
    '../../assets/images/cascada.jpg'
  ];
  card4Images: string[] = [
    '../../assets/images/callepuebla.jpg',
    '../../assets/images/casaluz.jpg'
  ];
  card5Images: string[] = [
    '../../assets/images/habitacion1.jpg',
    '../../assets/images/habitacion2.jpg',
    '../../assets/images/baño1.jpg',
    '../../assets/images/ducha.jpg'
  ];

  card1Photo: string = this.card1Images[0];
  isFirstCard1: boolean = true;
  isLastCard1: boolean = false;

  card2Photo: string = this.card2Images[0];
  isFirstCard2: boolean = true;
  isLastCard2: boolean = false;

  card3Photo: string = this.card3Images[0];
  isFirstCard3: boolean = true;
  isLastCard3: boolean = false;

  card4Photo: string = this.card4Images[0];
  isFirstCard4: boolean = true;
  isLastCard4: boolean = false;

  card5Photo: string = this.card5Images[0];
  isFirstCard5: boolean = true;
  isLastCard5: boolean = false;

  prevImageCard1() {
    const currentIndex = this.card1Images.indexOf(this.card1Photo);
    if (currentIndex !== 0) {
      const prevIndex = currentIndex - 1;
      this.card1Photo = this.card1Images[prevIndex];
      this.isFirstCard1 = prevIndex === 0;
      this.isLastCard1 = false;
    }
  }

  nextImageCard1() {
    const currentIndex = this.card1Images.indexOf(this.card1Photo);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % this.card1Images.length;
      this.card1Photo = this.card1Images[nextIndex];
      this.isFirstCard1 = false;
      this.isLastCard1 = nextIndex === this.card1Images.length - 1;
    }
  }

  prevImageCard2() {
    const currentIndex = this.card2Images.indexOf(this.card2Photo);
    if (currentIndex !== 0) {
      const prevIndex = currentIndex - 1;
      this.card2Photo = this.card2Images[prevIndex];
      this.isFirstCard2 = prevIndex === 0;
      this.isLastCard2 = false;
    }
  }

  nextImageCard2() {
    const currentIndex = this.card2Images.indexOf(this.card2Photo);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % this.card2Images.length;
      this.card2Photo = this.card2Images[nextIndex];
      this.isFirstCard2 = false;
      this.isLastCard2 = nextIndex === this.card2Images.length - 1;
    }
  }

  prevImageCard3() {
    const currentIndex = this.card3Images.indexOf(this.card3Photo);
    if (currentIndex !== 0) {
      const prevIndex = currentIndex - 1;
      this.card3Photo = this.card3Images[prevIndex];
      this.isFirstCard3 = prevIndex === 0;
      this.isLastCard3 = false;
    }
  }

  nextImageCard3() {
    const currentIndex = this.card3Images.indexOf(this.card3Photo);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % this.card3Images.length;
      this.card3Photo = this.card3Images[nextIndex];
      this.isFirstCard3 = false;
      this.isLastCard3 = nextIndex === this.card3Images.length - 1;
    }
  }

  prevImageCard4() {
    const currentIndex = this.card4Images.indexOf(this.card4Photo);
    if (currentIndex !== 0) {
      const prevIndex = currentIndex - 1;
      this.card4Photo = this.card4Images[prevIndex];
      this.isFirstCard4 = prevIndex === 0;
      this.isLastCard4 = false;
    }
  }

  nextImageCard4() {
    const currentIndex = this.card4Images.indexOf(this.card4Photo);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % this.card4Images.length;
      this.card4Photo = this.card4Images[nextIndex];
      this.isFirstCard4 = false;
      this.isLastCard4 = nextIndex === this.card4Images.length - 1;
    }
  }

  prevImageCard5() {
    const currentIndex = this.card5Images.indexOf(this.card5Photo);
    if (currentIndex !== 0) {
      const prevIndex = currentIndex - 1;
      this.card5Photo = this.card5Images[prevIndex];
      this.isFirstCard5 = prevIndex === 0;
      this.isLastCard5 = false;
    }
  }

  nextImageCard5() {
    const currentIndex = this.card5Images.indexOf(this.card5Photo);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % this.card5Images.length;
      this.card5Photo = this.card5Images[nextIndex];
      this.isFirstCard5 = false;
      this.isLastCard5 = nextIndex === this.card5Images.length - 1;
    }
  }
}
