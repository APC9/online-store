import { UploadApiResponse } from 'cloudinary';

export const cloudinaryStub = (): UploadApiResponse => {
  return {
    public_id: 'test_public_id',
    version: 1,
    signature: 'dummy_signature',
    width: 100,
    height: 100,
    format: 'jpg',
    resource_type: 'image',
    created_at: new Date().toISOString(),
    tags: [],
    pages: 1,
    bytes: 5000,
    type: 'upload',
    etag: 'dummy_etag',
    placeholder: false,
    url: 'http://example.com/dummy_url.jpg',
    secure_url: 'https://example.com/dummy_secure_url.jpg',
    access_mode: 'public',
    original_filename: 'dummy_original_filename',
    moderation: [],
    access_control: [],
    context: {},
    metadata: {},
  };
};
