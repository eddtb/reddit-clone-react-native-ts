import { ScrollView, View, ViewStyle } from "react-native";

import StyledView from "./StyledView";
import StyledWrapper from "./StyledWrapper";
import { Palette, usePalette } from "../constants/theme";

export default function Loader() {
    return (
        <ScrollView style={{ flex: 1 }} scrollEnabled={false} accessibilityLabel="Loading posts">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </ScrollView>
    );
}

const block = (palette: Palette, width: number | string = "100%"): ViewStyle => ({
    width,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.divider,
});

const circle = (palette: Palette, size: number = 30): ViewStyle => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: palette.divider,
});

const Skeleton = () => {
    const palette = usePalette();

    return (
        <StyledWrapper>
            <StyledView gap={10}>
                <StyledView row gap={15}>
                    <View style={circle(palette, 35)} />
                    <StyledView gap={5}>
                        <View style={block(palette, 190)} />
                        <StyledView row gap={10}>
                            <View style={block(palette, 80)} />
                            <View style={circle(palette, 10)} />
                            <View style={block(palette, 80)} />
                        </StyledView>
                    </StyledView>
                </StyledView>

                <StyledView gap={5}>
                    <View style={block(palette)} />
                    <View style={block(palette)} />
                    <View style={block(palette)} />
                </StyledView>

                <StyledView row gap={50}>
                    <StyledView row gap={10}>
                        <View style={circle(palette)} />
                        <View style={block(palette, 80)} />
                    </StyledView>
                    <StyledView row gap={10}>
                        <View style={circle(palette)} />
                        <View style={block(palette, 80)} />
                    </StyledView>
                </StyledView>
            </StyledView>
        </StyledWrapper>
    );
};
