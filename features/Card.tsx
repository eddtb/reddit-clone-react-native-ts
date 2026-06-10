import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, View } from "react-native";

import StyledImage from "../components/StyledImage";
import StyledText from "../components/StyledText";
import StyledView from "../components/StyledView";
import StyledWrapper from "../components/StyledWrapper";
import { ArrowIcon, CommentsIcon, DividerIcon } from "../constants/icons";
import { PostType } from "../constants/types";
import { timeFromNow } from "../utils/format";

type Props = {
    data: PostType;
    active?: boolean;
};

function Card({ data, active }: Props) {
    const router = useRouter();
    const timeAgo = timeFromNow(data.timestamp);

    const selectHandler = () => {
        // Navigation is keyed by post id (the permalink stays a data concern);
        // the comments screen reads the post back out of the feed cache.
        router.push(`/post/${data.id}`);
    };

    // icon is string | null — fall back to the bundled splash mark when the
    // subreddit has no avatar instead of crashing on `.trim()` of undefined.
    const iconSource =
        data.icon && data.icon.trim().length > 0
            ? { uri: data.icon }
            : require("../assets/images/splash.png");

    return (
        <Pressable
            onPress={selectHandler}
            disabled={!active}
            accessibilityRole={active ? "button" : undefined}
            accessibilityLabel={`${data.title}. r/${data.subreddit}, posted by u/${data.author} ${timeAgo}`}
            accessibilityHint={active ? "Opens the post and its comments" : undefined}
        >
            <StyledWrapper gap={10}>
                <StyledView row gap={15}>
                    <StyledImage height={35} width={35} circle source={iconSource} />
                    <View>
                        <StyledText light small>
                            r/{data.subreddit}
                        </StyledText>
                        <StyledView row>
                            <StyledText light small>
                                u/{data.author}
                            </StyledText>
                            <DividerIcon />
                            <StyledText light small>
                                {timeAgo}
                            </StyledText>
                        </StyledView>
                    </View>
                </StyledView>

                <StyledText>{data.title}</StyledText>

                {data.media ? (
                    <StyledImage
                        height={250}
                        source={{ uri: data.media }}
                        accessibilityLabel={`Image for post: ${data.title}`}
                    />
                ) : null}

                <StyledView row gap={20}>
                    <StyledView row gap={10} accessible accessibilityLabel={`${data.score} points`}>
                        <ArrowIcon />
                        <StyledText light small>
                            {data.score}
                        </StyledText>
                    </StyledView>
                    <StyledView row gap={10} accessible accessibilityLabel={`${data.comments} comments`}>
                        <CommentsIcon />
                        <StyledText light small>
                            {data.comments}
                        </StyledText>
                    </StyledView>
                </StyledView>
            </StyledWrapper>
        </Pressable>
    );
}

// memo: list rows only re-render when their own post changes, not on every
// parent state change (pagination, refetch flags, …).
export default memo(Card);
