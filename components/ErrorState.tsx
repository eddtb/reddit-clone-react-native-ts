import { Pressable } from "react-native";

import StyledText from "./StyledText";
import StyledWrapper from "./StyledWrapper";
import { usePalette } from "../constants/theme";

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

// Distinct from the loading skeleton and from "empty": shows what went wrong
// and, when a retry handler is provided, an affordance to try again.
export default function ErrorState({ message, onRetry }: ErrorStateProps) {
    const palette = usePalette();

    return (
        <StyledWrapper gap={10}>
            <StyledText accessibilityRole="alert">{message ?? "Something went wrong"}</StyledText>
            {onRetry ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Try again"
                    hitSlop={8}
                    onPress={onRetry}
                >
                    <StyledText style={{ color: palette.accent }}>Try again</StyledText>
                </Pressable>
            ) : null}
        </StyledWrapper>
    );
}
