export interface FriendRequestInterface {
    _id: string;
    sender: {
        _id: string;
        username: string;
        email: string;
        profilePicture: string;
    };
    status: string;

}