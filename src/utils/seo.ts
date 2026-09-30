export const SITE_ORIGIN = 'https://ais-pre-ty6diymvlughewikchko4e-115949490517.asia-southeast1.run.app';

export const getSiteOrigin = (): string => {
  if (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')) {
    return window.location.origin;
  }
  return SITE_ORIGIN;
};
