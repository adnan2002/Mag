import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-crud-product',
  templateUrl: './crud-product.page.html',
  styleUrls: ['./crud-product.page.scss'],
})
export class CrudProductPage implements OnInit {

  productAddForm = this.formbuilder.group({
    title: ['', Validators.required],
    description: [''],
    old_price: ['', Validators.required],
    new_price: ['', Validators.required],
    images: new FormArray([new FormControl('', Validators.required),]),
    categories: new FormArray([new FormControl('', Validators.required )]),
    collections: new FormArray([new FormControl ('', Validators.required)]),
    status: 'active',
    inventory: ['', Validators.required],
    vendor: ['', Validators.required],
    variants: [false],
    variantsArray: this.formbuilder.array([])
  })


  createVariant() {
    return this.formbuilder.group({
      name: ['', Validators.required],
      old_price: ['', Validators.required],
      new_price: ['', Validators.required],
      inventory: ['', Validators.required],
    });
  }

  addVariant() {
    const variants = this.productAddForm.get('variantsArray') as FormArray;
    variants.push(this.createVariant());
  }
  
  // Function to delete a variant form
  deleteVariant(index: number) {
    const variants = this.productAddForm.get('variantsArray') as FormArray;
    variants.removeAt(index);
  }

  get variantControls() {
    return (<FormArray>this.productAddForm.get('variantsArray')).controls;
  }


  get imageControls(){
    return (<FormArray>this.productAddForm.get('images')).controls;
  }

  get categoryControls(){
    return (<FormArray>this.productAddForm.get('categories')).controls;
  }
  get collectionControls(){
    return (<FormArray>this.productAddForm.get('collections')).controls;
  }


  constructor(private formbuilder:FormBuilder, private firebase: FirebaseService, private loadingController: LoadingController, private toastController: ToastController) { 
  }


  async onSubmit(){
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    if(this.productAddForm.valid && this.productAddForm.get('variants')?.value == false){
      const data = {
        title: this.productAddForm.get('title')?.value,
        description: this.productAddForm.get('description')?.value,
        old_price: this.productAddForm.get('old_price')?.value,
        new_price: this.productAddForm.get('new_price')?.value,
        images: this.productAddForm.get('images')?.value,
        categories: this.productAddForm.get('categories')?.value,
        collections: this.productAddForm.get('collections')?.value,
        status: this.productAddForm.get('status')?.value,
        inventory: this.productAddForm.get('inventory')?.value,
        vendor: this.productAddForm.get('vendor')?.value,
      }

      await this.firebase.addDocument('products', data);
    }else if(this.productAddForm.valid && this.productAddForm.get('variants')?.value == true){
      const data = {
        title: this.productAddForm.get('title')?.value,
        description: this.productAddForm.get('description')?.value,
        old_price: this.productAddForm.get('old_price')?.value,
        new_price: this.productAddForm.get('new_price')?.value,
        images: this.productAddForm.get('images')?.value,
        categories: this.productAddForm.get('categories')?.value,
        collections: this.productAddForm.get('collections')?.value,
        status: this.productAddForm.get('status')?.value,
        inventory: this.productAddForm.get('inventory')?.value,
        vendor: this.productAddForm.get('vendor')?.value,
        variants: this.productAddForm.get('variantsArray')?.value
      }

      await this.firebase.addDocument('products', data);
    }

    await loading.dismiss();

  // Present the toast controller
  const toast = await this.toastController.create({
    message: 'Your operation was successful.',
    duration: 2000,
    color: 'success'
  });
  toast.present();


  }

  addImage(){
    const control = new FormControl('', Validators.required);
    (<FormArray>this.productAddForm.get('images')).push(control);
  }

  deleteImage(index:number){
    (<FormArray>this.productAddForm.get('images')).removeAt(index);
  }
  addCollection(){
    const control = new FormControl('', Validators.required);
    (<FormArray>this.productAddForm.get('collections')).push(control);
  }
  deleteCollection(index:number){
    (<FormArray>this.productAddForm.get('collections')).removeAt(index);
  }

  addCategory(){
    const control = new FormControl('', Validators.required);
    (<FormArray>this.productAddForm.get('categories')).push(control);
  }
  deleteCategory(index:number){
    (<FormArray>this.productAddForm.get('categories')).removeAt(index);
  }

  reset(){
    this.productAddForm.reset();
  }
  
  

  ngOnInit() {
  }


}
