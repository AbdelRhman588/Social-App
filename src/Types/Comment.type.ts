

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface CommentType {
  _id: string;
  content: string;
  image: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: string | null;
  likes: string[]; // or unknown[] / any[] if the shape of likes is unknown
  createdAt: string; // ISO date string
}
