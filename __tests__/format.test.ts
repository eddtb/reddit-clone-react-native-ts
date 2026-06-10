import { CommentListing, PostListing } from "../api/schemas";
import { decodeUrl, formatPosts, formatReplies, timeFromNow } from "../utils/format";

const post = (overrides: Partial<PostListing["data"]["children"][number]["data"]> = {}) => ({
    kind: "t3",
    data: {
        id: "p1",
        title: "A title",
        subreddit: "test",
        author: "alice",
        created: 1700000000,
        permalink: "/r/test/comments/p1/a_title/",
        score: 12,
        num_comments: 3,
        ...overrides,
    },
});

describe("formatPosts", () => {
    it("maps Reddit fields onto the app's PostType", () => {
        const listing: PostListing = { data: { after: "t3_next", children: [post()] } };
        const [result] = formatPosts(listing);

        expect(result).toEqual({
            id: "p1",
            title: "A title",
            subreddit: "test",
            author: "alice",
            timestamp: 1700000000,
            url: "/r/test/comments/p1/a_title/",
            score: 12,
            comments: 3,
            type: null,
            icon: null,
            media: null,
        });
    });

    it("uses null (not undefined) when sr_detail or preview are missing", () => {
        const listing: PostListing = { data: { after: null, children: [post()] } };
        const [result] = formatPosts(listing);

        expect(result.icon).toBeNull();
        expect(result.media).toBeNull();
    });

    it("decodes HTML-escaped media URLs", () => {
        const listing: PostListing = {
            data: {
                after: null,
                children: [
                    post({
                        preview: { images: [{ source: { url: "https://example.com/a.jpg?x=1&amp;y=2" } }] },
                        sr_detail: { icon_img: "https://example.com/icon.png" },
                    }),
                ],
            },
        };
        const [result] = formatPosts(listing);

        expect(result.media).toBe("https://example.com/a.jpg?x=1&y=2");
        expect(result.icon).toBe("https://example.com/icon.png");
    });
});

const comment = (id: string, replies: CommentListing | "" = "") => ({
    kind: "t1" as const,
    data: {
        id,
        author: `author_${id}`,
        body: `body ${id}`,
        created: 1700000000,
        score: 5,
        score_hidden: false,
        collapsed: false,
        replies,
    },
});

describe("formatReplies", () => {
    it('returns [] for "" and undefined (Reddit sends "" when there are no replies)', () => {
        expect(formatReplies("")).toEqual([]);
        expect(formatReplies(undefined)).toEqual([]);
    });

    it('filters out "more" stubs', () => {
        const listing: CommentListing = {
            data: { children: [comment("c1"), { kind: "more" }] },
        };

        const result = formatReplies(listing);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("c1");
    });

    it("recurses through nested replies", () => {
        const listing: CommentListing = {
            data: {
                children: [
                    comment("c1", {
                        data: { children: [comment("c1a", { data: { children: [comment("c1a1")] } })] },
                    }),
                ],
            },
        };

        const [top] = formatReplies(listing);
        expect(top.replies).toHaveLength(1);
        expect(top.replies[0].id).toBe("c1a");
        expect(top.replies[0].replies[0].id).toBe("c1a1");
    });
});

describe("timeFromNow", () => {
    it("formats a unix timestamp as a relative string", () => {
        const twoHoursAgo = Math.floor(Date.now() / 1000) - 2 * 3600;
        expect(timeFromNow(twoHoursAgo)).toBe("2 hours ago");
    });
});

describe("decodeUrl", () => {
    it("strips amp; entities", () => {
        expect(decodeUrl("a?b=1&amp;c=2&amp;d=3")).toBe("a?b=1&c=2&d=3");
    });
});
