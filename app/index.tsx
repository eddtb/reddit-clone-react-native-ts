import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback } from "react";

import { useGetPosts } from "../api/queries";
import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import Spinner from "../components/Spinner";
import { PostType } from "../constants/types";
import Card from "../features/Card";

// Average card height (header + title + optional media): FlashList uses this
// to lay out before items are measured.
const ESTIMATED_ITEM_SIZE = 360;

export default function Home() {
    const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
        useGetPosts();

    // Hoisted + memoized so FlashList rows aren't re-created every render.
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<PostType>) => <Card active data={item} />,
        []
    );

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <ErrorState message="Couldn't load posts." onRetry={() => refetch()} />;
    }

    return (
        <FlashList
            data={data?.pages.flatMap((page) => page.posts) ?? []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            estimatedItemSize={ESTIMATED_ITEM_SIZE}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                if (hasNextPage) {
                    fetchNextPage();
                }
            }}
            ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
            ListEmptyComponent={<ErrorState message="No posts to show." onRetry={() => refetch()} />}
        />
    );
}
