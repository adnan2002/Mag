import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/firebase.service';
import { ModalController } from '@ionic/angular';
import { ForgotpassmodalPage } from 'src/app/forgotpassmodal/forgotpassmodal.page';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent  implements OnInit {
  @Output() toggle = new EventEmitter<void>();

  formGroup: FormGroup | any;



  constructor(private formBuilder:FormBuilder, private toastController:ToastController, private firebase:FirebaseService, private loadingController: LoadingController, private nav:NavController, private modalController:ModalController) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
 async onSubmit(){
  if(!this.formGroup.get('email').value && !this.formGroup.get('password').value){
    const toast = await this.toastController.create({
      message: 'Email and Password are not filled.',
      duration: 1000,
      color: 'danger'
    });

    return toast.present();
  }else if(!this.formGroup.get('email').value){
    const toast = await this.toastController.create({
      message: 'Email is not filled.',
      duration: 1000,
      color: 'danger'
    });
    return toast.present();
  }else if(!this.formGroup.get('password').value){
    const toast = await this.toastController.create({
      message: 'Password is not filed.',
      duration: 1000,
      color: 'danger'
    });

    return toast.present();
  }

  if(this.formGroup.valid){
    const loading = await this.loadingController.create({
      spinner: 'dots',
    });
    try {
      loading.present();
  
      const result = await this.firebase.signIn(this.formGroup.value);
  
      await loading.dismiss();
  
      if(result === true){
        await this.nav.navigateRoot('/tabs/profile');
      } else {
        let message = '';
        if (result === 'auth/invalid-credential') {
          message = 'Email or Password is incorrect.';
        } 
  
        const toast = await this.toastController.create({
          message: message,
          duration: 1000,
          color: 'danger'
        });
  
        return toast.present();
      }
    } catch(error:any) {
      loading.dismiss();
      console.log(error);
    }
  }



  }

  async forgotPass(){
    const modal = await this.modalController.create({
      component: ForgotpassmodalPage,
      cssClass: 'forgot-passmodal',
      backdropDismiss: true
    });

    modal.initialBreakpoint = 0.8

    modal.present();

  }

}
