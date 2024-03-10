import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from '../services/user.service';
import { Preferences } from '@capacitor/preferences';
import { PostCreateInterface } from '../interfaces/create.post.interface';
import { Capacitor } from '@capacitor/core';
import { ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource, GalleryImageOptions } from '@capacitor/camera';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  @ViewChild('swiper', { static: true }) swiper?: ElementRef;
  constructor(
    private user: UserServices,
    private alert: AlertController,
    private nav: NavController,
    private storage: Storage,

  ) {
    register();
  }

  createPost: PostCreateInterface = {
    title: '',
    content: '',
  };
  token: string = "";
  image: any = '';
  image2: any = "";

  async getToken() {
    const token = await Preferences
      .get({ key: 'token' })
      .then((token: any) => {
        this.token = token.value;
      });
  }
  ngOnInit() {
    this.getToken();
    this.createPost = {
      title: '',
      content: '',
      images: [],
    };

  }

  async close() {
    this.nav.navigateRoot("/landing/feed");
  }


  async takePicture() {
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
      // Si createPost.images no existe, inicialízalo como un array vacío
      if (!this.createPost.images) {
        this.createPost.images = [];
      }
      // Agrega la imagen al array de imágenes
      this.createPost.images.push(image.dataUrl as string);
      console.log(this.createPost.images);
      console.log(this.createPost)
      await this.swiper?.nativeElement.swiper.update();
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

  removeImage(index: number) {
    this.createPost.images?.splice(index, 1);
    this.swiper?.nativeElement.swiper.update();
  }

  async createNewPost() {
    if (this.createPost.title === "" || this.createPost.content === "") {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'You must fill all the fields',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    try {
      const createPost: any = this.createPost;
      let uploadedImageUrls = []; // Nuevo array para almacenar las URLs de las imágenes subidas
      if (createPost.images != null) {
        for (let image of createPost.images) { // Usa un bucle for...of en lugar de forEach para poder usar async/await
          const blob = this.dataURLtoBlob(image);
          const url = await this.uploadPicture(blob, image);
          uploadedImageUrls.push(url); // Añade la URL al nuevo array
        }
      }
      createPost.images = uploadedImageUrls; // Asigna el nuevo array a createPost.images
      const result = await this.user.createPost(this.createPost, this.token);
      console.log(result);
      const alert = await this.alert.create({
        header: 'Success',
        message: 'Post created',
        buttons: ['OK']
      });
      await alert.present();
      this.nav.navigateRoot('/landing/feed');

    } catch (error) {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'Post not created',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

}
