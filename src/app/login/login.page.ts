import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from '../services/user.service';

import { existingUser } from '../interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private nav: NavController,
    private user: UserServices
  ) { }
  User: existingUser = {
    email: "",
    password: ""
  }



  ngOnInit() {
    this.User = {
      email: "",
      password: ""
    };
  }

  async login() {
    if (this.User.email == "" || this.User.password == "") {
      const alert = await this.alert.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Please fill all the fields',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    this.user.loginUser(this.User).subscribe(
      async (res: any) => {
        const alert = await this.alert.create({
          header: 'Success',
          message: 'User registered successfully',
          buttons: ['OK']
        });
        await alert.present();
        this.nav.navigateForward('/landing/feed');
      },
      async (err: any) => {
        const alert = await this.alert.create({
          header: 'Error',
          message: err.error.message,
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

}
