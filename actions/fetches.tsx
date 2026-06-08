import { PostDataType, CommentType } from "../constants/types";
import { QueryFunctionContext } from "@tanstack/react-query";
import { formatPosts, formatReplies } from "./methods";

const REDDIT_HEADERS = {
    "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
};

// Reddit now serves a 403 HTML block page to anonymous requests hitting its
// public *.json endpoints, and OAuth app registration is currently gated. As a
// no-account workaround we route the request through read-only proxies, which
// fetch the URL from their own server (a different IP) and hand back the body.
// We try a direct request first, then fall back to each proxy in turn.
const PROXIES: Array<(url: string) => string> = [
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

const looksLikeJson = (text: string): boolean => {
    const trimmed = text.trim();
    return trimmed.startsWith("{") || trimmed.startsWith("[");
};

const fetchWithTimeout = async (url: string, ms = 12000): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
        return await fetch(url, { headers: REDDIT_HEADERS, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
};

// Fetch a Reddit URL as JSON, trying the URL directly and then via proxies.
// Throws a clear error if nothing returns parseable JSON.
const fetchRedditJson = async (url: string): Promise<any> => {
    const targets = [url, ...PROXIES.map((proxy) => proxy(url))];
    let lastStatus: number | string = "error";
    for (const target of targets) {
        try {
            const response = await fetchWithTimeout(target);
            lastStatus = response.status;
            const body = await response.text();
            if (response.ok && looksLikeJson(body)) {
                return JSON.parse(body);
            }
        } catch {
            // timeout or network error on this target — fall through to the next
        }
    }
    throw new Error(
        `Couldn't load Reddit data (last HTTP ${lastStatus}). Reddit is blocking ` +
        `anonymous access and the fallback proxies didn't return JSON either.`
    );
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
