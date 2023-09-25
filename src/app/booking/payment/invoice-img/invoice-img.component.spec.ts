import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceImgComponent } from './invoice-img.component';

describe('InvoiceImgComponent', () => {
  let component: InvoiceImgComponent;
  let fixture: ComponentFixture<InvoiceImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
