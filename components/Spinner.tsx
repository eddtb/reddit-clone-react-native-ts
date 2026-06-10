import { ActivityIndicator } from "react-native";

import StyledView from "./StyledView";
import { usePalette } from "../constants/theme";

export default function Spinner() {
    const palette = usePalette();

    return (
        <StyledView style={{ marginVertical: 20 }}>
            <ActivityIndicator size="large" color={palette.accent} />
        </StyledView>
    );
}
