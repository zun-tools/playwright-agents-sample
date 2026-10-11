// @ts-check
import { test, expect } from '@playwright/test';

test('品物を足してチェックすると、残りが減る', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('品物').fill('牛乳');
  await page.getByRole('button', { name: '追加' }).click();
  await page.getByLabel('品物').fill('卵');
  await page.getByRole('button', { name: '追加' }).click();

  await expect(page.getByRole('listitem')).toHaveCount(2);
  await expect(page.getByRole('status')).toHaveText('残り 2 品');

  await page.getByRole('checkbox', { name: '牛乳' }).check();
  await expect(page.getByRole('status')).toHaveText('残り 1 品');
});
