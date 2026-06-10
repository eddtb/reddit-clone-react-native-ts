import { SAMPLE_COMMENTS, SAMPLE_POSTS } from "./sampleData";
import { commentsResponseSchema, postListingSchema } from "./schemas";
import { CommentType, PostPage } from "../constants/types";
import { formatPosts, formatReplies } from "../utils/format";

// Reddit blocks anonymous access to its public *.json endpoints (HTTP 403), and
// creating an OAuth app to authenticate is currently gated behind Reddit's
// Responsible Builder Policy, so there is no no-account way to pull live posts.
// The app therefore runs on bundled, Reddit-shaped sample data, validated
// through the same zod schemas a live response would be.
//
// To go live later: register an OAuth "installed app" to get a client ID,
// request an app-only token from https://www.reddit.com/api/v1/access_token,
// then fetch from https://oauth.reddit.com here and `parse` the JSON with the
// schemas before formatting. Nothing else in the app needs to change.

export const fetchPosts = async (): Promise<PostPage> => {
    const listing = postListingSchema.parse(SAMPLE_POSTS);
    // Single sample page: `after` is null, so getNextPageParam stops pagination.
    return { posts: formatPosts(listing), nextPageToken: listing.data.after };
};

export const fetchComments = async (_permalink: string): Promise<CommentType[]> => {
    const [, comments] = commentsResponseSchema.parse(SAMPLE_COMMENTS);
    return formatReplies(comments);
};
