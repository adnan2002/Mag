import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Phone from 'Phone';


import {Firestore, arrayUnion, updateDoc, doc} from '@angular/fire/firestore'
import {getAuth} from '@angular/fire/auth'

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent  implements OnInit {

  form: FormGroup|any;
  isApartment: boolean = false;

  constructor(private loadingController:LoadingController,private firestore:Firestore,private modalCtrl:ModalController,private fb: FormBuilder, private toasty:ToastController) { 
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
  


  ngOnInit() {
    
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
      id: new Date().getTime().toString(),
      dateCreated: new Date(),
      phoneNumber: phony,
      road: this.form.get('road').value,
      block: this.form.get('block').value,
      area: this.form.get('area').value,
      addressType: this.form.get('addressType').value
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
     // Get the current user's UID
  const uid = user.currentUser?.uid;

  // Add the address to the 'addresses' field in the user's document
  const userDoc = uid ? doc(this.firestore, 'users', uid) : null;
  if(userDoc){
  await updateDoc(userDoc, {
    addresses: arrayUnion(data)
  });
  }
  await loader.dismiss();
  await this.modalCtrl.dismiss();

}catch(err){
  await loader.dismiss();
 const toast = await this.toasty.create({message: 'Error adding address.', color: 'danger', duration: 1000})
toast.present();
}



  }




}
