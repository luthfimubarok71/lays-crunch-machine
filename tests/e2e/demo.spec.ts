import { test, expect, type Page } from "@playwright/test";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import fs from "node:fs/promises";

async function toPreparation(page: Page, scenario = "win") {
  await page.goto("/");
  await page.selectOption("#scenario", scenario);
  await page.getByRole("button", { name: /LET’S CRUNCH/ }).click();
  await page.getByRole("button", { name: "I’M READY" }).click();
  await expect(
    page.getByRole("button", { name: "LET’S DO THIS" }),
  ).toBeDisabled();
  await page.selectOption("#identity", "3");
  await expect(page.locator("#email")).toHaveValue("dimas@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "LET’S DO THIS" }).click();
  await expect(page.locator("video")).toBeVisible();
  await page.getByRole("button", { name: "GOT IT, LET’S GO" }).click();
}
async function finishChallenge(page: Page) {
  await page.getByRole("button", { name: "START CHALLENGE" }).click();
  await expect(page.getByText("READY. SET.")).toBeVisible();
  await expect(page.getByTestId("challenge-timer")).toBeVisible({
    timeout: 6000,
  });
  await expect(page.getByTestId("challenge-timer")).not.toBeVisible({
    timeout: 14000,
  });
}
test("complete 12-screen journey, 10 seconds, dashboard, CSV and reset", async ({
  page,
}) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (!new URL(r.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))
      external.push(r.url());
  });
  await toPreparation(page);
  await page.screenshot({
    path: "docs/screenshots/camera-preparation.png",
    fullPage: true,
    animations: "disabled",
  });
  await page
    .getByRole("button", { name: "START CHALLENGE" })
    .evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
  await expect(page.getByText("READY. SET.")).toBeVisible();
  await expect(page.getByTestId("challenge-timer")).toBeVisible({
    timeout: 6000,
  });
  const start = Date.now();
  await expect(page.getByTestId("final-score")).toBeVisible({ timeout: 14000 });
  expect(Date.now() - start).toBeGreaterThanOrEqual(9500);
  await expect(page.getByTestId("final-score")).toContainText("92");
  await page.screenshot({
    path: "docs/screenshots/challenge-result.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("button", { name: "SEE MY REWARD" }).click();
  await expect(page.getByText("Lay’s Good Vibes Kit")).toBeVisible();
  await page.getByRole("button", { name: "KEEP MY MOMENT" }).click();
  await expect(page.getByText(/Buka demo melalui IP LAN/)).toBeVisible();
  await page.getByRole("button", { name: "SHARE THE GOOD VIBES" }).click();
  await expect(page.getByText("CAPTION PREVIEW")).toBeVisible();
  await page.getByRole("button", { name: "ALL DONE" }).click();
  await page.getByRole("button", { name: "FINISH & RESET" }).click();
  await expect(
    page.getByRole("button", { name: /LET’S CRUNCH/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(page.getByText("Dimas Demo", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Detail Dimas Demo" }).click();
  await expect(page.getByRole("heading", { name: "Dimas Demo" })).toBeVisible();
  await expect(
    page.getByText("10 detik simulasi", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("video")).toBeVisible();
  await page.getByRole("link", { name: "Semua peserta", exact: true }).click();
  await page.getByRole("textbox", { name: "Cari peserta" }).fill("Dimas");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  const csv = await fs.readFile((await download.path())!, "utf8");
  expect(csv).toContain("Dimas Demo");
  expect(csv).not.toContain("Alya Demo");
  expect(csv).not.toContain("example.com");
  await page
    .getByRole("combobox", { name: "Filter status" })
    .selectOption("invalid");
  await expect(page.getByText("Tidak ada peserta yang cocok.")).toBeVisible();
  await page.getByRole("link", { name: "Kembali ke kiosk" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3000/");
  await page.reload();
  await expect(
    page.getByRole("button", { name: /LET’S CRUNCH/ }),
  ).toBeVisible();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
for (const [scenario, score] of [
  ["no-win", "64"],
  ["pending", "88"],
  ["invalid", ""],
] as const) {
  test(`scenario ${scenario} stays consistent across kiosk and public result`, async ({
    page,
  }) => {
    await toPreparation(page, scenario);
    await finishChallenge(page);
    if (scenario === "invalid") {
      await expect(
        page.getByText(/Tidak ada skor atau hadiah yang diterbitkan/),
      ).toBeVisible();
      await expect(page.getByTestId("final-score")).toHaveCount(0);
    } else {
      await expect(page.getByTestId("final-score")).toContainText(score);
    }
    await page.goto(`/demo/result/${scenario}`);
    if (scenario === "pending") {
      await expect(page.getByText("MOMENT IN THE MAKING.")).toBeVisible();
      await expect(page.locator("video")).toHaveCount(0);
    } else if (scenario === "invalid") {
      await expect(page.getByText("NO RECORDING THIS TIME.")).toBeVisible();
      await expect(page.locator("video")).toHaveCount(0);
    } else {
      await expect(page.locator(".score-huge")).toContainText("64");
      await expect(page.locator("video")).toBeVisible();
    }
  });
}
test("invalid attempt retries without duplicate registration", async ({
  page,
}) => {
  await toPreparation(page, "invalid");
  await finishChallenge(page);
  await page.getByRole("button", { name: /ULANGI DENGAN INPUT/ }).click();
  await finishChallenge(page);
  await expect(page.getByTestId("final-score")).toContainText("92");
  await page.goto("/demo/admin/participants");
  await page.getByRole("textbox", { name: "Cari peserta" }).fill("Dimas");
  await expect(page.locator("tbody tr")).toHaveCount(1);
});
test("sample MP4 plays, is ten seconds, replays and downloads", async ({
  page,
}) => {
  await page.goto("/demo/result/win");
  const video = page.locator("video");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState))
    .toBeGreaterThanOrEqual(1);
  expect(await video.evaluate((v: HTMLVideoElement) => v.duration)).toBeCloseTo(
    10,
    1,
  );
  await video.evaluate((v: HTMLVideoElement) => v.play());
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0.3);
  await video.evaluate((v: HTMLVideoElement) => {
    v.pause();
    v.currentTime = 0;
  });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeLessThan(0.1);
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: "Unduh video contoh" }).click();
  const downloaded = await pending;
  expect((await fs.stat((await downloaded.path())!)).size).toBeGreaterThan(
    100000,
  );
});
test("QR decodes and opens a result in an independent mobile browser context", async ({
  browser,
}) => {
  // Public-like origin routed to the local test server; this is NOT a physical phone test.
  const publicOrigin = "http://crunch-demo.test:3000";
  const context = await browser.newContext({
    viewport: { width: 1200, height: 900 },
  });
  await context.route(`${publicOrigin}/**`, async (route) => {
    const response = await route.fetch({
      url: route.request().url().replace(publicOrigin, "http://127.0.0.1:3000"),
    });
    await route.fulfill({ response });
  });
  const p = await context.newPage();
  await p.goto(publicOrigin);
  await p.getByRole("button", { name: /LET’S CRUNCH/ }).click();
  await p.getByRole("button", { name: "I’M READY" }).click();
  await p.getByRole("checkbox").check();
  await p.getByRole("button", { name: "LET’S DO THIS" }).click();
  await p.getByRole("button", { name: "GOT IT, LET’S GO" }).click();
  await finishChallenge(p);
  await p.getByRole("button", { name: "SEE MY REWARD" }).click();
  await p.getByRole("button", { name: "KEEP MY MOMENT" }).click();
  const qr = p.getByTestId("result-qr");
  await expect(qr).toBeVisible();
  const data = (await qr.getAttribute("src"))!.split(",")[1];
  const png = PNG.sync.read(Buffer.from(data, "base64"));
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  expect(decoded?.data).toBe(`${publicOrigin}/demo/result/win`);
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobile.route(`${publicOrigin}/**`, async (route) => {
    const response = await route.fetch({
      url: route.request().url().replace(publicOrigin, "http://127.0.0.1:3000"),
    });
    await route.fulfill({ response });
  });
  const phone = await mobile.newPage();
  await phone.goto(decoded!.data);
  await expect(phone.locator(".score-huge")).toContainText("92");
  await expect(phone.locator("video")).toBeVisible();
  await expect(phone.getByText("Alya Demo")).toHaveCount(0);
  expect(
    await phone.evaluate(() =>
      sessionStorage.getItem("lays-demo-v1-synthetic"),
    ),
  ).not.toContain('"status":"registered"');
  await phone.screenshot({
    path: "docs/screenshots/mobile-result.png",
    fullPage: true,
  });
  await context.close();
  await mobile.close();
});
test("responsive visual evidence, admin navigation and no horizontal page overflow", async ({
  page,
}) => {
  for (const [name, width, height, url] of [
    ["landing-desktop", 1440, 1000, "/"],
    ["landing-tablet", 768, 1024, "/"],
    ["landing-mobile", 390, 844, "/"],
    ["dashboard", 1440, 1000, "/demo/admin"],
    ["dashboard-mobile", 390, 844, "/demo/admin"],
    ["result-mobile", 360, 800, "/demo/result/win"],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
    await page.screenshot({
      path: `docs/screenshots/${name}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/demo/admin");
  for (const label of [
    "Peserta",
    "Video library",
    "Rewards",
    "Email delivery",
    "Overview",
  ])
    await page
      .getByRole("navigation", { name: "Dashboard" })
      .getByRole("link", { name: label, exact: true })
      .click();
  await page.goto("/demo/admin/email-preview");
  await expect(
    page.getByText("Your Lay’s Crunch Moment Is Ready!", { exact: false }),
  ).toBeVisible();
  await page.goto("/demo/login");
  await expect(page.getByText(/Autentikasi produksi belum/)).toBeVisible();
});
test("privacy headers, unknown result and corrupted local state fail safely", async ({
  page,
  request,
}) => {
  const response = await request.get("/");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  expect(response.headers()["permissions-policy"]).toContain("camera=()");
  await page.goto("/");
  await page.evaluate(() =>
    sessionStorage.setItem("lays-demo-v1-synthetic", "{broken"),
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: /LET’S CRUNCH/ }),
  ).toBeEnabled();
  await page.goto("/demo/result/unknown");
  await expect(page.getByText("Halaman tidak ditemukan.")).toBeVisible();
  expect((await request.get("/demo/result/unknown")).status()).toBe(404);
});

test("idle session resets safely and browser Back cannot restore an abandoned registration", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page.getByRole("button", { name: /LET’S CRUNCH/ }).click();
  await page.clock.fastForward(91000);
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.clock.fastForward(30000);
  await expect(
    page.getByRole("button", { name: /LET’S CRUNCH/ }),
  ).toBeVisible();
  await toPreparation(page);
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(page).toHaveURL(/\/demo\/admin$/);
  await page.goBack();
  await expect(
    page.getByRole("button", { name: /LET’S CRUNCH/ }),
  ).toBeVisible();
  await expect(page.locator("#email")).toHaveCount(0);
});

test("tablet landscape and mobile challenge controls remain within viewport", async ({
  page,
}) => {
  for (const [name, width, height] of [
    ["tablet-portrait", 768, 1024],
    ["tablet-landscape", 1366, 768],
    ["phone", 390, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    await toPreparation(page);
    const card = await page.locator(".experience-card").boundingBox();
    expect(card!.x).toBeGreaterThanOrEqual(0);
    expect(card!.x + card!.width).toBeLessThanOrEqual(width);
    await expect(
      page.getByRole("button", { name: "START CHALLENGE" }),
    ).toBeVisible();
    await page.screenshot({
      path: `docs/screenshots/preparation-${name}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
});
