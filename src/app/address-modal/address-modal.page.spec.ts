import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressModalPage } from './address-modal.page';

describe('AddressModalPage', () => {
  let component: AddressModalPage;
  let fixture: ComponentFixture<AddressModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddressModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
