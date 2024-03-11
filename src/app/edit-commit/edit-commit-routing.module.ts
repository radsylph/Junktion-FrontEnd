import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCommitPage } from './edit-commit.page';

const routes: Routes = [
  {
    path: '',
    component: EditCommitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCommitPageRoutingModule {}
