import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import Phone from 'Phone';
import { CapStorageService } from '../cap-storage.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-edit-address-guest',
  templateUrl: './edit-address-guest.page.html',
  styleUrls: ['./edit-address-guest.page.scss'],
})
export class EditAddressGuestPage implements OnInit {

  form: FormGroup|any;
  isApartment: boolean = false;
  address:any;

  constructor(private toasty:ToastController,private loadingController:LoadingController,private cap:CapStorageService,private modalCtrl:ModalController, private fb:FormBuilder) {
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
      countryCode: ['+973'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    },{ validators:  this.addressValidator   });

    this.form.get('addressType').valueChanges.subscribe((value:any) => {
      this.isApartment = value === 'apartment';
    });

   }

  dismiss(){
    this.modalCtrl.dismiss();

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
      countryCode: this.form.get('countryCode').value,
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value
    }
  
    if(this.form.get('additionalDirections').value){
      data.additionalDirections = this.form.get('additionalDirections').value;
    }else{
      delete this.address.additionalDirections;
    }
  
    if(this.form.get('addressType').value === 'home'){
      data.house = this.form.get('house').value;
      delete this.address.apartmentNumber;
      delete this.address.buildingName;
      delete this.address.floor;
    }else{
      data.apartmentNumber = this.form.get('apartmentNumber').value;
      data.buildingName = this.form.get('buildingName').value;
      data.floor = this.form.get('floor').value;
      delete this.address.house;
    }
  
    

      
        // Update the address
        const result = { ...this.address, ...data };

        await this.cap.setItem('address',result);


        await loader.dismiss();
        this.modalCtrl.dismiss();


      }
  
      // Write the updated addresses array back to Firestore
    


  
  
catch(err){
  await loader.dismiss();
  const toast = await this.toasty.create({message: 'Error Editing address.', color: 'danger', duration: 1000})
  toast.present();
  }
  

  
  }

 async ngOnInit() {
  const ret:any = await Preferences.get({key: 'address'});
  this.address = JSON.parse(ret.value);
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
    this.form.controls['phoneNumber'].setValue(this.address.phoneNumber.replace(this.address.countryCode, ''));
    this.form.controls['firstName'].setValue(this.address.firstName);
    this.form.controls['lastName'].setValue(this.address.lastName);


  }

}
