import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartmodalPage } from './cartmodal.page';

describe('CartmodalPage', () => {
  let component: CartmodalPage;
  let fixture: ComponentFixture<CartmodalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CartmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
