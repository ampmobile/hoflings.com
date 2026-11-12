import React from 'react';
import { Kicker, Btn, SecHead, Reveal, In, Panel, Points, Icon } from '../components/Bits.jsx';
import { HRBRIDGE, BRAND, AUTOMATION } from '../data/content.js';

const STEPS = [
  [
    '01',
    'Map the hiring steps',
    'We configure the AI recruiter around the questions and disqualifiers your operation already applies — not a generic script.',
  ],
  [
    '02',
    'Call and text every applicant',
    'Applications are phoned and messaged within minutes of arrival. Voice screening runs the conversation and logs the transcript.',
  ],
  [
    '03',
    'Qualified candidates land in your CRM',
    'The shortlist arrives with the full transcript and reasoning attached, so a manager can see why before deciding.',
  ],
  [
    '04',
    'Exceptions stay with your team',
    'Approvals, offers and judgement calls never get automated away. The workflow hands back to a person.',
  ],
];

const PLANS = [
  [
    'Recruiting only',
    'Stop the workflow at a qualified CRM handoff.',
    ['AI calls, screens and follows up', 'Qualified applicant with full conversation attached', 'Hands back to your team'],
  ],
  [
    'Full cycle',
    'Carry it through onboarding and confirmed training.',
    ['Everything in recruiting only', 'Documents, onboarding steps and scheduling', 'Confirmed training attendance'],
  ],
  [
    'Control room',
    'Watch every call and message as it happens.',
    ['Live view of calls and transcripts', 'SMS threads, stages and exceptions', 'Nothing the automation does is invisible'],
  ],
];

export default function HrBridge() {
  return (
    <>
      <section className="phero">
        <div className="wrap phero__in">
          <nav className="crumbs">
            <a href="/">Home</a>
            <span>/</span>
            <span>HRBridge</span>
          </nav>
          <Kicker>A Hoflings Ltd product — {AUTOMATION.label}</Kicker>
          <h1>
            The fully automated AI recruiter for <span className="accent">Amazon DSP hiring.</span>
          </h1>
          <p>
            HRBridge calls, texts and screens every applicant the moment they apply, then hands you a short list of drivers
            who are actually ready to start. It is the same engine that powers the Hoflings service business, packaged for
            delivery fleets running their own hiring — recruiting and onboarding run automatically, end to end, and the
            approval still lands with your team.
          </p>
          <div className="hero__act">
            <Btn href={HRBRIDGE.url} target="_blank" rel="noopener noreferrer">
              Visit {HRBRIDGE.name}.app
              <Icon name="arrow" />
            </Btn>
            <Btn href="/contact.html" variant="line">
              Talk to Hoflings
            </Btn>
          </div>
          <p className="hero__src">
            {HRBRIDGE.name} is operated by {BRAND.legalName}. Software, platform and trial details live on{' '}
            <a href={HRBRIDGE.url} target="_blank" rel="noopener noreferrer">
              {HRBRIDGE.domain}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="sec sec--top">
        <div className="wrap">
          <div className="split">
            <div>
              <SecHead
                kicker="Why it exists"
                title="Applications pile up faster than <span class='accent'>anyone can phone back.</span>"
              />
              <p className="lede">
                A fleet that hires every week cannot wait for a recruiter to work a list. HRBridge takes the dialling, texting
                and chasing, and leaves your team the drivers worth meeting.
              </p>
              <p className="dim">
                That is the whole idea. It is not a job board, and it is not a keyword filter that sends you a spreadsheet.
                It is a conversation, with the right questions, on the first attempt, with the result written down and
                attached to the record.
              </p>
              <p className="dim">
                HRBridge was built for Amazon DSP hiring, where volume is the problem by design — weekly intake, a three-day
                driver academy, weekly check-ins against service level standards, and a qualification file that has to be
                complete before the first dispatch.
              </p>
            </div>

            <In>
              <Panel tick>
                <span className="panel__idx">What it does</span>
                <h3 style={{ marginTop: 12 }}>One engine, four moving parts</h3>
                <div style={{ marginTop: 18 }}>
                  <Points
                    items={[
                      'AI phone interviews, run the moment an application arrives',
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

      <section className="sec" style={{ background: 'var(--hull)' }}>
        <div className="wrap">
          <SecHead
            kicker="How it works"
            title="From application to <span class='accent'>handoff.</span>"
            lede="Setup is the first week. After that the same questions are asked on every call — and the interesting decisions stay with your managers."
          />
          <Reveal className="grid g4" stagger={0.09}>
            {STEPS.map(([n, t, d]) => (
              <Panel key={n} tick data-rv>
                <span className="panel__idx">{n}</span>
                <h3 style={{ fontSize: 18 }}>{t}</h3>
                <p>{d}</p>
              </Panel>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SecHead
            kicker="Service plans"
            title="Choose where it <span class='accent'>hands back to you.</span>"
            lede="The same engine runs on every plan. What changes is how far the workflow carries itself before a person takes over."
          />
          <Reveal className="grid g3" stagger={0.09}>
            {PLANS.map(([t, d, items]) => (
              <Panel key={t} tick data-rv>
                <h3 style={{ fontSize: 20 }}>{t}</h3>
                <p className="dim" style={{ marginTop: 6 }}>
                  {d}
                </p>
                <div style={{ marginTop: 18 }}>
                  <Points items={items} />
                </div>
              </Panel>
            ))}
          </Reveal>
          <div style={{ marginTop: 40, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Btn href={HRBRIDGE.url} target="_blank" rel="noopener noreferrer">
              See plans and pricing on {HRBRIDGE.domain}
              <Icon name="arrow" />
            </Btn>
            <Btn href="/contact.html" variant="line">
              Ask Hoflings about a fleet rollout
            </Btn>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--hull)' }}>
        <div className="wrap">
          <div className="split">
            <div>
              <SecHead
                kicker="The relationship"
                title="Hoflings is the <span class='accent'>legal entity.</span>"
              />
              <p className="lede">
                {HRBRIDGE.name} is operated by {BRAND.legalName}. The software is {HRBRIDGE.name}; the contracts, the
                invoicing and the data processing agreements are with {BRAND.legalName}.
              </p>
              <p className="dim">
                That distinction matters when you are placing a driver. The company on the employment offer, the entity
                handling the qualification file, and the software making the call are all named explicitly — in the contract,
                on the privacy notice, and in the record itself.
              </p>
              <p className="dim">
                If you want the {HRBRIDGE.name} software on its own, use {HRBRIDGE.domain}. If you want the whole service —
                the platform plus the people who run recruiting, onboarding and HR around it — that is what Hoflings is, and
                it comes through this site.
              </p>
            </div>

            <In>
              <Panel tick>
                <span className="panel__idx">Entities</span>
                <div style={{ marginTop: 18, display: 'grid', gap: 22 }}>
                  {[
                    ['HRBridge', `${HRBRIDGE.domain} — the AI recruiting software, operated by ${BRAND.legalName}.`],
                    ['Hoflings', `${BRAND.domain} — the service business: AI recruiting, onboarding and HR services. ${BRAND.legalName}.`],
                    ['Hoflings Ltd', `${BRAND.address.line1}, ${BRAND.address.line2}. ${BRAND.address.country}.`],
                  ].map(([t, d]) => (
                    <div key={t}>
                      <h4 style={{ fontSize: 16, marginBottom: 6, fontFamily: 'var(--display)' }}>{t}</h4>
                      <p className="tiny dim" style={{ margin: 0 }}>
                        {d}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a className="pill" href={HRBRIDGE.url} target="_blank" rel="noopener noreferrer">
                    {HRBRIDGE.domain}
                  </a>
                  <a className="pill" href="/contact.html">
                    {BRAND.email}
                  </a>
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
              Try the software, or <span className="accent">hire the team.</span>
            </h2>
            <p>
              Start with {HRBRIDGE.name} on {HRBRIDGE.domain} if you want the engine on its own. Talk to Hoflings if you want
              it run for you.
            </p>
            <div className="band__act">
              <Btn href={HRBRIDGE.url} target="_blank" rel="noopener noreferrer">
                Visit {HRBRIDGE.domain}
                <Icon name="arrow" />
              </Btn>
              <Btn href="/contact.html" variant="line">
                Talk to us
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
