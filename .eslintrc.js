module.exports = {
    root: true,
    extends: ["universe/native"],
    plugins: ["react-hooks"],
    rules: {
        // The two rules that would have caught the conditional-hook bug in
        // useGetPost and the empty-deps useMemo in Comment.
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
    overrides: [
        {
            files: ["plugins/**/*.js", "*.config.js", ".eslintrc.js"],
            extends: ["universe/node"],
        },
    ],
    ignorePatterns: ["node_modules", "ios", "android", ".expo", "dist"],
};
