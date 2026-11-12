import React from 'react';
import Hero from '../components/Hero.jsx';
import Pipeline from '../components/Pipeline.jsx';
import { Tabs, Faq } from '../components/Parts.jsx';
import {
  Kicker, Btn, SecHead, Src, Fig, Tape, Panel, Points, Reveal, In, Icon,
} from '../components/Bits.jsx';
import {
  MARKET_FIGS, SECONDARY_FIGS, TAPE, LEAVE_REASONS, AGENTIC_RESULT,
  COMPLIANCE_TIMELINE, NETWORKS, SERVICES, ROLES, FAQ, MODULES, SOURCE_LIST, SOURCES,
  BRAND, HRBRIDGE, AUTOMATION,
} from '../data/content.js';

const Bullet = ({ children }) => (
  <ul className="panel__list">
    {children.map((c, i) => (
      <li key={i}>
        <span dangerouslySetInnerHTML={{ __html: c }} />
      </li>
    ))}
  </ul>
);

export default function Home() {
  return (
    <>
      <Hero />
      <Tape items={TAPE} />

      {/* ============ THE AUTOMATION ============ */}
      <section className="sec" id="automation">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <Kicker>{AUTOMATION.label}</Kicker>
              <h2 className="h2">
                Fully automated AI recruiting
                <br />
                <span className="accent">and onboarding.</span>
              </h2>
            </div>
            <p className="lede">{AUTOMATION.statement}</p>
          </div>

          <Reveal className="auto" stagger={0.1}>
            {AUTOMATION.points.map((p) => (
              <div className="auto__c" key={p.k} data-rv>
                <span className="auto__k">{p.k}</span>
                <p>{p.v}</p>
              </div>
            ))}
          </Reveal>

          <div className="band" style={{ marginTop: 26 }}>
            <h2>Automation runs the process. Your team runs the decision.</h2>
            <p>{AUTOMATION.scope}</p>
            <div className="band__act">
              <Btn href="/services.html">
                See how the automation works
                <Icon name="arrow" />
              </Btn>
              <Btn href="/contact.html" variant="line">
                Run a live requisition through it
              </Btn>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE MARKET ============ */}
      <section className="sec" id="market">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <Kicker>The 2026 market</Kicker>
              <h2 className="h2">
                The labour market broke.
                <br />
                <span className="accent">The hiring process did not move with it.</span>
              </h2>
            </div>
            <p className="lede">
              The for-hire driver pool shrank more than 5% in 2025 and another 1% in early 2026, against an ageing
              workforce and tightening enforcement. Cost per hire is up 41%. The scarcity is real — but so is the
              friction between a good candidate and a compliant hire.
            </p>
          </div>

          <Reveal className="figs" stagger={0.1}>
            {MARKET_FIGS.map((f) => (
              <Fig key={f.label} {...f} data-rv />
            ))}
          </Reveal>

          <div style={{ height: 20 }} />

          <Reveal className="figs" stagger={0.1}>
            {SECONDARY_FIGS.map((f) => (
              <Fig key={f.label} {...f} data-rv />
            ))}
          </Reveal>

          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 20 }}>
            <Src k="conversion-pda" />
            <Src k="atri" />
            <Src k="natacademies" />
            <Src k="nptc" />
            <Src k="bls" />
          </div>
        </div>
      </section>

      {/* ============ WHY THEY LEAVE ============ */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="split split--wide">
            <div>
              <SecHead
                kicker="Why drivers leave"
                title="Retention is a <span class='accent'>scheduling and equipment</span> problem — not a pay problem alone."
                lede="ATA reporting ranks the reasons drivers give for leaving a carrier. Equipment failure tops the list, ahead of pay. Every one of them is something a hiring and onboarding process can either cause or prevent."
              />
              <Reveal className="ranked">
                {LEAVE_REASONS.map((r) => (
                  <div className="ranked__row" data-rv key={r.n}>
                    <span className="ranked__n">{r.n}</span>
                    <span className="ranked__t">{r.t}</span>
                    <span className="ranked__d">{r.d}</span>
                    <span className="ranked__v">{r.v}</span>
                  </div>
                ))}
              </Reveal>
              <p className="tiny faint" style={{ marginTop: 18 }}>
                Ranking reported by ATA and reproduced in transport trade press, 2026.
              </p>
            </div>

            <div style={{ display: 'grid', gap: 18 }}>
              <Panel idx="ATRI, 2026" tick>
                <h3>Dwell time is a turnover multiplier</h3>
                <p>
                  Each additional 30 minutes of average dwell time per stop is associated with a 5.4 percentage point
                  increase in average driver turnover. That is a dispatch decision showing up later in your hiring budget.
                </p>
                <div style={{ marginTop: 20 }}>
                  <Src k="atri" />
                </div>
              </Panel>

              <Panel idx="Conversion &amp; PDA, Q3 2026" tick>
                <h3>
                  <span className="accent" style={{ fontFamily: 'var(--display)' }}>{AGENTIC_RESULT.value}{AGENTIC_RESULT.suffix}</span>{' '}
                  more hires
                </h3>
                <p>{AGENTIC_RESULT.extra}</p>
                <div style={{ marginTop: 20 }}>
                  <Src k="conversion-pda" />
                </div>
              </Panel>

              <Panel idx="ATRI, 2026" tick>
                <h3>Pay moves the number, but not one for one</h3>
                <p>
                  A $5,000 increase in annual driver pay was associated with a 2.9% decrease in average turnover. Real,
                  and nowhere near enough on its own — which is why the operational reasons above decide the rest.
                </p>
                <div style={{ marginTop: 20 }}>
                  <Src k="atri" />
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="sec" id="services">
        <div className="wrap">
          <SecHead
            kicker="What we do"
            title="Three services on <span class='accent'>one record.</span>"
            lede="Every candidate, credential and deadline lives in the same place, so a compliance calendar can raise a retention conversation before it becomes a roadside finding."
            center
          />
          <Reveal className="grid g3" stagger={0.1}>
            {SERVICES.map((s) => (
              <Panel key={s.key} idx={s.idx} tick data-rv>
                <h3>{s.title}</h3>
                <p style={{ color: 'var(--text)', marginBottom: 12 }}>{s.lead}</p>
                <p>{s.body}</p>
                <Bullet>{s.points}</Bullet>
                <div style={{ marginTop: 24 }}>
                  <Btn href={`/services.html#${s.key}`} variant="line" size="sm">
                    Explore {s.title.toLowerCase()}
                  </Btn>
                </div>
              </Panel>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============ PIPELINE DEMO ============ */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="split">
            <div>
              <SecHead
                kicker="One candidate, end to end"
                title="The phone call that <span class='accent'>actually happens.</span>"
                lede="A candidate who speaks Spanish, drives Class A with a tanker endorsement, and has held a medical card for two years. Here is what our pipeline does with them, and what reaches your hiring manager."
              />
              <ul className="panel__list" style={{ marginTop: 6 }}>
                <li><span>Every applicant answers the same questions, against a documented role profile</span></li>
                <li><span>Calls are transcribed and translated the moment they end</span></li>
                <li><span>Credentials are verified before the file is assembled</span></li>
                <li><span>The score shows its evidence; a human decides</span></li>
              </ul>
            </div>
            <In>
              <Panel tick>
                <Pipeline />
              </Panel>
            </In>
          </div>
        </div>
      </section>

      {/* ============ COMPLIANCE TIMELINE ============ */}
      <section className="sec" id="compliance">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <Kicker>2026 rule changes</Kicker>
              <h2 className="h2">
                The rules changed.
                <br />
                <span className="accent">Most carriers did not.</span>
              </h2>
            </div>
            <p className="lede">
              English language proficiency enforcement, medical certification integration and the paper-certificate
              transition all landed in the last eighteen months. These are the dates that matter to a qualification file
              and a roadside inspection.
            </p>
          </div>

          <div className="split" style={{ gap: 'clamp(34px,5vw,80px)' }}>
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

            <div style={{ display: 'grid', gap: 18 }}>
              <Panel idx="What it means in practice" tick>
                <h3>English proficiency belongs in qualification</h3>
                <p>
                  FMCSA assesses in two steps: an interview to establish whether the driver can respond sufficiently to
                  official inquiries, then — only if that passes — a highway traffic sign recognition assessment. On 10
                  August 2026 FMCSA proposed codifying a failure as an out-of-service violation.
                </p>
                <p style={{ marginTop: 14 }}>
                  We run that same assessment with every applicant, in the candidate’s own language where possible, so the
                  standard is identical for everyone and documented before the hire — not discovered at a weigh station.
                </p>
                <div style={{ marginTop: 20 }}>
                  <Src k="fmcsa-elp" />
                </div>
              </Panel>

              <Panel idx="The eight-state gap" tick>
                <h3>Eight states still run the old process</h3>
                <p>
                  Alaska, California, Kentucky, Louisiana, New Hampshire, New Jersey, New York and Oklahoma remain outside
                  the National Registry integration. Drivers there still self-certify medical cards and carriers still need
                  an MVR check after every exam.
                </p>
                <p style={{ marginTop: 14 }}>
                  A fleet that runs across both groups needs one process that knows the difference — not one assumption
                  applied everywhere.
                </p>
                <div style={{ marginTop: 20 }}>
                  <Src k="jjkeller" />
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NETWORKS ============ */}
      <section className="sec" id="networks">
        <div className="wrap">
          <SecHead
            kicker="The networks you serve"
            title="If you contract with a platform, <span class='accent'>their bar is your bar.</span>"
            lede="Amazon DSP, FedEx ISP and Amazon freight programmes each publish their own screening, capital and safety requirements. We encode them once and screen against all of them in a single pass."
          />

          <Reveal className="panel" stagger={0.06}>
            <div style={{ overflowX: 'auto' }}>
              <table className="cmp">
                <thead>
                  <tr>
                    <th>Requirement</th>
                    {NETWORKS.map((n) => (
                      <th key={n.name}>
                        {n.name}
                        <span style={{ display: 'block', textTransform: 'none', letterSpacing: 0, color: 'var(--faint)', fontSize: 10.5, marginTop: 5 }}>
                          {n.tag}
                        </span>
                      </th>
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

      {/* ============ ROLES ============ */}
      <section className="sec" id="roles">
        <div className="wrap">
          <SecHead
            kicker="Who we hire"
            title="Role libraries built for <span class='accent'>freight.</span>"
            lede="Pre-built screening profiles, question banks and credential checks for the roles that keep a carrier moving."
          />
          <In>
            <Tabs items={ROLES} />
          </In>
        </div>
      </section>

      {/* ============ PLATFORM ============ */}
      <section className="sec" id="platform">
        <div className="wrap">
          <SecHead
            kicker="The platform"
            title="Six modules. <span class='accent'>One person record.</span>"
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
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Btn href="/platform.html" variant="line">
              Explore the platform
              <Icon name="arrow" />
            </Btn>
          </div>
        </div>
      </section>

      {/* ============ HRBRIDGE ============ */}
      <section className="sec" id="hrbridge" style={{ background: 'var(--hull)' }}>
        <div className="wrap">
          <div className="split split--right">
            <div>
              <SecHead
                kicker={`${HRBRIDGE.name} — a Hoflings Ltd product`}
                title="The same engine, <span class='accent'>packaged for delivery fleets.</span>"
                lede={`${HRBRIDGE.name} is our AI recruiting software, built around one delivery-fleet problem: applications pile up faster than anyone can phone them back. It calls, texts and screens every applicant the moment they apply.`}
              />
              <p className="dim">
                Built for Amazon DSP hiring, where volume is the problem by design — weekly intake, a three-day driver
                academy, weekly check-ins against service level standards, and a qualification file that has to be complete
                before the first dispatch.
              </p>
              <p className="dim">
                {HRBRIDGE.name} carries the transcripts, the CRM, the e-signing and the onboarding automation. Hoflings carries
                everything around it — the recruiting, the qualification file, the compliance calendar and the people who
                answer when something goes wrong. They are two ways to buy the same capability.
              </p>
              <div className="band__act" style={{ marginTop: 30 }}>
                <Btn href="/hrbridge.html">
                  See {HRBRIDGE.name}
                  <Icon name="arrow" />
                </Btn>
                <Btn href={HRBRIDGE.url} variant="line" target="_blank" rel="noopener noreferrer">
                  Visit {HRBRIDGE.domain}
                </Btn>
              </div>
              <p className="hero__src">
                {HRBRIDGE.name} is operated by {BRAND.legalName}. {BRAND.legalName}, {BRAND.address.line1},{' '}
                {BRAND.address.line2}.
              </p>
            </div>

            <In>
              <Panel idx="What HRBridge does" tick>
                <div style={{ marginTop: 18 }}>
                  <Points
                    items={[
                      'AI phone interviews on every application, minutes after it arrives',
                      'SMS follow-up sequences that chase without being pushy',
                      'A built-in CRM where every stage, message and transcript lands',
                      'eSigning and onboarding automation for documents and steps',
                      'A live control room showing every call, thread and exception',
                    ]}
                  />
                </div>
              </Panel>
            </In>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="sec" id="faq">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <Kicker>Questions carriers actually ask</Kicker>
              <h2 className="h2">Answered with the <span className="accent">rule text.</span></h2>
            </div>
            <p className="lede">
              These are not invented questions. Each one is a real operational or compliance question from the freight
              sector, answered against published regulation and 2026 industry reporting — with the reference linked.
            </p>
          </div>

          <div className="split split--wide2">
            <Faq items={FAQ.slice(0, 6)} />
            <div>
              <Panel idx="Source list" tick>
                <h3 style={{ fontSize: 17 }}>Everything cited on this page</h3>
                <ul className="panel__list" style={{ marginTop: 16 }}>
                  {SOURCE_LIST.slice(0, 8).map((s) => (
                    <li key={s.k}>
                      <span>
                        <a
                          href={SOURCES[s.k].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--text)' }}
                        >
                          {SOURCES[s.k].label}
                        </a>
                        <span style={{ display: 'block', color: 'var(--faint)', fontSize: 12.5, marginTop: 2 }}>{s.n}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 20 }}>
                  <Btn href="/contact.html#sources" variant="line" size="sm">
                    See all sources
                  </Btn>
                </div>
              </Panel>
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <Faq items={FAQ.slice(6)} />
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="sec sec--tight">
        <div className="wrap">
          <div className="band">
            <h2>
              Bring one live requisition.
              <br />
              <span className="accent">We will show you the shortlist.</span>
            </h2>
            <p>
              We will source, screen and present qualified candidates for a real role in your operation within 48 hours —
              no commitment, no pilot deck, and no discovery phase billed as consulting.
            </p>
            <div className="band__act">
              <Btn href="/contact.html">
                Book a 30-minute walkthrough
                <Icon name="arrow" />
              </Btn>
              <Btn href="/services.html" variant="line">
                See how hiring works
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
