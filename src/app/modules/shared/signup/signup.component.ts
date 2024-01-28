import { Component, OnInit } from '@angular/core';
import{NavController} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../firebase.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent  implements OnInit {


  formGroup: FormGroup | any;
  showPassword = false;
  showCheckPassword = false
 
 
 
 
   constructor(private nav:NavController,private formBuilder: FormBuilder, private firebase:FirebaseService, private loadingController: LoadingController) { }
 
   ngOnInit() {
     this.formGroup = this.formBuilder.group({
       firstName: ['', Validators.required],
       lastName: ['', Validators.required],
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required,Validators.min(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]+$')]],
       confirmPassword: ['', [Validators.required,Validators.min(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]+$')]],
      }, { validator: this.MustMatch('password', 'confirmPassword') });
 
     
   }
 
   checkLength(): boolean {
     return this.formGroup.get('password').value.length >= 6;
   }
 
   checkUpperCase(): boolean {
     return /[A-Z]/.test(this.formGroup.get('password').value);
   }
 
   checkLowerCase(): boolean {
     return /[a-z]/.test(this.formGroup.get('password').value);
   }
 
   checkNumber(): boolean {
     return /[0-9]/.test(this.formGroup.get('password').value);
   }
   
 
   MustMatch(controlName: string, matchingControlName: string) {
     return (formGroup: FormGroup) => {
       const control = formGroup.controls[controlName];
       const matchingControl = formGroup.controls[matchingControlName];
   
       if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
         // return if another validator has already found an error on the matchingControl
         return;
       }
   
       // set error on matchingControl if validation fails
       if (control.value !== matchingControl.value) {
         matchingControl.setErrors({ mustMatch: true });
       } else {
         matchingControl.setErrors(null);
       }
     }
   }
 
   checkConfirmPassword(){
     return this.formGroup.get('password').value === this.formGroup.get('confirmPassword').value;
   }
 
   checkPassword(){
     return this.checkLength() && this.checkUpperCase() && this.checkLowerCase() && this.checkNumber();
   }
 
   toggleShowPassword(){
     this.showPassword = !this.showPassword;
   }
 
   toggleShowCheckPassword(){
     this.showCheckPassword = !this.showCheckPassword;
   }
 
   async onSubmit() {
     if(this.formGroup.valid) {
       const loading = await this.loadingController.create({
         spinner: 'dots',
       });
       try {
         loading.present();
   
         const noError = await this.firebase.signUp(this.formGroup.value);
   
        await  loading.dismiss();
   
         if(noError){
        await  this.nav.navigateRoot('/tabs/home');
         }
       } catch(error:any) {
         loading.dismiss();
         console.log(error);
       }
     } 
   }

}
