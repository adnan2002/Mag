import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressModalPageRoutingModule } from './address-modal-routing.module';

import { AddressModalPage } from './address-modal.page';
import { SharedModule } from '../modules/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressModalPageRoutingModule,
    SharedModule
  ],
  declarations: [AddressModalPage]
})
export class AddressModalPageModule {}
