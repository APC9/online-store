const urls: string[] = ['http://url1.com'];

export const FileUploadService = jest.fn().mockReturnValue({
  fileUploadStore: jest.fn().mockReturnValue(urls),
});
