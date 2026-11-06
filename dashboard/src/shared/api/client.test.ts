import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, ApiNotConfiguredError, apiRequest, isForbidden, isUnauthorised } from './client'

// A test-only stand-in for fetch. The shipped app has no fake API.
const fetchStub = vi.fn<typeof fetch>()
vi.stubGlobal('fetch', fetchStub)

const BASE = 'https://api.test'

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

afterEach(() => {
  fetchStub.mockReset()
})

describe('apiRequest', () => {
  it('refuses to run when the API base URL is not configured', async () => {
    await expect(apiRequest('/anything', {}, null)).rejects.toBeInstanceOf(ApiNotConfiguredError)
    expect(fetchStub).not.toHaveBeenCalled()
  })

  it('sends cookies, asks for JSON and joins the base URL and path', async () => {
    fetchStub.mockResolvedValue(json({ ok: true }))

    const result = await apiRequest('/some/path', {}, BASE)

    expect(result).toEqual({ ok: true })
    const [url, init] = fetchStub.mock.calls[0]
    expect(url).toBe('https://api.test/some/path')
    expect(init?.credentials).toBe('include')
    expect(init?.method).toBe('GET')
    expect(init?.headers).toMatchObject({ Accept: 'application/json' })
    expect(init?.body).toBeUndefined()
  })

  it('adds a missing leading slash to the path', async () => {
    fetchStub.mockResolvedValue(json({}))
    await apiRequest('relative', {}, BASE)
    expect(fetchStub.mock.calls[0][0]).toBe('https://api.test/relative')
  })

  it('sends a JSON body with a content type, and merges extra headers', async () => {
    fetchStub.mockResolvedValue(json({}))

    await apiRequest('/x', { method: 'PATCH', body: { a: 1 }, headers: { 'X-Test': 'yes' } }, BASE)

    const init = fetchStub.mock.calls[0][1]
    expect(init?.method).toBe('PATCH')
    expect(init?.body).toBe('{"a":1}')
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json', 'X-Test': 'yes' })
  })

  it('returns undefined for an empty 204 response', async () => {
    fetchStub.mockResolvedValue(new Response(null, { status: 204 }))
    await expect(apiRequest('/x', { method: 'DELETE' }, BASE)).resolves.toBeUndefined()
  })

  it('throws an ApiError carrying the status and body for a failed response', async () => {
    fetchStub.mockResolvedValue(json({ detail: 'nope' }, 403))

    const error = await apiRequest('/x', {}, BASE).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(403)
    expect((error as ApiError).body).toEqual({ detail: 'nope' })
    expect(isForbidden(error)).toBe(true)
    expect(isUnauthorised(error)).toBe(false)
  })

  it('tells 401 apart from 403', async () => {
    fetchStub.mockResolvedValue(json({}, 401))
    const error = await apiRequest('/x', {}, BASE).catch((e: unknown) => e)
    expect(isUnauthorised(error)).toBe(true)
    expect(isForbidden(error)).toBe(false)
  })

  it('keeps a non-JSON error body as text', async () => {
    fetchStub.mockResolvedValue(new Response('Bad gateway', { status: 502 }))
    const error = await apiRequest('/x', {}, BASE).catch((e: unknown) => e)
    expect((error as ApiError).body).toBe('Bad gateway')
  })

  it('does not classify ordinary errors as API errors', () => {
    expect(isForbidden(new Error('x'))).toBe(false)
    expect(isUnauthorised(undefined)).toBe(false)
  })
})
