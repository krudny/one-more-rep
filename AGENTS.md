# OneMoreRep

Expo / React Native app (TypeScript, Expo Router). Local-first gym workout tracker.
Goal for all code: the simplest, most readable code possible.

## Expo docs

Expo ships breaking changes every SDK release. Do not rely on memory for Expo or React Native APIs.
Read the major version of `expo` in `package.json` and use `https://docs.expo.dev/versions/v<major>.0.0/`.
Index of all docs: https://docs.expo.dev/llms.txt

## Commands

```bash
npm start                  # dev server (press i / a / w for iOS / Android / web)
npx expo install <package> # ALWAYS use this instead of npm install <package>
npx expo install --fix     # fix incompatible package versions
npx expo-doctor            # diagnose dependency and config issues
npm run typecheck          # tsc --noEmit
npm test                   # unit tests for src/lib (plain Node)
npm run format             # Prettier (write)
```

Before declaring any task done: `npm run typecheck`, `npm test` and `npm run format` must pass.

## Project structure

```
src/
  app/          Expo Router screens only. A file here is a route. No reusable code.
  components/   One folder per component: Name.tsx, Name.types.ts, Name.styles.ts
  hooks/        Custom hooks (data loading, timers, screen logic)
  state/        React Context providers
  services/     I/O: network (exerciseApi) and device storage (storage)
  lib/          Pure logic and domain types. No React / React Native imports. Has tests.
  theme/        Colors, spacing, radius
```

- Use the `@/` alias (maps to `src/`). No `../..` imports.
- Exception: files in `src/lib/` import siblings as `./file.ts`, so tests can run in plain Node.
- Routes live in `src/app/`. Use `Link`, `router`, `useLocalSearchParams` from `expo-router`.

## Expo rules

- `ios/` and `android/` are generated (Continuous Native Generation). Never create or edit them. Configure native behavior in `app.json` and config plugins.
- Expo Go only has its bundled native modules. A library with native code needs a development build (`npx expo run:ios|android`).
- Prefer Expo modules over third-party libraries. Do not add dependencies without asking.

## Code style

### Simplicity

- Write the most obvious code. No clever one-liners, no deep nesting, no nested ternaries.
- Use early returns instead of nested `if`.
- Do not abstract until something is used in at least two places.
- Keep functions short and focused on one job. Split a file when it grows beyond roughly 150 lines.
- Comments explain why, never what. No commented-out code. Prefer no comments. 

### Naming

- Never use single-letter or cryptic names, also in callbacks and loops:
  `exercise`, `workout`, `workoutSet`, `index`, not `e`, `w`, `s`, `i`.
- Components: PascalCase. Functions and variables: camelCase. Constants: UPPER_SNAKE_CASE.
- Booleans start with `is`, `has`, `should` or `can`. Functions start with a verb.
- Name files after the main thing they export.

### Enum-like values

- Never use inline string unions (`'a' | 'b'`) or raw string literals for fixed sets of values.
- Do not use the `enum` keyword. Use a const object plus a derived type:
  ```ts
  export const ButtonVariants = {
    PRIMARY: 'PRIMARY',
    SECONDARY: 'SECONDARY',
    DANGER: 'DANGER',
    GHOST: 'GHOST',
  } as const;

  export type ButtonVariant = (typeof ButtonVariants)[keyof typeof ButtonVariants];
  ```
- Use the constant everywhere: `variant === ButtonVariants.PRIMARY`.
- Replace magic numbers and strings with named constants.

### TypeScript

- Types live in separate `.ts` files, never in `.tsx` component files:
  props in `Name.types.ts`, domain types in `src/lib/types.ts`, constants next to the code that owns them in a `*.constants.ts` file.
- No `any`. No `as` casts or `!` unless unavoidable, with a short comment why.
- Use `type`, not `interface` when possible. 
- Exported functions have explicit return types.

### Components

- One exported component per file.
- A component renders UI and calls hooks. Loading data, effects with cleanup, timers and form logic go to a custom hook in `src/hooks/`.
- Props destructured in the signature, with a typed props object from `Name.types.ts`.

### Styles and theme

- No inline style objects and no `StyleSheet.create` inside component files.
- Styles live in `Name.styles.ts`. Styles that depend on colors are created by a function: `createNameStyles(colors)`.
- No hex colors, raw spacing or radius numbers outside `src/theme/`.
- Colors have UPPER_CASE keys defined once, so light and dark cannot diverge: `const colors = useColors();` then `colors.CARD`, `colors.TEXT`.
- Spacing and radius are constants: `SPACING.MD`, `RADIUS.LG`.

### Formatting

- Prettier is the single source of truth. Never hand-format. Run `npm run format`.

### Tests

- New or changed logic in `src/lib/` gets a `*.test.ts` next to it.