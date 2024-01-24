import { Component, OnInit } from '@angular/core';
import { NavController , IonSearchbar} from '@ionic/angular';
import { ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, AfterViewInit {

  constructor(private nav:NavController) { }

  @ViewChild('searchbar', {static: false}) searchbar ?: IonSearchbar;

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchbar?.setFocus();
    }, 150);

      
  }



  goBack(){
    this.nav.back();
  }

  ngOnInit() {
  }


  search(ev:any){

  }

}
