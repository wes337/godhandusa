const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_PATH_PREFIXES = ["embed", "v", "shorts", "live"];

/**
 * Extracts a Youtube video ID from any common input format:
 * a bare video ID, youtu.be links, youtube.com/watch?v= links,
 * shorts/embed/live links, mobile and music subdomains, with or
 * without a protocol. Returns null if no video ID can be found.
 */
export function parseYoutubeId(input: string): string | null {
  const value = input.trim();

  const bareId = value.split("?")[0];

  if (YOUTUBE_ID_REGEX.test(bareId)) {
    return bareId;
  }

  let url: URL;

  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www|m)\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0] || "";
    return YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  if (host === "youtube.com" || host.endsWith(".youtube.com")) {
    const v = url.searchParams.get("v");

    if (v && YOUTUBE_ID_REGEX.test(v)) {
      return v;
    }

    const segments = url.pathname.split("/").filter(Boolean);

    if (
      segments.length >= 2 &&
      YOUTUBE_PATH_PREFIXES.includes(segments[0]) &&
      YOUTUBE_ID_REGEX.test(segments[1])
    ) {
      return segments[1];
    }
  }

  return null;
}
