"use client";

import React, { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

// Splits text on $...$ (inline) and $$...$$ (block) delimiters
function renderMath(text: string): string {
  // Replace $$...$$ first (block)
  text = text.replace(/\$\$([^$]+)\$\$/g, (_, latex) => {
    try {
      return katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return latex;
    }
  });
  // Replace $...$ (inline)
  text = text.replace(/\$([^$\n]+)\$/g, (_, latex) => {
    try {
      return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return latex;
    }
  });
  return text;
}

export function MathText({ children, className, style }: MathTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = renderMath(children);
    }
  }, [children]);

  return <span ref={ref} className={className} style={style} />;
}
