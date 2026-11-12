import React from 'react';
import { Kicker, Btn, SecHead, Src, Reveal, In, Panel, Points, Icon } from '../components/Bits.jsx';
import { SERVICES, PRICING, FAQ, COMPLIANCE_TIMELINE, AUTOMATION } from '../data/content.js';
import { Faq } from '../components/Parts.jsx';

export default function Services() {
  return (
    <>
      <section className="phero">
        <div className="wrap phero__in">
          <nav className="crumbs">
            <a href="/">Home</a>
            <span>/</span>
            <span>Services</span>
          </nav>
          <Kicker>{AUTOMATION.label}</Kicker>
          <h1>
            Fully automated AI recruiting and onboarding — <span className="accent">built for freight.</span>
          </h1>
          <p>
            Most HR software assumes an office job with a predictable interview cycle. Transportation work is none of those
            things. Each service here is engineered around how carriers actually hire, verify and keep drivers — and the
            recruiting and onboarding work runs itself, end to end.
          </p>
        </div>
      </section>

      {SERVICES.map((s, idx) => (
        <section className="sec" id={s.key} key={s.key} style={idx % 2 === 1 ? { background: 'var(--hull)' } : undefined}>
          <div className="wrap">
            <div className="split">
              <div>
                <Kicker>
                  {s.idx} — {s.title}
                </Kicker>
                <h2 className="h2">{s.lead}</h2>
                <p className="lede" style={{ marginBottom: 28 }}>
                  {s.body}
                </p>
                <Reveal>
                  <Panel tick>
                    <span className="panel__idx">What is included</span>
                    <Points items={s.points} />
                  </Panel>
                </Reveal>
              </div>

              <div style={{ display: 'grid', gap: 18 }}>
                {idx === 0 && (
                  <Panel idx="Recruiting · what lands in your inbox" tick>
                    <h3 style={{ fontSize: 18 }}>A shortlist, not a stack of résumés</h3>
                    <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
                      {[
                        ['Route fit', 'Dallas domicile, weekend resets', '92%'],
                        ['Credential', 'Class A + tanker endorsement', 'Match'],
                        ['Tenure', '6 years, 2 with current carrier', 'Good'],
                        ['Record review', 'One minor violation — human review', 'Flag'],
                      ].map(([k, v, s2]) => (
                        <div key={k}>
                          <div className="hud__row">
                            <span className="k">{k}</span>
                            <span className="v" style={{ color: s2 === 'Flag' ? 'var(--signal)' : 'var(--text)' }}>
                              {s2}
                            </span>
                          </div>
                          <div className="tiny faint" style={{ marginTop: 3 }}>
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="tiny faint" style={{ marginTop: 20 }}>
                      Screening flags a human decision. It never makes one.
                    </p>
                  </Panel>
                )}

                {idx === 1 && (
                  <Panel idx="Onboarding · the file that assembles itself" tick>
                    <h3 style={{ fontSize: 18 }}>Complete before the first dispatch</h3>
                    <div style={{ marginTop: 18, display: 'grid', gap: 11 }}>
                      {[
                        'Driver agreement signed and filed',
                        'Form I-9 Section 1 and 2 complete, E-Verify closed',
                        'CDL licence and medical certificate validated',
                        'Endorsements confirmed where the role requires them',
                        'Clearinghouse and Part 40 / 382 enrolment',
                        'MVR and PSP review, violations documented',
                        'Medical certificate filed to the qualification file',
                        'DQ file assembled under 49 CFR 391.51',
                        'ELD and hours-of-service training assigned',
                        'Benefits, payroll and direct deposit confirmed',
                      ].map((t) => (
                        <div className="chk" key={t}>
                          <span className="chk__t">
                            <Icon name="check" />
                          </span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}

                {idx === 2 && (
                  <Panel idx="HR · both sides of the border" tick>
                    <h3 style={{ fontSize: 18 }}>One advisor, two jurisdictions</h3>
                    <div className="grid g2" style={{ marginTop: 18, gap: 14 }}>
                      <div>
                        <div className="mono" style={{ color: 'var(--signal)', marginBottom: 12 }}>United States</div>
                        {['DOT & FMCSA', 'Form I-9 & E-Verify', '49 CFR Part 40 / 382', 'Clearinghouse', 'OSHA recordkeeping', 'State employment law', 'Workers’ compensation', 'FLSA meal & rest rules'].map((t) => (
                          <div className="tiny dim" key={t} style={{ marginBottom: 7 }}>— {t}</div>
                        ))}
                      </div>
                      <div>
                        <div className="mono" style={{ color: 'var(--live)', marginBottom: 12 }}>Canada</div>
                        {['CRA & provincial registries', 'Provincial licensing', 'NSC Standard', 'Provincial OHS', 'Employment standards', 'WSIB / WCB coverage', 'Paid leave rules', 'Monitoring rules'].map((t) => (
                          <div className="tiny dim" key={t} style={{ marginBottom: 7 }}>— {t}</div>
                        ))}
                      </div>
                    </div>
                    <p className="tiny faint" style={{ marginTop: 18 }}>
                      Where a rule needs legal advice, we document the issue and refer it to your counsel with the facts
                      already assembled.
                    </p>
                  </Panel>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ============ PRICING ============ */}
      <section className="sec" id="pricing">
        <div className="wrap">
          <SecHead
            kicker="Engagement models"
            title="Priced against <span class='accent'>trucks and findings,</span> not software seats."
            lede="Three ways to work with us. Every one includes the credential ledger and the compliance calendar — that is not a premium feature."
            center
          />
          <Reveal className="grid g3" stagger={0.1}>
            {PRICING.map((p) => (
              <Panel key={p.name} tick>
                {p.featured && (
                  <span
                    className="mono"
                    style={{
                      position: 'absolute', top: 16, right: 16, color: 'var(--signal)',
                      border: '1px solid rgba(255,180,31,.3)', borderRadius: 5, padding: '4px 8px',
                    }}
                  >
                    Most common
                  </span>
                )}
                <h3 style={{ fontSize: 19 }}>{p.name}</h3>
                <p style={{ marginBottom: 18 }}>{p.for}</p>
                <div style={{ fontFamily: 'var(--display)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>
                  {p.price}{' '}
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--faint)' }}>
                    {p.unit}
                  </span>
                </div>
                <Points items={p.points} />
                <div style={{ marginTop: 26 }}>
                  <Btn href="/contact.html" variant={p.featured ? 'fill' : 'line'} size="sm" magnetic={false}>
                    Get a quote
                  </Btn>
                </div>
              </Panel>
            ))}
          </Reveal>
          <p className="tiny faint" style={{ textAlign: 'center', marginTop: 26 }}>
            Engagements are scoped against fleet size, locations and role mix. Peak-season surge capacity is quoted
            separately. Replacement cost benchmarks run $8,234 to $20,729 per driver departure.
          </p>
        </div>
      </section>

      {/* ============ 2026 COMPLIANCE ============ */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="split split--narrow">
            <div>
              <Kicker>Rule changes we track</Kicker>
              <h2 className="h2">The compliance calendar is a product, not a spreadsheet.</h2>
              <p className="lede">
                Every deadline in your operation — medical certificates, endorsements, training cycles, I-9 retention and
                audit dates — is dated, owned and escalated. These are the 2026 changes it absorbs for you.
              </p>
              <div style={{ marginTop: 24 }}>
                <Btn href="/contact.html" variant="line">
                  Ask about your jurisdiction
                  <Icon name="arrow" />
                </Btn>
              </div>
            </div>
            <Reveal className="tl">
              {COMPLIANCE_TIMELINE.map((t) => (
                <div className={`tl__item${t.state === 'done' ? ' tl__item--done' : ''}`} key={t.date} data-rv>
                  <div className="tl__d">{t.date}</div>
                  <div className="tl__t">{t.title}</div>
                  <p className="tl__x">{t.body}</p>
                  {t.src && (
                    <div style={{ marginTop: 10 }}>
                      <Src k={t.src} />
                    </div>
                  )}
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SecHead kicker="Questions" title="Before you ask" />
          <div style={{ maxWidth: 900 }}>
            <Faq items={FAQ.slice(0, 5)} />
          </div>
        </div>
      </section>

      <section className="sec sec--tight">
        <div className="wrap">
          <div className="band">
            <h2>
              See it work on a role you <span className="accent">actually need filled.</span>
            </h2>
            <p>
              Bring a live requisition. We will show you the shortlist, the screening transcript and the onboarding packet
              before we talk about a contract.
            </p>
            <div className="band__act">
              <Btn href="/contact.html">
                Book a demo
                <Icon name="arrow" />
              </Btn>
              <Btn href="/platform.html" variant="line">
                Explore the platform
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
