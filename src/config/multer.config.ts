import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './images/uploads',
    filename: (req: any, file: any, callback: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  limits: { 
    fileSize: 1024 * 1024 * 5, // 5MB
  },
}; 