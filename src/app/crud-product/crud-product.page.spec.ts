import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudProductPage } from './crud-product.page';

describe('CrudProductPage', () => {
  let component: CrudProductPage;
  let fixture: ComponentFixture<CrudProductPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrudProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
