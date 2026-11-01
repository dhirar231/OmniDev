import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('desktop navigation, filters, project detail and browser history work', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Omni Dev/);
  await page.getByRole('button', { name: 'For business', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(2);
  await page.getByRole('button', { name: 'Products', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(1);
  await page.goBack();
  await expect(page.locator('.project-card:visible')).toHaveCount(2);
  await page.locator('#facterly-link').click();
  await expect(page.locator('#facterly')).toBeVisible();
  await page.locator('#facterly summary').click();
  await expect(page.locator('#facterly details')).toHaveAttribute('open', '');
  const broken = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((a) => a.getAttribute('href')!)
        .filter((href) => !document.querySelector(href)),
    );
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
});

test('contact validates and downloads an honest local brief', async ({
  page,
}) => {
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'Download Project Brief' }).click();
  await expect(page.locator('input[name="name"]')).toBeFocused();
  await page.getByLabel('Your name', { exact: true }).fill('Test Person');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('test@example.com');
  await page
    .getByLabel('Tell us about your project')
    .fill('A scheduling platform for a small team.');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Project Brief' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('OmniDev-project-brief.txt');
  await expect(page.locator('#form-status')).toContainText(
    'It has not been sent',
  );
});

for (const width of [320, 390, 768, 1440]) {
  test(`accessible and no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    if (width < 620) {
      const menu = page.getByRole('button', { name: 'Menu' });
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(menu).toBeFocused();
      await menu.click();
      await page
        .locator('#main-nav')
        .getByRole('link', { name: 'Products', exact: true })
        .click();
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
    }
  });
}

test('content and navigation remain available without JavaScript', async ({
  browser,
}) => {
  const page = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await page.goto('http://127.0.0.1:4321');
  await expect(page.locator('#main-nav')).toBeVisible();
  await expect(page.locator('.project-card')).toHaveCount(3);
  await page.locator('#university summary').click();
  await expect(page.locator('#university details')).toHaveAttribute('open', '');
  await page.close();
});
