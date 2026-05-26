-- Добавь поле instructions в существующую таблицу
-- Выполни в Supabase → SQL Editor → New query

ALTER TABLE codes ADD COLUMN IF NOT EXISTS instructions text;
