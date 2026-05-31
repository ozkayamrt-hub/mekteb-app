'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const DocumentUpload = dynamic(() => import('@/components/upload/DocumentUpload'), { ssr: false })

const STATUS_BADGE: Record<string, React.ReactNode> = {
  pending:  <span className="badge badge-gold">İnceleniyor</span>,
  verified: <span className="badge badge-green">Onaylandı ✓</span>,
  rejected: <span className="badge badge-red">Reddedildi</span>,
}

const DOC_TYPE_LABEL: Record<string, string> = {
  diploma: 'Diploma', license: 'Ruhsat', certificate: 'Sertifika',
  membership: 'Üyelik', supervision: 'Süpervizyon', other: 'Diğer',
}

interface Doc {
  id: string; document_type: string; title: string; issuer: string | null
  issue_year: number | null; status: string; document_url: string | null; created_at: string
}

interface Props { userId: string; initialDocs: Doc[] }

export default function BelgelerSection({ userId, initialDocs }: Props) {
  const [docs, setDocs]         = useState<Doc[]>(initialDocs)
  const [showUpload, setShowUpload] = useState(false)

  async function refreshDocs() {
    const res  = await fetch('/api/documents/me')
    const data = await res.json()
    setDocs(data)
    setShowUpload(false)
  }

  return (
    <div>
      {/* Başlık */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--muted)' }}>
          Belgelerim ({docs.length})
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="btn btn-outline btn-sm">
          {showUpload ? 'İptal' : '+ Belge Yükle'}
        </button>
      </div>

      {/* Yükleme formu */}
      {showUpload && (
        <div style={{ marginBottom:'20px' }}>
          <DocumentUpload userId={userId} onUploaded={refreshDocs} />
        </div>
      )}

      {/* Belge listesi */}
      {docs.length === 0 ? (
        <div className="card" style={{ padding:'32px', textAlign:'center' }}>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--muted)', marginBottom:'14px' }}>
            Henüz belge eklenmemiş. Diploma ve sertifikalarınızı ekleyin.
          </p>
          <button onClick={() => setShowUpload(true)} className="btn btn-gold btn-sm">
            İlk Belgeyi Yükle →
          </button>
        </div>
      ) : (
        <div className="card">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Belge','Tür','Kurum','Yıl','Durum',''].map(h => (
                  <th key={h} style={{ padding:'10px 20px', textAlign:'left', fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', fontWeight:400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => (
                <tr key={doc.id} style={{ borderBottom:'1px solid var(--border)' }}>
                  <td style={{ padding:'12px 20px', fontFamily:'Cormorant Garant,serif', color:'var(--cream)', fontSize:'.9rem', fontWeight:500 }}>
                    {doc.title}
                  </td>
                  <td style={{ padding:'12px 20px' }}>
                    <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)', border:'1px solid var(--border)', padding:'2px 8px' }}>
                      {DOC_TYPE_LABEL[doc.document_type] || doc.document_type}
                    </span>
                  </td>
                  <td style={{ padding:'12px 20px', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--text)' }}>
                    {doc.issuer || '—'}
                  </td>
                  <td style={{ padding:'12px 20px', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--muted)' }}>
                    {doc.issue_year || '—'}
                  </td>
                  <td style={{ padding:'12px 20px' }}>
                    {STATUS_BADGE[doc.status] || doc.status}
                  </td>
                  <td style={{ padding:'12px 20px' }}>
                    {doc.document_url && (
                      <a href={doc.document_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--gold-d)', textDecoration:'none' }}>
                        Görüntüle ↗
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {docs.some(d => d.status === 'pending') && (
        <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)', marginTop:'10px' }}>
          ◈ &nbsp; Bekleyen belgeleriniz Mekteb Komitesi tarafından inceleniyor. Ortalama süre 1–3 iş günüdür.
        </p>
      )}
    </div>
  )
}
