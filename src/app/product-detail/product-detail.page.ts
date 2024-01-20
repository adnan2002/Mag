import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';
import {Swiper} from 'swiper'
import { Storage } from '@ionic/storage-angular';


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
  formQuantity = 1;
  formMax = 10; // will be changed
  formMin = 1; // will be changed
  disabled = false;

  constructor(private cdr: ChangeDetectorRef,private route: ActivatedRoute, private nav:NavController, private firebase: FirebaseService, private storage:Storage) { 
    this.init();
  }

  range(start: number, end: number) {
    return Array.from({length: (end - start + 1)}, (v, k) => k + start);
  }
  


  goBack(){
    this.nav.navigateBack('/');
  }

  search(){
    this.nav.navigateForward('/tabs/search');
  }

  goNext(index: number){
   this.swiper?.nativeElement.swiper.slideTo(index);
  }


  async init(){
    await this.storage.create();

  }

  async addToBagNonVariant(){
    let currentQuantity = await this.storage.get(this.productId);
    if(currentQuantity == this.productObject.inventory){
      this.disabled = true;
      return;
    }
    if(currentQuantity == null){
      await this.storage.set(this.productId, this.formQuantity);
      this.formMax = this.formMax - this.formQuantity;
      this.formQuantity = 1;
    }else{
      await this.storage.set(this.productId, currentQuantity + this.formQuantity);
      this.formMax = this.formMax - this.formQuantity;
      this.formQuantity = 1;
    }
  }

  updateDisabled() {
    this.disabled = this.formQuantity <= 0;
    this.cdr.detectChanges();
  }

  async addToBagVariant(){
  }


  
  




  async ngOnInit() {
    this.productId = <string>this.route.snapshot.paramMap.get('id');
    this.productObject = await this.firebase.getProductById(this.productId);
    this.productImages = this.productObject.images;
  
    let storedQuantity = await this.storage.get(this.productId);
    if(storedQuantity != null){
      this.formMax = this.formMax - storedQuantity;
    } else {
      this.formMax = this.productObject.inventory;
    }
  
    if(this.formMax == 0){
      this.formQuantity = 0;
    }
  }
  



}
