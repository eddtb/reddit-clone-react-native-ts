# Code-review improvements (this branch)

This branch is the "fixed" version of the app after a code review, using only
technologies and practices that were current for Expo SDK 48 / React Native
0.71 (early 2023). The original code is untouched on the main/session branches,
so the two can be diffed side by side.

## Correctness bugs fixed

| Bug | Where it was | Fix |
| --- | --- | --- |
| Conditional hook call (Rules of Hooks): `useGetPost` returned before calling `useGetPosts()` | `actions/queries.tsx` | Hooks run unconditionally; the early return moved after them (`api/queries.ts`) |
| All posts shared one comments cache entry (`["comments"]`), so post B could show post A's thread | `actions/queries.tsx` | Cache key includes the post id: `["comments", id]` |
| `PostType.icon` typed `string` but really `string \| undefined` → `.trim()` crash in `Card` | `constants/types.tsx` / `features/Card.tsx` | Honest types (`string \| null`) + guarded fallback to the bundled icon |
| `useMemo(..., [])` reading `timestamp`/`replies` — stale-closure misuse, called inside JSX | `features/Comment.tsx` | Plain computation; memoization moved to `React.memo` on components |
| Unvalidated API parsing (`preview?: any`, unguarded `preview?.images[0].source.url`) | `constants/types.tsx`, `actions/methods.tsx` | zod schemas validate everything at the data boundary (`api/schemas.ts`); no `any` remains |

## Performance

- **FlashList** (`@shopify/flash-list@1.4.0`, the SDK 48-pinned version) replaces
  `FlatList` for the media feed.
- **Stable keys**: `keyExtractor` is `item.id` (the old key appended the list
  index, which breaks recycling as pages load).
- **`React.memo`** on `Card` and `Comment`, with a hoisted, `useCallback`-wrapped
  `renderItem` — rows no longer re-render on unrelated parent state changes.
- **expo-image** now actually used (it was a dependency the app paid for but
  never imported): disk+memory caching, fade-in transitions.
- `onEndReachedThreshold` corrected from `5` to `0.5`.

## Data layer

- zod (`api/schemas.ts`) parses everything entering the app; malformed data
  fails loudly at the boundary instead of crashing a component mid-render.
- `QueryClient` has explicit defaults (`staleTime`, `retry`,
  `refetchOnWindowFocus: false`) instead of per-query one-offs.
- Error states are distinct from empty states, with a retry affordance
  (`components/ErrorState.tsx`); `isError` was previously never read.
- Navigation decoupled from Reddit's URL shape: routes are `/post/[id]` instead
  of pushing the raw permalink into a catch-all route. The permalink stays a
  data concern.

## Accessibility

- `Pressable`s have `accessibilityRole="button"`, labels, and hints.
- Comments expose `accessibilityState.expanded` for their collapse state.
- Score/comment counts are grouped with spoken labels ("12 points");
  post images carry a description; error messages use `accessibilityRole="alert"`.

## Theming

- Light/dark palettes driven by `useColorScheme` (`constants/theme.ts`) —
  `userInterfaceStyle: "automatic"` was already set but never used. Headers,
  cards, text, skeletons, and pressed states all adapt.

## Type safety

- `strict` TypeScript now holds everywhere: no `any`, no `StyleSheet.create<any>`,
  no `as unknown as` casts (`useSearchParams` uses its generic), nullable fields
  typed as nullable (`nextPageToken: string | null`).
- Non-JSX files renamed `.tsx` → `.ts`.

## Tooling & process

- **ESLint** (`eslint-config-universe` + `eslint-plugin-react-hooks`) — the
  react-hooks rules would have caught two of the bugs above automatically.
- **Prettier**, **Jest** (`jest-expo`) with tests for the formatters, the zod
  schemas, and the `Comment` collapse behaviour, and a **GitHub Actions** CI
  workflow running type-check + lint + tests on every push/PR.
- `actions/` split into `api/` (data access) and `utils/` (pure helpers).

## Build note

FlashList is a native dependency, so this branch needs a fresh native build:

```bash
npm install
npx expo prebuild --clean
npx expo run:ios
```
