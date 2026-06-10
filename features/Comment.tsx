import { memo, useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import StyledText from "../components/StyledText";
import StyledView from "../components/StyledView";
import { ArrowIcon, DividerIcon } from "../constants/icons";
import { usePalette } from "../constants/theme";
import { CommentType } from "../constants/types";
import { timeFromNow } from "../utils/format";

function Comment({ data }: { data: CommentType }) {
    const palette = usePalette();
    const { author, collapsed, body, scoreHidden, score, replies, timestamp } = data;
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const timeAgo = timeFromNow(timestamp);

    const collapseHandler = () => setIsCollapsed((prev) => !prev);

    // Collapsed sections stay mounted (display: none) so nested expand/collapse
    // state survives a parent being toggled.
    const collapsedStyle: ViewStyle | undefined = isCollapsed ? styles.hidden : undefined;

    return (
        <View>
            <Pressable
                onPress={collapseHandler}
                accessibilityRole="button"
                accessibilityState={{ expanded: !isCollapsed }}
                accessibilityLabel={`Comment by ${author}, ${timeAgo}, ${
                    scoreHidden ? "score hidden" : `${score} points`
                }`}
                accessibilityHint="Collapses or expands this comment"
                style={({ pressed }) => [styles.wrapper, pressed && { backgroundColor: palette.background }]}
            >
                <StyledView row gap={5}>
                    <StyledText light small>
                        {author}
                    </StyledText>
                    <DividerIcon small />
                    <StyledText light small>
                        {timeAgo}
                    </StyledText>
                </StyledView>

                <View style={collapsedStyle}>
                    <StyledText>{body}</StyledText>

                    <StyledView row gap={5} style={styles.scoreContainer}>
                        <ArrowIcon small />
                        <StyledText light small>
                            {scoreHidden ? "Hidden" : score}
                        </StyledText>
                    </StyledView>
                </View>
            </Pressable>

            {replies.length > 0 ? (
                <View style={[styles.replies, { borderLeftColor: palette.divider }, collapsedStyle]}>
                    {replies.map((item) => (
                        <Comment key={item.id} data={item} />
                    ))}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 5,
        padding: 2,
    },
    replies: {
        paddingLeft: 10,
        borderLeftWidth: 1,
    },
    hidden: {
        display: "none",
    },
    scoreContainer: {
        alignSelf: "flex-end",
    },
});

// memo: collapsing one comment doesn't re-render its siblings.
export default memo(Comment);
