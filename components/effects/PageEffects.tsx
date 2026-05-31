'use client'

/* ═══════════════════════════════════════════════
   Mekteb Dekoratif Efektler
   - Güvercin sürüsü
   - Defne dalı
   - Yaprak yağmuru
═══════════════════════════════════════════════ */

export function DoveFlock({ side = 'left' }: { side?: 'left' | 'right' }) {
  const birds = [
    { x: 40,  y: 55,  size: 22, delay: 0,    dur: 28, drift: -15 },
    { x: 90,  y: 40,  size: 16, delay: 3,    dur: 32, drift: -10 },
    { x: 55,  y: 70,  size: 14, delay: 6,    dur: 25, drift: -20 },
    { x: 25,  y: 35,  size: 20, delay: 1.5,  dur: 30, drift: -8  },
    { x: 120, y: 60,  size: 12, delay: 8,    dur: 35, drift: -12 },
    { x: 75,  y: 25,  size: 18, delay: 4,    dur: 27, drift: -18 },
    { x: 30,  y: 80,  size: 11, delay: 10,   dur: 33, drift: -6  },
    { x: 100, y: 45,  size: 15, delay: 2,    dur: 29, drift: -14 },
    { x: 60,  y: 90,  size: 10, delay: 12,   dur: 36, drift: -9  },
    { x: 145, y: 30,  size: 13, delay: 5,    dur: 31, drift: -16 },
    { x: 20,  y: 50,  size: 17, delay: 7,    dur: 26, drift: -11 },
    { x: 110, y: 75,  size: 9,  delay: 9,    dur: 34, drift: -7  },
  ]

  return (
    <div style={{
      position: 'absolute',
      [side === 'left' ? 'left' : 'right']: '-20px',
      top: '15%',
      width: '200px',
      height: '70%',
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes doveFloat {
          0%   { transform: translate(0px, 0px) scale(1) rotate(-2deg); opacity: 0; }
          8%   { opacity: 0.7; }
          50%  { transform: translate(var(--dx), -40px) scale(1.05) rotate(2deg); opacity: 0.5; }
          92%  { opacity: 0.4; }
          100% { transform: translate(calc(var(--dx) * 2), -80px) scale(0.9) rotate(-3deg); opacity: 0; }
        }
        @keyframes doveWing {
          0%, 100% { d: path("M0,5 Q5,0 10,5 Q15,0 20,5"); }
          50%       { d: path("M0,8 Q5,2 10,8 Q15,2 20,8"); }
        }
      `}</style>

      {birds.map((b, i) => (
        <svg
          key={i}
          viewBox="0 0 20 10"
          width={b.size}
          height={b.size / 2}
          style={{
            position: 'absolute',
            left: `${b.x}px`,
            top: `${b.y}%`,
            '--dx': `${b.drift}px`,
            animation: `doveFloat ${b.dur}s ease-in-out ${b.delay}s infinite`,
            filter: 'drop-shadow(0 0 3px rgba(201,169,110,0.3))',
          } as React.CSSProperties}
        >
          <path
            d="M0,5 Q5,0 10,5 Q15,0 20,5"
            fill="none"
            stroke="rgba(201,169,110,0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  )
}

export function LaurelBranch({ position = 'bottomLeft' }: { position?: 'bottomLeft' | 'bottomRight' | 'topLeft' }) {
  const transforms: Record<string, string> = {
    bottomLeft:  'translate(-10px, 20px) rotate(15deg)',
    bottomRight: 'translate(10px, 20px) scaleX(-1) rotate(15deg)',
    topLeft:     'translate(-10px, -10px) rotate(-20deg)',
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: position === 'topLeft' ? 'auto' : '0',
      top:    position === 'topLeft' ? '0' : 'auto',
      left: '0',
      width: '280px',
      height: '220px',
      pointerEvents: 'none',
      zIndex: 1,
      transform: transforms[position],
      opacity: 0.55,
    }}>
      <style>{`
        @keyframes drawBranch {
          from { stroke-dashoffset: 1200; opacity: 0; }
          10%  { opacity: 1; }
          to   { stroke-dashoffset: 0; opacity: 0.7; }
        }
        @keyframes leafSway {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(3deg); }
        }
      `}</style>

      <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}>

        {/* Ana dal */}
        <path
          d="M10,210 C30,180 50,150 80,120 C110,90 140,70 170,50 C200,30 230,20 260,15"
          stroke="rgba(158,125,76,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1200"
          strokeDashoffset="1200"
          style={{ animation: 'drawBranch 4s ease-out 0.5s forwards' }}
        />

        {/* Yapraklar — sol taraf */}
        {[
          { cx: 55, cy: 165, rx: 18, ry: 9, rot: -40 },
          { cx: 40, cy: 148, rx: 16, ry: 8, rot: -55 },
          { cx: 78, cy: 140, rx: 19, ry: 9, rot: -30 },
          { cx: 68, cy: 125, rx: 15, ry: 7, rot: -50 },
          { cx: 105, cy: 112, rx: 18, ry: 8, rot: -25 },
          { cx: 95, cy: 98,  rx: 16, ry: 7, rot: -40 },
          { cx: 132, cy: 85, rx: 17, ry: 8, rot: -20 },
          { cx: 122, cy: 72, rx: 15, ry: 7, rot: -35 },
          { cx: 158, cy: 60, rx: 17, ry: 8, rot: -15 },
          { cx: 148, cy: 48, rx: 14, ry: 6, rot: -30 },
          { cx: 185, cy: 38, rx: 16, ry: 7, rot: -10 },
          { cx: 215, cy: 25, rx: 15, ry: 6, rot: -5  },
        ].map((leaf, i) => (
          <ellipse
            key={i}
            cx={leaf.cx} cy={leaf.cy}
            rx={leaf.rx} ry={leaf.ry}
            fill="rgba(30,70,40,0.5)"
            stroke="rgba(158,125,76,0.7)"
            strokeWidth="0.8"
            transform={`rotate(${leaf.rot}, ${leaf.cx}, ${leaf.cy})`}
            style={{
              animation: `leafSway ${3.5 + i * 0.2}s ease-in-out ${i * 0.3}s infinite`,
              transformOrigin: `${leaf.cx}px ${leaf.cy}px`,
              opacity: 0,
              animationFillMode: 'forwards',
              animationDelay: `${1 + i * 0.15}s`,
            }}
          />
        ))}

        {/* Yapraklar — sağ taraf (dal üstü) */}
        {[
          { cx: 72,  cy: 155, rx: 16, ry: 8, rot: 35 },
          { cx: 58,  cy: 138, rx: 14, ry: 7, rot: 50 },
          { cx: 98,  cy: 128, rx: 17, ry: 8, rot: 30 },
          { cx: 88,  cy: 115, rx: 15, ry: 7, rot: 45 },
          { cx: 125, cy: 100, rx: 16, ry: 8, rot: 25 },
          { cx: 115, cy: 88,  rx: 14, ry: 6, rot: 38 },
          { cx: 150, cy: 75,  rx: 16, ry: 7, rot: 20 },
          { cx: 140, cy: 63,  rx: 13, ry: 6, rot: 32 },
          { cx: 175, cy: 52,  rx: 15, ry: 7, rot: 15 },
          { cx: 200, cy: 38,  rx: 14, ry: 6, rot: 10 },
          { cx: 228, cy: 26,  rx: 13, ry: 5, rot: 5  },
        ].map((leaf, i) => (
          <ellipse
            key={`r${i}`}
            cx={leaf.cx} cy={leaf.cy}
            rx={leaf.rx} ry={leaf.ry}
            fill="rgba(30,70,40,0.45)"
            stroke="rgba(158,125,76,0.65)"
            strokeWidth="0.8"
            transform={`rotate(${leaf.rot}, ${leaf.cx}, ${leaf.cy})`}
            style={{
              opacity: 0,
              animation: `leafSway ${3.8 + i * 0.25}s ease-in-out ${i * 0.35}s infinite`,
              transformOrigin: `${leaf.cx}px ${leaf.cy}px`,
              animationFillMode: 'forwards',
              animationDelay: `${1.5 + i * 0.18}s`,
            }}
          />
        ))}

        {/* Küçük tomurcuklar */}
        {[[85,148],[118,118],[152,88],[188,62],[220,38]].map(([x,y],i) => (
          <circle key={`b${i}`} cx={x} cy={y} r="2.5"
            fill="rgba(201,169,110,0.6)"
            style={{ opacity: 0, animation: `leafSway 4s ease-in-out ${2+i*0.3}s infinite`, animationFillMode: 'forwards', animationDelay: `${2+i*0.3}s` }}
          />
        ))}
      </svg>
    </div>
  )
}

export function FloatingLeaves({ count = 8, color = 'gold' }: { count?: number; color?: 'gold' | 'green' }) {
  const c = color === 'gold' ? 'rgba(201,169,110,' : 'rgba(30,100,50,'
  const leaves = Array.from({ length: count }, (_, i) => ({
    left:  10 + Math.random() * 80,
    delay: i * 1.8,
    dur:   12 + i * 2,
    size:  6 + i % 4 * 3,
    rot:   i * 37,
  }))

  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:1 }}>
      <style>{`
        @keyframes leafFall {
          0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 0; }
          10%  { opacity: 0.6; }
          85%  { opacity: 0.4; }
          100% { transform: translate(var(--lx),120px) rotate(var(--lr)) scale(0.7); opacity: 0; }
        }
      `}</style>
      {leaves.map((l, i) => (
        <svg key={i} viewBox="0 0 20 30" width={l.size} height={l.size * 1.5}
          style={{
            position:'absolute', left:`${l.left}%`, top:'-20px',
            '--lx': `${(i % 2 === 0 ? 1 : -1) * (20 + i * 5)}px`,
            '--lr': `${l.rot + 180}deg`,
            animation: `leafFall ${l.dur}s ease-in ${l.delay}s infinite`,
          } as React.CSSProperties}
        >
          <path d="M10,0 C20,8 22,20 10,30 C-2,20 0,8 10,0 Z"
            fill={`${c}0.5)`} stroke={`${c}0.7)`} strokeWidth="0.8" />
        </svg>
      ))}
    </div>
  )
}

export function OrnamentalDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', padding:'8px 0', opacity:.5 }}>
      <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg,transparent,var(--gold-d))' }} />
      <svg viewBox="0 0 40 20" width="40" height="20" style={{ flexShrink:0 }}>
        <path d="M5,10 C10,3 20,3 20,10 C20,17 30,17 35,10"
          fill="none" stroke="var(--gold-d)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="20" cy="10" r="2" fill="var(--gold-d)" />
      </svg>
      <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg,var(--gold-d),transparent)' }} />
    </div>
  )
}
