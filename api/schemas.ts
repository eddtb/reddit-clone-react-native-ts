import { z } from "zod";

// Zod schemas for the raw Reddit listing shapes this app consumes. All data
// entering the app is parsed at the boundary (see fetches.ts), so everything
// past this file is fully typed — the `preview?: any` / `sr_detail?: any`
// holes in the old types are gone, and a malformed payload fails loudly at
// parse time instead of crashing a component mid-render.

const previewSchema = z.object({
    images: z.array(z.object({ source: z.object({ url: z.string() }) })),
});

const subredditDetailSchema = z.object({
    icon_img: z.string().optional(),
});

const postChildSchema = z.object({
    kind: z.string(),
    data: z.object({
        id: z.string(),
        title: z.string(),
        subreddit: z.string(),
        author: z.string(),
        created: z.number(),
        permalink: z.string(),
        score: z.number(),
        num_comments: z.number(),
        post_hint: z.string().optional(),
        preview: previewSchema.optional(),
        sr_detail: subredditDetailSchema.optional(),
    }),
});

export const postListingSchema = z.object({
    data: z.object({
        after: z.string().nullable(),
        children: z.array(postChildSchema),
    }),
});

export type PostListing = z.infer<typeof postListingSchema>;

// Comments are recursive: a comment's `replies` is another listing, or "" when
// there are none. zod models recursion with z.lazy plus explicit interfaces.
export interface RawCommentData {
    id: string;
    author: string;
    body: string;
    created: number;
    score: number;
    score_hidden: boolean;
    collapsed: boolean;
    replies?: CommentListing | "";
}

// Reddit mixes real comments (kind "t1") with "load more" stubs (kind "more")
// in the same children array; modelling both lets the formatter narrow safely.
export type CommentChild = { kind: "t1"; data: RawCommentData } | { kind: "more" };

export interface CommentListing {
    data: { children: CommentChild[] };
}

const rawCommentDataSchema: z.ZodType<RawCommentData> = z.lazy(() =>
    z.object({
        id: z.string(),
        author: z.string(),
        body: z.string(),
        created: z.number(),
        score: z.number(),
        score_hidden: z.boolean(),
        collapsed: z.boolean(),
        replies: z.union([z.literal(""), commentListingSchema]).optional(),
    })
);

const commentChildSchema: z.ZodType<CommentChild> = z.union([
    z.object({ kind: z.literal("t1"), data: rawCommentDataSchema }),
    z.object({ kind: z.literal("more") }),
]);

export const commentListingSchema: z.ZodType<CommentListing> = z.lazy(() =>
    z.object({
        data: z.object({ children: z.array(commentChildSchema) }),
    })
);

// The comments endpoint returns a two-element array: [postListing, commentListing].
// Only the second element is consumed, so the first stays unvalidated.
export const commentsResponseSchema = z.tuple([z.unknown(), commentListingSchema]);
