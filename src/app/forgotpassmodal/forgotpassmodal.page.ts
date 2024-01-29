import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-forgotpassmodal',
  templateUrl: './forgotpassmodal.page.html',
  styleUrls: ['./forgotpassmodal.page.scss'],
})
export class ForgotpassmodalPage implements OnInit {

  @ViewChild('myInput') myInput: IonInput | any;

  email:string = "";

  constructor(private modalController: ModalController, private toastController:ToastController, private firebase:FirebaseService, private loadingController:LoadingController) { }

  ngOnInit() {
    setTimeout(() => {
      this.myInput.setFocus();
    },10);
  }


  dismissModal(){
    this.modalController.dismiss();

  }

  async sendLink(){
    if(!this.email){

      const toast = await this.toastController.create({
        message: 'Please provide your email address.',
        color: 'danger',
        duration: 1000
      });

      return toast.present();
    }

    const loader = await this.loadingController.create({
      spinner: 'dots'
    })

    


    try{
      loader.present();
      const toast = await this.toastController.create({
        message: 'Email is not found.',
        color: 'danger',
        duration: 1000
      });
      const isEmailFound = await this.firebase.isEmailFound(this.email);
      if(!isEmailFound){
        loader.dismiss();
        return toast.present();
      }

      const noError = await this.firebase.forgotPassword(this.email);
      await loader.dismiss();
      
      const toast2 = await this.toastController.create({
        message: 'The link has been sent to your email address.',
        color: 'success',
        duration: 1000
      });

      const toast3 = await this.toastController.create({
        message: 'There has been an error in sending the link.',
        color: 'danger',
        duration: 1000
      })
      if(noError){
      toast2.present();
      }else{
        toast3.present();

      }



    }catch(err){
      loader.dismiss();

    }
  }






}
