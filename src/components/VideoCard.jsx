import React, { useState } from 'react';

export default function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const url = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`;

  if (video.pending) return <article className="video-card"><div className="pending-cover" aria-hidden="true">PAU<span>{video.title.split("— ")[1]}</span></div><div className="video-card__info"><span className="small-label">{video.type}</span><h3>{video.title}</h3><p>{video.note}</p></div></article>;

  return (
    <article className="video-card">
      <div className="video-card__media">
        {playing ? (
          <iframe
            src={url}
            title={`Reproducir ${video.title}`}
            allow="encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="video-card__play"
            onClick={() => setPlaying(true)}
            aria-label={`Cargar reproductor de ${video.title}`}
          >
            <img src={video.thumbnail} alt="" loading="lazy" decoding="async" width="480" height="360" />
            <span className="play-icon" aria-hidden="true">▶</span>
          </button>
        )}
      </div>
      <div className="video-card__info"><span className="small-label">{video.type}</span><h3>{video.title}</h3><p>{video.note}</p></div>
    </article>
  );
}
