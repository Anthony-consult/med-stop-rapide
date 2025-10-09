import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: { opacity?: number; y?: number; x?: number };
  to?: { opacity?: number; y?: number; x?: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: string;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 0.8,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 30 },
  to = { opacity: 1, y: 0 },
  threshold = 0.2,
  rootMargin = '0px',
  textAlign = 'left',
  tag = 'h1',
  onLetterAnimationComplete
}: SplitTextProps) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const chars = container.querySelectorAll('.split-char');

    // Set initial state
    gsap.set(chars, from);

    // Create animation with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: `top ${(1 - threshold) * 100}%${rootMargin !== '0px' ? rootMargin : ''}`,
        once: true,
      },
      onComplete: () => {
        onLetterAnimationComplete?.();
      }
    });

    tl.to(chars, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [text, delay, duration, ease, from, to, threshold, rootMargin, onLetterAnimationComplete]);

  // Split text into characters manually
  const splitText = () => {
    if (splitType === 'chars') {
      return text.split('').map((char, index) => (
        <span
          key={index}
          className="split-char inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    } else if (splitType === 'words') {
      return text.split(' ').map((word, index) => (
        <span key={index} className="split-char inline-block mr-[0.25em]">
          {word}
        </span>
      ));
    }
    return text;
  };

  const style = {
    textAlign: textAlign as any,
  };

  const classes = `split-parent ${className}`;

  const content = splitText();

  switch (tag) {
    case 'h1':
      return (
        <h1 ref={containerRef as any} style={style} className={classes}>
          {content}
        </h1>
      );
    case 'h2':
      return (
        <h2 ref={containerRef as any} style={style} className={classes}>
          {content}
        </h2>
      );
    case 'h3':
      return (
        <h3 ref={containerRef as any} style={style} className={classes}>
          {content}
        </h3>
      );
    case 'h4':
      return (
        <h4 ref={containerRef as any} style={style} className={classes}>
          {content}
        </h4>
      );
    case 'h5':
      return (
        <h5 ref={containerRef as any} style={style} className={classes}>
          {content}
        </h5>
      );
    case 'h6':
      return (
        <h6 ref={containerRef as any} style={style} className={classes}>
          {content}
        </h6>
      );
    default:
      return (
        <p ref={containerRef as any} style={style} className={classes}>
          {content}
        </p>
      );
  }
};

export default SplitText;
