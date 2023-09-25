import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Booking } from '../shared/booking';
import { ScrollService } from '../scroll.service';
import { DatePipe } from '@angular/common';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'invoice-img',
  templateUrl: './invoice-img.component.html',
  styleUrls: ['./invoice-img.component.css'],
})
export class InvoiceImgComponent {
  @Input() bookingDetails!: Booking;
  @Input() toPrint!: boolean;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  // Current date
  today = new Date();
  formatToday = this.datePipe.transform(this.today, 'dd-MM-yyyy');

  constructor(
    private scrollService: ScrollService,
    private datePipe: DatePipe
  ) {}

  // Scroll to a specified section
  scrollTo(sectionId: string) {
    this.scrollService.scrollToSection(sectionId);
  }

  // Generate and download the PDF
  generateAndDownloadPDF() {
    const pdfDefinition: any = {
      info: {
        title: 'Reserva Casa de Armas'
      },
      content: [
        {
          text: 'Resumen del alquiler',
          style: 'header',
        },
        {
          text: `Fecha de compra: ${this.formatToday}`,
          style: 'span',
        },
        {
          text: 'reservationId',
          style: 'span',
        },
        {
          text: `Nombre: ${this.bookingDetails.name}`,
          style: 'details',
        },
        {
          text: `Email: ${this.bookingDetails.email}`,
          style: 'details',
        },
        {
          text: `Teléfono: ${this.bookingDetails.phone}`,
          style: 'details',
        },
        {
          text: `Número de huéspedes: ${this.bookingDetails.guests}`,
          style: 'details',
        },
        {
          text: `Fecha de entrada: ${this.bookingDetails.dateIn}`,
          style: 'details',
        },
        {
          text: `Fecha de salida: ${this.bookingDetails.dateOut}`,
          style: 'details',
        },
        {
          text: 'Total',
          style: 'price',
        },
        {
          text: `${this.bookingDetails.price}€`,
          style: 'price',
        },
      ],
      styles: {
        header: {
          fontWeight: 'bold',
          letterSpacing: 2,
          fontSize: 18,
          margin: [0, 0, 0, 5],
        },
        span: {
          fontSize: 10,
          margin: [0, 0, 0, 5],
        },
        details: {
          fontSize: 12,
          letterSpacing: 0.5,
          margin: [0, 0, 0, 20],
        },
        price: {
          fontSize: 16,
          letterSpacing: 0.5,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
      },
    };
    const pdfOptions = {
      filename: 'your_custom_name.pdf', // Change 'your_custom_name' to the desired name
    };

    const pdf = pdfMake.createPdf(pdfDefinition, pdfOptions);
    pdf.open();
    pdfMake.createPdf(pdfDefinition).download('Reserva-CasaDeArmas.pdf');

  }
}
