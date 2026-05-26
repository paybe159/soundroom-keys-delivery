import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { id, product_name, product_type, delivery_type, content, download_url, file_name, instructions } = req.body
  if (!id) return res.status(400).json({ error: 'ID обязателен' })
  const { error } = await supabase.from('codes').update({
    product_name, product_type, delivery_type,
    content: content || null,
    download_url: download_url || null,
    file_name: file_name || null,
    instructions: instructions || null,
  }).eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
