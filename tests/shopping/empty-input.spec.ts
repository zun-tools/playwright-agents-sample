// spec: specs/shopping-memo.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('買い物メモ', () => {
  test('空・空白のみの入力は追加されない', async ({ page }) => {
    await page.goto('/');

    const list = page.getByRole('list', { name: '買う物' });
    const status = page.getByRole('status');
    const input = page.getByRole('textbox', { name: '品物' });
    const addButton = page.getByRole('button', { name: '追加' });

    // 1. 「品物」欄が空のまま「追加」をクリック
    await addButton.click();
    await expect(list.getByRole('listitem')).toHaveCount(0);
    await expect(status).toHaveText('残り 0 品');

    // 2. 「品物」に半角/全角スペースのみを入力して「追加」をクリック
    await input.fill(' 　 ');
    await addButton.click();
    await expect(list.getByRole('listitem')).toHaveCount(0);
    await expect(status).toHaveText('残り 0 品');

    // 3. 「牛乳」を追加した後、再度空のまま「追加」をクリック
    await input.fill('牛乳');
    await addButton.click();
    await addButton.click();
    await expect(list.getByRole('listitem')).toHaveCount(1);
    await expect(status).toHaveText('残り 1 品');
  });
});
