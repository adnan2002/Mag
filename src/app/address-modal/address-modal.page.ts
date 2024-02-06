import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.page.html',
  styleUrls: ['./address-modal.page.scss'],
})
export class AddressModalPage implements OnInit {

  addressId:any;

  constructor(private modalCtrl:ModalController, private navParams:NavParams) {
    this.addressId = this.navParams.get('addressId');
   }

  ngOnInit() {
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }



}
