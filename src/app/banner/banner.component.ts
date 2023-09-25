import { Component, Input } from '@angular/core';
import { ScrollService } from '../scroll.service';

@Component({
  selector: 'banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  @Input() localBooking! : boolean;

  constructor(private scrollService: ScrollService) {}

  scrollTo(sectionId: string) {
    this.scrollService.scrollToSection(sectionId);
  }

  openLinkInNewTab() {
    const url = 'https://www.airbnb.es/rooms/945766271880521378?guests=1&adults=1&s=67&unique_share_id=f7ca4270-2099-4e9a-adab-1682e1fe5186';
    window.open(url, '_blank');
  }
}
