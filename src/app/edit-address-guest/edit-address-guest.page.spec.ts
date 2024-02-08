import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAddressGuestPage } from './edit-address-guest.page';

describe('EditAddressGuestPage', () => {
  let component: EditAddressGuestPage;
  let fixture: ComponentFixture<EditAddressGuestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditAddressGuestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
