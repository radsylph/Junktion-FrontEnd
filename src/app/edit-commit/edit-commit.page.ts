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
  selector: 'app-edit-commit',
  templateUrl: './edit-commit.page.html',
  styleUrls: ['./edit-commit.page.scss'],
})
export class EditCommitPage implements OnInit {
  @ViewChild('swiper', { static: true }) swiper?: ElementRef;
  constructor(
    private user: UserServices,
    private alert: AlertController,
    private nav: NavController,
    private storage: Storage,

  ) {
    register();
  }

  editPost: PostCreateInterface = {
    title: '',
    content: '',
    images: [],
  };
  token: string = "";
  postId: string = "";
  image: any = '';
  image2: any = "";

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
    console.log(this.postId);
  }
  async getPostInfo() {
    const post: any = await this.user.getPublicationInfo(this.token, this.postId);
    console.log(post);
    this.editPost = post.publication;
  }

  async ngOnInit() {
    await this.getToken();
    await this.getPostInfo();
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
      // Si editPost.images no existe, inicialízalo como un array vacío
      if (!this.editPost.images) {
        this.editPost.images = [];
      }
      // Agrega la imagen al array de imágenes
      this.editPost.images.push(image.dataUrl as string);
      console.log(this.editPost.images);
      console.log(this.editPost)
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
    this.editPost.images?.splice(index, 1);
    this.swiper?.nativeElement.swiper.update();
  }
  async editNewPost() {
    if (this.editPost.title === "" || this.editPost.content === "") {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'You must fill all the fields',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    try {
      // await this.user.editPost(this.editPost, this.token)?.subscribe(res => {
      //   console.log(res);
      // });
      console.log(this.editPost);
      console.log(this.postId);
      await this.user.editPost(this.postId, this.token, this.editPost);
      const alert = await this.alert.create({
        header: 'Success',
        message: 'Post edited successfully',
        buttons: ['OK']
      });
      await alert.present();
      this.nav.navigateForward('/landing/feed');

    } catch (error) {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'Post not edited',
        buttons: ['OK']
      });
      await alert.present();
      console.log(error)
    }
  }
}
