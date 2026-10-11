// spec: specs/shopping-memo.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('買い物メモ', () => {
  test('Enterキーで追加でき、追加後に入力欄が空になる', async ({ page }) => {
    await page.goto('/');

    const list = page.getByRole('list', { name: '買う物' });
    const items = list.getByRole('listitem');
    const status = page.getByRole('status');
    const input = page.getByRole('textbox', { name: '品物' });
    const addButton = page.getByRole('button', { name: '追加' });

    // 1. 「品物」に「パン」を入力して Enter を押す
    await input.fill('パン');
    await input.press('Enter');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('パン');
    await expect(input).toHaveValue('');
    await expect(status).toHaveText('残り 1 品');

    // 2. 続けて「みかん」を入力して「追加」ボタンをクリック
    await input.fill('みかん');
    await addButton.click();
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText('パン');
    await expect(items.nth(1)).toContainText('みかん');
    await expect(status).toHaveText('残り 2 品');
  });
});
