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

  //variants
  formQuantityVariant = 1;
  formMaxVariant = 10;
  formMinVariant = 1;
  selectedVariant:any = {};
  disabledVariant = false;

  constructor(private cdr: ChangeDetectorRef,private route: ActivatedRoute, private nav:NavController, private firebase: FirebaseService, private storage:Storage) { 
    this.init();
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

  async addToBagVariant(){
    let currentVariant = await this.storage.get(this.productId);
    if(currentVariant == this.selectedVariant.inventory){
      this.disabledVariant = true;
      return;
    }
    if(currentVariant == null){
      let variantData = {variant: this.selectedVariant.name, quantity: this.formQuantityVariant};
      await this.storage.set(this.productId, variantData);
      this.formMaxVariant = this.formMaxVariant - this.formQuantityVariant;
      this.formQuantityVariant = 1;
    }else{
      currentVariant.quantity += this.formQuantityVariant;
      await this.storage.set(this.productId, currentVariant);
      this.formMaxVariant = this.formMaxVariant - this.formQuantityVariant;
      this.formQuantityVariant = 1;
    }
    if(this.formMaxVariant == 0){
      this.formQuantityVariant = 0;
      this.formMinVariant = 0;
      this.cdr.detectChanges();
    }
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
    if(this.formMax == 0){
    this.formQuantity = 0;
    this.formMin = 0;
    this.cdr.detectChanges();
    }
  }

  updateDisabled() {
    this.disabled = this.formQuantity <= 0;
    this.cdr.detectChanges();
  }

 

  
  incrementQuantity() {
    if (this.formQuantity < this.formMax) {
      this.formQuantity++;
    }
    this.cdr.detectChanges();
  }
  
  decrementQuantity() {
    if (this.formQuantity > this.formMin) {
      this.formQuantity--;
    }
    this.cdr.detectChanges();
  }


  incrementQuantityVariant() {
    if(this.formQuantityVariant < this.formMaxVariant){
      this.formQuantityVariant++;
    }
    this.cdr.detectChanges();
  }
  decrementQuantityVariant() 
  {
    if(this.formQuantityVariant > this.formMinVariant){
      this.formQuantityVariant--;
    }
    this.cdr.detectChanges();
  }

  selectVariant(index: number){
    this.selectedVariant = this.productObject.variants[index];
    this.formMaxVariant = this.selectedVariant.inventory;
    if(this.formMaxVariant == 0){
    this.formQuantityVariant = 0;
    this.formMinVariant = 0;
    }else{
    this.formQuantityVariant = 1;
    this.formMinVariant = 1;
    }
    this.goNext(this.selectedVariant.index);
    this.cdr.detectChanges();
  }
  






  async ngOnInit() {
    this.productId = <string>this.route.snapshot.paramMap.get('id');
    this.productObject = await this.firebase.getProductById(this.productId);
    this.productImages = this.productObject.images;

    if(this.productObject.variants){
     this.selectedVariant = this.productObject.variants[0];
    }
  
    let storedQuantity = await this.storage.get(this.productId);
    if(storedQuantity != null){
      this.formMax = this.formMax - storedQuantity;
    } else {
      if(this.productObject.variants){
        this.formMaxVariant = this.productObject.variants[0].inventory;
      }
      this.formMax = this.productObject.inventory;
    }

    if(this.formMaxVariant == 0){
      this.formQuantityVariant = 0;
      this.formMinVariant = 0;
    }
  
    if(this.formMax == 0){
      this.formQuantity = 0;
    }



  }
  



}
