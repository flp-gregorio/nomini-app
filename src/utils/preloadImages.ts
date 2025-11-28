export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
                const promises = imageUrls.map((url) => {
                                return new Promise<void>((resolve) => {
                                                const img = new Image();
                                                img.src = url;
                                                img.onload = () => resolve();
                                                img.onerror = () => {
                                                                console.warn(`Failed to preload: ${url}`);
                                                                resolve();
                                                };
                                });
                });

                return Promise.all(promises);
};
