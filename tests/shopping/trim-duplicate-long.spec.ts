// spec: specs/shopping-memo.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('買い物メモ', () => {
  test('前後の空白は除去され、同名の重複・長い名前も追加できる', async ({ page }) => {
    await page.goto('/');

    const list = page.getByRole('list', { name: '買う物' });
    const items = list.getByRole('listitem');
    const status = page.getByRole('status');
    const input = page.getByRole('textbox', { name: '品物' });
    const addButton = page.getByRole('button', { name: '追加' });

    // 1. 「  牛乳  」(前後に空白)を追加
    await input.fill('  牛乳  ');
    await addButton.click();
    await expect(items).toHaveCount(1);
    await expect(items.first().getByText('牛乳')).toBeVisible();
    // toHaveText は空白を正規化するため、生の textContent で検証する
    // (マークアップ由来の先頭1文字の空白のみ許容。入力由来の空白が残っていれば不一致)
    const rawText = await items.first().locator('label').evaluate((el) => el.textContent);
    expect(rawText).toMatch(/^ ?牛乳$/);

    // 2. 同じ「牛乳」をもう一度追加
    await input.fill('牛乳');
    await addButton.click();
    await expect(items).toHaveCount(2);
    await expect(status).toHaveText('残り 2 品');
    await items.nth(0).getByRole('checkbox').check();
    await expect(items.nth(0).getByRole('checkbox')).toBeChecked();
    await expect(items.nth(1).getByRole('checkbox')).not.toBeChecked();
    await expect(status).toHaveText('残り 1 品');

    // 3. 200文字の「a」を追加
    const longName = 'a'.repeat(200);
    await input.fill(longName);
    await addButton.click();
    await expect(items).toHaveCount(3);
    await expect(items.nth(2)).toContainText(longName);
    await expect(status).toHaveText('残り 2 品');
  });
});
