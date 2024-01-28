import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';

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

  constructor(private firebase:FirebaseService) { }

  user:any;

  ngOnInit() {
    this.showSignin = true;
    this.firebase.getAuthState().subscribe(user => {
      if(user){
        this.user = user;
        console.log(this.user);
      }else{
        this.user = null;
      }
    })

  }


  async signOut(){
    await this.firebase.signOut();
    this.ngOnInit();
    this.showSignin = true;
  }

}
