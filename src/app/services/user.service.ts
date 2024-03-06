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
        return this.http.post(`${this.BackenUrl}/users/create`, newUser).pipe(
            catchError((error) => {
                console.log(error);
                return throwError(error);
            })
        );
    }

    loginUser(existingUser: existingUser) {
        return this.http.post(`${this.BackenUrl}/users/login`, existingUser).pipe(
            catchError((error) => {
                console.log(error);
                return throwError(error);
            })
        );
    }

}
