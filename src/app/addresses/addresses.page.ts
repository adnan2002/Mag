import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';

import { AddressModalPage } from '../address-modal/address-modal.page';

import {getAuth} from '@angular/fire/auth'
import {doc, getDoc, setDoc, deleteField, updateDoc, Firestore } from '@angular/fire/firestore'
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {
  user$:Observable<any> = of([]);
  uid: any;

  constructor(private firestore:Firestore,private alertController: AlertController,private loadingController:LoadingController,private nav:NavController, private modal:ModalController, private firebase:FirebaseService) { }

   ngOnInit() {

     this.uid = getAuth().currentUser?.uid;
    this.user$ = this.firebase.getUserByUidObservable(this.uid);
  }

  goBack(){
    this.nav.back();
  }

  async displayAdd(){
    const address = await this.modal.create({
      component: AddressModalPage,
      backdropDismiss: true,
      initialBreakpoint: 0.9
    });

    

    address.present();
  }


  async deleteAddress(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete this address?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Yes',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Deleting...'
            });
            await loading.present();
  
            // Get the current user's UID
            
  
            // Get a reference to the user's document
            const userRef = doc(this.firestore, 'users', this.uid);
  
            // Read the user's document
            const userSnap = await getDoc(userRef);
  
            if (userSnap.exists()) {
              // Get the user's data
              const userData = userSnap.data();
  
              // Filter out the address with the given ID
              userData['addresses'] = userData['addresses'].filter((address: any) => address.id !== id);
  
              // If the addresses array is empty after the deletion, remove the 'addresses' field
              if (userData['addresses'].length === 0) {
                await updateDoc(userRef, { addresses: deleteField() });
              } else {
                // Otherwise, write the user's data back to Firestore
                await setDoc(userRef, userData);
              }
  
              // Dismiss the loading spinner
              await loading.dismiss();
            } else {
              console.error('User document does not exist');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }


  async editAddress(id:string){
    const address = await this.modal.create({
      component: AddressModalPage,
      componentProps: {addressId: id},
      backdropDismiss: true,
      initialBreakpoint: 0.9
    });


    address.present();


  }
  

}
