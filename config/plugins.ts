import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  // Images are saved in public/uploads by default.
  // Set UPLOAD_PROVIDER=s3 to store them on Cloudflare R2 / AWS S3 instead (see .env.example).
  const useS3 = env('UPLOAD_PROVIDER', 'local') === 's3';

  return {
    'users-permissions': {
      config: {
        jwtManagement: 'refresh',
        sessions: {
          httpOnly: true,
        },
      },
    },
    upload: {
      config: {
        sizeLimit: env.int('UPLOAD_MAX_MB', 25) * 1024 * 1024,
        // responsive sizes made for every uploaded image (px width)
        breakpoints: {
          xlarge: 1920,
          large: 1280,
          medium: 768,
          small: 480,
        },
        security: {
          allowedTypes: allowedMediaTypes,
          deniedTypes,
        },
        ...(useS3
          ? {
              provider: 'aws-s3',
              providerOptions: {
                // public URL of the bucket / custom domain, e.g. https://media.kepvipassana.org
                baseUrl: env('S3_PUBLIC_URL'),
                rootPath: env('S3_ROOT_PATH', 'uploads'),
                s3Options: {
                  credentials: {
                    accessKeyId: env('S3_ACCESS_KEY_ID'),
                    secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
                  },
                  // Cloudflare R2: https://<ACCOUNT_ID>.r2.cloudflarestorage.com and region "auto"
                  endpoint: env('S3_ENDPOINT', undefined),
                  region: env('S3_REGION', 'auto'),
                  forcePathStyle: env.bool('S3_FORCE_PATH_STYLE', false),
                  params: {
                    Bucket: env('S3_BUCKET'),
                    // R2 does not support ACLs -> leave S3_ACL empty. For AWS S3 with ACLs use public-read.
                    ACL: env('S3_ACL', '') || undefined,
                  },
                },
              },
              actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
              },
            }
          : {}),
      },
    },
  };
};

export default config;
