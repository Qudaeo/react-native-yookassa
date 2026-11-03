# AGENTS.md

React Native TurboModule library wrapping the YooKassa payment SDKs (Android SDK 8.4.0, iOS SDK 11.0.1). Published to npm as `react-native-yookassa`.

## Setup commands

- Install deps: `corepack enable && yarn install` — Yarn 4.18.0 (pinned via the `packageManager` field), `nodeLinker: node-modules`
- Build + typecheck: `yarn build` (runs `tsc`, emits to `lib/`)
- Typecheck only: `npx tsc --noEmit`
- Lint: `npx eslint src index.ts`
- Lint fix: `npx eslint src index.ts --fix`
- Format check: `npx prettier --check "src/**/*.ts"`
- Example app: `yarn example start` / `yarn example android` / `yarn example ios`
- Release: `yarn release` (release-it) — or the manual "Release" GitHub Actions workflow

Use Node 22+ (CI uses 24, `example` requires >= 22.11.0). Note `.nvmrc` still says `v18` and is stale.

There is **no test suite** — no Jest config, no `test` script, no test files. `CONTRIBUTING.md` documents `yarn typecheck` / `yarn lint` / `yarn test`; none of those scripts exist. Verify changes with the build, lint, and a manual example-app run.

## Project layout

- `src/` — public TypeScript API and the TurboModule spec
- `android/` — Kotlin native module (old + new architecture variants)
- `ios/` — Swift implementation plus the Objective-C++ bridge
- `example/` — Yarn workspace demo app that consumes the local library
- `index.ts` — root re-export (`export default YandexPayment`)

## Code style

- TypeScript strict mode (`tsconfig.json`): `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` — type-only imports must use `import type`
- Prettier: single quotes, semicolons, 80-char width, `trailingComma: es5`, `arrowParens: avoid`
- ESLint config: `.eslintrc.js` plus the `eslintConfig` key in `package.json`
- The effective Prettier config is the `prettier` key in `package.json` — it **shadows** `.prettierrc` (Prettier prefers `package.json` over `.prettierrc` in the same directory). Trust the `package.json` key: semicolons on, 80-char width.
- Kotlin: 4-space indent, trailing commas on multi-line argument lists
- Swift: 4-space indent, trailing commas in multi-line parameter lists

## Native module contract (critical)

Changing the public API means changing native code in **all** of these places at once:

1. `src/NativeYookassa.ts` — the codegen spec (`Spec extends TurboModule`)
2. `src/YandexPayment.ts` — the JS → native parameter mapping
3. `android/src/newarch/com/yookassa/YookassaModule.kt` — extends `NativeYookassaSpec`
4. `android/src/oldarch/com/yookassa/YookassaModule.kt` — extends `ReactContextBaseJavaModule`, uses `@ReactMethod`
5. `android/src/main/java/com/yookassa/YandexPaymentImpl.kt` — the shared implementation
6. `ios/YandexPayment.mm` — `RCT_EXTERN_METHOD` declarations must match the spec exactly
7. `ios/YandexPayment.swift` — the Swift implementation

Rules that are easy to break:

- The TurboModule is registered under the name **`'YandexPayment'`**, not `'NativeYookassa'`. `NativeYookassa.ts` is only the codegen spec file. Do not rename either one.
- Codegen config lives in `package.json`: name `RNYookassaSpec`, `jsSrcsDir: "src"`, android `javaPackageName: "com.yookassa"`. The iOS spec header is `RNYookassaSpec/RNYookassaSpec.h`.
- The JS ↔ native parameter names are SCREAMING_SNAKE keys, and each one is hardcoded in three places: the spec, `YandexPayment.ts`, and the native mappers (`mapShop`/`mapPayment` in `YandexPaymentImpl.kt`, the `attach` method in `YandexPayment.swift`). Keys: `SHOP_ID`, `SHOP_TOKEN`, `SHOP_NAME`, `SHOP_RETURN_URL`, `SHOP_DESCRIPTION`, `PAYMENT_AMOUNT`, `PAYMENT_CURRENCY`, `PAYMENT_TYPES_ARRAY`, `PAYMENT_SAVE_TYPE`, `PAYMENT_YOO_MONEY_CLIENT_ID`.
- `show()` resolves `PaymentToken` (`{ token, type }`) but native returns a two-element array `[token, type]` — the tuple shape is part of the contract.
- `show3ds` resolves the literal string `'RESULT_OK'`; `YandexPayment.show3ds` throws `'3ds cancelled'` for any other value.
- The spec must stay valid for both architectures. Old-arch Kotlin uses `@ReactMethod` annotations; new-arch inherits from the generated spec. `ios/YandexPayment.mm` bridges the same three methods (`attach`, `close`, `show3ds`).
- Payment types: `BANK_CARD`, `YOO_MONEY`, `SBERBANK`, `SBP`, `GOOGLE_PAY`. Android has Google Pay commented out; iOS maps unknown values to `BANK_CARD`. Empty type arrays fall back to all available types.

Platform differences to respect:

- Android `close()` is an intentional no-op ("dummy method, just for compatibility with ios").
- Android `show3ds` casts the host activity to `FragmentActivity` — it will throw if the host activity is not one.
- iOS `attach` and `close` must run on the main thread.

## Testing instructions

- No automated tests exist. Add Jest + `react-native` preset and a `test` script if a task calls for unit coverage.
- `yarn build` must pass — it is the typecheck gate.
- `npx eslint src index.ts` must pass for changed files.
- Native changes require rebuilding the example app: JS-only changes hot-reload, Kotlin/Swift changes do not.
- The example app needs credentials: copy `example/src/config.example.ts` to `example/src/config.ts` and fill in the shop id and token.
- `npx eslint src index.ts` currently reports **3 pre-existing** formatting errors (missing semicolons) in `src/NativeYookassa.ts` and `src/YandexPayment.ts`. These are committed at HEAD — do not assume a change of yours caused them.

## PR & commit conventions

- Branch from `master` (the default branch). release-it refuses to run on any other branch.
- Commit messages follow conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`) — enforced by commitlint with `@commitlint/config-conventional`.
- Scope commits by platform when it aids clarity: `fix(ios):`, `chore(android):`, `chore(ts):`.
- Keep PRs small and focused on one change.
- Releases are cut from `master` via `yarn release` or the manual GitHub Actions workflow (`patch` / `minor` / `major`).

## Security

- `example/src/config.ts` is gitignored — it holds real shop credentials. Copy from `example/src/config.example.ts` and never commit it.
- The shop token (`shop.token`) and `yooKassaClientId` are secrets. The payment token returned by `show()` must be sent to your own backend, never handled directly against the YooKassa API from the client.
- `example/src/config.ts` and `example/ios/.xcode.env.local` are gitignored; keep it that way.
- The Android host app needs a network security config allowing cleartext to `certs.yoomoney.ru` — see the Android setup section in `README.md`.
