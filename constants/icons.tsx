import { Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";

import { usePalette } from "./theme";

interface IconProps {
    small?: boolean;
}

export const ArrowIcon = ({ small }: IconProps) => {
    const palette = usePalette();
    return <FontAwesome5 name="arrow-alt-circle-up" size={small ? 15 : 20} color={palette.textSecondary} />;
};

export const CommentsIcon = ({ small }: IconProps) => {
    const palette = usePalette();
    return <FontAwesome name="comment-o" size={small ? 15 : 20} color={palette.textSecondary} />;
};

export const DividerIcon = ({ small }: IconProps) => {
    const palette = usePalette();
    return <Entypo name="dot-single" size={small ? 15 : 20} color={palette.textSecondary} />;
};
