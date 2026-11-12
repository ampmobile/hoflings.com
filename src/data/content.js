/**
 * Hoflings content layer.
 * Every figure below is sourced. `src` keys map to SOURCES at the bottom.
 * Market data is 2026 industry reporting, not company results.
 */

export const BRAND = {
  name: 'Hoflings',
  legalName: 'Hoflings Ltd',
  domain: 'hoflings.com',
  email: 'support@hoflings.com',
  tagline: 'Fully automated AI recruiting and onboarding for the freight economy',
  address: {
    line1: '300 Main Street',
    line2: 'Madison, NJ 07940',
    country: 'United States',
  },
};

/* HRBridge is a Hoflings Ltd product line. */
export const HRBRIDGE = {
  name: 'HRBridge',
  domain: 'hrbridge.app',
  url: 'https://hrbridge.app',
  email: 'support@hoflings.com',
  line: 'Operated by Hoflings Ltd',
  tagline: 'AI recruiting software for Amazon DSP hiring',
};

export const NAV = [
  { label: 'Services', href: '/services.html', key: 'services' },
  { label: 'Platform', href: '/platform.html', key: 'platform' },
  { label: 'Industries', href: '/industries.html', key: 'industries' },
  { label: 'HRBridge', href: '/hrbridge.html', key: 'hrbridge' },
  { label: 'About', href: '/about.html', key: 'about' },
  { label: 'Contact', href: '/contact.html', key: 'contact' },
];

/* ------------------------------------------------------------------ */
/* Positioning — fully automated recruiting and onboarding               */
/* ------------------------------------------------------------------ */

/**
 * One statement, used everywhere so the claim is identical on every page.
 *
 * The scope is deliberate and load-bearing: the *process* runs end to end
 * without a recruiter picking up a phone; the *employment decision* stays
 * with the carrier, with the evidence attached. Automation without that
 * line is a compliance problem, not a product.
 */
export const AUTOMATION = {
  label: 'Fully automated recruiting & onboarding',
  headline: 'Fully automated AI recruiting and onboarding.',
  statement:
    'Your requisition becomes a documented role profile. Applications are screened against it the day they arrive, candidates are called in their own language and transcribed, documents are captured and validated on a phone, and the qualification file assembles itself — end to end, without a recruiter picking up a phone.',
  scope:
    'Automation runs the process, never the employment decision. Every adverse finding, every exception and every signature stays with your team, with the evidence attached.',
  points: [
    {
      k: 'Source & screen',
      v: 'Every application screened against a documented role profile the day it arrives.',
    },
    {
      k: 'Call & transcribe',
      v: 'Voice screens run in English, Spanish or French, transcribed and scored the same day.',
    },
    {
      k: 'Documents',
      v: 'I-9, CDL, medical certificate and endorsements captured on mobile and validated on upload.',
    },
    {
      k: 'Qualification file',
      v: 'Assembled, date-stamped and kept current under 49 CFR 391.51, with expiry alerts that have owners.',
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Market reality — dated, sourced                                      */
/* ------------------------------------------------------------------ */

export const MARKET_FIGS = [
  {
    value: 41,
    suffix: '%',
    label: 'Year-over-year rise in driver cost per hire, Q3 2026',
    src: 'conversion-pda',
  },
  {
    value: 44.2,
    suffix: '%',
    label: 'Annual for-hire driver turnover, 2025 (48% in 2024)',
    src: 'atri',
  },
  {
    value: 0.9,
    suffix: '',
    label: 'Drivers available per truck in 2025 — for every 10 trucks, 9 could run',
    src: 'atri',
  },
  {
    value: 5.4,
    suffix: 'pp',
    label: 'Extra turnover per 30 minutes of added average dwell time',
    src: 'atri',
  },
];

export const SECONDARY_FIGS = [
  {
    value: 92.7,
    suffix: '%',
    label: 'Long-run annualised turnover, large truckload carriers',
    src: 'natacademies',
  },
  {
    value: 17.1,
    suffix: '%',
    label: 'Annual turnover in private fleets (89 fleets surveyed)',
    src: 'nptc',
  },
  {
    value: 2.2,
    suffix: 'M',
    label: 'US heavy and tractor-trailer drivers employed, 2025 (BLS)',
    src: 'bls',
  },
  {
    value: 214500,
    suffix: '',
    label: 'Driver openings created each year through 2035, mostly replacement',
    src: 'bls',
  },
];

export const TAPE = [
  { v: '+41%', t: 'driver cost per hire, YoY' },
  { v: '44.2%', t: 'for-hire turnover, 2025' },
  { v: '17.1%', t: 'private fleet turnover' },
  { v: '0.9', t: 'drivers per truck' },
  { v: '−5%', t: 'for-hire driver pool, 2025' },
  { v: '57', t: 'median driver age' },
  { v: '214.5K', t: 'openings per year to 2035' },
  { v: '32%', t: 'more hires, agentic lead assist' },
];

/* Ranked reasons drivers leave — ATA reporting via trade press */
export const LEAVE_REASONS = [
  { n: '01', t: 'Equipment breakdowns', d: 'Mechanical failure tops the list of why drivers resign.', v: '#1' },
  { n: '02', t: 'Uncompetitive pay or a better offer', d: 'Compensation is the leading retention concern at 26.6%.', v: '26.6%' },
  { n: '03', t: 'Family reasons', d: 'Home time and predictability beat headline pay in many cases.', v: '#3' },
  { n: '04', t: 'Poor scheduling or planning', d: 'Unrealistic dispatch promises the first week.', v: '#4' },
  { n: '05', t: 'Wanted daily home time', d: 'Private fleets report 58% of drivers go home every night.', v: '#6' },
  { n: '06', t: 'Dishonest or misleading recruiting', d: 'Promises made at hire that the operation cannot keep.', v: '#7' },
];

export const AGENTIC_RESULT = {
  value: 32,
  suffix: '%',
  label: 'more hires year over year among carriers using agentic lead assist',
  extra: 'Carriers using agentic lead assist also paid $17 less per full application and produced 20% more applications per $1,000 of marketing spend.',
  src: 'conversion-pda',
};

/* ------------------------------------------------------------------ */
/* 2026 compliance timeline — real rules, real dates                    */
/* ------------------------------------------------------------------ */

export const COMPLIANCE_TIMELINE = [
  {
    date: '2025-06-23',
    state: 'done',
    title: 'National Registry Integration Phase 2 goes live',
    body:
      'Drivers no longer self-certify medical cards and carriers no longer verify examiners on the registry. Eight states remain non-compliant — Alaska, California, Kentucky, Louisiana, New Hampshire, New Jersey, New York and Oklahoma — where carriers still need an MVR check after every exam.',
    src: 'jjkeller',
  },
  {
    date: '2025-06-22',
    state: 'done',
    title: 'Paper medical examiner certificates stop being accepted',
    body:
      'Reliance on a paper MEC expired. Waivers extended the ability to carry or file a paper copy for up to 60 days, now running through 12 October 2027.',
    src: 'fedregister',
  },
  {
    date: '2026-04-19',
    state: 'done',
    title: 'CVSA narrows the English Language Proficiency out-of-service exception',
    body:
      'The revision narrows the previous border-commercial-zone exception. FMCSA policy MC-SEE-2026-0002, issued 16 April 2026, requires inspectors to determine the scope of the driver’s current trip before applying OOS criteria.',
    src: 'fmcsa-elp',
  },
  {
    date: '2026-08-10',
    state: 'live',
    title: 'FMCSA proposes codifying English proficiency as an out-of-service violation',
    body:
      'The NPRM would align the FMCSR with CVSA enforcement tolerances so a failure to satisfy 49 CFR 391.11(b)(2) places a driver out of service, except where the current trip stays inside the US–Mexico border commercial zones.',
    src: 'fedregister',
  },
  {
    date: '2026-10-06',
    state: 'live',
    title: 'ELP enforcement FAQs revised with Question 5',
    body:
      'Adds confirmation that drivers excepted from Part 391 — including certain agricultural operations under 391.2 and exemptions under 390.3T(f) — are not subject to the ELP enforcement protocol.',
    src: 'fmcsa-elp',
  },
];

/* ------------------------------------------------------------------ */
/* The networks you hire for                                            */
/* ------------------------------------------------------------------ */

export const NETWORKS = [
  {
    name: 'Amazon DSP',
    tag: 'Delivery Service Partner',
    who: 'You own a contracted delivery business and employ W-2 drivers.',
    rows: [
      ['Capital to start', '<b>$30,000</b> in liquid assets, demonstrated at application'],
      ['Screening', '<b>Motor vehicle record check, credit check and a recorded screening interview</b> before any offer'],
      ['Driver prep', '<b>Three-day academy</b> on the delivery app, safety protocol and route expectations'],
      ['Carriers', 'DSPs hold their own <b>MC and DOT number</b> and comply with DOT and FMCSA rules'],
      ['Ongoing', '<b>Weekly check-ins with Amazon</b> against service level standards'],
      ['Route types', 'Helper routes for large items and home services, plus <b>one-person freight routes</b> on evening shifts'],
    ],
    src: 'amazon-dsp',
  },
  {
    name: 'FedEx ISP',
    tag: 'Independent Service Provider',
    who: 'You own a pickup and delivery company contracting with FedEx.',
    rows: [
      ['Capital to start', '<b>At least $100,000</b> to invest, plus the ability to own or lease a fleet'],
      ['Structure', '<b>Incorporated as an S or C corporation</b>, hiring and training W-2 employees'],
      ['Minimum route', '<b>At least five routes or 500 stops per day</b>'],
      ['Driver rules', 'No more than <b>three moving violations in three years</b>, maximum <b>one in twelve months</b>'],
      ['Credentialing', 'DOT physical and drug test, valid CDL, unrestricted access to and from Canada for Custom Critical routes'],
      ['Enforcement', 'Compliance Investigation Report, then a <b>Notice of Compliance Concern or Opportunity to Cure</b>'],
    ],
    src: 'fedex-isp',
  },
  {
    name: 'Amazon Relay & inbound',
    tag: 'Freight carriers',
    who: 'You haul Amazon freight on your own authority.',
    rows: [
      ['Authority', '<b>Active USDOT with interstate authority for at least 180 days</b>'],
      ['Safety', 'FMCSA safety rating of <b>“Satisfactory” or “None”</b>, plus performance across VRM and BASIC'],
      ['Insurance', '<b>$1 million</b> commercial general liability per occurrence'],
      ['Daily', '<b>Pre-trip and post-trip inspections</b> on every vehicle; fleet safety assessed every 14 days'],
      ['Onboarding', '<b>Four-week program</b> requiring <b>85% first-pass yield</b> and <b>NCNS at or below 4%</b>'],
      ['Windows', '<b>Seven-day delivery windows</b> for all shipments since September 2025'],
    ],
    src: 'amazon-relay',
  },
];

/* ------------------------------------------------------------------ */
/* Services                                                             */
/* ------------------------------------------------------------------ */

export const SERVICES = [
  {
    idx: '01',
    key: 'recruiting',
    title: 'Fully automated AI recruiting',
    lead: 'Source, screen and voice-interview the people who can actually clear the road — in English, Spanish or French, without a recruiter picking up a phone.',
    body:
      'We convert a requisition into a documented role profile: credentials, endorsements, route and schedule fit, equipment experience and the language the work happens in. Our models screen against it, call the candidate, transcribe the call, and return a shortlist where every score shows the answer that produced it.',
    points: [
      'Multi-channel sourcing with source-level retention tracking',
      'Real-time voice screening, auto-transcribed and scored the same day',
      'Route, home-time and touch-time fit scoring — not keyword matching',
      'Explainable scores with the evidence attached',
      'Human decision on every adverse finding',
      'Documented criteria, applied consistently to every candidate',
    ],
  },
  {
    idx: '02',
    key: 'onboarding',
    title: 'Fully automated AI onboarding',
    lead: 'A complete, verified driver qualification file before the truck moves — captured, validated and assembled on a phone, without a single document chased by email.',
    body:
      'Mobile-first onboarding a driver finishes from a phone in 25 minutes. Documents are captured, validated and time-stamped; the qualification file assembles itself; every deadline — medical card, endorsement, training cycle, DQ review — is tracked and escalated before it becomes a finding.',
    points: [
      'Form I-9 Sections 1 and 2 with E-Verify, captured on mobile',
      'CDL, medical certificate and endorsements validated on upload',
      'Medical Examiner Certificate and National Registry handled correctly, state by state',
      'Clearinghouse, Part 40 / 382 and MVR / PSP orchestrated in one flow',
      'DQ file assembly under 49 CFR 391.51',
      'Expiry alerts with owners, so nothing expires quietly',
    ],
  },
  {
    idx: '03',
    key: 'hr',
    title: 'HR services',
    lead: 'The HR function a 40-truck carrier needs and cannot staff.',
    body:
      'One named advisor who knows that a driver in Ontario is governed by different rules than one in Ohio. Policies written for your fleet and your states and provinces, classification and wage exposure closed out, records kept audit-ready between audits — and a clear path to your own counsel when a matter needs an opinion.',
    points: [
      'Handbooks and policies built for your fleet mix and lanes',
      'Employee vs contractor analysis, including light-vehicle exposure',
      'Audit preparation for FMCSA, provincial, OSHA and insurance review',
      'Safety scorecards and coaching loops tied to telematics',
      'Manager training for hiring managers, dispatch leads and shop foremen',
      'Stay interviews and 90-day check-ins that catch a resignation early',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Roles                                                                */
/* ------------------------------------------------------------------ */

export const ROLES = [
  {
    key: 'drivers',
    title: 'Truck drivers',
    lead:
      'The hardest role in the building. We screen for the credentials the job legally requires, and the preferences that decide whether a driver is still on your lane in six months.',
    screen: [
      'CDL class, endorsements and medical certification',
      'Route, domicile and home-time fit',
      'Tanker, HazMat, doubles and triples experience',
      'Provincial equivalency for Canadian roles',
      'MVR / PSP history and violation review',
      'English Language Proficiency readiness under 391.11(b)(2)',
    ],
    help: [
      'Voice screening in English, Spanish and French',
      'Sourcing campaigns by lane and terminal',
      'Referral pipelines with source-level attribution',
      'Day-one onboarding and DQ file assembly',
      '90-day retention check-ins and coaching',
    ],
  },
  {
    key: 'dispatch',
    title: 'Dispatch & operations',
    lead:
      'Dispatchers live or die on the phone. We screen for communication under pressure, freight knowledge and the software you actually run — then verify it before the first shift.',
    screen: [
      'Load and freight handling knowledge',
      'ELD and hours-of-service familiarity',
      'High-volume phone and email handling',
      'Bilingual capability for customer-facing roles',
      'Multi-state and cross-border routing',
      'Relief and surge coverage availability',
    ],
    help: [
      'Skills and work-sample assessments',
      'Scenario simulations for peak and surge',
      'Systems training plan for your TMS',
      'Structured onboarding with quality scoring',
      'Backfill coverage for seasonal peaks',
    ],
  },
  {
    key: 'warehouse',
    title: 'Warehouse & yard',
    lead:
      'High-volume hiring with real standards. We handle surge hiring for peak season, verify equipment certifications, and keep safety training records clean.',
    screen: [
      'Forklift, picker and reach-truck certification',
      'Background and driving record checks',
      'Shift and seasonal availability',
      'Distribution centre safety record',
      'French-language requirement for Canadian DCs',
      'OSHA 10 training completion',
    ],
    help: [
      'Fast-track hiring for Q3 and Q4 peaks',
      'Certification verification and renewal tracking',
      'OSHA 10 training coordination and records',
      'Day-one ready, badge-ready new hires',
      'Attrition analysis by hub and shift',
    ],
  },
  {
    key: 'fleet',
    title: 'Fleet & maintenance',
    lead:
      'Shop talent is scarce and expensive to lose. We verify certifications, hands-on experience and safety history, and document the training record you will need to defend.',
    screen: [
      'ASE certification and manufacturer training',
      'Heavy-duty and tractor experience',
      'Hazmat and inspection training',
      'Welding, brake and electrical specialisation',
      'Tooling and equipment familiarity',
      'Safety record history',
    ],
    help: [
      'Apprentice and intern pipelines',
      'Certification tracking and renewal reminders',
      'Tool and equipment assignment planning',
      'Shift and on-call coverage staffing',
      'Apprenticeship wage subsidy navigation',
    ],
  },
  {
    key: 'corporate',
    title: 'Corporate & admin',
    lead:
      'The back office that keeps a carrier compliant: safety, maintenance, accounting, customer service and the HR generalist you have been meaning to hire.',
    screen: [
      'Safety and compliance certification',
      'DOT, FMCSA and CRA working knowledge',
      'Payroll, claims and workers’ compensation exposure',
      'Bilingual recruiting for Canadian operations',
      'General ledger and freight billing systems',
      'Employment eligibility verification',
    ],
    help: [
      'Professional and technical screening',
      'Recruiter-assisted hiring for hard roles',
      'Onboarding with payroll and benefits setup',
      'Fractional HR generalist coverage',
      'Employment records maintained to retention rules',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FAQ — real questions, answered with real rules                      */
/* ------------------------------------------------------------------ */

export const FAQ = [
  {
    q: 'What does "fully automated" actually mean — and what still stays with you?',
    a: [
      'It means the work runs without a recruiter picking up a phone. Your requisition becomes a documented role profile, every application is screened against it the day it arrives, candidates are called in their own language and transcribed, documents are captured and validated on a phone, and the qualification file assembles and dates itself. Onboarding steps, expiry alerts and follow-up sequences fire on their own.',
      'It does not mean the employment decision is automated. Every adverse finding, every exception and every signature stays with your team, and every score we produce ships with the evidence that produced it. Automation here removes the admin and the chasing — not your accountability, and not your legal one.',
    ],
  },
  {
    q: 'What does FMCSA actually require in a driver qualification file?',
    a: [
      'Under 49 CFR 391.51, the qualification file must contain the driver’s medical certificate, the motor vehicle record from the reviewing agency, a copy of the driver’s road test or written examination results if required, and the employer’s evaluation of the driver’s overall qualification. With the National Registry integration, the medical certification itself now moves electronically from the examiner to the state licensing agency and appears on the CDLIS motor vehicle record.',
      'Hoflings assembles and date-stamps that file from the onboarding flow, and flags medical certification, training and review deadlines against the record so the file is complete before an auditor asks for it — not during.',
    ],
    src: 'fmcsa-reg',
  },
  {
    q: 'How do I assess a driver’s English language proficiency, and what happens if they fail?',
    a: [
      'FMCSA’s assessment is two steps. Step 1 is an interview to establish whether the driver can respond sufficiently to official inquiries. Only a driver who passes Step 1 proceeds to Step 2, a highway traffic sign recognition assessment covering United States signs, including electronic changeable message signs. Inspectors apply enforcement policy MC-SEE-2026-0002, and where the driver’s current trip stays inside the US–Mexico border commercial zones, scope of the trip is checked before out-of-service criteria apply.',
      'On 10 August 2026 FMCSA proposed codifying the requirement as an out-of-service violation, aligning the FMCSR with the CVSA out-of-service criteria revised on 19 April 2026. The rule text has not changed: a driver must be able to read and speak English sufficiently to converse with the general public, understand traffic signs and signals, respond to official inquiries and make entries on reports and records.',
      'Practically, this belongs in qualification, not in a roadside surprise. We run the same assessment with every applicant — in the candidate’s own language where possible — so the same standard is applied to everyone and documented before hire.',
    ],
    src: 'fmcsa-elp',
  },
  {
    q: 'Can I still rely on a paper medical examiner certificate?',
    a: [
      'The provisions allowing reliance on a paper MEC expired on 22 June 2025. FMCSA has since extended the ability for drivers to carry a paper copy and for carriers to file one in the qualification file — for up to 60 days from the date the certificate was issued. The current waiver runs through 12 October 2027.',
      'Eight states remain outside the National Registry integration: Alaska, California, Kentucky, Louisiana, New Hampshire, New Jersey, New York and Oklahoma. In those states drivers still self-certify medical cards and carriers must obtain MVR proof after every exam. Note also that when a driver fails an exam, the MVR shows “Not Certified” immediately, even if time remains on the old card.',
      'We track which rule set applies to each driver by state of domicile, so a mixed-state fleet gets one process rather than two conflicting ones.',
    ],
    src: 'fedregister',
  },
  {
    q: 'What does it actually cost to replace a truck driver?',
    a: [
      'Industry estimates put total driver cost per hire between $5,000 and $12,000 once recruiter time, screening, background checks, drug testing, onboarding and idle equipment are counted. Breakdowns of replacement cost commonly run $8,234 to $20,729, with recruiting at $2,000–$5,000, screening and compliance at $500–$1,000, orientation and training at $1,500–$3,000, empty-truck revenue loss at $800–$1,200 per day, and sign-on bonuses at $1,000–$5,000.',
      'Against that, driver cost per hire rose 41% year over year in Q3 2026, and 46% of carriers surveyed increased driver pay within the previous 90 days. The recruiting channel itself is only one line: the median cost per applicant for CDL campaigns on social platforms ran $26.86 in 2026 benchmarking.',
      'Our pricing is set against these numbers rather than against a seat licence, because the cost you are managing is the seat sitting empty.',
    ],
    src: 'conversion-pda',
  },
  {
    q: 'How do I decide whether a driver is an employee or an independent contractor?',
    a: [
      'The vehicle weight decides a large part of it. Drivers operating a vehicle with a gross vehicle weight rating above 10,000 pounds fall under the Motor Carrier Act exemption from federal overtime protections. Drivers of light vehicles below 10,001 pounds remain under FLSA overtime protection — and that distinction has been the subject of significant litigation over ISP and contractor models.',
      'Classification also turns on the substance of the relationship, not the label on the contract: who controls the work, who supplies the equipment, and who bears the opportunity for profit or loss. The classification questions in the FedEx ISP agreements go further still — the provider is the employer of record and retains sole discretion over staffing, selection, hiring, training, supervision, assignment, hours, discipline, compensation and benefits.',
      'We map the arrangement, assemble the facts and flag the exposure, and refer the legal opinion to your counsel with the work already done.',
    ],
    src: 'fedex-isp',
  },
  {
    q: 'What disqualifies an applicant on a major delivery or freight programme?',
    a: [
      'The published screen for contract delivery work is strict: a felony conviction within the past seven years, a DUI or DWI within the past seven years, more than two moving violations in the past three years, and at least one year of driving history are all disqualifying. Some programmes add a credit check and a recorded screening interview; carrier contracts add their own conditions — FedEx owner-operator rules cap moving violations at three in three years and one in twelve months, and require a DOT physical, drug test, valid CDL and unrestricted access to and from Canada for Custom Critical routes.',
      'Programmes also screen the business, not just the driver. Amazon DSP requires $30,000 in liquid assets, a motor vehicle record check, a credit check and a recorded screening interview; Relay carriers need an active USDOT with interstate authority for at least 180 days, an FMCSA safety rating of “Satisfactory” or “None”, and $1 million in commercial general liability.',
      'We run the full set of criteria in one pass, so an applicant who fails one screen is not walked through three more interviews first.',
    ],
    src: 'amazon-dsp',
  },
  {
    q: 'What are driver turnover rates actually?',
    a: [
      'They depend entirely on which population you measure. Long-run annualised turnover for large truckload carriers is 92.7%, and 77.6% for smaller truckload operations, against 11.8% for less-than-truckload linehaul drivers. For-hire carriers reported 44.2% for 2025, down from 48% in 2024, with the highest turnover among the largest truckload fleets at 70.7% and the lowest among small specialised fleets at 13.9%. Private fleets report 17.1%.',
      'BLS separates for the whole transportation, warehousing and utilities sector put separations at 4.0% a month in 2025 — roughly 48 per 100 employees a year. The lesson for a carrier is that no single number is your number: segment, terminal, lane and hire source determine yours, and the source with the best cost per applicant is frequently not the source that retains.',
      'We report retention by source, terminal and lane, because that is the only cut of the data you can act on.',
    ],
    src: 'natacademies',
  },
  {
    q: 'Can you support a mixed US and Canadian fleet?',
    a: [
      'Yes. Cross-border operations carry two regulatory systems and two sets of credential rules, so we model the differences instead of averaging them. The US side covers Form I-9 and E-Verify, DOT and FMCSA rules, hours of service, Part 40 and Part 382 drug and alcohol programmes, Clearinghouse, OSHA recordkeeping and state employment law. The Canadian side covers provincial licensing and safety credentialing, NSC standards, provincial occupational health and safety, employment standards, WSIB and WCB coverage, and provincial paid-leave rules.',
      'USMCA-aware credential mapping means a driver crossing the border has the right documents for both sides, and the compliance calendar runs on one system with jurisdiction attached to every deadline.',
    ],
    src: 'bls',
  },
  {
    q: 'How fast can you actually go live?',
    a: [
      'Inside a week. We do not run a multi-month implementation, because the first deliverable should be a hire, not a project plan. Scoping call, then a live demonstration on one of your real requisitions, then a written scope covering roles, volumes, timelines, compliance ownership and pricing, then go live.',
      'The demonstration is run on your requisition with your criteria: we source against it, screen candidates, and show your hiring manager the shortlist with the reasoning attached and the onboarding packet behind it. If it is not better than your current baseline, we will tell you before you sign anything.',
    ],
    src: 'atri',
  },
  {
    q: 'Will AI screening survive a discrimination review or an audit?',
    a: [
      'It survives if the reasoning is on the record. Every candidate answers the same questions against a documented role profile, every score traces back to the answer that produced it, and anything adverse routes to a person before it goes anywhere. A model that cannot explain itself is a liability in a regulated industry, so the explanation is built into the product rather than offered on request.',
      'We also keep the decision with your hiring manager. We screen, schedule, score and document; your team interviews and hires.',
    ],
    src: 'natacademies',
  },
];

/* ------------------------------------------------------------------ */
/* Pricing                                                              */
/* ------------------------------------------------------------------ */

export const PRICING = [
  {
    name: 'Project fill',
    for: 'One role class, one hiring campaign.',
    price: 'Flat fee',
    unit: 'per hire',
    featured: false,
    points: [
      'AI sourcing and screening for a defined role',
      'Voice interviews in English, Spanish and French',
      'Shortlist with explained scoring',
      'Onboarding and DQ file for every accepted hire',
      'Replacement guarantee for 90 days',
    ],
  },
  {
    name: 'Full programme',
    for: 'Recruiting, onboarding and HR on a monthly retainer.',
    price: 'Monthly retainer',
    unit: 'per operation',
    featured: true,
    points: [
      'Unlimited hiring across all roles',
      'Onboarding and credential management',
      'Named HR advisor and compliance calendar',
      'Policy library and audit preparation',
      'Quarterly compliance and retention review',
      'Source-level and terminal-level attrition reporting',
    ],
  },
  {
    name: 'Onboarding only',
    for: 'You already have candidates. We make them compliant.',
    price: 'Per driver',
    unit: 'onboarded',
    featured: false,
    points: [
      'Mobile onboarding flow and document capture',
      'Form I-9 and E-Verify processing',
      'Credential screening and DQ file assembly',
      'Expiry, deadline and renewal monitoring',
      'Audit pack export on demand',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Platform modules                                                     */
/* ------------------------------------------------------------------ */

export const MODULES = [
  {
    k: 'Module 01',
    t: 'Talent Console',
    p: 'Requirement profiles, multi-channel sourcing, AI voice screening with live transcripts, explainable scoring and the shared shortlist your hiring manager works from.',
    span: 'b4',
    ic: 'search',
  },
  {
    k: 'Module 02',
    t: 'Onboarding Engine',
    p: 'Mobile-first flows a driver completes from a truck cab. Document capture, I-9 and E-Verify, credential validation, e-signature and background check orchestration.',
    span: 'b2',
    ic: 'phone',
  },
  {
    k: 'Module 03',
    t: 'Credential Ledger',
    p: 'The single source of truth for every licence, medical certificate, endorsement and training record, with issue dates, expiry dates and the file each belongs to.',
    span: 'b2',
    ic: 'shield',
  },
  {
    k: 'Module 04',
    t: 'Compliance Calendar',
    p: 'Every deadline in your operation — medical certificates, endorsements, training cycles, I-9 retention and audit dates — in one dated view with owners and escalations.',
    span: 'b3',
    ic: 'calendar',
  },
  {
    k: 'Module 05',
    t: 'HR Desk',
    p: 'Employee and driver files, performance and safety scorecards, open cases and manager training records — with a named advisor attached.',
    span: 'b3',
    ic: 'users',
  },
  {
    k: 'Module 06',
    t: 'Analytics',
    p: 'Hiring funnel, source quality, time-to-hire, attrition by lane and terminal, cost per hire and compliance incidents, reported per facility.',
    span: 'b6',
    ic: 'chart',
  },
];

/* ------------------------------------------------------------------ */
/* Industries                                                           */
/* ------------------------------------------------------------------ */

export const INDUSTRIES = [
  {
    id: 'trucking',
    n: '01',
    t: 'Trucking & intermodal',
    p: 'Driver retention, not applicant volume, decides the margin. We hire for route fit and keep the qualification file clean so a paperwork gap never costs you a truck.',
    pts: [
      'OTR, dedicated and regional role libraries',
      'Domicile-specific sourcing by lane and terminal',
      'Home-time, touch-time and schedule-fit screening',
      'DQ file, medical certificate and endorsement tracking',
      'Owner-operator and lease arrangement support',
    ],
  },
  {
    id: 'dsp',
    n: '02',
    t: 'DSP & delivery services',
    p: 'Contract delivery is a people business with wheels attached. If you run a DSP, an ISP or a contract route, your hiring bar is set by the programme you serve — and your screening has to meet it.',
    pts: [
      'Application screening to programme criteria, run once',
      'MVR, credit and background screening orchestrated',
      'Helper and one-person route staffing models',
      'Academy-style orientation and safety training records',
      'Owner-operator eligibility and route documentation',
    ],
  },
  {
    id: 'brokerage',
    n: '03',
    t: 'Freight brokerage',
    p: 'Brokerages do not hire drivers — they compete for capacity and pay for the certainty that a load will move. We build the carrier network, the onboarding and the screening behind it.',
    pts: [
      'Carrier onboarding and operating authority verification',
      'Insurance certificate tracking and expiry alerts',
      'Safety rating and BASIC screening before the first load',
      'Factoring and quick-pay partner onboarding',
      'Broker and account manager hiring',
    ],
  },
  {
    id: 'warehouse',
    n: '04',
    t: 'Warehousing & 3PL',
    p: 'Distribution centres hire in waves, certify in weeks and get audited by safety regulators. We compress the pipeline without compressing the record.',
    pts: [
      'Surge capacity for Q3 and Q4 peaks',
      'Forklift, reach truck and picker certification checks',
      'OSHA 10 training coordination and recordkeeping',
      'Shift pattern and availability matching',
      'French-language hiring for Canadian DCs',
    ],
  },
  {
    id: 'finalmile',
    n: '05',
    t: 'Final mile & courier',
    p: 'Route-based work with weekly turnover, seasonal peaks and drivers who work from a phone rather than a terminal.',
    pts: [
      'Weekly hiring cohorts with same-week starts',
      'Route and delivery van qualification',
      'Smartphone-first onboarding and pay apps',
      'Bilingual routing and customer-facing hiring',
      'Hub sorting and operations staff',
    ],
  },
  {
    id: 'autotransport',
    n: '06',
    t: 'Auto transport',
    p: 'Moving vehicles without moving steel. Auto carriers need drivers who understand tie-downs, damage prevention and chain of custody — a different skill set from general freight, and rarely screened for.',
    pts: [
      'Tie-down and securement competency checks',
      'Air-ride and lowboy experience screening',
      'Damage prevention and chain-of-custody training',
      'Endorsement matching for oversized loads',
      'Excessive-damage patterns flagged for review',
    ],
  },
  {
    id: 'crossborder',
    n: '07',
    t: 'Cross-border Canada & US',
    p: 'Cross-border operations carry two regulatory systems, two tax regimes and two sets of credential rules. Most providers pick a side. We map both.',
    pts: [
      'Provincial licensing equivalency mapping',
      'Cross-border clearance and customs-aware documentation',
      'Bilingual screening and policy documentation',
      'USMCA-aware credential and work authorisation checks',
      'One compliance calendar across both countries',
    ],
  },
  {
    id: 'staffing',
    n: '08',
    t: 'Driver staffing & support',
    p: 'Staffing firms live on placement speed and driver quality. We screen once, verify compliance, and hand both you and the carrier a complete, documented file.',
    pts: [
      'Pre-vetted driver pools for carrier clients',
      'Credential and MVR verification before placement',
      'Requisitioned, expedited and touch-and-go profiles',
      'Drug and alcohol programme administration',
      'Placement documentation and file management',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Sources                                                              */
/* ------------------------------------------------------------------ */

export const SOURCES = {
  'conversion-pda': {
    label: 'Conversion Interactive & PDA, Q3 2026 Driver Recruiting & Retention Data',
    url: 'https://www.ttnews.com/articles/truck-driver-cost-hire-jumps-q3',
  },
  atri: {
    label: 'ATRI, Operational Costs of Trucking (2026 report, 2025 data)',
    url: 'https://www.fleetowner.com/operations/article/55417849/trucking-by-the-numbers-2026-for-hire-private-and-driver-stats',
  },
  nptc: {
    label: 'NPTC Benchmarking Survey, reported by FleetOwner',
    url: 'https://www.fleetowner.com/operations/article/55417849/trucking-by-the-numbers-2026-for-hire-private-and-driver-stats',
  },
  'natacademies': {
    label: 'National Academies, using ATA turnover data',
    url: 'https://locus.sh/blogs/delivery-driver-turnover-rate-primary-data-2026/',
  },
  bls: {
    label: 'U.S. Bureau of Labor Statistics, employment projections 2024–2035',
    url: 'https://www.truckinginfo.com/news/why-hiring-truck-drivers-is-getting-harder',
  },
  'fmcsa-reg': {
    label: 'FMCSA Regulatory Guidance (49 CFR 391.51, 391.11)',
    url: 'https://www.fmcsa.dot.gov/guidance',
  },
  'fmcsa-elp': {
    label: 'FMCSA ELP Roadside Enforcement Policy MC-SEE-2026-0002 and CVSA FAQs, eff. 6 Oct 2026',
    url: 'https://www.fmcsa.dot.gov/regulations/english-language-proficiency-roadside-enforcement-policy-faqs-0',
  },
  fedregister: {
    label: 'Federal Register 91 FR, 8 Oct 2026 — MEC paper-copy guidance',
    url: 'https://www.govinfo.gov/content/pkg/FR-2026-10-08/pdf/2026-20589.pdf',
  },
  jjkeller: {
    label: 'J.J. Keller Compliance Network — 3 hot FMCSA DQ topics for 2026',
    url: 'https://jjkellercompliancenetwork.com/news/3-hot-fmcsa-dq-topics-for-2026-watchouts-and-common-questions',
  },
  'amazon-dsp': {
    label: 'Amazon DSP programme materials and FAQ',
    url: 'https://logistics.amazon.com/marketing/faq?linkId=216707915',
  },
  'amazon-relay': {
    label: 'Amazon Freight carrier requirements and US Prepaid Carrier Manual',
    url: 'https://m.media-amazon.com/images/G/01/magicarp/common/US_Prepaid_Carrier_Manual.pdf',
  },
  'fedex-isp': {
    label: 'FedEx Contracting — Independent Service Provider opportunity',
    url: 'https://www.contracting.fedex.com/the-opportunity',
  },
};

export const SOURCE_LIST = [
  { k: 'conversion-pda', n: 'Driver cost per hire, pay changes, retention concerns' },
  { k: 'atri', n: 'For-hire turnover, drivers per truck, dwell time effect, pay and turnover' },
  { k: 'nptc', n: 'Private fleet turnover and driver pay' },
  { k: 'natacademies', n: 'Segment turnover: truckload, LTL linehaul, private' },
  { k: 'bls', n: 'Driver employment, openings to 2035, driver pool contraction' },
  { k: 'fmcsa-reg', n: 'Driver qualification file and qualification requirements' },
  { k: 'fmcsa-elp', n: 'English Language Proficiency assessment and enforcement' },
  { k: 'fedregister', n: 'Medical Examiner Certificate guidance and ELP rulemaking' },
  { k: 'jjkeller', n: 'National Registry integration and non-compliant states' },
  { k: 'amazon-dsp', n: 'DSP eligibility, screening and launch requirements' },
  { k: 'amazon-relay', n: 'Carrier vetting, VRM, insurance and inbound onboarding standards' },
  { k: 'fedex-isp', n: 'ISP investment, route minimums, driver rules, enforcement' },
];
