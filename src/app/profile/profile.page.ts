import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  showSignin = true;


  toggleShowSignin(){
    this.showSignin = !this.showSignin
  }

  constructor(private firebase:FirebaseService, private loadingController:LoadingController, private alertController: AlertController) { }

  user:any;
  userObj:any;

  async ngOnInit() {
    const loader = await this.loadingController.create({
      spinner: 'dots'
    });
    loader.present();
    this.showSignin = true;
    this.firebase.getAuthState().subscribe(async (user:any) => {
      if(user){
        this.user = user;
       const userOb = await this.firebase.getUserByUid(user.uid);
       this.userObj = userOb;
      }else{
        this.user = null;
      }
    })

    await loader.dismiss();

  }


  async signOut(){
    await this.firebase.signOut();
    this.ngOnInit();
    this.showSignin = true;
  }

  async presentSignOutAlert() {
    const alert = await this.alertController.create({
      header: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Sign Out',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });
  
    await alert.present();
  }


  title(){
    if(!this.user && this.showSignin){
      return "Sign In"
    }else if(!this.user && !this.showSignin){
      return "Sign Up"
    }else{
      return "Account Info"
    }
  }

}
