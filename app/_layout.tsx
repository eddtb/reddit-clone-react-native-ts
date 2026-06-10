import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { usePalette } from "../constants/theme";

export { ErrorBoundary } from "expo-router";

const client = new QueryClient({
    defaultOptions: {
        // Sensible client-wide defaults instead of per-query one-offs: posts
        // and comments are not hot data, so don't refetch on every focus.
        queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Varela: require("../assets/fonts/VarelaRound-Regular.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    if (!loaded) {
        return <SplashScreen />;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const palette = usePalette();

    return (
        <QueryClientProvider client={client}>
            <StatusBar style="auto" />
            <Stack
                screenOptions={{
                    contentStyle: { backgroundColor: palette.background, paddingHorizontal: 10 },
                    headerStyle: { backgroundColor: palette.surface },
                    headerTintColor: palette.text,
                }}
            >
                <Stack.Screen name="index" options={{ title: "/r/all/hot" }} />
                <Stack.Screen name="post/[id]" options={{ title: "Post" }} />
            </Stack>
        </QueryClientProvider>
    );
}
