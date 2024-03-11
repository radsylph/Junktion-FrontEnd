import {CUSTOM_ELEMENTS_SCHEMA , NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPageRoutingModule } from './edit-routing.module';

import { EditPage } from './edit.page';
import { register } from 'swiper/element/bundle';

register();


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPageRoutingModule
  ],
  declarations: [EditPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditPageModule {}