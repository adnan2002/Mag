import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAddressGuestPageRoutingModule } from './edit-address-guest-routing.module';

import { EditAddressGuestPage } from './edit-address-guest.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAddressGuestPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditAddressGuestPage]
})
export class EditAddressGuestPageModule {}
