/* Aquí irá el código de tu test */

// @ts-check
import { expect, test } from '@playwright/test'

test('Buscador visible', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  const searchInput = page.getByRole('search') // <- En este caso solo tenemos un `search` en la página, pero para tener en cuenta: Si lo hacemos en un sitio que tiene más de un input, no deberíamos buscarlo en la `page` global [page.getByRole('search')], sino en el elemento específico en el que se encuentra, un formulario por ejemplo: [form.getByRole('search')]
  const searchButton = page.getByRole('button', { name: 'Buscar' })
  await expect(searchInput).toBeVisible()
  await expect(searchButton).toBeVisible()
})

test('Buscar trabajos de React', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await handleSearchByTerm(page, 'React')
  const jobResults = await page.getByRole('article') // <- después de una acción en la que va a cambiar la UI, podemos agregar `await` en el `getByRole()` para evitar que se busque el elemento antes de que cargue
  await expect(jobResults.first()).toBeVisible()
})

test('Aplicar a un trabajo', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await handleSearchByTerm(page, 'JavaScript')
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
  await handleSearchByTerm(page, 'JavaScript')
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
  await handleSearchByTerm(page, 'JavaScript')
  const jobResults = page.getByRole('article')
  await expect(jobResults.first()).toBeVisible()
  await jobResults.first().getByRole('link').click()
  const jobTitle = page.locator('[class*="_title_"]').first() // <- Tratemos siembre de evitar selectores por CSS. En este caso, podemos usar elector por role, o en el peor de los casos, agregar un `data-testid`.
  await expect(jobTitle).toBeVisible()
  await expect(jobTitle).toHaveText('Desarrollador de Software Senior')
  const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
  await loginButton.click()
  const applyButton = page.getByRole('button', { name: 'Aplicar Ahora' })
  await applyButton.click()
  const appliedButton = page.getByRole('button', { name: 'Aplicar Ahora' })
  await expect(appliedButton).toBeVisible()
})

/* Esto es un extra, no significa que lo que hiciste esté mal: */
/* Si vemos que repetimos mucho código en un test, lo mejor que podemos hacer es pasar esa lógica a una función y reutilizar */

async function handleSearchByTerm(element, term) {
  const searchForm = element.getByRole('search')
  const searchInput = searchForm.getByRole('searchbox')
  const searchButton = element.getByRole('button', { name: 'Buscar' })
  await searchInput.fill(term)
  await searchButton.click()
}