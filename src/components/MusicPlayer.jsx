import React, { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';
import ExternalLink from './ExternalLink';

let apiPromise;
function youtubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) apiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    const timer = setTimeout(() => reject(new Error('timeout')), 15000);
    window.onYouTubeIframeAPIReady = () => { clearTimeout(timer); resolve(window.YT); };
    script.onerror = () => { clearTimeout(timer); reject(new Error('network')); };
    document.head.append(script);
  }).catch(error => { apiPromise = null; throw error; });
  return apiPromise;
}
export default function MusicPlayer() {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('Elegí un video para cargar el reproductor.');
  const [attempt, setAttempt] = useState(0);
  const host = useRef(null);
  useEffect(() => {
    if (!selected) return;
    let cancelled = false, player;
    setStatus('Cargando YouTube…');
    const timer = setTimeout(() => { if (!cancelled) setStatus('YouTube no responde. Reintentá o abrí el video en YouTube.'); }, 20000);
    const mount = document.createElement('div');
    host.current.replaceChildren(mount);
    youtubeAPI().then(YT => {
      if (cancelled) return;
      player = new YT.Player(mount, {
        host: 'https://www.youtube-nocookie.com', videoId: selected.id,
        width: '100%', height: '100%',
        playerVars: { autoplay: 0, controls: 1, playsinline: 1, origin: window.location.origin },
        events: {
          onReady: event => {
            clearTimeout(timer);
            event.target.getIframe().title = `YouTube: ${selected.title}`;
            setStatus('Listo. Usá los controles de YouTube para reproducir.');
          },
          onStateChange: event => { if (event.data === 1) setStatus('Reproduciendo en YouTube.'); if (event.data === 2) setStatus('Reproducción en pausa.'); if (event.data === 0) setStatus('Video finalizado.'); },
          onError: () => { clearTimeout(timer); setStatus('No se pudo reproducir este video. Reintentá o abrilo en YouTube.'); },
        },
      });
    }).catch(() => { if (!cancelled) { clearTimeout(timer); setStatus('No se pudo conectar con YouTube. Reintentá o abrí el video en YouTube.'); } });
    return () => { cancelled = true; clearTimeout(timer); player?.destroy(); };
  }, [selected, attempt]);
  return <div className="retro-panel music-player">
    <div className="panel-title"><h2 id="music-title"><small className="panel-index">01 / </small>♫ Música</h2><span>Selección del canal oficial</span></div>
    <div className="player-deck"><span className="hardware-label" aria-hidden="true">PAUJBC · DIGITAL AUDIO SYSTEM</span><div className="player-display"><span className="small-label">PAUJBC PLAYER / 2.0</span><h3>{selected ? 'Ahora en el player' : 'Sonido propio.'}</h3>{selected ? <div className="youtube-stage" ref={host}/> : <p>Rap, hip hop y producción independiente.</p>}<p className="player-status" role="status">{status}</p></div>
    {selected && <div className="player-links"><button className="retro-button" onClick={() => setAttempt(v => v + 1)}>Recargar reproductor</button><ExternalLink href={`https://www.youtube.com/watch?v=${selected.id}`}>Abrir en YouTube</ExternalLink></div>}
    <div className="video-grid">{site.music.videos.map(video => <article className="video-card" key={video.id}><button className="track-select" aria-pressed={selected?.id === video.id} onClick={() => setSelected(video)}><img src={video.thumbnail} onError={event => { event.currentTarget.style.visibility = "hidden"; }} alt="" width="120" height="68" loading="lazy"/><span className="video-card__info"><span className="small-label">{video.type}</span><strong>{video.title}</strong><span>{video.note}</span></span><span aria-hidden="true">▷</span></button></article>)}</div></div>
    <ExternalLink href={site.music.link.href}>Visitar el canal oficial</ExternalLink><p className="game-help">Sin reproducción automática. Al cargar un video te conectás con YouTube.</p>
  </div>;
}
