import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { PostInterface } from 'src/app/interfaces/post.interface';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  public buttons = ['Filter'];
  public inputs = [
    {
      label: 'Most recent',
      type: 'radio',
      value: 'most_recent',
    },
    {
      label: 'Older',
      type: 'radio',
      value: 'older',
    },
    {
      label: 'More popular',
      type: 'radio',
      value: 'more_popular',
    },
    {
      label: 'Less popular',
      type: 'radio',
      value: 'less_popular',
    },
  ];
  constructor(private nav: NavController, private alert: AlertController, private user: UserServices, private sheet: ActionSheetController,) { }

  Publications: PostInterface[] = [];
  originalPublications: PostInterface[] = [];
  AllUsers: UserInterface[] = [];
  originalUsers: UserInterface[] = [];
  User: UserInterface[] = [];
  token: string = '';
  ownerSession: string = '';
  input: string = '';
  currentSegment = 'post';

  handleAlertDismiss(event: any) {
    console.log(event.detail);
    const value = event.detail.data.values;
    console.log(value);
    switch (value) {
      case 'most_recent':
        this.Publications.sort((a, b) => (a.createdAt ?? 0) < (b.createdAt ?? 0) ? 1 : -1);
        this.AllUsers.sort((a, b) => (a.createdAt ?? new Date(0)) < (b.createdAt ?? new Date(0)) ? 1 : -1);
        break;
      case 'older':
        this.Publications.sort((a, b) => (a.createdAt ?? 0) > (b.createdAt ?? 0) ? 1 : -1);
        this.AllUsers.sort((a, b) => (a.createdAt ?? new Date(0)) > (b.createdAt ?? new Date(0)) ? 1 : -1);
        break;
      case 'more_popular':
        this.Publications.sort((a, b) => (a.likes ?? 0) < (b.likes ?? 0) ? 1 : -1);
        this.AllUsers.sort((a, b) => (a.friends ?? 0) < (b.friends ?? 0) ? 1 : -1);
        break;
      case 'less_popular':
        this.Publications.sort((a, b) => (a.likes ?? 0) > (b.likes ?? 0) ? 1 : -1);
        this.AllUsers.sort((a, b) => (a.friends ?? 0) > (b.friends ?? 0) ? 1 : -1);
        break;
    }
  }


  public data = [
    'Amsterdam',
    'Buenos Aires',
    'Cairo',
    'Geneva',
    'Hong Kong',
    'Istanbul',
    'London',
    'Madrid',
    'New York',
    'Panama City',
  ];
  public results = [...this.data];

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter((d) => d.toLowerCase().indexOf(query) > -1);
    this.Publications = this.originalPublications.filter((d) => d.title.toLowerCase().indexOf(query) > -1); // Modifica esta línea
    this.AllUsers = this.originalUsers.filter((d) => d.name.toLowerCase().indexOf(query) > -1); // Modifica esta línea
  }

  async getUsers() {
    try {
      const users: any = await this.user.getUsers(this.token);
      console.log('Response from server:', users);
      console.log(users);
      const userWithoutMe = users.users.filter((user: any) => user._id !== this.ownerSession);
      this.AllUsers = userWithoutMe;
      this.originalUsers = [...this.AllUsers];
      return users;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  changeSegment(event: any) {
    this.currentSegment = event.detail.value;
  }

  async getFeed() {
    console.log(this.token)
    try {
      const Feed: any = await this.user.getFeedPosts(this.token) || [];
      const likes: any = await this.user.getLikedPosts(this.token) || [];
      const bookmarks: any = await this.user.getBookMarkedPosts(this.token) || [];
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
      this.originalPublications = [...this.Publications]; // Añade esta línea
    } catch (error: any) {
      console.log(error);
      return error
    }
  }
  async getFriendsFeed() {
    const token = this.token;
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
      this.originalPublications = [...this.Publications]; // Añade esta línea
    } catch (error: any) {
      console.log(error);
      return error
    }
  }
  async goToProfile(userId: any) {
    await Preferences.remove({ key: 'userId' });
    await Preferences.set({ key: 'userId', value: userId });
    console.log('userId:', userId);
    await this.nav.navigateForward('/landing/userfriends');
  }
  async goToSettings() {
    console.log("test")
    await this.nav.navigateForward('/landing/user');
  }
  async getBookMarkFeed() {
    const token = this.token;
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
      this.originalPublications = [...this.Publications]; // Añade esta línea
    } catch (error: any) {
      console.log(error);
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
  async goToPublication(postId: string) {
    await Preferences.set({ key: 'PublicationId', value: postId });
    console.log('PublicationId:', postId);
    await this.nav.navigateRoot('/landing/details');
  }
  async makeComment(postId: string) {
    await Preferences.set({ key: 'PublicationId', value: postId });
    console.log('PublicationId:', postId);
    await this.nav.navigateForward('/edit');
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
                header: 'Delete publication',
                message: 'Are you really sure you want to delete this ?',
                buttons: [
                  {
                    text: 'Yes',
                    handler: async () => {
                      await this.deletePublication(postId);
                      this.getFeed();
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
  async ngOnInit() {
    await this.getToken()
    await this.getFeed();
    await this.getUsers();
  }

}
