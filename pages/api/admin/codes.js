import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const { data, error } = await supabase.from('codes').select('id,code,product_name,product_type,delivery_type,used,created_at').order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ codes: data })
}
