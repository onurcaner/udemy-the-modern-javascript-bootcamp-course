import { RequestHandler } from 'express';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export const injectUploadedImageToBody = (
  formKey: string
): RequestHandler[] => {
  return [
    upload.single(formKey),
    (request, _response, next): void => {
      if (request.file) {
        Object.assign(request.body, {
          [formKey]: request.file.buffer.toString('base64'),
        });
      }
      next();
    },
  ];
};
