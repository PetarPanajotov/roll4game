/** Replace url backslashes at the start with https://
 * Example: Converts: \\images.igdb.com\igdb\image\upload\t_cover_big\abc.jpg
 *          To:       https://images.igdb.com/igdb/image/upload/t_cover_big/abc.jpg
 * @param url - {string} The url to be replaced
 */

export const normalizeUrl = (url: string) =>
  url.replace(/\\/g, '/').replace(/^\/\//, 'https://')
