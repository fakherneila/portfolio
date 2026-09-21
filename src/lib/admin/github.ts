export type RepoConfig = {
  owner: string
  repo: string
  branch: string
}

export function parseRepo(
  envRepo = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_GITHUB_REPO) as
    | string
    | undefined,
  envBranch = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_GITHUB_BRANCH) as
    | string
    | undefined,
): RepoConfig {
  const fallbackRepo = 'fakher-neila/portfolio'
  const rawRepo = (envRepo && envRepo.trim()) || fallbackRepo
  const branch = (envBranch && envBranch.trim()) || 'main'

  const [owner = 'fakher-neila', repo = 'portfolio'] = rawRepo.split('/')
  return { owner, repo, branch }
}

export function encodeUtf8ToBase64(content: string): string {
  const bytes = new TextEncoder().encode(content)
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export type CommitOptions = {
  path: string // e.g. "content/blog/en/my-post.mdx"
  content: string // raw MDX text
  message: string // commit message
  sha?: string // if updating an existing file
}

export async function commitFile(
  token: string,
  options: CommitOptions,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const { owner, repo, branch } = parseRepo()
  const cleanPath = options.path.replace(/^\/+/, '')
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`

  try {
    const body: Record<string, unknown> = {
      message: options.message,
      content: encodeUtf8ToBase64(options.content),
      branch,
    }

    if (options.sha) {
      body.sha = options.sha
    }

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = (await res.json()) as {
        commit?: { html_url?: string }
        content?: { html_url?: string }
      }
      return {
        ok: true,
        url:
          data.commit?.html_url ||
          data.content?.html_url ||
          `https://github.com/${owner}/${repo}/blob/${branch}/${cleanPath}`,
      }
    }

    const errData = (await res.json().catch(() => null)) as { message?: string } | null
    return {
      ok: false,
      error:
        errData?.message ||
        `GitHub API returned HTTP ${res.status}: ${res.statusText}`,
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error committing file',
    }
  }
}

export async function fileExists(token: string, path: string): Promise<boolean> {
  const { owner, repo, branch } = parseRepo()
  const cleanPath = path.replace(/^\/+/, '')
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${encodeURIComponent(branch)}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: 'application/vnd.github+json',
    },
  })

  if (res.status === 200) return true
  if (res.status === 404) return false

  const errData = (await res.json().catch(() => null)) as { message?: string } | null
  throw new Error(
    errData?.message || `GitHub error checking file: HTTP ${res.status}`,
  )
}

export async function getFileSha(
  token: string,
  path: string,
): Promise<string | null> {
  const { owner, repo, branch } = parseRepo()
  const cleanPath = path.replace(/^\/+/, '')
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${encodeURIComponent(branch)}`

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
      },
    })

    if (res.status === 200) {
      const data = (await res.json()) as { sha: string }
      return data.sha
    }
    if (res.status === 404) {
      return null
    }

    return null
  } catch {
    return null
  }
}

export type GitHubPostItem = {
  name: string
  path: string
  sha: string
  url: string
  size?: number
}

export async function listPosts(
  token: string,
  locale: 'en' | 'fr',
): Promise<GitHubPostItem[]> {
  const { owner, repo, branch } = parseRepo()
  const path = `content/blog/${locale}`
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
      },
    })

    if (!res.ok) {
      if (res.status === 404) return []
      throw new Error(`Failed to list posts: HTTP ${res.status}`)
    }

    const data = (await res.json()) as Array<{
      name: string
      path: string
      sha: string
      html_url: string
      size?: number
      type: string
    }>

    if (!Array.isArray(data)) return []

    return data
      .filter((item) => item.type === 'file' && item.name.endsWith('.mdx'))
      .map((item) => ({
        name: item.name,
        path: item.path,
        sha: item.sha,
        url: item.html_url,
        size: item.size,
      }))
  } catch (err) {
    console.error('[admin/github] Error listing posts:', err)
    return []
  }
}

export async function deleteFile(
  token: string,
  path: string,
  sha: string,
  message: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { owner, repo, branch } = parseRepo()
  const cleanPath = path.replace(/^\/+/, '')
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sha,
        branch,
      }),
    })

    if (res.ok) {
      return { ok: true }
    }

    const errData = (await res.json().catch(() => null)) as { message?: string } | null
    return {
      ok: false,
      error:
        errData?.message ||
        `GitHub API returned HTTP ${res.status}: ${res.statusText}`,
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error deleting file',
    }
  }
}
