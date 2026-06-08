import { PostDataType, CommentType } from "../constants/types";
import { QueryFunctionContext } from "@tanstack/react-query";
import { formatPosts, formatReplies } from "./methods";

// Reddit blocks anonymous requests that don't send a descriptive User-Agent and
// serves an HTML block/rate-limit page instead of JSON (which then fails to
// parse with "Unexpected token: <"). A unique User-Agent in the
// "<platform>:<app id>:<version> (by /u/<user>)" format keeps the public .json
// endpoints returning JSON. See https://github.com/reddit-archive/reddit/wiki/API
const REDDIT_HEADERS = {
    "User-Agent": "ios:com.redditclone.app:v1.0.0 (by /u/redditclone)",
    Accept: "application/json",
};

// Fetch a Reddit URL and parse it as JSON, surfacing a clear error if Reddit
// returns something that isn't JSON (e.g. a rate-limit/block HTML page).
const fetchRedditJson = async (url: string): Promise<any> => {
    const response = await fetch(url, { headers: REDDIT_HEADERS });
    const body = await response.text();
    try {
        return JSON.parse(body);
    } catch {
        throw new Error(
            `Reddit returned a non-JSON response (HTTP ${response.status}). ` +
            `This usually means the request was rate-limited or blocked — try again shortly.`
        );
    }
};

export const fetchPosts = async ({ pageParam }: QueryFunctionContext): Promise<PostDataType> => {
    const after = pageParam ? `after=${pageParam}&` : "";
    const json = await fetchRedditJson(`https://www.reddit.com/r/all/hot.json?${after}sr_detail=1`);
    const posts = formatPosts(json);
    return { posts, nextPageToken: json.data.after };
};


export const fetchComments = async ( query: string[] | string ):  Promise<CommentType[]> => {
    const url = typeof query === 'string' ? query : query.join("/");
    const json = await fetchRedditJson(`https://www.reddit.com/${url}.json?sr_detail=1`);
    return formatReplies(json[1]);
};
