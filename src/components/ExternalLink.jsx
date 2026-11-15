import React from 'react';

export default function ExternalLink({ href, children, className = '' }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span><span className="sr-only"> (abre en una pestaña nueva)</span></a>;
}
