import { PostDataType, CommentType } from "../constants/types";
import { QueryFunctionContext } from "@tanstack/react-query";
import { formatPosts, formatReplies } from "./methods";
import { SAMPLE_POSTS, SAMPLE_COMMENTS } from "./sampleData";

// Reddit blocks anonymous access to its public *.json endpoints (HTTP 403), and
// creating an OAuth app to authenticate is currently gated behind Reddit's
// Responsible Builder Policy, so there is no no-account way to pull live posts.
// The app therefore runs on bundled, Reddit-shaped sample data (see sampleData),
// which flows through formatPosts / formatReplies exactly like a real response.
//
// To go live later: register an OAuth "installed app" to get a client ID, request
// an app-only token from https://www.reddit.com/api/v1/access_token, then fetch
// r/all/hot from https://oauth.reddit.com with that bearer token here. Nothing
// else in the app needs to change — the formatters and screens stay the same.

// Param is kept (and ignored) so the signature stays compatible with the
// react-query queryFn call site in queries.tsx.
export const fetchPosts = async (_context: QueryFunctionContext): Promise<PostDataType> => {
    // The sample set is a single page; nextPageToken stays null so react-query's
    // getNextPageParam reports no further pages and pagination stops cleanly.
    return { posts: formatPosts(SAMPLE_POSTS), nextPageToken: SAMPLE_POSTS.data.after };
};

export const fetchComments = async (_query: string[] | string): Promise<CommentType[]> => {
    // Reddit's comments endpoint returns [postListing, commentsListing]; the
    // comments live at index [1], matching the shape of the sample data.
    return formatReplies(SAMPLE_COMMENTS[1]);
};
