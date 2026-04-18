import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  constructor(@Inject('CLOUDINARY') private cloudinary: any) {}

  /**
   * Detecta o tipo MIME analisando a magic number do buffer
   */
  private detectMimeType(buffer: Buffer): string | null {
    // PNG: 89 50 4E 47
    if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return 'image/png';
    }
    // JPEG: FF D8 FF
    if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'image/jpeg';
    }
    // GIF: 47 49 46
    if (buffer.length >= 3 && buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      return 'image/gif';
    }
    // WebP: RIFF ... WEBP
    if (buffer.length >= 12 && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return 'image/webp';
    }
    return null;
  }

  async uploadImage(file: any, productId: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    // Detectar tipo MIME pela magic number
    const detectedMimeType = this.detectMimeType(file.buffer);
    const mimeType = detectedMimeType || file.mimetype;

    // Validar tipo
    if (!this.ALLOWED_TYPES.includes(mimeType)) {
      throw new BadRequestException(
        `Tipo de arquivo inválido. Permitidos: JPG, PNG, WebP, GIF (recebido: ${mimeType})`
      );
    }

    // Validar tamanho
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Arquivo muito grande. Máximo: 5MB, enviado: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      );
    }

    try {
      // Upload para Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `products/${productId}`,
            resource_type: 'auto',
            quality: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      return (result as any).secure_url;
    } catch (error) {
      throw new BadRequestException(
        `Erro ao fazer upload da imagem: ${error.message}`
      );
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    try {
      // Extrair public_id da URL do Cloudinary
      // URL: https://res.cloudinary.com/cloud_name/image/upload/v1234/products/productId/filename.jpg
      const parts = imageUrl.split('/');
      const fileWithExt = parts[parts.length - 1];
      const filename = fileWithExt.split('.')[0];
      const publicId = `products/${parts[parts.length - 2]}/${filename}`;

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.warn(`Aviso ao deletar imagem: ${error.message}`);
    }
  }
}
