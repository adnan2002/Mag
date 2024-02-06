import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import {Browser} from '@capacitor/browser'

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

  constructor(private nav:NavController,private firebase:FirebaseService, private loadingController:LoadingController, private alertController: AlertController) { }

  user:any;
  userObj:any;
  isGoogleUser = false;

  async ngOnInit() {
    const loader = await this.loadingController.create({
      spinner: 'dots'
    });
    loader.present();
    this.showSignin = true;
    this.firebase.getAuthState().subscribe(async (user:any) => {
      if(user){
        this.user = user;
        console.log(user);
        const userOb = await this.firebase.getUserByUid(user.uid);
        this.userObj = userOb;
  
        // Check if the user signed in with Google
        this.isGoogleUser = user.providerData.some(
          (provider:any) => provider.providerId === 'google.com'
        );
      } else {
        this.user = null;
        this.isGoogleUser = false;
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


  goToAddress(){
    this.nav.navigateForward('tabs/profile/addresses')
  }

  async gotoInstagram(){
    await Browser.open({url: 'https://www.instagram.com/imagnolia_/'})
  }

  async gotoTikTok(){
    await Browser.open({url: 'https://www.tiktok.com/@imagnolia'});
  }



}
