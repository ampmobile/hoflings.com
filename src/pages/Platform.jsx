import React from 'react';
import { Kicker, Btn, SecHead, Src, Reveal, In, Panel, Points, Icon } from '../components/Bits.jsx';
import { MODULES, SOURCES, AUTOMATION } from '../data/content.js';

export default function Platform() {
  return (
    <>
      <section className="phero">
        <div className="wrap phero__in">
          <nav className="crumbs">
            <a href="/">Home</a>
            <span>/</span>
            <span>Platform</span>
          </nav>
          <Kicker>Platform — {AUTOMATION.label}</Kicker>
          <h1>
            One record for every hire, credential and deadline.
          </h1>
          <p>
            Not three tools stitched together. One record per person — the same driver record that carries a résumé, an
            I-9 result, a medical certificate expiry and a safety score, from screening to year three. Every module writes
            to it automatically, so the record stays current without anyone chasing a document.
          </p>
        </div>
      </section>

      <section className="sec sec--top">
        <div className="wrap">
          <SecHead
            kicker="Architecture"
            title="Six modules, <span class='accent'>one person record.</span>"
            lede="Every module writes to the same record. That is why an expiry noticed by the compliance calendar can trigger a retention conversation before it becomes a roadside violation."
          />
          <Reveal className="bento" stagger={0.08}>
            {MODULES.map((m) => (
              <div className={`bento__c bento__c--${m.span.replace('b', '')}`} key={m.t} data-rv>
                <span className="bento__k">{m.k}</span>
                <div className="bento__ic">
                  <Icon name={m.ic} />
                </div>
                <h3>{m.t}</h3>
                <p>{m.p}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============ DATA FLOW ============ */}
      <section className="sec" style={{ background: 'var(--hull)' }}>
        <div className="wrap">
          <div className="split split--right">
            <div>
              <SecHead
                kicker="Data flow"
                title="From application to audit, without re-typing anything."
                lede="A single driver record accumulates evidence as it moves through the pipeline, and every module writes back to it."
              />
              <p className="tiny faint">
                Nothing is re-keyed, so nothing drifts out of sync. The record is the same object your safety team, your
                payroll provider and your auditor read.
              </p>
            </div>
            <In>
              <Panel tick>
                <span className="panel__idx">Driver record · DL-48219 · R. Alvarez</span>
                <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                  {[
                    ['Talent Console', 'role profile match, voice screen transcript, score 94', 'var(--signal)'],
                    ['Onboarding Engine', 'I-9 Section 2 closed, E-Verify case finalised', 'var(--live)'],
                    ['Credential Ledger', 'CDL Class A, medical certificate, tanker endorsement on file', 'var(--live)'],
                    ['Compliance Calendar', 'medical certificate renewal reminder scheduled 94 days out', 'var(--live)'],
                    ['HR Desk', '90-day check-in scheduled, training records attached', 'var(--signal)'],
                    ['Analytics', 'source tagged, cost-to-hire and retention attributed', 'var(--signal)'],
                  ].map(([k, v, c]) => (
                    <div className="chk" key={k}>
                      <span className="chk__t" style={c === 'var(--signal)' ? { background: 'var(--signal-dim)', borderColor: 'rgba(255,180,31,.32)' } : undefined}>
                        <Icon name="check" style={c === 'var(--signal)' ? { stroke: 'var(--signal)' } : undefined} />
                      </span>
                      <span>
                        <b>{k}</b> — {v}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </In>
          </div>
        </div>
      </section>

      {/* ============ EXPLAINABLE AI ============ */}
      <section className="sec">
        <div className="wrap">
          <div className="split">
            <div>
              <SecHead
                kicker="AI you can defend"
                title="Every score <span class='accent'>shows its work.</span>"
                lede="Employers in this industry get audited, sued and reviewed by insurance carriers. A hiring decision you cannot explain is a liability, so the explanation is built into the product rather than offered on request."
              />
              <ul className="panel__list" style={{ marginTop: 6 }}>
                <li><span>Traceable scoring — each factor sits next to the answer that produced it</span></li>
                <li><span>Consistent, role-relevant criteria applied to every candidate</span></li>
                <li><span>Human decisions, always — adverse findings route to a person first</span></li>
                <li><span>Data handled deliberately: role-based access, retention controls, export and deletion on request</span></li>
              </ul>
              <div style={{ marginTop: 26 }}>
                <Btn href="/contact.html" variant="line">
                  Ask about explainability
                  <Icon name="arrow" />
                </Btn>
              </div>
            </div>
            <In>
              <Panel tick>
                <span className="panel__idx">Score breakdown · OTR Driver Class A</span>
                <h3 style={{ marginTop: 12 }}>Every weight maps to a documented requirement</h3>
                <div style={{ marginTop: 22, display: 'grid', gap: 16 }}>
                  {[
                    ['Credential match — CDL + medical', '40 / 40', '100%', 'var(--signal)'],
                    ['Route & domicile fit', '18 / 20', '90%', 'var(--signal)'],
                    ['Relevant experience & equipment', '16 / 20', '80%', '#6E8CF5'],
                    ['Communication & hours-of-service', '14 / 15', '93%', '#8FB2FF'],
                    ['Record review — MVR / PSP', '6 / 5', '100%', '#FF6B4A'],
                  ].map(([k, v, w, c]) => (
                    <div key={k}>
                      <div className="hud__row">
                        <span className="k" style={{ fontSize: 13.5 }}>{k}</span>
                        <span className="v">{v}</span>
                      </div>
                      <div className="bar" style={{ marginTop: 6 }}>
                        <i style={{ width: w, background: c }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 24, padding: 15, borderRadius: 10,
                    background: 'var(--signal-dim)', border: '1px solid rgba(255,180,31,.24)',
                  }}
                >
                  <p className="tiny" style={{ margin: 0, color: 'var(--muted)' }}>
                    <b style={{ color: 'var(--text)' }}>Flagged for human review:</b> one minor violation on the MVR.
                    Referred to the hiring manager before any offer is extended.
                  </p>
                </div>
              </Panel>
            </In>
          </div>
        </div>
      </section>

      {/* ============ INTEGRATIONS ============ */}
      <section className="sec" style={{ background: 'var(--hull)' }}>
        <div className="wrap">
          <SecHead
            kicker="Integrations"
            title="Fits the stack you <span class='accent'>already run.</span>"
            lede="We do not ask a carrier to rip out its TMS, telematics or payroll system. Hoflings sits above them, keeping one people record current and pushing events back into the tools your teams already live in."
          />
          <Reveal className="grid g4" stagger={0.08}>
            {[
              ['TMS & dispatch', 'Hire and roster against live freight demand, terminals and lane assignments.', 'truck'],
              ['ELD & telematics', 'Pull hours-of-service, safety scores and event history into driver records.', 'layers'],
              ['ATS & HRIS', 'Requisitions in, hires out, payroll status back — without duplicate entry.', 'users'],
              ['Background checks', 'Drug and alcohol, MVR, credit and criminal results flowing into the ledger.', 'shield'],
            ].map(([t, p, ic]) => (
              <Panel key={t} tick data-rv>
                <div className="bento__ic">
                  <Icon name={ic} />
                </div>
                <h3 style={{ fontSize: 18 }}>{t}</h3>
                <p>{p}</p>
              </Panel>
            ))}
          </Reveal>
          <p className="tiny faint" style={{ textAlign: 'center', marginTop: 26 }}>
            Certified connectors for major TMS, telematics, applicant tracking, payroll and background-screening platforms,
            plus an open API for custom connectors.
          </p>
        </div>
      </section>

      {/* ============ SECURITY ============ */}
      <section className="sec">
        <div className="wrap">
          <div className="split">
            <div>
              <SecHead
                kicker="Security &amp; compliance"
                title="Built for records that <span class='accent'>regulators read.</span>"
                lede="Driver qualification files and I-9 records are among the most sensitive documents a carrier holds — and they are subject to audit, subpoena and insurance review."
              />
              <ul className="panel__list" style={{ marginTop: 6 }}>
                <li><span>Encryption in transit and at rest, role-based access control, full audit log</span></li>
                <li><span>Retention policies aligned to I-9, DQ file and provincial record rules</span></li>
                <li><span>Export and deletion workflows you control, including on offboarding</span></li>
                <li><span>Data residency options for US and Canadian operations</span></li>
                <li><span>Vendor security review documentation available under NDA</span></li>
              </ul>
            </div>
            <In>
              <Panel tick>
                <span className="panel__idx">At a glance</span>
                <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
                  {[
                    ['Encryption', 'AES-256 at rest, TLS 1.3 in transit'],
                    ['Access control', 'Role-based, least privilege'],
                    ['Audit log', 'Every record change retained'],
                    ['Languages', 'EN, ES, FR — voice and written'],
                    ['Accessibility', 'WCAG 2.2 AA target'],
                    ['Availability', '99.9% uptime target'],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}
                    >
                      <span className="tiny dim">{k}</span>
                      <span className="tiny" style={{ color: 'var(--text)', textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </In>
          </div>
        </div>
      </section>

      <section className="sec sec--tight">
        <div className="wrap">
          <div className="band">
            <h2>
              Walk through the platform with a <span className="accent">live requisition.</span>
            </h2>
            <p>Thirty minutes, your role, your questions — including the ones about how decisions actually get made.</p>
            <div className="band__act">
              <Btn href="/contact.html">
                Book a demo
                <Icon name="arrow" />
              </Btn>
              <Btn href="/services.html" variant="line">
                See the services
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
