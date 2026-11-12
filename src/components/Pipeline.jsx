import React, { useEffect, useRef, useState } from 'react';
import { REDUCED } from '../lib/motion.js';

const STEPS = [
  { id: 1, t: 'Application received', s: 'careers → requisition 4182', v: 'ON TIME' },
  { id: 2, t: 'Résumé parsed against role profile', s: 'CDL · endorsements · route fit', v: 'MATCH 94%' },
  { id: 3, t: 'Voice screen — answered in Spanish', s: 'auto-transcribed · translated', v: 'COMPLETE' },
  { id: 4, t: 'Credential & record verification', s: 'CDL · MEC · MVR · Clearinghouse', v: '4 / 4' },
  { id: 5, t: 'Shortlist score issued', s: 'evidence attached · human review flagged', v: '94 / 100' },
];

const QUESTION = '¿Tiene licencia CDL Clase A con su certificado médico vigente?';
const ANSWER =
  'Sí. Tengo Clase A con endorsements de tanker, mi médico expira en marzo y llevo seis años en ruta dedicated.';

/**
 * A looping, self-playing sequence of what one candidate looks like as it
 * moves through the Hoflings funnel. Honest about being a simulation.
 */
export default function Pipeline() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');
  const timers = useRef([]);

  useEffect(() => {
    if (REDUCED) {
      setStep(4);
      setTyped(ANSWER);
      return;
    }
    let alive = true;
    const wait = (ms, fn) => {
      const id = setTimeout(() => {
        if (alive) fn();
      }, ms);
      timers.current.push(id);
    };

    const run = () => {
      setStep(0);
      setTyped('');
      wait(900, () => setStep(1));
      wait(2000, () => setStep(2));
      // typing effect for the transcript
      wait(2600, () => {
        let i = 0;
        const tick = () => {
          if (!alive) return;
          setTyped(ANSWER.slice(0, i));
          i += 2;
          if (i <= ANSWER.length) timers.current.push(setTimeout(tick, 18));
        };
        tick();
      });
      wait(6200, () => setStep(3));
      wait(8000, () => setStep(4));
      wait(10600, () => {
        setStep(-1);
        timers.current.push(setTimeout(run, 700));
      });
    };

    run();
    return () => {
      alive = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const cls = (i) => (step > i ? 'is-done' : step === i ? 'is-live' : '');

  return (
    <div className="pipe" aria-label="Illustration of one candidate moving through the Hoflings hiring pipeline">
      {STEPS.map((st, i) => (
        <div className={`pipe__step ${cls(i)}`} key={st.id}>
          <span className="pipe__i">{st.id}</span>
          <span className="pipe__t">
            {st.t}
            <small>{st.s}</small>
          </span>
          <span className="pipe__v">{step >= i ? st.v : '—'}</span>
        </div>
      ))}

      <div className="transcript" style={{ marginTop: 6 }}>
        <div className="transcript__who">
          <span className="transcript__av">AI</span>
          <span className="mono">VOICE SCREEN · 01:12 · ES</span>
        </div>
        <div className="transcript__q">{QUESTION}</div>
        <div className="transcript__a">
          {typed}
          {step < 3 && <span className="caret" />}
        </div>
      </div>
    </div>
  );
}
