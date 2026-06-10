import { View, ViewProps } from "react-native";

import { usePalette } from "../constants/theme";

interface StyledWrapperProps extends ViewProps {
    gap?: number;
}

export default function StyledWrapper({ gap, style, ...rest }: StyledWrapperProps) {
    const palette = usePalette();

    return (
        <View
            {...rest}
            style={[
                { backgroundColor: palette.surface, padding: 10, marginTop: 20, rowGap: gap ?? 0 },
                style,
            ]}
        />
    );
}
