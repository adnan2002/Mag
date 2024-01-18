import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudProductPage } from './crud-product.page';

const routes: Routes = [
  {
    path: '',
    component: CrudProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudProductPageRoutingModule {}
