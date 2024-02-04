import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  form: FormGroup|any;
  isApartment: boolean = false;

  constructor(private modalCtrl:ModalController,private fb: FormBuilder) { 
    this.form = this.fb.group({
      addressType: ['home'],
      house: ['', Validators.required],
      road: ['', Validators.required],
      block: ['', Validators.required],
      phoneNumber: [''],
      area: [''],
      additionalDirections: [''],
      buildingName: [''],
      apartmentNumber: [''],
      floor: [''],
      countryCode: ['+973']
    });

    this.form.get('addressType').valueChanges.subscribe((value:any) => {
      this.isApartment = value === 'apartment';
    });
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

}
