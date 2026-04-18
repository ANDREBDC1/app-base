# 🧠 AI CONTEXT — API CONTROLE DE ESTOQUE

## 📌 Objetivo do projeto

API REST para controle de estoque de produtos.

Permite:

* Criar produtos
* Adicionar estoque
* Remover estoque
* Consultar estoque atual

---

## 🏗️ Stack utilizada

* Node.js
* NestJS
* TypeORM
* SQLite (testes)
* PostgreSQL (produção)
* Jest (testes)

---

## 📦 Entidade principal

### Product

* id: number
* name: string
* quantity: number

---

## ⚙️ Regras de negócio

### ✔️ Criação de produto

* Produto inicia com quantidade = 0

---

### ✔️ Adicionar estoque

* Soma a quantidade atual
* Não pode receber valores negativos

---

### ✔️ Remover estoque

* Subtrai da quantidade atual
* Não pode ficar negativo
* Se tentar remover mais do que existe → erro

---

### ✔️ Consultar estoque

* Retorna a quantidade atual do produto

---

### ❌ Produto inexistente

* Qualquer operação deve lançar erro:
  "Product not found"

---

## 📦 Controle de validade (lotes)

O estoque é controlado por lotes.

Cada lote possui:

* quantidade
* data de validade

---

### ✔️ Regra FEFO

Remoção de estoque deve seguir:

First Expire First Out (FEFO)

→ Consumir primeiro o lote com menor data de validade

---

### ❌ Não usar produtos vencidos

Produtos com validade menor que a data atual não devem ser utilizados

---

### ✔️ Adicionar estoque

Sempre cria um novo lote com data de validade

---

### ✔️ Consultar estoque

Soma de todos os lotes válidos


## 🚨 Regras importantes

* Toda operação deve validar existência do produto
* Toda operação deve ser assíncrona (uso de banco)
* Sempre persistir alterações no banco
* Não confiar em estado em memória

---

## 🧪 Estratégia de testes

### Unitários

* Mock de repository
* Testar regras de negócio isoladas

### Integração

* Banco SQLite em memória
* Testar persistência real

### E2E

* Testar endpoints HTTP
* Ignorar autenticação (mock de guard)

---

## 🔌 Endpoints da API

### POST /stock

Cria um produto

Body:
{
"name": "Produto A"
}

---

### POST /stock/add

Adiciona estoque

Body:
{
"productId": 1,
"amount": 10
}

---

### POST /stock/remove

Remove estoque

Body:
{
"productId": 1,
"amount": 5
}

---

### GET /stock/:id

Retorna estoque atual

---

## 🧠 Padrões usados

* Service contém regra de negócio
* Repository acessa banco
* Controller expõe API
* Uso de async/await em tudo

---

## ⚠️ Erros esperados

* "Product not found"
* "Insufficient stock"
* "Invalid amount"

---

## 🎯 Objetivo técnico

Código limpo, testável e desacoplado.

Foco em:

* TDD
* Clean Architecture (simples)
* Facilidade de manutenção

---

## 🤖 Instruções para IA

* Sempre respeitar regras de negócio acima
* Nunca permitir estoque negativo
* Sempre validar existência do produto
* Sempre usar async/await
* Sempre persistir dados no banco
* Gerar testes junto com código

---
