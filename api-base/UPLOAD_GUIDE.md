# 📸 Upload de Imagens com Cloudinary

Guia de implementação e uso do recurso de upload de imagens para produtos.

## 🚀 Setup Inicial

### 1. Instalar Dependências

```bash
npm install cloudinary multer @types/multer
```

### 2. Configurar Cloudinary

#### a) Criar conta em Cloudinary
1. Acesse [cloudinary.com](https://cloudinary.com)
2. Crie uma conta gratuita
3. Acesse o dashboard e copie suas credenciais:
   - **Cloud Name** (CLOUDINARY_NAME)
   - **API Key** (CLOUDINARY_API_KEY)
   - **API Secret** (CLOUDINARY_API_SECRET)

#### b) Adicionar ao `.env`
```env
CLOUDINARY_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

### 3. Build e Start
```bash
npm run build
npm start
```

---

## 📝 API Endpoint

### Upload de Imagem do Produto

**Requisição:**
```
POST /api/v1/stock/:id/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
  - image: [arquivo JPEG, PNG, WebP ou GIF, máx 5MB]
```

**Exemplos:**

#### cURL
```bash
curl -X POST http://localhost:3000/api/v1/stock/123e4567-e89b-12d3-a456-426614174000/image \
  -H "Authorization: Bearer seu_token_jwt" \
  -F "image=@/caminho/para/imagem.jpg"
```

#### Postman
1. Nova requisição **POST** para `http://localhost:3000/api/v1/stock/{productId}/image`
2. Aba **Headers**: `Authorization: Bearer {seu_token}`
3. Aba **Body**: Selecionar `form-data`
4. Adicionar campo:
   - Key: `image`
   - Type: File
   - Value: Selecionar arquivo

#### JavaScript/Fetch
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch(
  `/api/v1/stock/{productId}/image`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  }
);

const result = await response.json();
console.log(result.imageUrl); // URL da imagem no Cloudinary
```

---

## ✅ Resposta de Sucesso

```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/seu_cloud_name/image/upload/v1234567890/products/123e4567-e89b-12d3-a456-426614174000/image.jpg",
  "message": "Imagem atualizada com sucesso"
}
```

---

## ❌ Tratamento de Erros

| Status | Erro | Descrição |
|--------|------|-----------|
| **400** | Nenhum arquivo foi enviado | Requisição sem arquivo |
| **400** | Tipo de arquivo inválido | Apenas JPG, PNG, WebP, GIF |
| **400** | Arquivo muito grande | Máximo 5MB |
| **401** | Unauthorized | Token JWT inválido/expirado |
| **403** | Forbidden | Sem permissão `product:update` |
| **404** | Produto não encontrado | ID do produto inválido |

---

## 🔒 Permissões Requeridas

- **Guard**: JWT Authentication
- **Permission**: `product:update`
- **Admin**: Tem acesso automático (sem validação de permissão)

---

## 📁 Estrutura de Pastas no Cloudinary

As imagens são organizadas por produto:
```
products/
└── {productId}/
    └── image.jpg
```

**Exemplo:**
```
products/
└── 123e4567-e89b-12d3-a456-426614174000/
    └── image.jpg
```

---

## 🗑️ Remoção de Imagem Anterior

Quando um novo upload é feito para um produto que já tem imagem:
1. A imagem anterior é deletada do Cloudinary automaticamente
2. Apenas 1 imagem é mantida por produto (não é galeria)

---

## 📊 Teste E2E

Teste incluído no arquivo `test/stock.e2e-spec.ts`:

```bash
npm run test:e2e
```

Casos de teste:
- ✅ Upload bem-sucedido
- ✅ Arquivo inválido (tipo incorreto)
- ✅ Arquivo muito grande
- ✅ Sem autenticação
- ✅ Produto não encontrado

---

## 🔧 Limites e Restrições

| Propriedade | Valor |
|-------------|-------|
| Tamanho máximo | 5 MB |
| Formatos aceitos | JPG, PNG, WebP, GIF |
| Imagens por produto | 1 (principal) |
| Otimização | Automática (Cloudinary) |
| Armazenamento teste | 25 GB (plano gratuito) |

---

## 📚 Arquivos Relevantes

- **Serviço**: `src/upload/upload.service.ts`
- **Módulo**: `src/upload/upload.module.ts`
- **Configuração**: `src/config/cloudinary.config.ts`
- **Controller**: `src/stock/stock.controller.ts` (endpoint POST `:id/image`)
- **Entidade**: `src/stock/product.entity.ts` (field `imageUrl`)

---

## 🎯 Próximas Melhorias

- [ ] Implementar galeria (múltiplas imagens por produto)
- [ ] Adicionar validação de dimensões mínimas
- [ ] Implementar compressão customizada
- [ ] Adicionar QR code automático (campo `qrCode`)
- [ ] Endpoint para deletar imagem sem atualização

---

**Status**: ✅ Implementado e Funcional
