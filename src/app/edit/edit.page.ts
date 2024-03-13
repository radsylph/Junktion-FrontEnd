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
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  @ViewChild('swiper', { static: true }) swiper?: ElementRef;
  constructor(
    private user: UserServices,
    private alert: AlertController,
    private nav: NavController,
    private storage: Storage,

  ) {
    register();
  }

  createComment: PostCreateInterface = {
    title: '',
    content: '',
    images: [],
  };
  token: string = "";
  postId: string = "";

  async getToken() {
    const token = await Preferences
      .get({ key: 'token' })
      .then((token: any) => {
        this.token = token.value;
      });
    const postId = await Preferences
      .get({ key: 'PublicationId' })
      .then((postId: any) => {
        this.postId = postId.value;
      });
  }

  ngOnInit() {
    this.getToken();
    this.createComment = {
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
      // Si createComment.images no existe, inicialízalo como un array vacío
      if (!this.createComment.images) {
        this.createComment.images = [];
      }
      // Agrega la imagen al array de imágenes
      this.createComment.images.push(image.dataUrl as string);
      console.log(this.createComment.images);
      console.log(this.createComment)
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


    const sizeInMB = n / (1024 * 1024);
    if (sizeInMB > 3) {
      const alert = this.alert.create({
        header: 'Error',
        message: 'The image is too big',
        buttons: ['OK']
      }).then(alert => alert.present());
      return;
    }

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  removeImage(index: number) {
    this.createComment.images?.splice(index, 1);
    this.swiper?.nativeElement.swiper.update();
  }

  async createNewComment() {
    if (this.createComment.title === "" || this.createComment.content === "") {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'You must fill all the fields',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    try {
      const comment = await this.user.makeComment(this.token, this.postId, this.createComment,);
      console.log(comment);
      const alert = await this.alert.create({
        header: 'Success',
        message: 'Post created',
        buttons: ['OK']
      });
      await alert.present();
      this.nav.navigateForward('/landing/feed');
    } catch (error) {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'Post not created',
        buttons: ['OK']
      });
      await alert.present();
      console.log(error)
    }
  }
}
