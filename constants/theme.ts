import { useColorScheme } from "react-native";

export interface Palette {
    /** Screen background (behind cards). */
    background: string;
    /** Card / sheet background. */
    surface: string;
    text: string;
    textSecondary: string;
    /** Borders, skeleton blocks, pressed states. */
    divider: string;
    accent: string;
}

export const light: Palette = {
    background: "#e5e7eb",
    surface: "#ffffff",
    text: "#313234",
    textSecondary: "#9A9A9A",
    divider: "#e5e7eb",
    accent: "#ED001C",
};

export const dark: Palette = {
    background: "#1a1a1b",
    surface: "#272729",
    text: "#d7dadc",
    textSecondary: "#818384",
    divider: "#343536",
    accent: "#ED001C",
};

/** Palette for the current system appearance (app.json sets userInterfaceStyle: automatic). */
export const usePalette = (): Palette => (useColorScheme() === "dark" ? dark : light);
