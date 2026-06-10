import { Image, ImageProps } from "expo-image";
import { StyleSheet, useWindowDimensions } from "react-native";

import { usePalette } from "../constants/theme";

interface StyledImageProps extends ImageProps {
    circle?: boolean;
    height?: number;
    width?: number;
}

// expo-image instead of the core Image: disk+memory caching, fade-in
// transitions, and better decode performance for a scrolling media feed.
export default function StyledImage({ circle, height, width, style, ...rest }: StyledImageProps) {
    const palette = usePalette();
    const windowWidth = useWindowDimensions().width - 40;
    const resolvedWidth = width ?? windowWidth;
    const resolvedHeight = height ?? windowWidth;

    return (
        <Image
            {...rest}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
            // expo-image v1 types `style` as a single object — flatten the composition.
            style={StyleSheet.flatten([
                {
                    width: resolvedWidth,
                    height: resolvedHeight,
                    borderRadius: circle ? resolvedHeight / 2 : 0,
                    backgroundColor: palette.divider,
                },
                style,
            ])}
        />
    );
}
