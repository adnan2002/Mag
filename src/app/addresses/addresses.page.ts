import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AddAddressPage } from '../add-address/add-address.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {

  constructor(private nav:NavController, private modal:ModalController) { }

  ngOnInit() {
  }

  goBack(){
    this.nav.back();
  }

  async displayAdd(){
    const address = await this.modal.create({
      component: AddAddressPage,
      backdropDismiss: true,
      initialBreakpoint: 0.9
    });

    

    address.present();
  }

}
