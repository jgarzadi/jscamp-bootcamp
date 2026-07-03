/* Aquí irá el código de tu test */

// @ts-check
import { test, expect } from '@playwright/test'

test('Buscador visible', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  const searchInput = page.getByRole('search')
  const searchButton = page.getByRole('button', { name: 'Buscar' })
  await expect(searchInput).toBeVisible()
  await expect(searchButton).toBeVisible()
})

test('Buscar trabajos de React', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  const searchForm = page.getByRole('search')
  const searchButton = page.getByRole('button', { name: 'Buscar' })
  const searchInput = searchForm.getByRole('searchbox')
  await searchInput.fill('React')
  await searchButton.click()
  const jobResults = page.getByRole('article')
  await expect(jobResults.first()).toBeVisible()
})

test('Aplicar a un trabajo', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  const searchForm = page.getByRole('search')
  const searchButton = page.getByRole('button', { name: 'Buscar' })
  const searchInput = searchForm.getByRole('searchbox')
  await searchInput.fill('JavaScript')
  await searchButton.click()
  const jobResults = page.getByRole('article')
  await expect(jobResults.first()).toBeVisible()
  await jobResults.first().click()
  const jobDetail = jobResults.first().getByRole('heading', { level: 3 })
  await expect(jobDetail).toBeVisible()
  const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
  await loginButton.click()
  const applyButton = page.getByRole('button', { name: 'Aplicar' })
  await applyButton.click()
  const appliedButton = page.getByRole('button', { name: 'Aplicado' })
  await expect(appliedButton).toBeVisible()
})

test('Filtrar por ubicación', async ({ page }) => {
  await page.goto('http://localhost:5173/search')
  const locationFilter = page.locator('#filter-location')
  await locationFilter.selectOption('Remoto')
  const jobResults = page.getByRole('article')
  await expect(jobResults.first()).toBeVisible()
  const count = await jobResults.count()
  for (let i = 0; i < count; i++) {
    const modalidad = await jobResults.nth(i).getAttribute('data-modalidad')
    expect(modalidad).toBe('remoto')
  }
})

test('Filtrar por nivel', async ({ page }) => {
  await page.goto('http://localhost:5173/search')
  const levelFilter = page.locator('#filter-experience-level')
  await levelFilter.selectOption('Senior')
  const jobResults = page.getByRole('article')
  await expect(jobResults.first()).toBeVisible()
  const count = await jobResults.count()
  for (let i = 0; i < count; i++) {
    const level = await jobResults.nth(i).getAttribute('data-nivel')
    expect(level).toBe('senior')
  }
})

test('Verificar paginación', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  const searchForm = page.getByRole('search')
  const searchButton = page.getByRole('button', { name: 'Buscar' })
  const searchInput = searchForm.getByRole('searchbox')
  await searchInput.fill('JavaScript')
  await searchButton.click()
  const jobResults = page.getByRole('article')
  await expect(jobResults.first()).toBeVisible()
  const firstIds = await page.getByRole('article').evaluateAll(els =>
    els.map(e => e.querySelector('a.job-title-link')?.getAttribute('href'))
  )
  const pagination = page.locator('nav').last()
  await expect(pagination).toBeVisible()
  const nextButton = pagination.getByRole('link').last()
  await nextButton.click()
  await expect(page.getByRole('article').first()).toBeVisible()
  const newIds = await page.getByRole('article').evaluateAll(els =>
    els.map(e => e.querySelector('a.job-title-link')?.getAttribute('href'))
  )
  expect(newIds).not.toEqual(firstIds)
})

test('Verificar detalle de empleo', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  const searchForm = page.getByRole('search')
  const searchButton = page.getByRole('button', { name: 'Buscar' })
  const searchInput = searchForm.getByRole('searchbox')
  await searchInput.fill('JavaScript')
  await searchButton.click()
  const jobResults = page.getByRole('article')
  await expect(jobResults.first()).toBeVisible()
  await jobResults.first().getByRole('link').click()
  const jobTitle = page.locator('[class*="_title_"]').first()
  await expect(jobTitle).toBeVisible()
  await expect(jobTitle).toHaveText('Desarrollador de Software Senior')
  const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
  await loginButton.click()
  const applyButton = page.getByRole('button', { name: 'Aplicar Ahora' })
  await applyButton.click()
  const appliedButton = page.getByRole('button', { name: 'Aplicar Ahora' })
  await expect(appliedButton).toBeVisible()
})
