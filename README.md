# 買い物メモ（Playwright 再入門 2 のサンプル）

YouTube「ずんだもんの実験道具箱」の動画「Playwright 再入門 2」で使ったサンプルです。動画と同じ中身を保つため、公開後は書き換えません。

買い物メモのアプリ（`index.html`）に、Playwright のテストが7本入っています。
**AI は要りません。** 手元で走らせて緑になるのを確かめ、画面を1か所書き換えて、テストが赤くなるのを見るところまで試せます。

| 中身 | 場所 |
|---|---|
| アプリ（買い物メモ） | `index.html` |
| 手書きのテスト1本 | `tests/shopping.spec.js` |
| seed（エージェントが最初に走らせるテスト） | `tests/seed.spec.ts` |
| 計画（planner が `specs/` に書いた物） | `specs/shopping-memo.plan.md` |
| 計画から generator が書いたテスト5本 | `tests/shopping/*.spec.ts` |
| 画面を書き換えるパッチ（3行） | `display-change.patch` |

## 今夜の一手

要る物は Node.js と git だけです（Claude Code は要りません）。

```bash
git clone https://github.com/zun-tools/playwright-agents-sample.git
cd playwright-agents-sample
npm install
npx playwright install chromium
npx playwright test            # 7 passed（緑）
```

画面を書き換えます（「残り 1 品」→「残り 1 / 2 品」。`index.html` の3行）。

```bash
git apply display-change.patch
npx playwright test            # 6 failed・1 passed（赤）。確かめ（expect）が古い表示のまま
```

元に戻すには `git checkout index.html` です。

## 動画で AI にやらせた所

動画では、Claude Code に次を頼みました（頼む文は動画の概要欄にあります）。

1. planner に「大事な順に5つまで」で計画を書かせる → `specs/` の計画
2. generator に計画からテストを書かせる → `tests/shopping/` の5本
3. 画面を書き換えて赤くなったところで、healer に直させる

このサンプルは、2 の後（緑でコミットした所）の状態です。エージェントの定義（`.claude/agents/`）と `.mcp.json` は入れていません。入れるには `npx playwright init-agents --loop=claude` を打ちます。

> `init-agents` は、すでにある `tests/seed.spec.ts` と `specs/` を上書きしません（作成時に確かめました）。入るのは `.claude/agents/` の3つと `.mcp.json` です。

## 試した環境

2026-10-11 時点・Linux（arm64）・Node.js 22・Playwright 1.64.0・Claude Code 2.1.296。ブラウザは Playwright が入れた Chromium です。Mac と Windows は確かめていません。

前の動画「Playwright 再入門」のサンプルは https://github.com/zun-tools/playwright-sample です（このサンプルの出発点）。

## ライセンス

MIT
