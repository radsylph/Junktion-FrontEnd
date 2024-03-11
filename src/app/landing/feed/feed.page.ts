import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router, NavigationEnd, Route } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from '../../../app/services/user.service';
import { Preferences } from '@capacitor/preferences';
import { PostInterface } from '../../interfaces/post.interface';
import { ChangeDetectorRef } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit, ViewDidEnter {
  constructor(
    private user: UserServices,
    private alert: AlertController,
    private nav: NavController,
    private sheet: ActionSheetController,
    private router: Router) {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getFeed(this.token);
    });
  }

  public Publications: PostInterface[] = [];
  public token: any = '';
  public ownerSession: any = '';
  public likedPost: any = "";

  async ngOnInit() {
    await this.getToken();
    await this.getFeed(this.token);
  }

  async ionViewDidEnter() {
    console.log("hola");
    await this.getFeed(this.token);
    console.log("token:", this.token);
    console.log("ownerSession:", this.ownerSession);
  }

  async getToken() {
    await Preferences
      .get({ key: 'token' })
      .then((token: any) => {
        this.token = token.value;
      });
    await Preferences.get({ key: 'ownerSession' }).then((ownerSession: any) => {
      this.ownerSession = ownerSession.value;
    });
  }

  async deleteToken() {
    await Preferences.remove({
      key: 'token',
    }).then(async () => {
      await Preferences.remove({
        key: 'ownerSession',
      });
      const alert = await this.alert.create({
        header: 'Token Deleted',
        message: 'Your session has expired, logIn again',
        buttons: ['OK']
      });
      await alert.present();
      this.nav.navigateRoot('/login');
    }
    );
  };

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      console.log(this.token)
      console.log(this.ownerSession)
      this.getFeed(this.token);
      this.getBookMarkFeed(this.token);
      this.getFriendsFeed(this.token);
      event.target.complete();
    }, 2000);
  }

  async getFeed(token: any) {
    token = this.token;
    try {
      const Feed: any = await this.user.getFeedPosts(token)
      const likes: any = await this.user.getLikedPosts(token);
      const bookmarks: any = await this.user.getBookMarkedPosts(token);
      const userLikedPostIds: any = likes
        .filter((like: any) => like.userId === this.ownerSession)
        .map((like: any) => like.publicationId);
      const userBookmarkedPostIds: any = bookmarks
        .filter((bookmark: any) => bookmark.userId === this.ownerSession)
        .map((bookmark: any) => bookmark.publicationId);
      this.Publications = Feed.publications.map((publication: any) => {
        publication.isLiked = userLikedPostIds.includes(publication._id);
        publication.isBookMarked = userBookmarkedPostIds.includes(publication._id);
        return publication;
      });
      console.log(this.Publications);
      return this.Publications;
    } catch (error: any) {
      console.log(error);
      if (error.status == 401) {
        this.deleteToken();
      }
      return error
    }
  }

  async getFriendsFeed(token: any) {
    token = this.token;
    try {
      const friendsFeed: any = await this.user.getFriendsPosts(token);
      console.log(friendsFeed)
      const likes: any = await this.user.getLikedPosts(token);
      const bookmarks: any = await this.user.getBookMarkedPosts(token);
      const userLikedPostIds = likes
        .filter((like: any) => like.userId === this.ownerSession)
        .map((like: any) => like.publicationId);
      const userBookmarkedPostIds = bookmarks
        .filter((bookmark: any) => bookmark.userId === this.ownerSession)
        .map((bookmark: any) => bookmark.publicationId);
      this.Publications = friendsFeed.friendsPublications.map((publication: any) => {
        publication.isLiked = userLikedPostIds.includes(publication._id);
        publication.isBookMarked = userBookmarkedPostIds.includes(publication._id);
        return publication;
      });
      console.log(this.Publications);
      return this.Publications;
    } catch (error: any) {
      console.log(error);
      if (error.status == 401) {
        this.deleteToken();
      }
      return error
    }
  }

  async getBookMarkFeed(token: any) {
    token = this.token;
    try {
      const bookMarkPosts: any = await this.user.getMyBookMarkedPosts(token, this.ownerSession);
      //console.log(bookMarkPosts)
      const test = bookMarkPosts.bookmarkPublication; //increible
      console.log(test)
      const bookmarks: any = await this.user.getBookMarkedPosts(token);
      const likes: any = await this.user.getLikedPosts(token);
      const userLikedPostIds = likes
        .filter((like: any) => like.userId === this.ownerSession)
        .map((like: any) => like.publicationId);
      const userBookmarkedPostIds = bookmarks
        .filter((bookmark: any) => bookmark.userId === this.ownerSession)
        .map((bookmark: any) => bookmark.publicationId);
      this.Publications = test.map((publication: any) => {
        publication.isLiked = userLikedPostIds.includes(publication._id);
        publication.isBookMarked = userBookmarkedPostIds.includes(publication._id);
        return publication;
      });
      console.log(this.Publications);
      return this.Publications;
    } catch (error: any) {
      console.log(error);
      if (error.status == 401) {
        this.deleteToken();
      }
      return error
    }
  }

  async deletePublication(postId: any) {
    try {
      const deleted: any = await this.user.deletePost(postId, this.token);
      console.log('Response from server:', deleted);
      return deleted;
    } catch (error) {
      console.log(error);
      return error;
    }
  }


  async publicationOptions(postId: string) {
    console.log(postId);
    const actionSheetButtons = await this.sheet.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.alert
              .create({
                header: 'Delete tweet',
                message: 'Are you really sure you want to delete this ?',
                buttons: [
                  {
                    text: 'Yes',
                    handler: async () => {
                      await this.deletePublication(postId);
                      this.getFeed(this.token);
                    },
                  },
                  {
                    text: 'No',
                    handler: () => { },
                  },
                ],
              })
              .then((alert) => alert.present());
          },
        },
        {
          text: 'Edit',
          role: 'modification',
          handler: async () => {
            console.log('Edit clicked');
            await Preferences.set({ key: 'PublicationId', value: postId });
            console.log('PublicationId:', postId);
            await this.nav.navigateForward('/edit-commit');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          },
        },
      ],
    });
    await actionSheetButtons.present();
  }

  async bookMarkPublication(postId: any, publication: any) {
    try {
      const bookmark: any = await this.user.bookMarkPost(postId, this.token);
      console.log('Response from server:', bookmark);
      if (bookmark.code == 201) {
        publication.isBookMarked = true;
        console.log("201")
      } else {
        publication.isBookMarked = false;
        console.log("200")
      }
      return bookmark;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async giveLike(postId: string, token: string, publication: any) {
    try {
      const like: any = await this.user.likePost(postId, token);
      console.log('Response from server:', like);
      if (like.code == 201) {
        publication.likes++;
        publication.isLiked = true; // Agrega esta línea
      } else {
        publication.likes--;
        publication.isLiked = false; // Agrega esta línea
      }
      console.log(publication)
      return like;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getBookMarkedPosts() {
    try {
      const bookmarks: any = await this.user.getBookMarkedPosts(this.token);
      console.log('Response from server:', bookmarks);
      return bookmarks;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async changeSection(event: any) {
    console.log('se ha cambiado a ' + event.detail.value);
    switch (event.detail.value) {
      case 'discover':
        console.log("discover")
        this.getFeed(this.token);
        break;
      case 'friends':
        console.log("friends");
        this.getFriendsFeed(this.token);
        break;
      case 'bookmark':
        console.log("bookmark")
        this.getBookMarkFeed(this.token);
        // const bookMarkedPublications: any = await this.user.getMyBookMarkedPosts(this.token, this.ownerSession);
        // console.log(bookMarkedPublications);
        // this.Publications = bookMarkedPublications.bookmarkPublication;
        break;
    }
  }


}
