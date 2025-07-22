import { BadRequestException, Injectable } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { generateSalt } from 'src/common/utils/generate-salt';

@Injectable()
export class UploadService {
  async handleUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const maxSize = 900 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException(
        'Arquivo com tamanho superior ao permitido',
      );
    }

    const fileType = await fileTypeFromBuffer(file.buffer);

    if (
      !fileType ||
      !['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(
        fileType.mime,
      )
    ) {
      throw new BadRequestException('Arquivo inválido ou tipo não permitido.');
    }

    const today = new Date().toISOString().split('T')[0];
    const uploadPath = resolve(__dirname, '..', '..', 'uploads', today);

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${generateSalt()}`;
    const fileExtension = fileType.ext;
    const fileName = `${uniqueSuffix}.${fileExtension}`;
    const fileFullPath = resolve(uploadPath, fileName);

    // Salvar o buffer no disco
    writeFileSync(fileFullPath, file.buffer);

    return {
      url: `/uploads/${today}/${fileName}`,
    };
  }
}
