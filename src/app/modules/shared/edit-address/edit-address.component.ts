import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/firebase.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import Phone from 'Phone';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

import {getAuth} from '@angular/fire/auth'
import { updateDoc, getDoc, doc, Firestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent  implements OnInit {
  @Input() id: string | any;
  address:any;
  form: FormGroup|any;
  isApartment = false;

  constructor(private firestore:Firestore,private toasty:ToastController,private modalCtrl:ModalController, private loadingController:LoadingController,private firebase:FirebaseService, private fb:FormBuilder) { 
    this.form = this.fb.group({
      addressType: ['home'],
      house: [''],
      road: ['', Validators.required],
      block: ['', Validators.required],
      phoneNumber: ['',Validators.required],
      area: ['', Validators.required],
      additionalDirections: [''],
      buildingName: [''],
      apartmentNumber: [''],
      floor: [''],
      countryCode: ['+973']
    },{ validators:  this.addressValidator   });

    this.form.get('addressType').valueChanges.subscribe((value:any) => {
      this.isApartment = value === 'apartment';
    });
  }

  async ngOnInit() {
    this.address = await this.firebase.getAddressById(this.id);
    this.form.controls['addressType'].setValue(this.address.addressType);
    this.form.controls['road'].setValue(this.address.road);
    this.form.controls['area'].setValue(this.address.area);
    this.form.controls['block'].setValue(this.address.block);
    if(this.address.additionalDirections){
      this.form.controls['additionalDirections'].setValue(this.address.additionalDirections)
    }
    if(this.address.addressType === 'home'){
      this.form.controls['house'].setValue(this.address.house);
    }else if(this.address.addressType === 'apartment'){
      this.form.controls['apartmentNumber'].setValue(this.address.apartmentNumber);
      this.form.controls['buildingName'].setValue(this.address.buildingName);
      this.form.controls['floor'].setValue(this.address.floor);
    }
    this.form.controls['countryCode'].setValue(this.address.countryCode);
    this.form.controls['phoneNumber'].setValue(this.address.phoneNumber.replace(this.address.countryCode, ''))




}

phoneNumberValidator(control: AbstractControl | any): {[key: string]: any} | null {
  const countryCode = control.get('countryCode').value;
  let phoneNumber = control.get('phoneNumber').value;

  phoneNumber = phoneNumber.replace(/\s/g, '');
  
  let areaCodes:any = [];
  let length = 0;
  
  if (countryCode === '+973') {
    areaCodes = Phone.bahrain;
    length = 8;
  } else if (countryCode === '+966') {
    areaCodes = Phone.ksa;
    length = 9;
  }
  
  if (phoneNumber.length !== length || !areaCodes.some((code:any) => phoneNumber.startsWith(code))) {
    return { 'phoneNumber': true };
  }
  
  return null;
}
addressValidator(control: AbstractControl | any): {[key: string]: any} | null {
  const addressType = control.get('addressType').value;
  
  if (addressType === 'home') {
    const house = control.get('house').value;
    if (!house) {
      return { 'home': true };
    }
  } else if (addressType === 'apartment') {
    const apartmentNumber = control.get('apartmentNumber').value;
    const floor = control.get('floor').value;
    const buildingName = control.get('buildingName').value;
    if (!apartmentNumber || !floor || !buildingName) {
      return { 'apartment': true };
    }
  }
  
  return null;
}


async onSubmit(){
  const phoneValidationResult = this.phoneNumberValidator(this.form);

  if(phoneValidationResult && phoneValidationResult['phoneNumber']){
    const toast = await this.toasty.create({
      message: 'Invalid Phone Number.',
      color: 'danger',
      duration: 1000
    });

    return toast.present();
  }

  const loader = await this.loadingController.create({
    spinner: 'dots'
  });
  loader.present();

  try{
  let phony = this.form.get('phoneNumber').value;
  if(this.form.get('countryCode').value === '+973'){
    phony = '+973'+phony;
  }else{
    phony = '+966'+phony;
  }

  phony = phony.replace(/\s/g, '');

  const data:any = {
    phoneNumber: phony,
    road: this.form.get('road').value,
    block: this.form.get('block').value,
    area: this.form.get('area').value,
    addressType: this.form.get('addressType').value,
    countryCode: this.form.get('countryCode').value
  }

  if(this.form.get('additionalDirections').value){
    data.additionalDirections = this.form.get('additionalDirections').value;
  }

  if(this.form.get('addressType').value === 'home'){
    data.house = this.form.get('house').value;
  }else{
    data.apartmentNumber = this.form.get('apartmentNumber').value;
    data.buildingName = this.form.get('buildingName').value;
    data.floor = this.form.get('floor').value;
  }

  const user = getAuth();
  const uid = user.currentUser?.uid;
  const userDoc = uid ? doc(this.firestore, 'users', uid) : null;

  if(userDoc){
    // Get the current addresses array
    const userSnapshot:any = await getDoc(userDoc);
    const addresses = userSnapshot.data().addresses;

    // Find the address to update and update it
    const index = addresses.findIndex((address:any) => address.id === this.id);
    if (index !== -1) {
      // Remove the fields not relevant to the current address type
      if (data.addressType === 'home') {
        delete addresses[index].apartmentNumber;
        delete addresses[index].buildingName;
        delete addresses[index].floor;
      } else {
        delete addresses[index].house;
      }

      if(!data.additionalDirections){
        delete addresses[index].additionalDirections;
      }
      // Update the address
      addresses[index] = { ...addresses[index], ...data };
    }

    // Write the updated addresses array back to Firestore
    await updateDoc(userDoc, { addresses: addresses });
  
  }
await loader.dismiss();
await this.modalCtrl.dismiss();

}catch(err){
await loader.dismiss();
const toast = await this.toasty.create({message: 'Error Editing address.', color: 'danger', duration: 1000})
toast.present();
}



}





}
