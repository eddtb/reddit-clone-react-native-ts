import { StyleSheet, Text, TextProps } from "react-native";

import { usePalette } from "../constants/theme";

interface StyledTextProps extends TextProps {
    light?: boolean;
    small?: boolean;
}

export default function StyledText({ light, small, style, ...rest }: StyledTextProps) {
    const palette = usePalette();

    return (
        <Text
            {...rest}
            style={[
                styles.base,
                { fontSize: small ? 12 : 15, color: light ? palette.textSecondary : palette.text },
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    base: {
        lineHeight: 21,
        fontFamily: "Varela",
    },
});
