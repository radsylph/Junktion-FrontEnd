import { ExistingProvider, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    UserInterface,
    existingUser,
} from '../interfaces/user.interface';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class UserServices {
    constructor(private http: HttpClient) { }

    private newUser: UserInterface = {
        name: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        repeat_password: '',
        profilePicture: 'image.png',
    };

    // private BackenUrl: string =
    //     'https://junktionbackend-production.up.railway.app';
    private BackenUrl: string = 'http://localhost:7338'; //cambiar por la url en despliegue luego.

    createUser(newUser: UserInterface) {
        try {
            // return console.log(newUser);
            return this.http.post(`${this.BackenUrl}/users/create`, newUser).toPromise().then((res: any) => {
                return res;
            });
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    loginUser(existingUser: existingUser) {
        try {
            return this.http.post(`${this.BackenUrl}/users/login`, existingUser).toPromise().then((res: any) => {
                return res;
            }
            );
        } catch (error) {
            console.log(error);
            return error;
        }

    }

    editUser(userInfo: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.put(`${this.BackenUrl}/users/edit`, userInfo, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("editUser", res);
                return res;
            })
        } catch (error) {
            console.log(error);
            return error;
        }

    }

    changePassword(newPassword: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.patch(`${this.BackenUrl}/users/changePassword`, newPassword, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("editUser", res);
                return res;
            })
        } catch (error) {
            console.log(error);
            return error;
        }

    }

    getUserInfo(token: string) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/users/getUser`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getUserInfo", res);
                return res;
            })

        } catch (error) {
            console.log(error);
            return error;
        }

    }

    createPost(post: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.post(`${this.BackenUrl}/publications/create`, post, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("createPost", res);
                return res;
            })
        } catch (error) {
            console.log(error);
            return error;
        }

    }

    editPost(postId: any, token: any, postInfo: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.put(`${this.BackenUrl}/publications/edit/${postId}`, postInfo, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("editPost", res);
                return res;
            })
        } catch (error) {
            console.log(error);
            return error;
        }

    }

    deletePost(postId: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.delete(`${this.BackenUrl}/publications/delete/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("deletePost", res);
                return res;
            })
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getPublicationInfo(token: any, publicationId: any) {
        try {
            return this.http.get(`${this.BackenUrl}/publications/get/${publicationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getPublicationInfo", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

    getFeedPosts(token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/publications/get`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getFeedPosts", res);
                return res;
            })
        } catch (error) {
            return error;
        }

    }

    likePost(postId: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.patch(`${this.BackenUrl}/publications/like/${postId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("likePost", res);
                return res;
            }
            )
        } catch (error) {
            return error;
        }
    }

    getLikedPosts(token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/publications/like`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getLikedPosts", res);
                return res.likes;
            })
        } catch (error) {
            return error;
        }
    }

    bookMarkPost(postId: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.patch(`${this.BackenUrl}/publications/bookmark/${postId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("bookMarkPost", res)
                return res;
            }
            )
        } catch (error) {
            return error;
        }
    }

    getBookMarkedPosts(token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/publications/bookmark`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getBookMarkedPosts", res);
                return res.bookmarks;
            })
        } catch (error) {
            return error;
        }
    }

    getMyBookMarkedPosts(token: any, userId: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/publications/${userId}/bookmark`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getMyBookMarkedPosts", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

    sendFriendRequest(receiver: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.post(`${this.BackenUrl}/publications/sendFriendRequest/${receiver}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("sendFriendRequest", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

    acceptFriendRequest(sender: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.post(`${this.BackenUrl}/publications/acceptFriendRequest/${sender}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("acceptFriendRequest", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

    rejectFriendRequest(sender: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.post(`${this.BackenUrl}/publications/rejectFriendRequest/${sender}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("rejectFriendRequest", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

    getFriendRequests(token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/publications/getFriendRequests`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getFriendRequests", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

    getUserPosts(userId: any, token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/publications/getAll/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getUserPosts", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

    getFriendsPosts(token: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/publications/getFriendsPublications`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getFriendsPosts", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

    getUserFriends(token: any, userId: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/publications/getFriends/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("getUserFriends", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

    deleteUserFriend(token: any, friendShipId: any) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.delete(`${this.BackenUrl}/publications/deleteFriend/${friendShipId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
                console.log("deleteUserFriend", res);
                return res;
            })
        } catch (error) {
            return error;
        }
    }

}
