import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  productId:string = "";

  constructor(private route: ActivatedRoute, private nav:NavController) { }


  goBack(){
    this.nav.navigateBack('/');

  }




  ngOnInit() {
    this.productId = <string>this.route.snapshot.paramMap.get('id');
    console.log(this.productId)
  }

}
