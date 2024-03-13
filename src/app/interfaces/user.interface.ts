export interface UserInterface {
    _id?: string;
    name: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    repeat_password: string;
    profilePicture?: string;
    myFriends?: number;
    createdAt?: Date;
    friends?: number;
}

export interface existingUser {
    email: string;
    password: string;
}