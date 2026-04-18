const views = new Map<string, number>();
const likes = new Map<string, number>();
const fbShares = new Map<string, number>();
const tiktokShares = new Map<string, number>();

export function incrementView(slug: string) {
  views.set(slug, (views.get(slug) || 0) + 1);
  return views.get(slug);
}

export function incrementLike(slug: string) {
  likes.set(slug, (likes.get(slug) || 0) + 1);
  return likes.get(slug);
}

export function incrementShare(slug: string, platform: 'facebook' | 'tiktok') {
  if (platform === 'facebook') {
    fbShares.set(slug, (fbShares.get(slug) || 0) + 1);
    return fbShares.get(slug);
  } else if (platform === 'tiktok') {
    tiktokShares.set(slug, (tiktokShares.get(slug) || 0) + 1);
    return tiktokShares.get(slug);
  }
  return 0;
}

export function getStats(slug: string) {
  return {
    views: views.get(slug) || 0,
    likes: likes.get(slug) || 0,
    fbShares: fbShares.get(slug) || 0,
    tiktokShares: tiktokShares.get(slug) || 0,
  };
}
