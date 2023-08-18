import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      CLOUDINARY_NAME: 'Your cloud name',
      CLOUDINARY_API_KEY: 'Your api key',
      CLOUDINARY_API_SECRET: 'Your api secret',
    });
  },
};