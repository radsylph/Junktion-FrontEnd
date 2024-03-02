import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { UserServices } from '../services/user.service';
import { UserInterface } from '../interfaces/user.interface';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private nav: NavController,
    private user: UserServices
  ) { }

  newUser: UserInterface = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    repeat_password: '',
    profilePicture: 'image.png',
  };

  ngOnInit() {
    this.newUser = {
      name: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      repeat_password: '',
      profilePicture: 'image.png',
    };
  }

  async register() {
    if (
      this.newUser.name == '' ||
      this.newUser.lastname == '' ||
      this.newUser.username == '' ||
      this.newUser.email == '' ||
      this.newUser.password == '' ||
      this.newUser.repeat_password == ''
    ) {
      this.alert
        .create({
          header: 'Error',
          message: 'Please fill all the fields',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }
    if (this.newUser.password !== this.newUser.repeat_password) {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'Passwords do not match',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    if (this.newUser.password.length < 6) {
      this.alert
        .create({
          header: 'Error',
          message: 'Password must be at least 6 characters long',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }
    const regex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    if (!regex.test(this.newUser.email)) {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'Invalid email',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    console.log(this.newUser);

    this.user.createUser(this.newUser).subscribe(
      async (res: any) => {
        const alert = await this.alert.create({
          header: 'Success',
          message: 'User registered successfully',
          buttons: ['OK']
        });
        await alert.present();
        this.nav.navigateRoot('/login');
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
