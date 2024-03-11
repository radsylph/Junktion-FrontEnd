import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPage } from './landing.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    children: [
      {
        path: 'feed',
        loadChildren: () => import('./feed/feed.module').then(m => m.FeedPageModule)
      },
      {
        path: 'friends',
        loadChildren: () => import('./friends/friends.module').then(m => m.FriendsPageModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserPageModule)
      },
      {
        path: 'userfriends',
        loadChildren: () => import('./userfriends/userfriends.module').then(m => m.UserfriendsPageModule)
      },
      {
        path: 'details',
        loadChildren: () => import('./details/details.module').then(m => m.DetailsPageModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule { }
