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
  app/          Expo Router routes only. Each view in its own folder with index.tsx (layouts like _layout.tsx and groups stay). No reusable code.
  views/        Screen views, one folder per view: Name.tsx, Name.types.ts, Name.styles.ts
  components/   Reusable UI and domain components, one folder per component
  hooks/        Custom hooks, one folder per hook: useName.ts, useName.types.ts
  state/        React Context providers, one folder per provider
  services/     I/O, one folder per service: name.ts, name.types.ts
  lib/          Pure logic and domain types, one folder per feature. No React / React Native imports. Has tests.
  theme/        Colors, spacing, radius
```

- Use the `@/` alias (maps to `src/`). No `../..` imports.
- No barrel files or re-exports/forwarding (`export ... from`). Import directly from the destination file that defines the symbol.
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
- If a type field needs a comment, put it inline next to the field (`field: number; // comment`), not above it.

### Naming

- Never use single-letter or cryptic names, also in callbacks and loops:
  `exercise`, `workout`, `workoutSet`, `index`, not `e`, `w`, `s`, `i`.
- Components: PascalCase. Functions and variables: camelCase. Constants: UPPER_SNAKE_CASE.
- Functions start with a verb.
- Name files after the main thing they export.

### Enum-like values

- Never use inline string unions (`'a' | 'b'`) or raw string literals for fixed sets of values.
- Do not use the `enum` keyword. Put the const object in `*.constants.ts` and its derived type in `*.types.ts`:
  ```ts
  // Button.constants.ts
  export const ButtonVariants = {
    PRIMARY: 'PRIMARY',
    SECONDARY: 'SECONDARY',
    DANGER: 'DANGER',
    GHOST: 'GHOST',
  } as const;

  // Button.types.ts
  export type ButtonVariant = (typeof ButtonVariants)[keyof typeof ButtonVariants];
  ```
- Use the constant everywhere: `variant === ButtonVariants.PRIMARY`.
- Replace magic numbers and strings with named constants.

### TypeScript

- All `type` declarations live in `*.types.ts` files (or `src/lib/types.ts`), never in `.tsx`, `.styles.ts`, `.constants.ts`, hooks or logic files.
- No `any`. No `as` casts or `!` unless unavoidable, with a short comment why.
- Avoid unnecessary optional `?` operators (`?:` or `?.`) when values always exist or can be explicit `| null`.
- Use `type`, not `interface` when possible.
- Exported functions and inline callbacks have explicit parameter and return types.

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
