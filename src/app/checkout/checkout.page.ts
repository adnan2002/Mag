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
import { Storage } from '@ionic/storage-angular';
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
   products:any;
   total:any;
   delivery:any;

  constructor(private storage:Storage,private cap:CapStorageService,private nav:NavController, private modalCtr:ModalController, private firebase:FirebaseService) { }

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

  const keys = await this.storage.keys();
    const productPromises = keys.map(key => this.getProduct(key));
    this.products = await Promise.all(productPromises);
    this.delivery = await this.firebase.getDeliveryCharge();
    this.total = await this.getTotalPrice();

    




    
  }


  async getProduct(id: string) {
    const product = await this.firebase.getProductById(id);
    const localData = await this.storage.get(id);

    if (Array.isArray(localData)) {
      return localData.map(variant => ({
        ...product,
        variantName: variant.variant,
        quantity: variant.quantity
      }));
    }

    return {
      ...product,
      quantity: localData
    };
  }

  isVariantProduct(product: any): boolean {
    return Array.isArray(product);
  }


  getCorrectPrice(item:any){
    const variants = item.variants;
    const filteredVariants = variants.filter((data:any) => data.name === item.variantName);
    return filteredVariants[0].new_price;
}

  goBack(){
    this.nav.navigateBack('/tabs/cart')
  }


 async getTotalPrice(){
    let sum =0;
    for(let i=0; i<this.products.length; i++){
      if(Array.isArray(this.products[i])){
        for(let product of this.products[i]){
          const variants = product.variants;
          const filteredVariants = variants.filter((data:any) => data.name === product.variantName);
          sum = sum + (product.quantity * filteredVariants[0].new_price)
        }
      }else{
        sum = sum + (this.products[i].quantity * this.products[i].new_price);
      }
    }
    if(sum >= 20){
      return sum;
    }else{
      return sum + this.delivery.charge;
    }
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
