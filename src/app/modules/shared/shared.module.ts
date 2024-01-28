import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { IonicModule } from '@ionic/angular';
import { SignupPageRoutingModule } from 'src/app/signup/signup-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SignupPageRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SignupComponent,
    SigninComponent
  ]
})
export class SharedModule { }
