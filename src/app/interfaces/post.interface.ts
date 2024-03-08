export interface PostInterface {
    publications: PostInterface[];
    _id: string;
    owner: {
        email: string;
        lastname: string;
        name: string;
        password: string;
        username: string;
        profilePicture: string;
        _id: string;
    };
    title: string;
    content: string;
    images: [string];
    isEdited: boolean;
    bookMark: boolean;
    likes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
    isLiked?: boolean;
}