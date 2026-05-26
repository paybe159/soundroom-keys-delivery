import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code } = req.body

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Введите код активации' })
  }

  const cleanCode = code.trim().toUpperCase()

  // Fetch code from DB
  const { data, error } = await supabase
    .from('codes')
    .select('*')
    .eq('code', cleanCode)
    .single()

  if (error || !data) {
    return res.status(404).json({ error: 'Неверный код активации' })
  }

  if (data.used) {
    return res.status(410).json({ error: 'Этот код уже был использован' })
  }

  // Mark as used
  await supabase
    .from('codes')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('id', data.id)

  return res.status(200).json({
    product_name: data.product_name,
    product_type: data.product_type,
    delivery_type: data.delivery_type,
    content: data.content,
    download_url: data.download_url,
    file_name: data.file_name,
  })
}
