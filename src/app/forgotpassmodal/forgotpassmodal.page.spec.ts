import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotpassmodalPage } from './forgotpassmodal.page';

describe('ForgotpassmodalPage', () => {
  let component: ForgotpassmodalPage;
  let fixture: ComponentFixture<ForgotpassmodalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ForgotpassmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
