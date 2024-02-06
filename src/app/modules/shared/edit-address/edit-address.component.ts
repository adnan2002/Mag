import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/firebase.service';
@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent  implements OnInit {
  @Input() id: string | any;
  address:any;

  constructor(private firebase:FirebaseService) { }

  async ngOnInit() {
    this.address = await this.firebase.getAddressById(this.id);
}


}
