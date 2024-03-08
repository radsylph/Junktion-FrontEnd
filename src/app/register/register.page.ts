import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { UserServices } from '../services/user.service';
import { UserInterface } from '../interfaces/user.interface';
import { NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
    private user: UserServices,
    private storage: Storage
  ) { }

  image: any = '';
  image2: any = "";

  newUser: UserInterface = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    repeat_password: 'https://firebasestorage.googleapis.com/v0/b/junktion-effaa.appspot.com/o/profilePictures%2F1709854375771.png?alt=media&token=421bfa47-f15d-416a-bf94-3e8a1df94430',

  };


  async takePicture() {
    //console.log('take picture')
    try {
      console.log('take picture')
      if (Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        width: 500,
      });
      console.log(image);
      this.newUser.profilePicture = image.dataUrl ?? 'image';
      this.image2 = image;
      console.log(this.newUser.profilePicture);
    } catch (error) {
      console.log(error);
    }
  }

  async uploadPicture(blob: any, imageData: any) {
    console.log('la wea loca' + imageData);
    try {
      const currentDate = Date.now();
      const filePath = `profilePictures/${currentDate}.${imageData.format}`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      console.log('task: ', task);
      const url = getDownloadURL(fileRef);
      return url;
    } catch (error) {
      throw error;
    }
  }

  dataURLtoBlob(dataurl: string) {
    let arr = dataurl.split(','),
      match = arr[0].match(/:(.*?);/),
      mime = match ? match[1] : '',
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  ngOnInit() {
    this.newUser = {
      name: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      repeat_password: '',
      profilePicture: 'https://firebasestorage.googleapis.com/v0/b/junktion-effaa.appspot.com/o/profilePictures%2F1709854375771.png?alt=media&token=421bfa47-f15d-416a-bf94-3e8a1df94430',
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
    if (this.newUser.profilePicture !== 'https://firebasestorage.googleapis.com/v0/b/junktion-effaa.appspot.com/o/profilePictures%2F1709854375771.png?alt=media&token=421bfa47-f15d-416a-bf94-3e8a1df94430' &&
      this.newUser.profilePicture !== undefined) {
      const blob = this.dataURLtoBlob(this.newUser.profilePicture as string);
      if (blob) {
        const url = await this.uploadPicture(blob, this.image2);
        this.newUser.profilePicture = url;
      }
    }
    console.log(this.newUser);
    try {
      const createUser = await this.user.createUser(this.newUser);
      console.log(createUser);
      const alert = await this.alert.create({
        header: 'Success',
        message: 'User registered successfully',
        buttons: ['OK']
      });
      await alert.present();
      this.nav.navigateRoot('/login');

    } catch (error: any) {
      console.log(error.error.message);
      const alert = await this.alert.create({
        header: 'Error',
        message: error.error.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
