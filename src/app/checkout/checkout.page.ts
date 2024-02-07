import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  constructor(private nav:NavController) { }

  ngOnInit() {
  }


  goBack(){
    this.nav.navigateBack('/tabs/cart')
  }

}
