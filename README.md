# 🧠 Gerador de Planos de Aula com IA

Sistema inteligente que gera **planos de aula personalizados**, alinhados à **BNCC (Base Nacional Comum Curricular)**, utilizando modelos de **IA generativa** (Gemini).

---

## 1️⃣ 🎯 Objetivo do Projeto

Criar uma ferramenta prática para professores e escolas, capaz de **gerar automaticamente planos de aula completos**, com introdução lúdica, objetivos pedagógicos e rubricas de avaliação.

---

## 2️⃣ 🚀 Funcionalidades

- Geração automática de planos de aula com:
  - **Introdução lúdica e contextualizada**
  - **Objetivo de aprendizagem da BNCC**
  - **Passo a passo detalhado**
  - **Rubrica de avaliação**
- Geração de texto via **Google Gemini API**
- Banco de dados **Supabase (PostgreSQL)**
- Interface web com **HTML + Fetch API**
- Backend em **Supabase**
- **JSON estruturado e validado**

---

## 3️⃣ 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-------------|
| Frontend | React |
| Backend | Supabase |
| Banco de Dados | PostgreSQL (Supabase) |
| IA | Google Gemini (modelo `gemini-2.5-flash`) |
| Deploy | GitHub Actions + VPS

---

## 4️⃣ ⚙️ Instalação e Setup Local

### Passo 1 — Clonar o Repositório
```bash
git clone https://github.com/thiagoleites/plannerai.git
cd plannerai
```

### Passo 2 — Instalar Dependências
```bash
npm install
```

### Passo 3 — Criar o Arquivo `.env`
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
VITE_GEMINI_API_KEY=sua_chave_google_ai
VITE_GEMINI_MODEL=gemini-2.5-flash
```

### Passo 4 — Rodar o Servidor
```bash
npm run dev
```

Acesse o sistema em:
> http://localhost:5173 - ou a através da URL fornecida ao executar o projeto

---

## 5️⃣ 🌐 Deploy em Produção

1. Configure as variáveis de ambiente no servidor.
2. Execute:
   ```bash
   npm run build
   npm run deploy
   ```
3. O app ficará disponível no domínio configurado.

---

## 6️⃣ 💾 Estrutura de Pastas

```
📦 plannerai/
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── node_modules/
│   └── ... (dependências instaladas pelo npm)
│
├── src/
│   ├── components/
│   │   ├── LessonPlanGenerator.tsx
│   │   ├── PlanViewer.tsx
│   │   └── SavedPlans.tsx
│   │
│   ├── lib/
│   │   └── supabase.ts
│   │
│   ├── supabase/
│   │   └── migrations/
│   │       └── 20251028022805_create_lesson_plans.sql
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md

```
---

### 7️⃣ 🧩 Schema SQL

```sql
CREATE TABLE IF NOT EXISTS lesson_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  grade_level text NOT NULL,
  theme text NOT NULL,
  introduction_ludica text DEFAULT '',
  objetivo_bncc text DEFAULT '',
  activity_steps jsonb DEFAULT '[]'::jsonb,
  evaluation_rubric jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

```
