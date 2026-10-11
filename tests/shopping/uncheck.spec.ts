// spec: specs/shopping-memo.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('買い物メモ', () => {
  test('チェックを外すと残りが戻り、取り消し線が外れる', async ({ page }) => {
    await page.goto('/');

    const list = page.getByRole('list', { name: '買う物' });
    const status = page.getByRole('status');
    const input = page.getByRole('textbox', { name: '品物' });
    const addButton = page.getByRole('button', { name: '追加' });
    const milkCheckbox = page.getByRole('checkbox', { name: '牛乳' });
    const eggCheckbox = page.getByRole('checkbox', { name: '卵' });
    const milkItem = list.getByRole('listitem').filter({ hasText: '牛乳' });
    const eggItem = list.getByRole('listitem').filter({ hasText: '卵' });

    // 1. 「牛乳」「卵」を追加し、「牛乳」をチェック
    await input.fill('牛乳');
    await addButton.click();
    await input.fill('卵');
    await addButton.click();
    await milkCheckbox.check();
    await expect(status).toHaveText('残り 1 品');
    await expect(milkItem).toHaveClass(/done/);

    // 2. 「牛乳」のチェックを外す
    await milkCheckbox.uncheck();
    await expect(status).toHaveText('残り 2 品');
    await expect(milkItem).not.toHaveClass(/done/);

    // 3. 「卵」もチェックし、全部チェックする
    await eggCheckbox.check();
    await milkCheckbox.check();
    await expect(status).toHaveText('残り 0 品');
    await expect(list.getByRole('listitem')).toHaveCount(2);
    await expect(milkItem).toHaveClass(/done/);
    await expect(eggItem).toHaveClass(/done/);
  });
});
