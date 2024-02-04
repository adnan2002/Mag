import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/firebase.service';
import { ModalController } from '@ionic/angular';
import { ForgotpassmodalPage } from 'src/app/forgotpassmodal/forgotpassmodal.page';

import {GoogleAuth, User as GoogleUser} from '@codetrix-studio/capacitor-google-auth'
import { ChangeDetectorRef } from '@angular/core';
import { isPlatform } from '@ionic/angular';

import {getAuth, GoogleAuthProvider, signInWithCredential, User as FirebaseUser} from '@angular/fire/auth';
import {getFirestore, doc, getDoc, setDoc, updateDoc} from '@angular/fire/firestore';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent  implements OnInit {
  @Output() toggle = new EventEmitter<void>();

  formGroup: FormGroup | any;
  userGoogle: any;



  constructor(private cdr:ChangeDetectorRef,private formBuilder:FormBuilder, private toastController:ToastController, private firebase:FirebaseService, private loadingController: LoadingController, private nav:NavController, private modalController:ModalController) {
    if(!isPlatform('capacitor')){
      GoogleAuth.initialize();
    }


   }

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
        } else{
          message = "Unknown Error."
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

  async signInUsingGoogle() {
    const loader = await this.loadingController.create({
      spinner: 'dots'
    });
    
    try {
      const user: GoogleUser | any = await GoogleAuth.signIn();
      this.userGoogle = user;
      this.cdr.detectChanges();
      loader.present();

      // Sign in user with Firebase
      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(user.authentication.idToken);
      const firebaseUser: FirebaseUser = (await signInWithCredential(auth, credential)).user;

      // Get a reference to the Firestore
      const db = getFirestore();

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // If the user already exists, just update the 'google' field
        await updateDoc(userDocRef, { google: true });
      } else {
        // If the user doesn't exist, create a new document
        await setDoc(userDocRef, {
          email: user.email,
          firstName: user.givenName,
          lastName: user.familyName,
          uid: firebaseUser.uid,
          google: true
        });
      }

      await loader.dismiss();
    } catch (err:any) {
      await loader.dismiss();
        this.toastController.create({
          message: 'Error In Google Sign In.',
          duration: 1000,
          color: 'danger'
        }).then(toast => toast.present());
      
    }
  }
  

}
