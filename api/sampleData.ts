// Realistic, Reddit-shaped sample data used because live Reddit requests are
// blocked (Reddit 403s anonymous access to its public *.json endpoints, and
// OAuth app registration is currently gated). The objects mirror Reddit's raw
// API response and are validated by the zod schemas in schemas.ts before use,
// so they flow through the formatters exactly like live data would. Placeholder
// images come from picsum.photos (not Reddit), so they load normally.

const now = Math.floor(Date.now() / 1000);
const hoursAgo = (h: number): number => now - h * 3600;

const preview = (seed: string) => ({
    images: [{ source: { url: `https://picsum.photos/seed/${seed}/800/500` } }],
});
const srIcon = (seed: string) => ({ icon_img: `https://picsum.photos/seed/${seed}-icon/96/96` });

// Exported as `unknown`: the only way into the app is through a zod parse.
export const SAMPLE_POSTS: unknown = {
    kind: "Listing",
    data: {
        after: null,
        children: [
            {
                kind: "t3",
                data: {
                    id: "s1",
                    title: "My cat discovered the printer and now refuses to leave",
                    subreddit: "funny",
                    author: "paper_jam_pat",
                    created: hoursAgo(2),
                    permalink: "/r/funny/comments/s1/my_cat_discovered_the_printer/",
                    score: 48213,
                    num_comments: 1024,
                    post_hint: "image",
                    preview: preview("cat"),
                    sr_detail: srIcon("funny"),
                },
            },
            {
                kind: "t3",
                data: {
                    id: "s2",
                    title: "TIL octopuses have three hearts and blue blood",
                    subreddit: "todayilearned",
                    author: "deep_sea_dave",
                    created: hoursAgo(5),
                    permalink: "/r/todayilearned/comments/s2/til_octopuses_have_three_hearts/",
                    score: 22945,
                    num_comments: 612,
                    post_hint: "link",
                    sr_detail: srIcon("til"),
                },
            },
            {
                kind: "t3",
                data: {
                    id: "s3",
                    title: "Rescued this little guy yesterday — meet Biscuit",
                    subreddit: "aww",
                    author: "goodboy_greg",
                    created: hoursAgo(8),
                    permalink: "/r/aww/comments/s3/rescued_this_little_guy/",
                    score: 89342,
                    num_comments: 2310,
                    post_hint: "image",
                    preview: preview("puppy"),
                    sr_detail: srIcon("aww"),
                },
            },
            {
                kind: "t3",
                data: {
                    id: "s4",
                    title: "After 6 years I finally shipped my side project",
                    subreddit: "programming",
                    author: "ship_it_sam",
                    created: hoursAgo(11),
                    permalink: "/r/programming/comments/s4/after_6_years_i_finally_shipped/",
                    score: 13407,
                    num_comments: 845,
                    post_hint: "self",
                    sr_detail: srIcon("prog"),
                },
            },
            {
                kind: "t3",
                data: {
                    id: "s5",
                    title: "Sunrise over the Dolomites this morning",
                    subreddit: "pics",
                    author: "alpine_amy",
                    created: hoursAgo(14),
                    permalink: "/r/pics/comments/s5/sunrise_over_the_dolomites/",
                    score: 64120,
                    num_comments: 932,
                    post_hint: "image",
                    preview: preview("mountains"),
                    sr_detail: srIcon("pics"),
                },
            },
            {
                kind: "t3",
                data: {
                    id: "s6",
                    title: "What's a small skill that drastically improved your life?",
                    subreddit: "AskReddit",
                    author: "curious_casey",
                    created: hoursAgo(17),
                    permalink: "/r/AskReddit/comments/s6/whats_a_small_skill/",
                    score: 30188,
                    num_comments: 5421,
                    post_hint: "self",
                    sr_detail: srIcon("ask"),
                },
            },
            {
                kind: "t3",
                data: {
                    id: "s7",
                    title: "My homelab finally fits in one rack",
                    subreddit: "homelab",
                    author: "rack_n_roll",
                    created: hoursAgo(20),
                    permalink: "/r/homelab/comments/s7/my_homelab_finally_fits/",
                    score: 9921,
                    num_comments: 401,
                    post_hint: "image",
                    preview: preview("servers"),
                    sr_detail: srIcon("homelab"),
                },
            },
            {
                kind: "t3",
                data: {
                    id: "s8",
                    title: "Scientists develop a battery that charges in under five minutes",
                    subreddit: "science",
                    author: "volt_vera",
                    created: hoursAgo(26),
                    permalink: "/r/science/comments/s8/battery_charges_in_five_minutes/",
                    score: 41277,
                    num_comments: 1576,
                    post_hint: "link",
                    sr_detail: srIcon("science"),
                },
            },
        ],
    },
};

const reply = (
    id: string,
    author: string,
    body: string,
    score: number,
    h: number,
    replies: object | "" = "",
    collapsed: boolean = false,
    score_hidden: boolean = false
) => ({
    kind: "t1",
    data: {
        id,
        author,
        body,
        score,
        score_hidden,
        collapsed,
        created: hoursAgo(h),
        author_fullname: `t2_${id}`,
        replies,
    },
});

// Reddit's comments endpoint returns [postListing, commentsListing]; fetchComments
// reads index [1], so the sample matches that two-element shape.
export const SAMPLE_COMMENTS: unknown = [
    { kind: "Listing", data: { children: [] } },
    {
        kind: "Listing",
        data: {
            children: [
                reply(
                    "c1",
                    "top_commenter_tom",
                    "This is exactly what I needed to see today. Thanks for sharing!",
                    1242,
                    1,
                    {
                        data: {
                            children: [
                                reply(
                                    "c1a",
                                    "reply_rachel",
                                    "Completely agree — saved it for later.",
                                    318,
                                    1
                                ),
                                reply("c1b", "nested_ned", "Same here, this whole thread is gold.", 96, 1, {
                                    data: {
                                        children: [
                                            reply(
                                                "c1b1",
                                                "deep_dana",
                                                "Going one level deeper just because we can 👀",
                                                21,
                                                0
                                            ),
                                        ],
                                    },
                                }),
                            ],
                        },
                    }
                ),
                reply("c2", "skeptical_sue", "Source? I'd genuinely love to read more about this.", 740, 2, {
                    data: {
                        children: [
                            reply(
                                "c2a",
                                "helpful_harry",
                                "There's a solid write-up linked further down the thread.",
                                205,
                                2
                            ),
                        ],
                    },
                }),
                reply(
                    "c3",
                    "punny_pete",
                    "I came for the post and stayed for the comments. Not disappointed.",
                    533,
                    3
                ),
                reply(
                    "c4",
                    "quiet_quinn",
                    "This comment has its score hidden, for variety.",
                    0,
                    4,
                    "",
                    false,
                    true
                ),
                reply(
                    "c5",
                    "collapsed_carl",
                    "This one starts collapsed — tap the row to expand it.",
                    88,
                    5,
                    "",
                    true
                ),
                reply(
                    "c6",
                    "long_winded_lou",
                    "The more I think about it, the more impressed I am. The effort behind something like this is wildly underrated, and most people scroll right past without realizing how much went into it.",
                    412,
                    6
                ),
            ],
        },
    },
];
