import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, REDUCED } from '../lib/motion.js';
import { Headline, Btn } from './Bits.jsx';

/**
 * Hero — a 3D freight network behind the copy, with a live operations
 * readout on the right. The camera advances with scroll.
 */
export default function Hero() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const hudRef = useRef(null);

  useEffect(() => {
    if (REDUCED) return;
    let scene;
    let disposed = false;

    // Three.js is loaded after first paint — the hero must not wait on it.
    import('../lib/scene.js')
      .then(({ createFreightScene }) => {
        if (disposed || !canvasRef.current) return;
        try {
          scene = createFreightScene(canvasRef.current);
          sceneRef.current = scene;
        } catch (err) {
          console.warn('3D scene unavailable', err);
        }
      })
      .catch(() => {});

    const onPointer = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      scene?.setPointer(x, -y);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    // The scene reads the document theme when it is built, and re-paints
    // whenever the visitor switches modes.
    const onTheme = (e) => scene?.setTheme(e.detail.theme);
    document.addEventListener('hof:theme', onTheme);

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => scene?.setScroll(Math.min(self.progress * 1.6, 1)),
    });

    return () => {
      disposed = true;
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('hof:theme', onTheme);
      st.kill();
      scene?.dispose();
    };
  }, []);

  /* HUD bars animate in */
  useEffect(() => {
    if (!hudRef.current) return;
    const bars = hudRef.current.querySelectorAll('.bar i');
    if (REDUCED) {
      bars.forEach((b) => (b.style.transform = 'scaleX(1)'));
      return;
    }
    gsap.fromTo(
      bars,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.5 }
    );
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__in wrap">
        <div className="hero__grid-2">
          <div>
            <span className="kicker">
              Fully automated AI recruiting &amp; onboarding
            </span>

            <Headline
              lines={[
                'Hire the drivers',
                'your lanes <span class="accent">depend on.</span>',
              ]}
            />

            <p className="hero__sub">
              Hoflings is the AI talent and HR partner for trucking, shipping, freight and delivery operators in the US
              and Canada. Your requisition becomes a role profile, applicants are screened, candidates are called and
              transcribed, documents are validated and the qualification file assembles itself — fully automated, end to
              end, with every decision still yours.
            </p>

            <div className="hero__act">
              <Btn href="/contact.html">
                Book a 30-minute walkthrough
                <IconArrow />
              </Btn>
              <Btn href="/services.html" variant="line">
                See how hiring works
              </Btn>
            </div>

            <div className="hero__data">
              <div>
                <span className="num">+41%</span>
                <span className="lbl">driver cost per hire, year over year (Q3 2026)</span>
              </div>
              <div>
                <span className="num">44.2%</span>
                <span className="lbl">for-hire driver turnover, 2025</span>
              </div>
              <div>
                <span className="num">0.9</span>
                <span className="lbl">drivers available per truck, 2025</span>
              </div>
            </div>
            <p className="hero__src">
              Sources: Conversion Interactive &amp; PDA Q3 2026 · ATRI Operational Costs of Trucking 2026
            </p>
          </div>

          {/* live readout */}
          <div className="hud" ref={hudRef}>
            <div className="hud__bar">
              <span className="dot" />
              <span className="lbl">hoflings / talent-console</span>
              <span className="right">Live</span>
            </div>
            <div className="hud__body">
              <div className="hud__row">
                <span className="k">Requisition</span>
                <span className="v">OTR Driver — Class A</span>
              </div>
              <div className="hud__row">
                <span className="k">Lane</span>
                <span className="v">Dallas TX → Atlanta GA</span>
              </div>
              <div className="hud__sep" />
              {[
                { k: 'Applications', v: '412', w: '100%', cls: '' },
                { k: 'AI screened', v: '268', w: '65%', cls: '' },
                { k: 'Interviewed', v: '96', w: '23%', cls: 'bar--cool' },
                { k: 'Onboarded', v: '31', w: '8%', cls: 'bar--live' },
              ].map((r) => (
                <div key={r.k}>
                  <div className="hud__row">
                    <span className="k">{r.k}</span>
                    <span className="v">{r.v}</span>
                  </div>
                  <div className={`bar ${r.cls}`} style={{ marginTop: 5 }}>
                    <i style={{ width: r.w }} />
                  </div>
                </div>
              ))}
              <div className="hud__sep" />
              <div className="chk">
                <span className="chk__t"><IconTick /></span>
                <span>
                  <b>Clearinghouse</b> Part 40 / 382 enrolment confirmed
                </span>
              </div>
              <div className="chk">
                <span className="chk__t"><IconTick /></span>
                <span>
                  <b>Credential</b> CDL Class A + medical certificate validated
                </span>
              </div>
              <div className="chk">
                <span className="chk__t chk__t--wait"><IconTick /></span>
                <span>
                  <b>Compliance</b> DQ file assembling — step 3 of 4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const IconTick = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
