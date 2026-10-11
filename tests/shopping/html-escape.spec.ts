// spec: specs/shopping-memo.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('買い物メモ', () => {
  test('HTMLを含む入力が文字列として表示される(XSS確認)', async ({ page }) => {
    const dialogs: string[] = [];
    page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    await page.goto('/');

    const list = page.getByRole('list', { name: '買う物' });
    const items = list.getByRole('listitem');
    const status = page.getByRole('status');
    const input = page.getByRole('textbox', { name: '品物' });
    const addButton = page.getByRole('button', { name: '追加' });

    // 1. 「<b>x</b>」を追加
    await input.fill('<b>x</b>');
    await addButton.click();
    await expect(items).toHaveCount(1);
    await expect(items.first().locator('label')).toHaveText('<b>x</b>');
    await expect(list.locator('b')).toHaveCount(0);
    await expect(status).toHaveText('残り 1 品');

    // 2. 「<img src=x onerror=alert(1)>」を追加
    await input.fill('<img src=x onerror=alert(1)>');
    await addButton.click();
    await expect(items).toHaveCount(2);
    await expect(items.nth(1).locator('label')).toHaveText('<img src=x onerror=alert(1)>');
    await expect(list.locator('img')).toHaveCount(0);
    expect(dialogs).toEqual([]);
  });
});
