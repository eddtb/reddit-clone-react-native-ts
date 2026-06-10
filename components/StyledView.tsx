import { View, ViewProps } from "react-native";

interface StyledViewProps extends ViewProps {
    row?: boolean;
    gap?: number;
}

export default function StyledView({ row, gap, style, ...rest }: StyledViewProps) {
    return (
        <View
            {...rest}
            style={[
                {
                    flexDirection: row ? "row" : "column",
                    alignItems: row ? "center" : "stretch",
                    gap: gap ?? 0,
                },
                style,
            ]}
        />
    );
}
