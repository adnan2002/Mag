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
    let currentVariants = await this.storage.get(this.productId);
    if(currentVariants == null){
      currentVariants = [];
    }
  
    let existingVariant = currentVariants.find((v:any) => v.variant === this.selectedVariant.name);
  
    if(existingVariant){
      if(existingVariant.quantity + this.formQuantityVariant > this.selectedVariant.inventory){
        this.disabledVariant = true;
        return;
      }
      existingVariant.quantity += this.formQuantityVariant;
    } else {
      let variantData = {variant: this.selectedVariant.name, quantity: this.formQuantityVariant};
      currentVariants.push(variantData);
    }
  
    await this.storage.set(this.productId, currentVariants);
    if(existingVariant){
      this.formMaxVariant = this.selectedVariant.inventory - existingVariant.quantity;
    }else{
      this.formMaxVariant = this.selectedVariant.inventory - this.formQuantityVariant;
    }
    // this.formMaxVariant = this.selectedVariant.inventory - (existingVariant ? existingVariant.quantity : 0);
    this.formQuantityVariant = this.formMaxVariant > 0 ? 1 : 0;
    this.formMinVariant = this.formMaxVariant > 0 ? 1 : 0;
  
    this.disabledVariant = this.formMaxVariant == 0;
    this.cdr.detectChanges();
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

  async selectVariant(index: number){
    this.selectedVariant = this.productObject.variants[index];
    
    // Fetch stored variants asynchronously
    let storedVariants = await this.storage.get(this.productId);
    
    // Find the stored variant that matches the selected variant
    let storedVariant = storedVariants ? storedVariants.find((v:any) => v.variant === this.selectedVariant.name) : null;
  
    // Update form quantities and disabledVariant flag
    this.formMaxVariant = this.selectedVariant.inventory;
    if(storedVariant && storedVariant.quantity === this.formMaxVariant){
      this.formQuantityVariant = 0;
      this.formMinVariant = 0;
      this.formMaxVariant = 0;
    } else {
      this.formQuantityVariant = this.formMaxVariant > 0 ? 1 : 0;
      this.formMinVariant = this.formMaxVariant > 0 ? 1 : 0;
      this.formMaxVariant = this.selectedVariant.inventory - (storedVariant ? storedVariant.quantity : 0);
    }
    this.disabledVariant = this.formMaxVariant == 0;
  
    this.goNext(this.selectedVariant.index);
    this.cdr.detectChanges();
  }
  
  
  

  async ngOnInit() {
    // Get product ID from route
    this.productId = <string>this.route.snapshot.paramMap.get('id');
  
    // Fetch product details from Firebase
    this.productObject = await this.firebase.getProductById(this.productId);
  
    // Assign product images
    this.productImages = this.productObject.images;
  
    // Get stored variants for the product
    let storedProducts = await this.storage.get(this.productId);
  
    // Check if product has variants and assign the first variant if it exists
    if(this.productObject.variants){
      this.selectedVariant = this.productObject.variants[0];
      let storedVariant = storedProducts ? storedProducts.find((v:any) => v.variant === this.selectedVariant.name) : null;
      this.formMaxVariant = storedVariant ? this.selectedVariant.inventory - storedVariant.quantity : this.selectedVariant.inventory;
    }
  
    // Calculate formMax based on storedQuantity
    let storedQuantity = storedProducts ? storedProducts : 0;


    this.formMax = storedProducts ? (this.productObject.inventory - storedQuantity) : this.productObject.inventory;
    this.formQuantity = this.formMax > 0 ? 1 : 0;
    this.formMin = this.formMax > 0 ? 1 : 0;
    this.disabled = this.formMax == 0;

  
    // Set formQuantityVariant, formMinVariant, and formQuantity based on formMax and formMaxVariant
    this.formQuantityVariant = this.formMaxVariant > 0 ? 1 : 0;
    this.formMinVariant = this.formMaxVariant > 0 ? 1 : 0;
    this.formQuantity = this.formMax > 0 ? 1 : 0;
  
    // Set disabledVariant flag based on formMaxVariant
    this.disabledVariant = this.formMaxVariant == 0;
  }
  
  



}
