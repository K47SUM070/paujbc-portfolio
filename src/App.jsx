import React, { useState, useEffect } from 'react';
import { site } from './data/site';
import SectionHeading from './components/SectionHeading';
import ExternalLink from './components/ExternalLink';
import MusicPlayer from './components/MusicPlayer';
import Snake from './components/Snake';

function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#inicio');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActive('#' + entry.target.id); }); }, { rootMargin: '-10% 0px -65% 0px' });
    document.querySelectorAll('section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#inicio" aria-label="PauJBC, volver al inicio"><span className="brand-logo">Pau<span>JBC</span><i aria-hidden="true">/</i></span></a>
        <button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>Menú {open ? "−" : "+"}</button><nav id="main-nav" className={open ? "is-open" : ""} onClick={() => setOpen(false)} aria-label="Navegación principal"><ul>{site.navigation.map(item => <li key={item.href}><a href={item.href} aria-current={active === item.href ? "location" : undefined}>{item.label}</a></li>)}</ul></nav>
        <a className="header-contact" href={`mailto:${site.email}`}>Hablemos <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero shell" id="inicio" aria-labelledby="hero-title">
      <div className="city-silhouette" aria-hidden="true"/><div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" /> DESARROLLO · MÚSICA · CIBERSEGURIDAD · CONTENIDO</p>
        <h1 id="hero-title">Pau<em>JBC</em><span>Música, creatividad y tecnología.</span></h1>
        <p className="hero-alias">Soy <strong>Juan Bautista Coria.</strong></p>
        <p className="hero-intro">{site.intro}</p>
        <p className="hero-summary">{site.summary}</p>
        <div className="hero-actions"><a className="button button-primary" href="#musica">▷ Escuchá mi música</a><a className="button button-text" href="#proyectos">Ver proyectos ↗</a><a className="button button-text" href="#trabajemos">Trabajemos juntos ↗</a></div>
      </div>
      <div className="hero-art"><div className="portrait-frame"><img src="/artist-profile.jpg" alt="PauJBC, retrato del artista" width="176" height="176" fetchPriority="high"/><span>PAU / ARCHIVO PERSONAL</span></div></div>
      <div className="hero-foot"><span>PERFIL MULTIDISCIPLINARIO</span><span>SCROLL PARA EXPLORAR ↓</span></div>
    </section>
  );
}

function About() {
  return <section className="section section-about" id="sobre-mi" aria-labelledby="about-title"><div className="shell"><SectionHeading index="04" eyebrow="SOBRE MÍ" title={<span id="about-title">Curiosidad aplicada.</span>}>{site.about}</SectionHeading><div className="area-grid">{site.areas.map(area => <article className="area" key={area.number}><span className="area-number">{area.number}</span><h3>{area.name}</h3><p>{area.detail}</p></article>)}</div></div></section>;
}

function Projects() {
  return <section className="section" id="proyectos" aria-labelledby="projects-title"><div className="shell projects-services"><div className="projects-pane"><SectionHeading index="03" eyebrow="PROYECTOS" title={<span id="projects-title">Proyectos destacados.</span>}>Desarrollo, colaboración y un laboratorio de aprendizaje.</SectionHeading><div className="project-grid">{site.projects.map((project, index) => <article className="project-card" key={project.name}><div className="project-card__top"><span>{project.category}</span><span>0{index + 1}</span></div><div className="project-card__visual"><img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" width="1000" height="562" /></div><div className="project-card__content"><h3>{project.name}</h3><p>{project.description}</p><div className="project-links">{project.links.map(link => <ExternalLink href={link.href} key={link.href}>{link.label}</ExternalLink>)}</div></div></article>)}<article className="project-card"><div className="project-card__top"><span>Aprendizaje en ciberseguridad</span><span>03</span></div><div className="soc-visual" aria-hidden="true"><span>&gt;_ SOC-L1</span><small>SSH / EVIDENCIAS / DOCUMENTACIÓN</small></div><div className="project-card__content"><h3>SOC-L1</h3><p>Laboratorio educativo con datos simulados. Análisis guiado de SSH y documentación de hallazgos.</p><div className="project-links"><ExternalLink href={site.lab.link.href}>Ver repositorio</ExternalLink><a href="#soc">Explorar prácticas ↓</a></div></div></article></div></div><Services/></div></section>;
}

function Services() {
  const icons = ['⌘', '◇', '♫', '▣'];
  return <aside className="services retro-panel" aria-labelledby="services-title"><div className="panel-title"><h2 id="services-title">♧ Servicios</h2></div>{site.areas.map((area, i) => <a className="service" href="#trabajemos" key={area.number}><span aria-hidden="true">{icons[i]}</span><div><h3>{area.name}</h3><p>{area.detail}</p></div></a>)}</aside>;
}
function SocialBar() {
 const icons = { YouTube: '▶', Instagram: '◎', SoundCloud: '☁', GitHub: '⌘', LinkedIn: 'in', Workana: 'W' };
 return <div className="shell connect-bar"><div className="connect-intro"><span aria-hidden="true">➤</span><div><strong>Conectemos</strong><p>Ideas, proyectos, música o colaboración.</p></div></div><div className="crt-monitor"><div className="terminal-title" aria-hidden="true"><span>PAUJBC://CONEXIONES</span><span>ENLACES ↗</span></div><div className="connect-links">{site.social.map(link => <ExternalLink key={link.href} href={link.href}><b className={'social-icon icon-' + link.label} aria-hidden="true">{icons[link.label]}</b>{link.label}</ExternalLink>)}</div><div className="terminal-foot" aria-hidden="true">SELECCIONÁ UN CANAL <span>▌</span></div></div><a className="button button-primary" href={`mailto:${site.email}`}>✉ Contactarme</a></div>;
}

function Lab() {
  return <section className="section section-lab" id="soc" aria-labelledby="soc-title"><div className="shell"><SectionHeading index="05" eyebrow="PRÁCTICAS SOC-L1" title={<span id="soc-title">Aprender investigando.</span>}>{site.lab.description}</SectionHeading><div className="lab-panel"><div className="lab-panel__intro"><div className="lab-icon" aria-hidden="true">&gt;_</div><div><span className="small-label">ENTORNO DE PRÁCTICA</span><h3>{site.lab.title}</h3></div></div><div className="case-list">{site.lab.cases.map(item => <article className="case" key={item.id}><span className="case-id">CASO {item.id}</span><div><h4>{item.title}</h4><p>{item.text}</p></div><span className={`case-state ${item.id === '001' ? 'case-state--done' : ''}`}>{item.state}</span></article>)}</div><div className="lab-panel__footer"><span>Casos simulados para aprendizaje.</span><ExternalLink href={site.lab.link.href}>{site.lab.link.label}</ExternalLink></div></div></div></section>;
}

function Music() {
 return <section className="section" id="musica" aria-labelledby="music-title"><div className="shell entertainment"><MusicPlayer/><Snake/></div></section>;
}

function SocialContact() {
  return <><section className="section section-social" id="trabajemos" aria-labelledby="social-title"><div className="shell"><SectionHeading index="06" eyebrow="TRABAJEMOS JUNTOS" title={<span id="social-title">Hagamos algo útil.</span>}>{site.hiring.intro}</SectionHeading><div className="hiring-actions"><a className="button button-primary" href={`mailto:${site.email}`}>Escribime por una propuesta <span aria-hidden="true">↗</span></a>{site.hiring.links.map(link => <ExternalLink className="hiring-link" href={link.href} key={link.href}>{link.label}</ExternalLink>)}</div><div className="social-heading"><span className="small-label">ENCONTRAME TAMBIÉN EN</span></div><div className="social-row">{site.social.map(link => <ExternalLink className="social-link" href={link.href} key={link.href}>{link.label}</ExternalLink>)}</div></div></section><section className="section section-contact" id="contacto" aria-labelledby="contact-title"><div className="shell contact-layout"><div><p className="eyebrow">07 / CONTACTO</p><h2 id="contact-title">¿Conversamos?</h2><p>Si querés hablar de una idea, un proyecto o una colaboración, escribime por correo.</p></div><a className="contact-email" href={`mailto:${site.email}`}>{site.email}<span aria-hidden="true">↗</span></a></div></section></>;
}

function Welcome() {
  const [visible, setVisible] = useState(() => {
    try { return !sessionStorage.getItem('paujbc-welcome') && !matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
  });
  useEffect(() => {
    try { sessionStorage.setItem('paujbc-welcome', '1'); } catch {}
    const timer = setTimeout(() => setVisible(false), 2300);
    return () => clearTimeout(timer);
  }, []);
  return visible ? <div className="welcome" aria-label="Bienvenida a PauJBC"><button className="welcome-skip retro-button" onClick={() => setVisible(false)}>Omitir bienvenida</button><svg aria-hidden="true" viewBox="0 0 200 200"><path d="M100 100c0-9 14-9 14 1 0 20-32 20-32-1 0-35 52-35 52 1 0 50-74 50-74-1 0-66 98-66 98 1 0 82-124 82-124-1"/></svg><span>PauJBC</span></div> : null;
}

export default function App() {
  useEffect(() => {
    const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const cleanups = [...document.querySelectorAll('.connect-bar, .section-social, .section-contact')].map(el => {
      let frame;
      const move = event => {
        if (!media.matches) return;
        const rect = el.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100));
        const y = Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100));
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => { el.style.setProperty('--light-x', `${x}%`); el.style.setProperty('--light-y', `${y}%`); });
      };
      const reset = () => { cancelAnimationFrame(frame); el.style.removeProperty('--light-x'); el.style.removeProperty('--light-y'); };
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', reset);
      media.addEventListener('change', reset);
      return () => { reset(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset); media.removeEventListener('change', reset); };
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } }), { threshold: .05 });
    document.querySelectorAll('.project-card, .service, .area, .lab-panel').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return <><Welcome/><a className="skip-link" href="#contenido">Ir al contenido</a><Header/><main id="contenido"><Hero/><Music/><Projects/><SocialBar/><About/><Lab/><SocialContact/></main><footer className="footer"><div className="shell footer-inner"><span>© {new Date().getFullYear()} {site.name} / {site.alias}</span><a href="#inicio">Volver arriba ↑</a></div></footer></>;
}
