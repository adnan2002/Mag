import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-forgotpassmodal',
  templateUrl: './forgotpassmodal.page.html',
  styleUrls: ['./forgotpassmodal.page.scss'],
})
export class ForgotpassmodalPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }


  dismissModal(){
    this.modalController.dismiss();

  }

}
