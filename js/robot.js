// ==================== 机器人 SVG：五阶形态 + 装备图层合成 ====================
import { partById } from './gacha-data.js?v=6';

const DEFS = `
<defs>
  <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#ffc93c"/><stop offset="1" stop-color="#ff9f43"/>
  </linearGradient>
  <linearGradient id="capeG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3a2a78"/><stop offset=".6" stop-color="#1b2360"/><stop offset="1" stop-color="#0d1230"/>
  </linearGradient>
  <radialGradient id="auroraG" cx=".5" cy=".45" r=".65">
    <stop offset="0" stop-color="#7df9ff" stop-opacity=".55"/>
    <stop offset=".5" stop-color="#9d6bff" stop-opacity=".35"/>
    <stop offset="1" stop-color="#ff5cd2" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="galaxyG" cx=".5" cy=".5" r=".55">
    <stop offset="0" stop-color="#fff7d6" stop-opacity=".95"/>
    <stop offset=".25" stop-color="#ffd166" stop-opacity=".55"/>
    <stop offset=".6" stop-color="#6a4df0" stop-opacity=".4"/>
    <stop offset="1" stop-color="#0b0e1a" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="metalG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#c3cdf0"/><stop offset=".5" stop-color="#8b95b8"/><stop offset="1" stop-color="#5d6792"/>
  </linearGradient>
  <linearGradient id="whiteG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#bcd0f5"/>
  </linearGradient>
  <linearGradient id="suitG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#3a4a86"/><stop offset="1" stop-color="#18204a"/>
  </linearGradient>
  <linearGradient id="holoG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#bff8ff"/><stop offset=".6" stop-color="#39e6ff"/><stop offset="1" stop-color="#9d6bff"/>
  </linearGradient>
</defs>`;

const BASES = [
  // ---------- Lv1 铁疙瘩 ----------
  `<ellipse cx="150" cy="234" rx="68" ry="13" fill="rgba(0,0,0,.4)"/>
   <path d="M100 152 Q94 110 132 98 Q150 88 172 98 Q206 106 206 148 Q214 192 184 216 Q150 236 114 212 Q86 188 100 152 Z"
     fill="#5d6792" stroke="#8993bd" stroke-width="3"/>
   <path d="M118 116 L134 128 M182 120 L168 132" stroke="#464e73" stroke-width="3" stroke-linecap="round"/>
   <circle cx="122" cy="196" r="4" fill="#3f4668"/><circle cx="178" cy="190" r="4" fill="#3f4668"/>
   <rect x="126" y="152" width="16" height="18" rx="8" fill="#202643"/>
   <rect x="158" y="152" width="16" height="18" rx="8" fill="#202643"/>
   <path d="M138 190 Q150 198 162 190" fill="none" stroke="#202643" stroke-width="3" stroke-linecap="round"/>`,
  // ---------- Lv2 带电小盒子 ----------
  `<ellipse cx="150" cy="234" rx="66" ry="12" fill="rgba(0,0,0,.4)"/>
   <line x1="150" y1="104" x2="150" y2="76" stroke="#9ff6ff" stroke-width="4" stroke-linecap="round"/>
   <circle cx="150" cy="70" r="7" fill="#ff5cd2"><animate attributeName="opacity" values="1;.3;1" dur="1.2s" repeatCount="indefinite"/></circle>
   <rect x="104" y="104" width="92" height="112" rx="22" fill="url(#metalG)" stroke="#9ff6ff" stroke-width="2.5"/>
   <rect x="118" y="122" width="64" height="50" rx="12" fill="#10173a"/>
   <circle cx="137" cy="144" r="7" fill="#39e6ff"/>
   <circle cx="163" cy="144" r="7" fill="#39e6ff"/>
   <circle cx="139" cy="142" r="2.4" fill="#d9feff"/><circle cx="165" cy="142" r="2.4" fill="#d9feff"/>
   <circle cx="132" cy="196" r="3" fill="#3f4668"/><circle cx="150" cy="196" r="3" fill="#3f4668"/><circle cx="168" cy="196" r="3" fill="#3f4668"/>
   <rect x="118" y="216" width="22" height="14" rx="6" fill="#56608a"/><rect x="160" y="216" width="22" height="14" rx="6" fill="#56608a"/>`,
  // ---------- Lv3 圆屏机器人 ----------
  `<ellipse cx="150" cy="246" rx="64" ry="11" fill="rgba(0,0,0,.4)"/>
   <line x1="150" y1="78" x2="150" y2="64" stroke="#9ff6ff" stroke-width="3.5" stroke-linecap="round"/>
   <circle cx="150" cy="59" r="6" fill="#39e6ff"><animate attributeName="r" values="6;8;6" dur="1.6s" repeatCount="indefinite"/></circle>
   <circle cx="91" cy="138" r="13" fill="url(#whiteG)" stroke="#9ff6ff" stroke-width="2.5"/>
   <circle cx="209" cy="138" r="13" fill="url(#whiteG)" stroke="#9ff6ff" stroke-width="2.5"/>
   <circle cx="150" cy="136" r="60" fill="url(#whiteG)" stroke="#39e6ff" stroke-width="3.5"/>
   <circle cx="150" cy="136" r="48" fill="#0f1636"/>
   <rect x="128" y="122" width="17" height="22" rx="8.5" fill="#39e6ff"/>
   <rect x="155" y="122" width="17" height="22" rx="8.5" fill="#39e6ff"/>
   <circle cx="133" cy="128" r="3" fill="#eafdff"/><circle cx="160" cy="128" r="3" fill="#eafdff"/>
   <circle cx="116" cy="152" r="5.5" fill="rgba(255,92,210,.5)"/><circle cx="184" cy="152" r="5.5" fill="rgba(255,92,210,.5)"/>
   <path d="M138 158 Q150 168 162 158" fill="none" stroke="#39e6ff" stroke-width="3" stroke-linecap="round"/>
   <circle cx="103" cy="206" r="11" fill="url(#whiteG)" stroke="#9ff6ff" stroke-width="2.5"/>
   <circle cx="197" cy="206" r="11" fill="url(#whiteG)" stroke="#9ff6ff" stroke-width="2.5"/>
   <rect x="118" y="192" width="64" height="46" rx="19" fill="url(#whiteG)" stroke="#9ff6ff" stroke-width="2.5"/>
   <circle cx="150" cy="215" r="8" fill="#39e6ff" opacity=".85"/>
   <ellipse cx="130" cy="244" rx="14" ry="8" fill="#8b95b8"/><ellipse cx="170" cy="244" rx="14" ry="8" fill="#8b95b8"/>`,
  // ---------- Lv4 喷气智能体 ----------
  `<ellipse cx="150" cy="248" rx="60" ry="10" fill="rgba(0,0,0,.4)"/>
   <path d="M132 240 q-14 16 2 30 q8 -16 -2 -30 Z" fill="#ff9f43">
     <animate attributeName="opacity" values=".9;.4;.9" dur=".5s" repeatCount="indefinite"/></path>
   <path d="M168 240 q14 16 -2 30 q-8 -16 2 -30 Z" fill="#39e6ff">
     <animate attributeName="opacity" values=".4;.9;.4" dur=".5" repeatCount="indefinite"/></path>
   <path d="M100 116 L86 106 L88 136 L104 142 Z" fill="#24305e" stroke="#39e6ff" stroke-width="2.5"/>
   <path d="M200 116 L214 106 L212 136 L196 142 Z" fill="#24305e" stroke="#39e6ff" stroke-width="2.5"/>
   <rect x="108" y="94" width="84" height="72" rx="26" fill="url(#suitG)" stroke="#39e6ff" stroke-width="3"/>
   <rect x="118" y="118" width="64" height="22" rx="11" fill="#081226" stroke="#39e6ff" stroke-width="2"/>
   <rect x="132" y="125" width="12" height="8" rx="4" fill="#39e6ff"/>
   <rect x="158" y="125" width="12" height="8" rx="4" fill="#39e6ff"/>
   <rect x="118" y="170" width="64" height="60" rx="20" fill="url(#suitG)" stroke="#39e6ff" stroke-width="3"/>
   <circle cx="150" cy="198" r="9" fill="#39e6ff"><animate attributeName="opacity" values="1;.5;1" dur="1.4s" repeatCount="indefinite"/></circle>
   <path d="M126 214 H174" stroke="#39e6ff" stroke-width="2.5" opacity=".6"/>
   <rect x="126" y="230" width="18" height="14" rx="5" fill="#24305e"/><rect x="156" y="230" width="18" height="14" rx="5" fill="#24305e"/>`,
  // ---------- Lv5 全息 AI 生命 ----------
  `<ellipse cx="150" cy="254" rx="78" ry="11" fill="none" stroke="#39e6ff" stroke-width="3" opacity=".8"/>
   <ellipse cx="150" cy="254" rx="52" ry="7" fill="rgba(57,230,255,.25)"/>
   <path d="M104 252 L196 252 L172 150 L128 150 Z" fill="rgba(57,230,255,.08)"/>
   <ellipse cx="150" cy="160" rx="92" ry="26" fill="none" stroke="#ffd166" stroke-width="2.5" stroke-dasharray="10 12" opacity=".7">
     <animateTransform attributeName="transform" type="rotate" values="0 150 160;360 150 160" dur="9s" repeatCount="indefinite"/></ellipse>
   <ellipse cx="150" cy="168" rx="72" ry="18" fill="none" stroke="#ff5cd2" stroke-width="2" stroke-dasharray="6 14" opacity=".6">
     <animateTransform attributeName="transform" type="rotate" values="360 150 168;0 150 168" dur="7s" repeatCount="indefinite"/></ellipse>
   <circle cx="150" cy="110" r="26" fill="rgba(191,248,255,.25)" stroke="url(#holoG)" stroke-width="3.5"/>
   <rect x="140" y="102" width="8" height="12" rx="4" fill="#eafdff"/>
   <rect x="153" y="102" width="8" height="12" rx="4" fill="#eafdff"/>
   <path d="M124 142 H176 L168 214 H132 Z" fill="rgba(57,230,255,.22)" stroke="#9ff6ff" stroke-width="3" stroke-linejoin="round"/>
   <line x1="130" y1="160" x2="170" y2="160" stroke="#eafdff" stroke-width="2" opacity=".7">
     <animate attributeName="opacity" values=".9;.2;.9" dur="1.6s" repeatCount="indefinite"/></line>
   <line x1="134" y1="176" x2="166" y2="176" stroke="#eafdff" stroke-width="2" opacity=".6">
     <animate attributeName="opacity" values=".3;.9;.3" dur="1.6s" begin=".4s" repeatCount="indefinite"/></line>
   <line x1="138" y1="192" x2="162" y2="192" stroke="#eafdff" stroke-width="2" opacity=".5">
     <animate attributeName="opacity" values=".9;.2;.9" dur="1.6s" begin=".8s" repeatCount="indefinite"/></line>
   <circle cx="104" cy="120" r="2.6" fill="#ffd166"><animate attributeName="opacity" values="1;.2;1" dur="1.8s" repeatCount="indefinite"/></circle>
   <circle cx="202" cy="150" r="2.4" fill="#ff5cd2"><animate attributeName="opacity" values=".2;1;.2" dur="1.5s" begin=".5s" repeatCount="indefinite"/></circle>
   <circle cx="112" cy="200" r="2.2" fill="#39e6ff"><animate attributeName="opacity" values="1;.3;1" dur="2s" begin=".9s" repeatCount="indefinite"/></circle>`
];

export function buildRobotSVG(stageIdx, equipped = {}) {
  const aura = equipped.aura ? partById[equipped.aura] : null;
  const cape = equipped.body === 'b_cape' ? partById['b_cape'] : null;
  const body = equipped.body && equipped.body !== 'b_cape' ? partById[equipped.body] : null;
  const head = equipped.head ? partById[equipped.head] : null;
  const acc = equipped.accessory ? partById[equipped.accessory] : null;

  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="机器人">
    ${DEFS}
    ${aura ? aura.svg : ''}
    ${cape ? cape.svg : ''}
    ${BASES[stageIdx] || BASES[0]}
    ${body ? body.svg : ''}
    ${head ? head.svg : ''}
    ${acc ? acc.svg : ''}
  </svg>`;
}
