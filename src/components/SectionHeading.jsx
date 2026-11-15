import React from 'react';

export default function SectionHeading({ index, eyebrow, title, children }) {
  return (
    <div className="section-heading">
      <div className="section-heading__index">{index} / {eyebrow}</div>
      <div className="section-heading__body">
        <h2>{title}</h2>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}
