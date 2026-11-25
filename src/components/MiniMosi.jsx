import React, { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';

const commands = ['ayuda', 'proyectos', 'musica', 'contacto', 'mosi', 'limpiar'];
const welcome = 'Soy MOSI, la terminal de Pau. Escribí ayuda para explorar.';
const css = `
.mosi-access{display:flex;align-items:center;gap:16px;margin-top:24px;font:14px ui-monospace,monospace;color:#c6b8bb}
.mosi-access button{background:#090809;color:#ff5265;border:1px solid #75283a;border-radius:4px;padding:12px 18px;font:600 16px ui-monospace,monospace;cursor:pointer;white-space:nowrap}
.mosi-dialog{position:fixed;top:var(--mosi-top,50%);bottom:auto;transform:translateY(-50%);margin:0 auto;padding:0;border:1px solid #75283a;border-radius:8px;background:#080709;color:#eee5e7;width:min(640px,calc(100% - 24px));max-width:none;max-height:calc(100dvh - 24px);box-shadow:0 24px 100px #000c;font:16px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;overflow:hidden}
.mosi-dialog::backdrop{background:#000b;backdrop-filter:blur(4px)}
.mosi-window{display:flex;flex-direction:column;height:540px;max-height:calc(var(--mosi-height,100dvh) - 32px);min-height:0}
.mosi-title{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #51202e;flex-shrink:0}
.mosi-title strong{color:#ff5265;letter-spacing:.2em}.mosi-title span{font-size:13px;color:#b9a2a8;letter-spacing:0}
.mosi-dialog button{font:inherit;cursor:pointer}.mosi-close{background:transparent;color:#e9d9dd;border:1px solid #633140;border-radius:4px;min-height:44px;min-width:44px}
.mosi-log{overflow:auto;overscroll-behavior:contain;flex:1;min-height:0;padding:16px;scrollbar-color:#75283a #080709;overflow-wrap:anywhere}
.mosi-log p{margin:0 0 12px}.mosi-entry{margin:18px 0}.mosi-command{color:#ff7182}.mosi-result{padding:6px 0}.mosi-result strong{display:block;color:#eee5e7}.mosi-dialog a{color:#ff8c9a;text-decoration:underline;text-underline-offset:3px}.mosi-links{display:flex;flex-wrap:wrap;gap:8px 16px}.mosi-dialog ul{padding-left:20px;margin:8px 0}
.mosi-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:10px 16px;border-top:1px solid #39202a;flex-shrink:0}.mosi-suggestions button{background:#190d12;color:#e6c3cc;border:1px solid #633140;border-radius:4px;padding:8px 10px;font-size:14px;min-height:44px}
.mosi-form{display:flex;align-items:center;gap:8px;padding:10px 16px 16px;flex-shrink:0}.mosi-form label{white-space:nowrap;color:#ff7182}.mosi-form input{min-width:0;width:100%;background:#080709;color:#fff;border:0;border-bottom:1px solid #633140;border-radius:0;padding:10px 4px;font:inherit}.mosi-form button{background:#75283a;color:#fff;border:0;border-radius:4px;padding:10px;min-height:44px}.mosi-dialog :focus-visible,.mosi-access button:focus-visible{outline:2px solid #ff8c9a;outline-offset:3px}
@media(max-width:480px){.mosi-access{align-items:flex-start;flex-direction:column;gap:8px}.mosi-dialog{margin:0 auto}.mosi-window{height:600px}.mosi-title{padding:8px 12px}.mosi-log{padding:12px}.mosi-form{gap:6px;padding:8px 12px 12px}.mosi-suggestions{padding:8px 12px}.mosi-title span{display:block}}
`;
function Links({links, onInternal}) {
  return <div className="mosi-links">{links.map(link => <a key={link.href} href={link.href} onClick={link.href.startsWith('#') ? onInternal : undefined} {...(link.href.startsWith('https:') ? {target:'_blank',rel:'noopener noreferrer'} : {})}>{link.label}{link.href.startsWith('https:') && <span className="sr-only"> (abre en una pestaña nueva)</span>}</a>)}</div>;
}
function Answer({command, onInternal}) {
  if(command === 'ayuda') return <p>ayuda · proyectos · musica · contacto · mosi · limpiar</p>;
  if(command === 'proyectos') return <>{site.projects.map(project => <div className="mosi-result" key={project.name}><strong>{project.name}</strong><Links links={project.links} /></div>)}<div className="mosi-result"><strong>{site.lab.title}</strong><Links links={[site.lab.link, {label:'Explorar prácticas',href:'#soc'}]} onInternal={onInternal}/></div></>;
  if(command === 'musica') return <><ul>{site.music.videos.map(video => <li key={video.id}>{video.title} · {video.note}</li>)}</ul><Links links={[{label:'Abrir reproductor',href:'#musica'},site.music.link]} onInternal={onInternal}/></>;
  if(command === 'contacto') return <Links links={[{label:site.email,href:`mailto:${site.email}`},...site.social]}/>;
  if(command === 'mosi') return <p>MOSI es el asistente de terminal de Pau en Kali Linux, pensado para acompañar sus proyectos y tareas. Esta Mini MOSI te permite explorar su trabajo público con comandos.</p>;
  return <p>Comando desconocido. Escribí ayuda.</p>;
}
export default function MiniMosi() {
  const dialog = useRef(null), trigger = useRef(null), input = useRef(null), log = useRef(null);
  const [entries,setEntries] = useState([]), [value,setValue] = useState(''), [open,setOpen] = useState(false);
  const close = () => { dialog.current.close(); };
  useEffect(() => {
    if(!open) return;
    const viewport = window.visualViewport;
    const resize = () => {const height = viewport?.height || window.innerHeight;dialog.current?.style.setProperty('--mosi-height',`${height}px`);dialog.current?.style.setProperty('--mosi-top',`${(viewport?.offsetTop || 0) + height / 2}px`);};
    resize(); viewport?.addEventListener('resize',resize);viewport?.addEventListener('scroll',resize);
    return () => {viewport?.removeEventListener('resize',resize);viewport?.removeEventListener('scroll',resize);};
  },[open]);
  useEffect(() => { if(log.current) log.current.scrollTop = log.current.scrollHeight; },[entries]);
  const run = raw => {
    const command = raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
    if(!command) return;
    if(command === 'limpiar') setEntries([]);
    else setEntries(previous => [...previous.slice(-49),{command, id: crypto.randomUUID()}]);
    setValue(''); input.current?.focus();
  };
  return <><style>{css}</style><div className="mosi-access"><button ref={trigger} type="button" aria-haspopup="dialog" aria-controls="mini-mosi" onClick={() => {dialog.current.showModal();setOpen(true);input.current.focus();}}>mosi ❯</button><span>Explorá mi trabajo desde la terminal.</span></div><dialog id="mini-mosi" ref={dialog} className="mosi-dialog" aria-labelledby="mosi-title" onClose={() => {setOpen(false);trigger.current?.focus();}}><div className="mosi-window"><header className="mosi-title"><strong id="mosi-title">MOSI <span>MINI / PAUJBC</span></strong><button className="mosi-close" aria-label="Cerrar Mini MOSI" onClick={close}>×</button></header><div ref={log} className="mosi-log" role="log" aria-label="Conversación con Mini MOSI" aria-live="polite" aria-relevant="additions"><p>{welcome}</p>{entries.map(entry => <div className="mosi-entry" key={entry.id}><div className="mosi-command">mosi ❯ {entry.command}</div><Answer command={entry.command} onInternal={close}/></div>)}</div><div className="mosi-suggestions" aria-label="Comandos sugeridos">{commands.map(command => <button key={command} type="button" onClick={() => run(command)}>{command}</button>)}</div><form className="mosi-form" onSubmit={event => {event.preventDefault();run(value);}}><label htmlFor="mosi-input">mosi ❯</label><input id="mosi-input" ref={input} value={value} onChange={event => setValue(event.target.value)} aria-label="Comando de MOSI" autoComplete="off" autoCapitalize="none" spellCheck={false} enterKeyHint="send" maxLength={120}/><button type="submit" aria-label="Ejecutar comando">Enter</button></form></div></dialog></>;
}
