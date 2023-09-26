export const useImage = () => {
  function assets(imageName: string): string {
    return new URL(`../assets/${imageName}`, import.meta.url).href;
  }

  return { assets };
};
