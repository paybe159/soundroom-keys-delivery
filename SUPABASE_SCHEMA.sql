-- Выполни этот SQL в Supabase → SQL Editor → New query

create table codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  product_name text not null,
  product_type text not null,
  delivery_type text not null check (delivery_type in ('file', 'text')),
  content text,
  download_url text,
  file_name text,
  used boolean default false,
  used_at timestamp,
  created_at timestamp default now()
);

-- Отключаем RLS (Row Level Security) для публичного доступа через API
alter table codes enable row level security;

-- Разрешаем SELECT и UPDATE через anon key (наш бэкенд)
create policy "Allow read" on codes for select using (true);
create policy "Allow update" on codes for update using (true);

-- Примеры кодов для теста (можешь удалить после)
insert into codes (code, product_name, product_type, delivery_type, content)
values
  ('SR-TEST-KEYS-0001', 'Serum by Xfer', 'Лицензионный ключ', 'text', 'SERUM-XFER-A8K2-9XPQ-4MNR-2024'),
  ('SR-TEST-KEYS-0002', 'Omnisphere 2', 'Лицензионный ключ', 'text', 'OMNI-SPEC-BB31-7YHQ-9ZXP-2024');

-- Для товара с файлом (ссылка на Google Drive):
-- insert into codes (code, product_name, product_type, delivery_type, download_url, file_name)
-- values ('SR-TEST-FILE-0001', 'Valhalla DSP Bundle', 'Плагин — инсталлятор', 'file', 'ССЫЛКА_С_ГУГЛ_ДИСКА', 'ValhallaDSP_Installer.exe');
