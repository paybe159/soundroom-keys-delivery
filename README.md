# SoundRoom — Сервис выдачи товаров

## Что это
Сайт для выдачи цифровых товаров по коду активации с Ozon.
Покупатель вводит код → получает файл для скачивания или лицензионный ключ.

---

## Деплой (без командной строки)

### Шаг 1 — Supabase (база данных)
1. Зайди на https://supabase.com → Sign up (бесплатно)
2. New project → придумай название и пароль
3. Когда проект создастся, иди в **SQL Editor** → **New query**
4. Скопируй содержимое файла `SUPABASE_SCHEMA.sql` и нажми **Run**
5. Зайди в **Project Settings** → **API**
6. Скопируй и сохрани:
   - `Project URL` (будет как https://abcdef.supabase.co)
   - `anon` `public` key

### Шаг 2 — GitHub
1. Зайди на https://github.com → создай новый репозиторий (New repository)
2. Назови его `soundroom-keys`, Public
3. В репозитории нажми **Add file** → **Upload files**
4. Загрузи все файлы из папки soundroom (можно zip-архивом)
5. Нажми **Commit changes**

### Шаг 3 — Vercel
1. Зайди на https://vercel.com → Sign up (через GitHub)
2. **New Project** → выбери репозиторий `soundroom-keys`
3. Перед деплоем нажми **Environment Variables** и добавь:
   - `NEXT_PUBLIC_SUPABASE_URL` = твой Project URL из Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = твой anon key из Supabase
4. Нажми **Deploy** 🚀

Через ~2 минуты сайт будет доступен на yourproject.vercel.app

---

## Добавление новых кодов

В Supabase → **Table Editor** → таблица `codes` → **Insert row**:

| Поле | Что вводить |
|------|-------------|
| code | SR-XXXX-XXXX-XXXX (любой уникальный код) |
| product_name | Название товара |
| product_type | Плагин / Лицензионный ключ / и т.д. |
| delivery_type | `file` или `text` |
| content | Лицензионный ключ (только для type=text) |
| download_url | Ссылка на Google Drive (только для type=file) |
| file_name | Имя файла (например, Valhalla_Installer.exe) |

### Как получить прямую ссылку с Google Drive
1. Загрузи файл на Google Drive
2. ПКМ → Открыть доступ → **Все у кого есть ссылка** → Просматривающий
3. ПКМ → Копировать ссылку
4. Ссылка вида: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
5. Замени на прямую: `https://drive.google.com/uc?export=download&id=FILE_ID`

---

## Структура проекта
```
soundroom/
├── pages/
│   ├── _app.js          — глобальные стили
│   ├── _document.js     — шрифты и иконки
│   ├── index.js         — главная страница
│   └── api/
│       └── redeem.js    — API: проверка и выдача кода
├── lib/
│   └── supabase.js      — клиент базы данных
├── styles/
│   └── globals.css      — глобальный CSS
├── .env.example         — шаблон переменных окружения
├── SUPABASE_SCHEMA.sql  — структура базы данных
└── package.json
```
