export interface ImageDao {
  putImage(alias: string, imageBytes: number[], fileExtension: string): Promise<string>;
}
