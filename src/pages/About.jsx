import React from 'react';
import { Kicker, Btn, SecHead, Reveal, In, Panel, Icon } from '../components/Bits.jsx';
import { AUTOMATION } from '../data/content.js';

const PRINCIPLES = [
  ['01', 'The job is defined before the candidate is found', 'We start from the credential, endorsement, shift pattern and lane the role actually requires — not a title. The screen we build comes from the qualification file the role has to produce, so a hire and a compliant file are the same piece of work.'],
  ['02', 'A human decides, every time', 'AI reads the application, runs the voice screen and scores the evidence. It never makes the hiring decision. Every score ships with the reason behind it, because an adverse finding you cannot explain is a finding you cannot defend.'],
  ['03', 'Two countries, one standard', 'A US and Canadian fleet runs on two different sets of paper, two provincial regimes and one shared labour market. We hold one evidence standard across both, and know which authority each credential belongs to.'],
  ['04', 'The record belongs to the carrier', 'Your candidate, credential and compliance data stays yours. Export it in full, set the retention rules yourself, and take it with you if you leave. If a vendor will not show you the record, there is nothing behind it.'],
];

export default function About() {
  return (
    <>
      <section className="phero">
        <div className="wrap phero__in">
          <nav className="crumbs">
            <a href="/">Home</a>
            <span>/</span>
            <span>About</span>
          </nav>
          <Kicker>About Hoflings — {AUTOMATION.label}</Kicker>
          <h1>
            We started from a carrier’s <span className="accent">back office.</span>
          </h1>
          <p>
            Hoflings exists because the hiring problem in freight is solvable — it is just badly served by software designed
            for office jobs and by agencies that treat a CDL driver like a keyword match. So we built the recruiting and the
            onboarding to run themselves, fully automated, and kept the parts that need a person where a person should be.
          </p>
        </div>
      </section>

      <section className="sec sec--top">
        <div className="wrap">
          <div className="split">
            <div>
              <SecHead
                kicker="The problem we found"
                title="Nobody had built for <span class='accent'>the actual job.</span>"
              />
              <p className="lede">
                Walk into a 120-truck carrier and you find the same three things: a driver shortage the market created, an
                onboarding process held together by a shared inbox, and a compliance calendar nobody fully owns.
              </p>
              <p className="dim">
                The hiring software on the market assumes a laptop, a nine-to-five interview and a predictable approval
                chain. The candidate drives a truck, works evenings, needs the paperwork to work on a phone, and has a legal
                right to touch-time that a generic applicant tracking system will never ask about.
              </p>
              <p className="dim">
                Meanwhile the vendors who understand freight — the staffing agencies — are measured on placement volume, not
                on whether the driver is still there in month six, or whether the qualification file was complete when the
                auditor arrived.
              </p>
              <p className="dim">
                Hoflings was built to close that gap: software-grade consistency and speed, with freight-grade knowledge
                about what the job legally requires and what the driver actually needs.
              </p>
            </div>

            <In>
              <Panel tick>
                <span className="panel__idx">What we believe</span>
                <div style={{ marginTop: 18, display: 'grid', gap: 22 }}>
                  {[
                    ['Speed is a hiring outcome', 'The fastest applicant in the market is usually the one who hears back first. Removing our own queue is a retention strategy.'],
                    ['Compliance is a workflow, not a document', 'A qualification file is the output of a process someone owns, with deadlines that fire. Build the process and the file takes care of itself.'],
                    ['Software should show its reasoning', 'In a regulated, audited industry, a score you cannot explain is a liability. Every decision we surface comes with the evidence behind it.'],
                    ['A driver is a person with a schedule', 'Home time, touch time, lanes and weekends decide who stays. Screen for the job as it is performed and retention improves on its own.'],
                  ].map(([t, d]) => (
                    <div key={t}>
                      <h4 style={{ fontSize: 16, marginBottom: 6, fontFamily: 'var(--display)' }}>{t}</h4>
                      <p className="tiny" style={{ margin: 0 }}>{d}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </In>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--hull)' }}>
        <div className="wrap">
          <SecHead
            kicker="How we work"
            title="Four principles we <span class='accent'>hold ourselves to.</span>"
            lede="These are not values on a wall. They are the criteria we use to judge our own work, and the reason a carrier stays with us past the first pilot."
          />
          <Reveal className="grid g4" stagger={0.09}>
            {PRINCIPLES.map(([n, t, d]) => (
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
          <div className="split split--reverse">
            <div>
              <SecHead
                kicker="What we don’t do"
                title="The <span class='accent'>honest version.</span>"
                lede="Vendors in this space oversell constantly. Here is where we draw the line, in writing, before you sign anything."
              />
              <ul className="panel__list" style={{ marginTop: 6 }}>
                <li><span><b style={{ color: 'var(--text)' }}>We don’t replace your hiring manager.</b> AI screens and schedules; your team interviews and hires. If you want a service that takes the decision away from you, we are not it.</span></li>
                <li><span><b style={{ color: 'var(--text)' }}>We don’t give legal advice.</b> We map the requirement, assemble the facts and flag the exposure. Where a rule needs an opinion, that comes from your counsel — with the work already done.</span></li>
                <li><span><b style={{ color: 'var(--text)' }}>We don’t make promises about the labour market.</b> No system creates drivers. We remove the friction between the drivers who exist and the jobs you need to fill, and we will tell you when a market needs a different answer.</span></li>
                <li><span><b style={{ color: 'var(--text)' }}>We don’t hide the record.</b> Your candidate, credential and compliance data belongs to you. Export it, take it with you, and set the retention rules yourself.</span></li>
              </ul>
            </div>

            <In>
              <Panel tick>
                <span className="panel__idx">The team behind the service</span>
                <h3 style={{ marginTop: 12 }}>Operations, HR, and people who have dispatched trucks</h3>
                <p style={{ marginBottom: 20 }}>
                  Hoflings is built by people who have worked inside carriers, run HR functions in distribution centres,
                  and built the systems that keep DOT and provincial inspections clean.
                </p>
                <div style={{ display: 'grid', gap: 11 }}>
                  {[
                    ['Carrier operations', 'people who have run terminals, dispatch and driver recruiting'],
                    ['HR & labour compliance', 'multi-state and multi-province advisory backgrounds'],
                    ['Applied AI & voice systems', 'real-time speech, scoring and explainability'],
                    ['Customer-side advisors', 'one named person who knows your operation'],
                  ].map(([t, d]) => (
                    <div className="chk" key={t}>
                      <span className="chk__t"><Icon name="check" /></span>
                      <span>
                        <b>{t}</b> — {d}
                      </span>
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
              Bring us a job you <span className="accent">cannot fill.</span>
            </h2>
            <p>
              We will show you what we would do about it, and tell you honestly if the answer is something other than
              software.
            </p>
            <div className="band__act">
              <Btn href="/contact.html">
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
