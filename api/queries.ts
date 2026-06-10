import { useInfiniteQuery, UseInfiniteQueryResult, useQuery, UseQueryResult } from "@tanstack/react-query";

import { fetchComments, fetchPosts } from "./fetches";
import { CommentType, PostPage, PostType } from "../constants/types";

export const useGetPosts = (): UseInfiniteQueryResult<PostPage, Error> =>
    useInfiniteQuery<PostPage, Error>({
        queryKey: ["posts", "infinite"],
        queryFn: () => fetchPosts(),
        getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    });

// The post id is part of the cache key: each post caches its own comments.
// (The old key was a shared ["comments"], so post B could show post A's thread.)
export const useGetComments = (
    id: string | undefined,
    permalink: string | undefined
): UseQueryResult<CommentType[], Error> =>
    useQuery<CommentType[], Error>({
        queryKey: ["comments", id],
        queryFn: () => fetchComments(permalink ?? ""),
        enabled: !!id,
    });

// Reads one post out of the already-cached feed. Hooks are called
// unconditionally — the early return sits after them, per the Rules of Hooks.
export const useGetPost = (id: string | undefined): PostType | null => {
    const posts = useGetPosts();

    if (!id) {
        return null;
    }

    return posts.data?.pages.flatMap((page) => page.posts).find((post) => post.id === id) ?? null;
};
