import { SAMPLE_COMMENTS, SAMPLE_POSTS } from "../api/sampleData";
import { commentsResponseSchema, postListingSchema } from "../api/schemas";

describe("postListingSchema", () => {
    it("accepts the bundled sample posts", () => {
        const listing = postListingSchema.parse(SAMPLE_POSTS);

        expect(listing.data.children).toHaveLength(8);
        expect(listing.data.after).toBeNull();
    });

    it("rejects a malformed listing instead of letting it crash a component", () => {
        const malformed = { data: { after: null, children: [{ kind: "t3", data: { id: 123 } }] } };
        expect(() => postListingSchema.parse(malformed)).toThrow();
    });
});

describe("commentsResponseSchema", () => {
    it("accepts the bundled [postListing, commentListing] sample shape", () => {
        const [, comments] = commentsResponseSchema.parse(SAMPLE_COMMENTS);

        expect(comments.data.children.length).toBeGreaterThan(0);
        expect(comments.data.children[0].kind).toBe("t1");
    });

    it("rejects a response whose comments are not a listing", () => {
        expect(() => commentsResponseSchema.parse([{}, { data: { children: "nope" } }])).toThrow();
    });
});
