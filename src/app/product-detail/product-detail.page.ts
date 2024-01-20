import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';
import {Swiper} from 'swiper'


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  @ViewChild('swiper', {static: false}) swiper ?: ElementRef<{swiper: Swiper}>;

  productId:string = "";
  productObject:any = {};
  productImages = [];

  constructor(private route: ActivatedRoute, private nav:NavController, private firebase: FirebaseService) { }


  goBack(){
    this.nav.navigateBack('/');
  }

  search(){
    this.nav.navigateForward('/tabs/search');
  }

  goNext(index: number){
   this.swiper?.nativeElement.swiper.slideTo(index);
  }



  async ngOnInit() {
    this.productId = <string>this.route.snapshot.paramMap.get('id');

    this.productObject = await this.firebase.getProductById(this.productId);

    this.productImages = this.productObject.images;
  

  }




}
