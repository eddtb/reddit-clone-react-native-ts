import { useSearchParams } from "expo-router";
import { FlatList } from "react-native";

import { useGetComments, useGetPost } from "../../api/queries";
import ErrorState from "../../components/ErrorState";
import Loader from "../../components/Loader";
import StyledWrapper from "../../components/StyledWrapper";
import Card from "../../features/Card";
import Comment from "../../features/Comment";

export default function Post() {
    // Typed params — expo-router's hook takes a generic, no `as unknown as` cast.
    const { id } = useSearchParams<{ id: string }>();

    const post = useGetPost(id);
    const { data, isLoading, isError, refetch } = useGetComments(id, post?.url);

    return (
        <FlatList
            data={isLoading ? [] : data ?? []}
            ListHeaderComponent={post ? <Card data={post} /> : null}
            ListEmptyComponent={
                isLoading ? (
                    <Loader />
                ) : isError ? (
                    <ErrorState message="Couldn't load comments." onRetry={() => refetch()} />
                ) : (
                    <ErrorState message="No comments yet." />
                )
            }
            renderItem={({ item }) => (
                <StyledWrapper>
                    <Comment data={item} />
                </StyledWrapper>
            )}
            keyExtractor={(item) => item.id}
        />
    );
}
