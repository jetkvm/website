interface GitHubRepoResponse {
  stargazers_count: number;
}

const CACHE_DURATION = 1; // 1 hour in milliseconds

let cachedStars: number | null = null;
let lastFetchTime: number | null = null;

export async function getGitHubStars(): Promise<number | null> {
  const now = Date.now();

  if (
    cachedStars !== null &&
    lastFetchTime !== null &&
    now - lastFetchTime < CACHE_DURATION
  ) {
    return cachedStars;
  }

  try {
    const resp = await fetch(`https://api.github.com/repos/jetkvm/kvm`);

    if (!resp.ok) {
      throw new Error(`GitHub API error: ${resp.status}`);
    }

    const data = (await resp.json()) as GitHubRepoResponse;
    cachedStars = data.stargazers_count;
    lastFetchTime = now;
    return cachedStars;
  } catch (error) {
    console.error("Failed to fetch GitHub stars:", error);
    return cachedStars ?? null;
  }
}
