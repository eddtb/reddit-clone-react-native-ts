import { PostDataType, CommentType } from "../constants/types";
import { QueryFunctionContext } from "@tanstack/react-query";
import { formatPosts, formatReplies } from "./methods";

// Reddit's edge now returns 403 (an HTML block page, which fails to parse with
// "Unexpected token: <") for unauthenticated requests to the public
// www.reddit.com/*.json endpoints unless the request looks like a real browser.
// An "API-style" User-Agent gets blocked, so we send a desktop-browser
// User-Agent and the headers a browser typically includes. (For heavier use the
// proper route is OAuth via oauth.reddit.com, which needs a registered app.)
const REDDIT_HEADERS = {
    "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
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
