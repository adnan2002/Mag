import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddressModalPage } from '../address-modal/address-modal.page';
import { Preferences } from '@capacitor/preferences';
import { CapStorageService } from '../cap-storage.service';
import { EditAddressGuestPage } from '../edit-address-guest/edit-address-guest.page';
import { FirebaseService } from '../firebase.service';
import { getAuth } from '@angular/fire/auth';
import { SelectAddressPage } from '../select-address/select-address.page';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  userAddresses$:any;
  userAddresses = [];
  selectedAddress:any;
  guestAddress:any;
  isAuthenticated = false;
  userObject:any;

  constructor(private cap:CapStorageService,private nav:NavController, private modalCtr:ModalController, private firebase:FirebaseService) { }

  async ngOnInit() {
    const auth = getAuth();
    if(auth.currentUser){
      this.isAuthenticated = true;
      this.userObject = await this.firebase.getUserByUid(auth.currentUser.uid);
      
    
    this.userAddresses$ = this.firebase.getUserAddresses();
    this.userAddresses$.subscribe((data:any)=>{
      if(data){
      this.userAddresses = data;
      this.selectedAddress = data?.sort((a:any, b:any) => b.dateCreated.toDate() - a.dateCreated.toDate())[0];
      }

    });
  }else{
    this.isAuthenticated = false;
    this.cap.watchStorage().subscribe(async(data:any)=>{
      const ret:any = await Preferences.get({key: 'address'});
      this.guestAddress = JSON.parse(ret.value);
    });
  }


    
  }


  goBack(){
    this.nav.navigateBack('/tabs/cart')
  }



  async add(){
    const modal = await this.modalCtr.create({
      component: AddressModalPage,
      initialBreakpoint: 0.9
    });
    modal.present();
  }

   capitalizeFirstLetter(name:string) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  async openEditGuest(){
    const modal = await this.modalCtr.create({
      component: EditAddressGuestPage,
      initialBreakpoint: 0.9
    });
    modal.present();

  }


  async presentSelectAddressModal() {
    const modal = await this.modalCtr.create({
      component: SelectAddressPage,
      componentProps: { 'selectedAddressId': this.selectedAddress.id },
      initialBreakpoint: 0.9
    });
  
    modal.onDidDismiss().then(async (dataReturned) => {
      if (dataReturned.data) {
        const selectedAddressId = dataReturned.data.selectedAddressId;
        this.selectedAddress = await this.firebase.getAddressById(selectedAddressId);
        // Now you can use this.selectedAddressId to get the selected address
      }
    });
  
    return await modal.present();
  }
  
}
