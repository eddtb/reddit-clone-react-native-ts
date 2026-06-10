// App-facing domain types. Raw Reddit API shapes live in api/schemas.ts (zod);
// these are the cleaned-up objects the UI renders. Nullable fields are typed
// as nullable — the old `icon: string` lie crashed Card on `.trim()`.

export interface PostType {
    id: string;
    title: string;
    media: string | null;
    icon: string | null;
    subreddit: string;
    author: string;
    timestamp: number;
    url: string;
    score: number;
    comments: number;
    type: string | null;
}

export interface PostPage {
    posts: PostType[];
    nextPageToken: string | null;
}

export interface CommentType {
    id: string;
    author: string;
    body: string;
    timestamp: number;
    score: number;
    scoreHidden: boolean;
    collapsed: boolean;
    replies: CommentType[];
}
