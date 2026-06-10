// expo-router v1 ships TypeScript source (its package "main" points at src/),
// so its imports are type-checked as part of this app. escape-string-regexp@1
// has no bundled types — this shim fills the gap.
declare module "escape-string-regexp" {
    const escapeStringRegexp: (input: string) => string;
    export default escapeStringRegexp;
}
