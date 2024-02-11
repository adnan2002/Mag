import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service'; 
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {
  selectedAddressId:any;
  addresses:any;


  constructor(private modalController:ModalController, private firebase:FirebaseService, private nav:NavParams) { }


  ngOnInit() {
    this.firebase.getUserAddresses().subscribe((addresses)=>{
      if(addresses){
        this.addresses = addresses?.sort((a:any , b:any) => {b.dateCreated.toDate().getTime() - a.dateCreated.toDate().getTime()});
        this.selectedAddressId = this.nav.get('selectedAddressId');
      }
    })
  }
  

  dismiss(){
    this.modalController.dismiss({
      'selectedAddressId': this.selectedAddressId
    });  }

  selectAddress(id: string) {
    this.selectedAddressId = id;
  }
  

}
