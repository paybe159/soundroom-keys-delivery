import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { code, product_name, product_type, delivery_type, content, download_url, file_name, instructions } = req.body
  if (!code || !product_name) return res.status(400).json({ error: 'Код и название обязательны' })
  const { error } = await supabase.from('codes').insert([{
    code: code.trim().toUpperCase(),
    product_name, product_type, delivery_type,
    content: content || null,
    download_url: download_url || null,
    file_name: file_name || null,
    instructions: instructions || null,
  }])
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
