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

    getUserInfo(token: string) {
        if (token === "" || token === undefined || token === null) {
            console.log("no hay token");
            return;
        }
        try {
            return this.http.get(`${this.BackenUrl}/users/getUser`, {
                headers: { Authorization: `Bearer ${token}` },
            }).toPromise().then((res: any) => {
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
                return res;
            })
        } catch (error) {
            console.log(error);
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
                console.log(res);
                return res.likes;
            })
        } catch (error) {
            return error;
        }
    }


}
