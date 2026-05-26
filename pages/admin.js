import { useState, useEffect } from 'react'
import Head from 'next/head'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'soundroom2024'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ code: '', product_name: '', product_type: '', delivery_type: 'text', content: '', download_url: '', file_name: '', instructions: '' })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [tab, setTab] = useState('add')

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); loadCodes() }
    else { setPwError(true); setTimeout(() => setPwError(false), 2000) }
  }

  async function loadCodes() {
    setLoading(true)
    const res = await fetch('/api/admin/codes')
    const data = await res.json()
    setCodes(data.codes || [])
    setLoading(false)
  }

  async function handleSave() {
    if (!form.code || !form.product_name) { setSaveMsg('Заполните код и название товара'); return }
    setSaving(true)
    const res = await fetch('/api/admin/add-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setSaveMsg('✓ Код добавлен!')
      setForm({ code: '', product_name: '', product_type: '', delivery_type: 'text', content: '', download_url: '', file_name: '', instructions: '' })
      loadCodes()
    } else {
      setSaveMsg('Ошибка: ' + (data.error || 'что-то пошло не так'))
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const seg = () => Array.from({length:4}, () => chars[Math.floor(Math.random()*chars.length)]).join('')
    setForm(f => ({...f, code: `SR-${seg()}-${seg()}-${seg()}`}))
  }

  if (!authed) return <LoginScreen pw={pw} setPw={setPw} onLogin={handleLogin} error={pwError} />

  return (
    <>
      <Head><title>SoundRoom Admin</title><meta name="robots" content="noindex" /></Head>
      <div style={s.bg}>
        <div style={s.bgGrid} />
        <div style={{...s.bgOrb, ...s.bgOrbA}} />
      </div>
      <main style={s.main}>
        <header style={s.header}>
          <div style={s.logoWrap}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect x="0" y="11" width="4" height="6" rx="2" fill="#4F8EF7" opacity=".5"/>
              <rect x="5.5" y="7.5" width="4" height="13" rx="2" fill="#4F8EF7" opacity=".75"/>
              <rect x="11" y="2" width="5" height="24" rx="2.5" fill="#4F8EF7"/>
              <rect x="17.5" y="6" width="4" height="16" rx="2" fill="#4F8EF7" opacity=".8"/>
              <rect x="23" y="10" width="5" height="8" rx="2" fill="#4F8EF7" opacity=".5"/>
            </svg>
          </div>
          <span style={s.brandText}>Sound<span style={{color:'#4F8EF7'}}>Room</span></span>
          <span style={s.adminBadge}>Admin</span>
        </header>

        <div style={s.card}>
          <div style={s.tabs}>
            <button style={{...s.tabBtn, ...(tab==='add'?s.tabBtnActive:{})}} onClick={()=>setTab('add')}>
              <i className="ti ti-plus" /> Добавить код
            </button>
            <button style={{...s.tabBtn, ...(tab==='list'?s.tabBtnActive:{})}} onClick={()=>{setTab('list');loadCodes()}}>
              <i className="ti ti-list" /> Все коды ({codes.length})
            </button>
          </div>

          {tab === 'add' && (
            <div style={s.cardBody}>
              <Row label="Код активации">
                <div style={{display:'flex',gap:8}}>
                  <input style={s.input} value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))} placeholder="SR-XXXX-XXXX-XXXX" />
                  <button style={s.genBtn} onClick={generateCode} title="Сгенерировать">
                    <i className="ti ti-refresh" />
                  </button>
                </div>
              </Row>
              <Row label="Название товара">
                <input style={s.input} value={form.product_name} onChange={e=>setForm(f=>({...f,product_name:e.target.value}))} placeholder="Valhalla DSP Bundle" />
              </Row>
              <Row label="Тип товара">
                <input style={s.input} value={form.product_type} onChange={e=>setForm(f=>({...f,product_type:e.target.value}))} placeholder="Плагин — инсталлятор" />
              </Row>
              <Row label="Способ выдачи">
                <div style={s.segmented}>
                  <button style={{...s.segBtn, ...(form.delivery_type==='text'?s.segBtnActive:{})}} onClick={()=>setForm(f=>({...f,delivery_type:'text'}))}>
                    Текст / ключ
                  </button>
                  <button style={{...s.segBtn, ...(form.delivery_type==='file'?s.segBtnActive:{})}} onClick={()=>setForm(f=>({...f,delivery_type:'file'}))}>
                    Файл / ссылка
                  </button>
                </div>
              </Row>

              {form.delivery_type === 'text' && (
                <Row label="Лицензионный ключ">
                  <textarea style={s.textarea} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} placeholder="XXXX-XXXX-XXXX-XXXX" rows={3} />
                </Row>
              )}
              {form.delivery_type === 'file' && (
                <>
                  <Row label="Ссылка на файл (Google Drive)">
                    <input style={s.input} value={form.download_url} onChange={e=>setForm(f=>({...f,download_url:e.target.value}))} placeholder="https://drive.google.com/uc?export=download&id=..." />
                  </Row>
                  <Row label="Имя файла">
                    <input style={s.input} value={form.file_name} onChange={e=>setForm(f=>({...f,file_name:e.target.value}))} placeholder="Valhalla_Installer.exe" />
                  </Row>
                </>
              )}

              <Row label="Инструкция по активации (необязательно)">
                <textarea style={s.textarea} value={form.instructions} onChange={e=>setForm(f=>({...f,instructions:e.target.value}))} placeholder={"Например:\n1. Скачайте и запустите инсталлятор\n2. При активации введите ключ\n3. Перезапустите DAW"} rows={5} />
              </Row>

              {saveMsg && (
                <div style={{...s.saveMsg, ...(saveMsg.startsWith('✓') ? s.saveMsgOk : s.saveMsgErr)}}>
                  {saveMsg}
                </div>
              )}

              <button style={{...s.mainBtn, ...(saving?{opacity:.7,cursor:'not-allowed'}:{})}} onClick={handleSave} disabled={saving}>
                <span style={s.btnShine} />
                {saving ? 'Сохраняем...' : <><i className="ti ti-device-floppy" style={{fontSize:17}} /> Сохранить код</>}
              </button>
            </div>
          )}

          {tab === 'list' && (
            <div style={s.cardBody}>
              {loading ? (
                <div style={{textAlign:'center',color:'#9CA3AF',padding:'40px 0'}}>Загружаем...</div>
              ) : codes.length === 0 ? (
                <div style={{textAlign:'center',color:'#9CA3AF',padding:'40px 0'}}>Кодов пока нет</div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {codes.map(c => (
                    <div key={c.id} style={s.codeRow}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                          <span style={s.codeTag}>{c.code}</span>
                          <span style={{...s.statusDot, background: c.used ? '#FCA5A5' : '#6EE7B7'}} />
                          <span style={{fontSize:11,color:c.used?'#DC4040':'#059669'}}>{c.used ? 'использован' : 'активен'}</span>
                        </div>
                        <div style={{fontSize:13,color:'#374151',fontWeight:500}}>{c.product_name}</div>
                        <div style={{fontSize:12,color:'#9CA3AF'}}>{c.product_type} · {c.delivery_type === 'file' ? 'файл' : 'ключ'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes shine{0%{left:-100%}50%,100%{left:160%}}`}</style>
    </>
  )
}

function LoginScreen({ pw, setPw, onLogin, error }) {
  return (
    <>
      <Head><title>SoundRoom Admin</title><meta name="robots" content="noindex" /></Head>
      <div style={s.bg}><div style={s.bgGrid}/><div style={{...s.bgOrb,...s.bgOrbA}}/></div>
      <main style={{...s.main,justifyContent:'center'}}>
        <div style={{...s.card,maxWidth:360,animation:'fadeUp .6s cubic-bezier(.22,1,.36,1) both'}}>
          <div style={{...s.cardTop,textAlign:'center'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:4}}>
              <div style={s.logoWrap}>
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <rect x="0" y="11" width="4" height="6" rx="2" fill="#4F8EF7" opacity=".5"/>
                  <rect x="5.5" y="7.5" width="4" height="13" rx="2" fill="#4F8EF7" opacity=".75"/>
                  <rect x="11" y="2" width="5" height="24" rx="2.5" fill="#4F8EF7"/>
                  <rect x="17.5" y="6" width="4" height="16" rx="2" fill="#4F8EF7" opacity=".8"/>
                  <rect x="23" y="10" width="5" height="8" rx="2" fill="#4F8EF7" opacity=".5"/>
                </svg>
              </div>
              <span style={s.brandText}>Sound<span style={{color:'#4F8EF7'}}>Room</span></span>
            </div>
            <div style={{fontSize:13,color:'#9CA3AF',marginTop:8}}>Панель управления</div>
          </div>
          <div style={s.cardBody}>
            <div style={s.inputLabel}>Пароль</div>
            <input
              style={{...s.input, ...(error?{borderColor:'#FCA5A5'}:{})}}
              type="password" value={pw}
              onChange={e=>setPw(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&onLogin()}
              placeholder="Введите пароль"
              autoFocus
            />
            {error && <div style={{fontSize:13,color:'#DC4040',marginTop:8}}>Неверный пароль</div>}
            <button style={{...s.mainBtn,marginTop:14}} onClick={onLogin}>
              <span style={s.btnShine}/>
              <i className="ti ti-lock-open" style={{fontSize:16}}/> Войти
            </button>
          </div>
        </div>
      </main>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes shine{0%{left:-100%}50%,100%{left:160%}}`}</style>
    </>
  )
}

function Row({ label, children }) {
  return (
    <div style={{marginBottom:16}}>
      <div style={s.inputLabel}>{label}</div>
      {children}
    </div>
  )
}

const s = {
  bg:{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'},
  bgGrid:{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(79,142,247,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,142,247,.04) 1px,transparent 1px)',backgroundSize:'40px 40px'},
  bgOrb:{position:'absolute',borderRadius:'50%',filter:'blur(70px)',pointerEvents:'none'},
  bgOrbA:{width:600,height:600,top:-200,left:'50%',transform:'translateX(-50%)',background:'radial-gradient(circle,rgba(79,142,247,.10) 0%,transparent 70%)'},
  main:{position:'relative',zIndex:1,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',padding:'36px 20px 60px'},
  header:{display:'flex',alignItems:'center',gap:12,marginBottom:40},
  logoWrap:{width:40,height:40,background:'#fff',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 12px rgba(79,142,247,.15)',border:'1px solid rgba(79,142,247,.12)'},
  brandText:{fontFamily:"'Unbounded',sans-serif",fontSize:18,fontWeight:600,color:'#1A1A2E',letterSpacing:'-.4px'},
  adminBadge:{background:'rgba(79,142,247,.1)',border:'1px solid rgba(79,142,247,.2)',borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:600,color:'#4F8EF7'},
  card:{width:'100%',maxWidth:520,background:'#fff',borderRadius:28,boxShadow:'0 4px 40px rgba(79,142,247,.10),0 1px 4px rgba(0,0,0,.05)',border:'1px solid rgba(79,142,247,.08)',overflow:'hidden'},
  cardTop:{padding:'28px 32px 20px',background:'linear-gradient(160deg,rgba(79,142,247,.04) 0%,transparent 100%)',borderBottom:'1px solid rgba(79,142,247,.07)'},
  cardBody:{padding:'24px 32px 32px'},
  tabs:{display:'flex',borderBottom:'1px solid rgba(79,142,247,.07)'},
  tabBtn:{flex:1,padding:'16px 12px',background:'none',border:'none',cursor:'pointer',fontSize:13,fontWeight:500,color:'#9CA3AF',display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all .2s'},
  tabBtnActive:{color:'#4F8EF7',borderBottom:'2px solid #4F8EF7'},
  inputLabel:{fontSize:11,fontWeight:600,color:'#9CA3AF',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:6},
  input:{width:'100%',background:'#F8F9FF',border:'1.5px solid #E5E9FF',borderRadius:12,padding:'13px 16px',fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:500,color:'#1A1A2E',outline:'none',transition:'all .2s'},
  textarea:{width:'100%',background:'#F8F9FF',border:'1.5px solid #E5E9FF',borderRadius:12,padding:'13px 16px',fontFamily:"'Inter',sans-serif",fontSize:13,color:'#1A1A2E',outline:'none',resize:'vertical',lineHeight:1.6,transition:'all .2s'},
  segmented:{display:'flex',background:'#F8F9FF',border:'1.5px solid #E5E9FF',borderRadius:12,padding:3,gap:3},
  segBtn:{flex:1,padding:'9px 12px',background:'none',border:'none',borderRadius:9,cursor:'pointer',fontSize:13,fontWeight:500,color:'#9CA3AF',transition:'all .2s'},
  segBtnActive:{background:'#fff',color:'#4F8EF7',boxShadow:'0 1px 4px rgba(79,142,247,.15)'},
  genBtn:{width:46,height:46,background:'#F8F9FF',border:'1.5px solid #E5E9FF',borderRadius:12,cursor:'pointer',fontSize:18,color:'#9CA3AF',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .2s'},
  mainBtn:{width:'100%',background:'linear-gradient(160deg,#4F8EF7 0%,#3A7FEF 100%)',border:'none',borderRadius:14,padding:15,fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:600,color:'#fff',cursor:'pointer',position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 2px 16px rgba(79,142,247,.35),inset 0 1px 0 rgba(255,255,255,.2)',transition:'all .15s'},
  btnShine:{position:'absolute',top:0,left:'-100%',width:'50%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)',animation:'shine 3.5s ease-in-out infinite'},
  saveMsg:{padding:'10px 14px',borderRadius:10,fontSize:13,fontWeight:500,marginBottom:14},
  saveMsgOk:{background:'#E6F9F2',color:'#1A7F4E',border:'1px solid #A3E9CC'},
  saveMsgErr:{background:'#FFF1F1',color:'#DC4040',border:'1px solid #FED4D4'},
  codeRow:{background:'#F8F9FF',border:'1px solid #E5E9FF',borderRadius:14,padding:'14px 16px',display:'flex',alignItems:'center'},
  codeTag:{fontFamily:"'Courier New',monospace",fontSize:12,background:'#EEF2FF',border:'1px solid #C7D7FF',borderRadius:6,padding:'2px 8px',color:'#4F8EF7',fontWeight:600},
  statusDot:{width:7,height:7,borderRadius:'50%',display:'inline-block'},
}
