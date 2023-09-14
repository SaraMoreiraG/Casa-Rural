import { Component } from '@angular/core';
import { ScrollService } from '../scroll.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../styles.css']
})
export class HomeComponent {
  constructor(private scrollService: ScrollService) {} // Inyecta el servicio

  scrollTo(sectionId: string) {
    this.scrollService.scrollToSection(sectionId); // Llama a la función del servicio
  }
}
