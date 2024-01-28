import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotpassmodalPageRoutingModule } from './forgotpassmodal-routing.module';

import { ForgotpassmodalPage } from './forgotpassmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotpassmodalPageRoutingModule
  ],
  declarations: [ForgotpassmodalPage]
})
export class ForgotpassmodalPageModule {}
