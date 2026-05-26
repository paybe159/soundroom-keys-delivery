import { useState, useRef } from 'react'
import Head from 'next/head'

export default function Home() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)

  async function handleRedeem() {
    if (!code.trim()) { setError('Введите код активации'); return }
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Произошла ошибка'); return }
      setResult(data)
    } catch {
      setError('Ошибка соединения. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      setCode(text.trim())
      inputRef.current?.focus()
    } catch {
      inputRef.current?.focus()
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Head>
        <title>SoundRoom — Получить товар</title>
        <meta name="description" content="Введите код активации из письма, чтобы получить ваш товар" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={s.bg}>
        <div style={s.bgGrid} />
        <div style={{...s.bgOrb, ...s.bgOrbA}} />
        <div style={{...s.bgOrb, ...s.bgOrbB}} />
        <div style={{...s.bgOrb, ...s.bgOrbC}} />
      </div>

      <main style={s.main}>
        <header style={s.header}>
          <div style={s.logoWrap}>
            <svg width="28" height="28" viewBox="0 0 1777 1694" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M888.594 116L889.489 1577.81" stroke="#4C9BFF" stroke-width="232" stroke-linecap="round" stroke-linejoin="round"/><path d="M498 404L498 1290" stroke="#4C9BFF" stroke-width="232" stroke-linecap="round" stroke-linejoin="round"/><path d="M1276 404L1276 1290" stroke="#4C9BFF" stroke-width="232" stroke-linecap="round" stroke-linejoin="round"/><path d="M116 739L116 955" stroke="#4C9BFF" stroke-width="232" stroke-linecap="round" stroke-linejoin="round"/><path d="M1661 739L1661 955" stroke="#4C9BFF" stroke-width="232" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span style={s.brandText}>Sound<span style={{color:'#4F8EF7'}}>Room</span></span>
        </header>

        <div style={s.card}>
          <div style={s.cardTop}>
            <Waveform />
            <h1 style={s.cardTitle}>Получить товар</h1>
            <p style={s.cardSub}>Введите код активации из письма после покупки на Ozon</p>
          </div>

          <div style={s.cardBody}>
            <div style={s.inputLabel}>Код активации</div>
            <div style={s.inputWrap}>
              <input
                ref={inputRef}
                style={s.input}
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleRedeem()}
                placeholder="SR-XXXX-XXXX-XXXX"
                autoComplete="off"
                spellCheck={false}
                onFocus={e => e.target.style.borderColor = '#4F8EF7'}
                onBlur={e => e.target.style.borderColor = '#E5E9FF'}
              />
              <button style={s.pasteBtn} onClick={handlePaste} title="Вставить из буфера">
                <i className="ti ti-clipboard" />
              </button>
            </div>

            <button style={{...s.mainBtn, ...(loading ? s.mainBtnLoading : {})}} onClick={handleRedeem} disabled={loading}>
              <span style={s.btnShine} />
              {loading ? <Spinner /> : <><i className="ti ti-package" style={{fontSize:17}} /> Получить товар</>}
            </button>

            {error && (
              <div style={s.errorBox}>
                <i className="ti ti-alert-circle" style={{fontSize:16,flexShrink:0}} />
                {error}
              </div>
            )}

            {result && (
              <div>
                <div style={s.divider} />
                <div style={s.successBadge}>
                  <span style={s.successDot} />
                  Код активирован
                </div>

                <div style={s.productCard}>
                  <div style={s.productName}>{result.product_name}</div>
                  <div style={s.productType}>{result.product_type}</div>

                  {result.delivery_type === 'text' && result.content && (
                    <div style={s.licenseBox}>{result.content}</div>
                  )}

                  {result.delivery_type === 'file' && result.download_url && (
                    <a href={result.download_url} target="_blank" rel="noopener noreferrer" style={s.dlBtn}>
                      <i className="ti ti-download" style={{fontSize:18}} />
                      Скачать {result.file_name || 'инсталлятор'}
                    </a>
                  )}

                  {result.delivery_type === 'text' && (
                    <button style={s.copyBtn} onClick={handleCopy}>
                      <i className={`ti ti-${copied ? 'check' : 'copy'}`} style={{fontSize:15}} />
                      {copied ? 'Скопировано!' : 'Скопировать лицензионный ключ'}
                    </button>
                  )}

                  {result.instructions && (
                    <div style={s.instructionsBox}>
                      <div style={s.instructionsTitle}>
                        <i className="ti ti-info-circle" style={{fontSize:15}} />
                        Инструкция по активации
                      </div>
                      <div style={s.instructionsText}>{result.instructions}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <a href="https://t.me/soundroomsupport" target="_blank" rel="noopener noreferrer" style={s.tgBtn}>
          <TgIcon />
          Поддержка в Telegram
        </a>
      </main>

      <style>{`
        @keyframes wave { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.4)} }
        @keyframes shine { 0%{left:-100%} 50%,100%{left:160%} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  )
}

function Waveform() {
  const heights = [14,26,40,48,40,24,12]
  const delays = [0,.15,.05,.25,.1,.2,.08]
  const opacities = [.45,.65,1,1,1,.65,.45]
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,height:52,marginBottom:22}}>
      {heights.map((h,i) => (
        <div key={i} style={{width:5,height:h,borderRadius:20,background:'linear-gradient(180deg,#4F8EF7 0%,#7BB3FF 100%)',opacity:opacities[i],animation:`wave 1.6s ease-in-out ${delays[i]}s infinite`}} />
      ))}
    </div>
  )
}

function Spinner() {
  return <div style={{width:18,height:18,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.35)',borderTopColor:'#fff',animation:'spin 0.7s linear infinite'}} />
}

function TgIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#4F8EF7">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

const s = {
  bg:{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'},
  bgGrid:{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(79,142,247,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,142,247,.04) 1px,transparent 1px)',backgroundSize:'40px 40px'},
  bgOrb:{position:'absolute',borderRadius:'50%',filter:'blur(70px)',pointerEvents:'none'},
  bgOrbA:{width:600,height:600,top:-200,left:'50%',transform:'translateX(-50%)',background:'radial-gradient(circle,rgba(79,142,247,.10) 0%,transparent 70%)'},
  bgOrbB:{width:350,height:350,bottom:-80,right:-80,background:'radial-gradient(circle,rgba(79,142,247,.07) 0%,transparent 70%)'},
  bgOrbC:{width:220,height:220,top:'40%',left:-70,background:'radial-gradient(circle,rgba(161,188,255,.11) 0%,transparent 70%)'},
  main:{position:'relative',zIndex:1,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',padding:'36px 20px 60px'},
  header:{display:'flex',alignItems:'center',gap:12,marginBottom:48,animation:'fadeUp .7s cubic-bezier(.22,1,.36,1) both'},
  logoWrap:{width:48,height:48,background:'#fff',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 16px rgba(79,142,247,.15),0 1px 3px rgba(0,0,0,.06)',border:'1px solid rgba(79,142,247,.12)'},
  brandText:{fontFamily:"'Unbounded',sans-serif",fontSize:20,fontWeight:600,color:'#1A1A2E',letterSpacing:'-.4px'},
  card:{width:'100%',maxWidth:460,background:'#fff',borderRadius:28,boxShadow:'0 4px 40px rgba(79,142,247,.10),0 1px 4px rgba(0,0,0,.05)',border:'1px solid rgba(79,142,247,.08)',overflow:'hidden',animation:'fadeUp .8s cubic-bezier(.22,1,.36,1) .1s both'},
  cardTop:{padding:'36px 36px 28px',textAlign:'center',background:'linear-gradient(160deg,rgba(79,142,247,.04) 0%,transparent 100%)',borderBottom:'1px solid rgba(79,142,247,.07)'},
  cardTitle:{fontFamily:"'Unbounded',sans-serif",fontSize:22,fontWeight:600,color:'#1A1A2E',letterSpacing:'-.5px',marginBottom:8},
  cardSub:{fontSize:14,color:'#6B7280',lineHeight:1.6,fontWeight:400},
  cardBody:{padding:'28px 36px 32px'},
  inputLabel:{fontSize:11,fontWeight:600,color:'#9CA3AF',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:8},
  inputWrap:{position:'relative',marginBottom:14},
  input:{width:'100%',background:'#F8F9FF',border:'1.5px solid #E5E9FF',borderRadius:14,padding:'15px 50px 15px 18px',fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:500,color:'#1A1A2E',letterSpacing:'.5px',outline:'none',transition:'all .2s'},
  pasteBtn:{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#C4CADC',fontSize:19,padding:4,lineHeight:1},
  mainBtn:{width:'100%',background:'linear-gradient(160deg,#4F8EF7 0%,#3A7FEF 100%)',border:'none',borderRadius:14,padding:16,fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:600,color:'#fff',cursor:'pointer',position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 2px 16px rgba(79,142,247,.35),inset 0 1px 0 rgba(255,255,255,.2)',transition:'transform .15s,box-shadow .2s'},
  mainBtnLoading:{opacity:.85,cursor:'not-allowed'},
  btnShine:{position:'absolute',top:0,left:'-100%',width:'50%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)',animation:'shine 3.5s ease-in-out infinite'},
  errorBox:{display:'flex',alignItems:'center',gap:8,background:'#FFF1F1',border:'1px solid #FED4D4',borderRadius:12,padding:'11px 14px',fontSize:13,color:'#DC4040',marginTop:12},
  divider:{height:1,background:'linear-gradient(90deg,transparent,rgba(79,142,247,.15),transparent)',margin:'24px 0'},
  successBadge:{display:'inline-flex',alignItems:'center',gap:6,background:'linear-gradient(135deg,#E6F9F2,#D0F5E8)',border:'1px solid #A3E9CC',borderRadius:20,padding:'5px 14px',fontSize:12,fontWeight:600,color:'#1A7F4E',marginBottom:16},
  successDot:{display:'inline-block',width:6,height:6,borderRadius:'50%',background:'#34C77A',animation:'blink 1.4s ease-in-out infinite'},
  productCard:{background:'linear-gradient(135deg,#F8F9FF 0%,#F0F3FF 100%)',border:'1px solid #E5E9FF',borderRadius:18,padding:20},
  productName:{fontFamily:"'Unbounded',sans-serif",fontSize:15,fontWeight:600,color:'#1A1A2E',marginBottom:4},
  productType:{fontSize:12,color:'#9CA3AF',marginBottom:18},
  licenseBox:{background:'#fff',border:'1px solid #E5E9FF',borderRadius:10,padding:'14px 16px',fontFamily:"'Courier New',monospace",fontSize:12.5,color:'#374151',lineHeight:1.7,wordBreak:'break-all',marginBottom:14,whiteSpace:'pre-wrap'},
  dlBtn:{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',background:'#fff',border:'1.5px solid #4F8EF7',borderRadius:12,padding:14,fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600,color:'#4F8EF7',cursor:'pointer',textDecoration:'none',boxShadow:'0 1px 6px rgba(79,142,247,.10)',transition:'all .2s'},
  copyBtn:{display:'flex',alignItems:'center',justifyContent:'center',gap:6,width:'100%',background:'none',border:'1.5px solid #E5E9FF',borderRadius:12,padding:12,fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:500,color:'#9CA3AF',cursor:'pointer',marginTop:8,transition:'all .2s'},
  instructionsBox:{marginTop:16,background:'#FFFBF0',border:'1px solid #FFE9A0',borderRadius:12,padding:'14px 16px'},
  instructionsTitle:{display:'flex',alignItems:'center',gap:6,fontSize:12,fontWeight:600,color:'#B45309',marginBottom:8},
  instructionsText:{fontSize:13,color:'#78350F',lineHeight:1.7,whiteSpace:'pre-wrap'},
  tgBtn:{marginTop:24,display:'inline-flex',alignItems:'center',gap:9,background:'#fff',border:'1px solid rgba(79,142,247,.15)',borderRadius:14,padding:'12px 22px',fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:500,color:'#6B7280',textDecoration:'none',boxShadow:'0 1px 6px rgba(79,142,247,.06)',animation:'fadeUp .8s cubic-bezier(.22,1,.36,1) .25s both',transition:'all .2s'},
}
