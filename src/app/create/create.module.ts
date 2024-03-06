import {CUSTOM_ELEMENTS_SCHEMA , NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { CreatePage } from './create.page';
import { register } from 'swiper/element/bundle';

register();


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePageRoutingModule
  ],
  declarations: [CreatePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreatePageModule {}
