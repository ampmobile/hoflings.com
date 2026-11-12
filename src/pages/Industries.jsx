import React from 'react';
import { Kicker, Btn, SecHead, Src, Reveal, In, Panel, Points, Icon } from '../components/Bits.jsx';
import { INDUSTRIES, NETWORKS, AUTOMATION } from '../data/content.js';

export default function Industries() {
  return (
    <>
      <section className="phero">
        <div className="wrap phero__in">
          <nav className="crumbs">
            <a href="/">Home</a>
            <span>/</span>
            <span>Industries</span>
          </nav>
          <Kicker>Industries — {AUTOMATION.label}</Kicker>
          <h1>
            Programs shaped by how your sector <span className="accent">actually hires.</span>
          </h1>
          <p>
            A refrigerated carrier, a parcel network and a truckload fleet do not have the same hiring problem, even though
            they all need drivers. Each segment gets its own role libraries, credential rules and onboarding flow — and each
            one runs fully automated, from the first application to the qualification file.
          </p>
        </div>
      </section>

      <section className="sec sec--top">
        <div className="wrap">
          <Reveal className="grid g2" stagger={0.07}>
            {INDUSTRIES.map((ind) => (
              <Panel key={ind.id} tick id={ind.id} data-rv>
                <span className="panel__idx">{ind.n}</span>
                <h3>{ind.t}</h3>
                <p>{ind.p}</p>
                <Points items={ind.pts} />
              </Panel>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============ PROGRAMME REQUIREMENTS ============ */}
      <section className="sec" style={{ background: 'var(--hull)' }}>
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <Kicker>Programme requirements</Kicker>
              <h2 className="h2">
                Contract delivery and freight programmes publish their bar.
                <br />
                <span className="accent">We screen against all of it.</span>
              </h2>
            </div>
            <p className="lede">
              If you operate an Amazon DSP, a FedEx ISP route or carry freight on your own authority, your applicant has to
              clear a published standard before you hire them. We encode those standards once and apply them in a single
              pass, so nobody is walked through three interviews before the first disqualifier surfaces.
            </p>
          </div>

          <Reveal className="panel" stagger={0.06}>
            <div style={{ overflowX: 'auto' }}>
              <table className="cmp">
                <thead>
                  <tr>
                    <th>Requirement</th>
                    {NETWORKS.map((n) => (
                      <th key={n.name}>{n.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {NETWORKS[0].rows.map((row, i) => (
                    <tr key={row[0]}>
                      <td>{row[0]}</td>
                      {NETWORKS.map((n) => (
                        <td key={n.name} dangerouslySetInnerHTML={{ __html: n.rows[i][1] }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 22 }}>
              <Src k="amazon-dsp" />
              <Src k="fedex-isp" />
              <Src k="amazon-relay" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CROSS BORDER ============ */}
      <section className="sec">
        <div className="wrap">
          <div className="split">
            <div>
              <SecHead
                kicker="Cross-border"
                title="Two regulatory systems. <span class='accent'>One programme.</span>"
                lede="Cross-border operations carry two regulatory systems, two tax regimes and two sets of credential rules. Most providers pick a side and hope for the best."
              />
              <ul className="panel__list" style={{ marginTop: 6 }}>
                <li><span>Provincial licensing equivalency mapped against US CDL classes and endorsements</span></li>
                <li><span>Single compliance calendar with jurisdiction attached to every deadline</span></li>
                <li><span>Bilingual screening and bilingual policy documentation</span></li>
                <li><span>USMCA-aware credential and work authorisation checks</span></li>
                <li><span>One named advisor who knows both sides of the border</span></li>
              </ul>
              <div style={{ marginTop: 28 }}>
                <Btn href="/contact.html" variant="line">
                  Talk about a cross-border fleet
                  <Icon name="arrow" />
                </Btn>
              </div>
            </div>
            <In>
              <Panel tick>
                <span className="panel__idx">United States</span>
                <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
                  {['DOT & FMCSA qualification standards', 'Form I-9 and E-Verify', '49 CFR Part 40 / 382 drug and alcohol', 'Clearinghouse and return to duty', 'Hours of service and ELD training', 'OSHA recordkeeping', 'State employment law and FLSA', 'Workers’ compensation'].map((t) => (
                    <div className="chk" key={t}>
                      <span className="chk__t"><Icon name="check" /></span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
                <span className="panel__idx" style={{ marginTop: 26, color: 'var(--live)' }}>Canada</span>
                <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
                  {['CRA and provincial registries', 'Provincial driver licensing', 'NSC Standard safety credentialing', 'Provincial occupational health and safety', 'Employment standards and overtime', 'WSIB / WCB coverage', 'Provincial paid leave and monitoring rules', 'Bilingual documentation'].map((t) => (
                    <div className="chk" key={t}>
                      <span className="chk__t" style={{ background: 'var(--live-dim)', borderColor: 'rgba(59,232,176,.3)' }}>
                        <Icon name="check" style={{ stroke: 'var(--live)' }} />
                      </span>
                      <span>{t}</span>
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
              Tell us what your operation <span className="accent">struggles to hire for.</span>
            </h2>
            <p>
              We will show you the role profile, the screening flow and the onboarding checklist we would use — for your
              segment, in your states and provinces.
            </p>
            <div className="band__act">
              <Btn href="/contact.html">
                Talk to us
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
