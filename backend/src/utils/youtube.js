const extractYouTubeVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);

    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (hostname === "youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        const videoId = parsedUrl.searchParams.get("v");

        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return videoId;
        }
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        const videoId = parsedUrl.pathname.split("/")[2]?.split("/")[0];

        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return videoId;
        }
      }
    }

    if (hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.split("/")[1]?.split("/")[0];

      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }

    return null;
  } catch {
    return null;
  }
};

module.exports = {
  extractYouTubeVideoId,
};
