import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { CommentChild, CommentListing, PostListing } from "../api/schemas";
import { CommentType, PostType } from "../constants/types";

dayjs.extend(relativeTime);

export const timeFromNow = (timestamp: number): string => dayjs.unix(timestamp).fromNow();

export const decodeUrl = (imgUrl: string): string => imgUrl.replace(/amp;/g, "");

export const formatPosts = (listing: PostListing): PostType[] =>
    listing.data.children.map(({ data }) => ({
        id: data.id,
        title: data.title,
        subreddit: data.subreddit,
        author: data.author,
        timestamp: data.created,
        url: data.permalink,
        score: data.score,
        comments: data.num_comments,
        type: data.post_hint ?? null,
        icon: data.sr_detail?.icon_img ?? null,
        media: data.preview?.images[0]?.source.url ? decodeUrl(data.preview.images[0].source.url) : null,
    }));

const isComment = (child: CommentChild): child is Extract<CommentChild, { kind: "t1" }> =>
    child.kind === "t1";

export const formatReplies = (replies: CommentListing | "" | undefined): CommentType[] => {
    if (!replies) {
        return [];
    }

    return replies.data.children.filter(isComment).map(({ data }) => ({
        id: data.id,
        author: data.author,
        body: data.body,
        timestamp: data.created,
        score: data.score,
        scoreHidden: data.score_hidden,
        collapsed: data.collapsed,
        replies: formatReplies(data.replies),
    }));
};
