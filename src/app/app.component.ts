import { Component } from '@angular/core';
import {register} from 'swiper/element/bundle'
import { CartService } from './cart.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  {
  constructor(private cartService:CartService) {}

  ngOnInit() {
    this.cartService.initializeCart();
    this.cartService.refreshCart();
    

  }


  

}
