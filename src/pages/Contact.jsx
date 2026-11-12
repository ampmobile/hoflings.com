import React from 'react';
import { Kicker, Btn, SecHead, Reveal, In, Panel, Icon } from '../components/Bits.jsx';
import { ContactForm, Faq } from '../components/Parts.jsx';
import { FAQ, SOURCE_LIST, SOURCES, BRAND, AUTOMATION } from '../data/content.js';

const CONTACT_FAQ = [
  {
    q: 'If recruiting and onboarding run automatically, who do we actually talk to?',
    a: [
      'One named person, and the same one throughout. You get a Hoflings advisor who knows your fleet, your states and your role profiles. The automation does the screening, the calling, the document work and the deadline tracking; the advisor handles the exceptions, the judgement calls and anything an auditor asks about.',
    ],
  },
  {
    q: 'Is the demonstration really free?',
    a: [
      'Yes. The first demonstration runs on one of your live requisitions and costs nothing. If it does not produce something better than your current baseline, we will say so and point you somewhere better.',
    ],
  },
  {
    q: 'We only operate in the US. Does that still work?',
    a: [
      'Completely. The Canadian capability is there when you need it, and it costs you nothing if you never use it. Most US-only clients use only the US credential rules.',
    ],
  },
  {
    q: 'Will you work with our existing staffing agency?',
    a: [
      'Yes. A number of clients keep an agency for overflow and use Hoflings for hard-to-fill roles, peak volume, and everything compliance-sensitive after the hire. The two can coexist as long as everyone agrees who owns the file.',
    ],
  },
  {
    q: 'How long until we are live?',
    a: [
      'A week. We do not run multi-month implementations. Credential records are loaded, the compliance calendar is built for your fleet, the role profiles are written with your hiring manager, and hiring starts.',
    ],
  },
  {
    q: 'We are not ready to talk to a salesperson.',
    a: [
      'That is fine — send the details of a role and we will reply with what we would do about it in writing. If it is not a fit, we will say so and suggest a better option, including occasionally one that is not us.',
    ],
  },
];

export default function Contact() {
  return (
    <>
      <section className="phero">
        <div className="wrap phero__in">
          <nav className="crumbs">
            <a href="/">Home</a>
            <span>/</span>
            <span>Contact</span>
          </nav>
          <Kicker>Contact — {AUTOMATION.label}</Kicker>
          <h1>
            Bring a <span className="accent">live requisition.</span>
          </h1>
          <p>
            Tell us about a role you are struggling to fill. We will run it through our fully automated recruiting and
            onboarding engine and show you the shortlist, the screening transcript and the onboarding packet — before anyone
            talks about a contract.
          </p>
        </div>
      </section>

      <section className="sec sec--top" id="demo">
        <div className="wrap">
          <div className="formwrap">
            <div>
              <SecHead kicker="What happens next" title="Three concrete steps. <span class='accent'>You can stop after the first.</span>" />

              <div style={{ display: 'grid', gap: 22 }}>
                {[
                  ['1', 'A 30-minute scoping call', 'Your roles, your fleet, your locations, your hardest hire. We tell you within the call whether we are the right fit — including when we are not.'],
                  ['2', 'A live demonstration on your role', 'We build the role profile, source against it, screen candidates and show your hiring manager the shortlist with the reasoning attached. Usually within 48 hours.'],
                  ['3', 'A written scope and proposal', 'Roles covered, volumes, timelines, who owns which compliance task, and pricing. No pilot deck, no discovery phase billed as consulting.'],
                ].map(([n, t, d]) => (
                  <div style={{ display: 'grid', gridTemplateColumns: '38px 1fr', gap: 16 }} key={n}>
                    <span
                      style={{
                        width: 38, height: 38, borderRadius: 10, display: 'grid', placeItems: 'center',
                        border: '1px solid rgba(255,180,31,.3)', background: 'var(--signal-dim)',
                        fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--signal)',
                      }}
                    >
                      {n}
                    </span>
                    <div>
                      <h4 style={{ fontSize: 17, marginBottom: 5, fontFamily: 'var(--display)' }}>{t}</h4>
                      <p className="tiny dim" style={{ margin: 0 }}>{d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact">
                <div className="contact__i">
                  <span className="contact__ic"><Icon name="mail" /></span>
                  <div>
                    <h5>Email</h5>
                    <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
                  </div>
                </div>
                <div className="contact__i">
                  <span className="contact__ic"><Icon name="globe" /></span>
                  <div>
                    <h5>Coverage</h5>
                    <p>Carriers and 3PLs across the United States and Canada</p>
                  </div>
                </div>
                <div className="contact__i">
                  <span className="contact__ic"><Icon name="truck" /></span>
                  <div>
                    <h5>Response time</h5>
                    <p>One business day, from a person who knows the sector</p>
                  </div>
                </div>
                <div className="contact__i">
                  <span className="contact__ic"><Icon name="file" /></span>
                  <div>
                    <h5>Registered entity</h5>
                    <p>
                      {BRAND.legalName}
                      <br />
                      {BRAND.address.line1}, {BRAND.address.line2}
                      <br />
                      {BRAND.address.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <In>
              <ContactForm />
            </In>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--hull)' }}>
        <div className="wrap">
          <SecHead kicker="Common questions" title="Before you hit send" />
          <div style={{ maxWidth: 900 }}>
            <Faq items={CONTACT_FAQ} />
          </div>
        </div>
      </section>

      {/* ============ SOURCES ============ */}
      <section className="sec" id="sources">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <Kicker>Method and sources</Kicker>
              <h2 className="h2">
                Every number on this site, <span className="accent">traceable.</span>
              </h2>
            </div>
            <p className="lede">
              Hoflings does not publish invented benchmarks. Where we cite a figure, it comes from a named source with a
              link — industry reporting, a regulator, or a programme’s own published requirements. Our own service metrics
              are reported per account, with the methodology, not claimed generically.
            </p>
          </div>

          <Reveal className="grid g2" stagger={0.05}>
            {SOURCE_LIST.map((s) => (
              <Panel key={s.k} tick data-rv>
                <a
                  href={SOURCES[s.k].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block' }}
                >
                  <span className="panel__idx">{s.n}</span>
                  <h3 style={{ fontSize: 16, marginBottom: 6 }}>{SOURCES[s.k].label}</h3>
                </a>
                <p className="tiny">{s.n}</p>
              </Panel>
            ))}
          </Reveal>

          <Panel tick className="panel--flat" >
            <div style={{ marginTop: 4 }}>
              <h3 style={{ fontSize: 17 }}>A note on our own figures</h3>
              <p style={{ marginTop: 8 }}>
                Where we describe what our platform does — screening in three languages, mobile onboarding, DQ file
                assembly, expiry tracking — that is a description of the product, not a performance claim. Client results
                are reported per account with the baseline and method, because a benchmark without a baseline is marketing,
                not evidence.
              </p>
            </div>
          </Panel>
        </div>
      </section>

      <section className="sec sec--tight">
        <div className="wrap">
          <div className="band">
            <h2>
              One role. <span className="accent">Forty-eight hours.</span>
            </h2>
            <p>
              We will source, screen and present a qualified shortlist for a live requisition in your operation within 48
              hours — no commitment, no pilot deck.
            </p>
            <div className="band__act">
              <Btn href="#demo">
                Start a conversation
                <Icon name="arrow" />
              </Btn>
              <Btn href="/services.html" variant="line">
                See our services
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
