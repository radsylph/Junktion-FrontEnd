import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCommitPageRoutingModule } from './edit-commit-routing.module';

import { EditCommitPage } from './edit-commit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCommitPageRoutingModule
  ],
  declarations: [EditCommitPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditCommitPageModule { }
