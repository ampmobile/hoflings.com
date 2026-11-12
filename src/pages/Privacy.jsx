import React from 'react';
import { LegalPage, LegalSection } from '../components/Legal.jsx';
import { BRAND, HRBRIDGE } from '../data/content.js';

export default function Privacy() {
  return (
    <LegalPage
      crumb="Privacy"
      kicker="Legal"
      title="Privacy policy."
      lede="What we collect, why we collect it, who we share it with, and how to get it back or have it deleted. Written to be read, not to be survived."
      updated="12 November 2026"
    >
      <LegalSection id="who-we-are" n="01" title="Who we are">
        <p>
          {BRAND.legalName} (&ldquo;Hoflings&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a
          company registered in the State of New Jersey, United States, with its registered office at {BRAND.address.line1},{' '}
          {BRAND.address.line2}, {BRAND.address.country}.
        </p>
        <p>
          {BRAND.legalName} is the legal entity behind {BRAND.domain} and is the contracting party for the Hoflings
          recruiting, onboarding and HR services described on this site. {HRBRIDGE.name} (the software published at{' '}
          {HRBRIDGE.domain}) is operated by {BRAND.legalName}. Where you use {HRBRIDGE.name}, the same entity holds your
          data and the same contact details below apply.
        </p>
        <p>
          For questions about this policy or your data, email{' '}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>. For privacy-specific requests, write to the same address with
          the subject line starting &ldquo;Privacy request&rdquo;.
        </p>
      </LegalSection>

      <LegalSection id="what-we-collect" n="02" title="What we collect">
        <p>
          It depends entirely on which part of Hoflings you use. We keep the distinction sharp because the data that matters
          most in freight is also the most sensitive.
        </p>

        <h3>When you visit this site</h3>
        <p>
          This website is a static marketing site. It does not run advertising trackers, does not set advertising cookies,
          and does not build a behavioural profile of you. The enquiry form on the{' '}
          <a href="/contact.html">contact page</a> opens your own email client with the details you typed. Nothing you type
          into that form is transmitted to, stored on, or logged by this website.
        </p>

        <h3>When you are a candidate or applicant</h3>
        <p>
          If you apply for a role through Hoflings or {HRBRIDGE.name}, the hiring client — the carrier, 3PL or DSP you applied
          to — is the controller of your application data. They decide what is collected and why. We act as a processor on
          their instructions, and we collect only what the screening process needs:
        </p>
        <ul>
          <li>Identity and contact details you provide, and application materials such as a résumé.</li>
          <li>Recruitment screening results — including any voice screening transcript, assessment answers and scoring.</li>
          <li>Right-to-work and credential evidence, such as licence, medical certification and driving record results.</li>
          <li>Employment and payroll records, once you are hired, where the service includes onboarding or HR support.</li>
          <li>Records of your communications with us and with the hiring client, including messages and calls.</li>
        </ul>
        <p>
          Sensitive personal information is handled under heightened controls. We do not make hiring decisions on the basis of
          protected characteristics, and we do not use automated scoring as the sole basis for an adverse decision.
        </p>

        <h3>When you are a client</h3>
        <p>
          If you buy the Hoflings services, we hold your business contact details, the candidate and credential records
          produced under the service, the correspondence needed to deliver and support it, and the billing records required to
          invoice you.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use" n="03" title="How we use it">
        <p>We use personal information to do the following, and for nothing else:</p>
        <ul>
          <li>To carry out the recruiting, onboarding and HR services you or your hiring client have engaged us for.</li>
          <li>
            To meet legal and regulatory obligations — including driver qualification file requirements under 49 CFR 391.51,
            Form I-9 and E-Verify obligations, drug and alcohol testing administration under 49 CFR Part 40 and 382, and
            Motor Carrier Safety Regulation recordkeeping.
          </li>
          <li>To communicate with you about your application, your service and your account.</li>
          <li>To invoice, collect and keep financial records.</li>
          <li>To detect fraud, secure our systems and enforce our agreements.</li>
          <li>
            To improve the service and the software — in aggregate and de-identified form. We do not use an individual
            candidate&rsquo;s record to train general-purpose models.
          </li>
        </ul>
        <p>
          Where we rely on consent &mdash; for example, to send you a marketing email &mdash; you can withdraw it at any time
          without affecting the service you have engaged us for.
        </p>
        <p>
          We do not sell personal information. We do not share it for advertising. We do not use it for automated decisions
          that produce legal or similarly significant effects without a human reviewing the outcome.
        </p>
      </LegalSection>

      <LegalSection id="who-we-share" n="04" title="Who we share it with">
        <p>We share personal information only with the parties who need it to deliver the service, and only as instructed:</p>
        <ul>
          <li>
            <b>The hiring client.</b> If you applied for a driving role, the carrier, 3PL or DSP receives your screening
            result, your credential evidence and your onboarding status.
          </li>
          <li>
            <b>Verification and screening providers.</b> We use third-party services to check identity, right to work,
            employment and criminal history, motor vehicle records, and drug and alcohol testing status. Each receives only the
            information needed to run that check.
          </li>
          <li>
            <b>Service providers.</b> Hosting, telephony, messaging and e-signature providers that process data on our
            instructions under written data processing terms.
          </li>
          <li>
            <b>Professional advisers and authorities.</b> Our counsel, accountants and auditors, and regulators or law
            enforcement where we are legally required to disclose.
          </li>
          <li>
            <b>Successors.</b> If {BRAND.legalName} reorganises or is acquired, personal information may transfer to the
            successor, and this policy continues to apply to it.
          </li>
        </ul>
        <p>
          {HRBRIDGE.name} voice screening and SMS messaging involve telephony and messaging providers who may process
          numbers and call content in the United States. The applicable data processing terms are provided in your service
          agreement.
        </p>
      </LegalSection>

      <LegalSection id="retention" n="05" title="How long we keep it">
        <p>
          We keep personal information for as long as we need it for the purpose it was collected, and then for as long as the
          law requires us to keep it.
        </p>
        <ul>
          <li>
            <b>Driver qualification files.</b> Retained and destroyed in line with the retention schedule in 49 CFR 391.51 and
            the applicable state and provincial requirements, and with the hiring client&rsquo;s instructions.
          </li>
          <li>
            <b>Employment records.</b> For the period required by applicable employment, payroll, tax and workers&rsquo;
            compensation law.
          </li>
          <li>
            <b>Application records for unsuccessful candidates.</b> For the period stated in the applicable privacy notice or
            hiring client instruction, and then deleted or anonymised.
          </li>
          <li>
            <b>Commercial and billing records.</b> For the statutory accounting period.
          </li>
        </ul>
        <p>
          When a retention period ends, we delete the information or convert it to a form where it can no longer identify an
          individual.
        </p>
      </LegalSection>

      <LegalSection id="security" n="06" title="How we protect it">
        <p>
          Information is encrypted in transit and at rest, access is restricted on a least-privilege basis and logged, and
          production access is granted on a need-to-know basis with multi-factor authentication. Credential files are
          segregated from general recruiting data, and access to them is recorded.
        </p>
        <p>
          No system is perfectly secure. If a breach occurs that is likely to result in a risk to your rights and freedoms, we
          will notify the relevant supervisory authority and, where required, affected individuals, without undue delay.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" n="07" title="Your rights">
        <p>
          Depending on where you live, you may have some or all of the following rights. We apply the same set of rights to
          everyone regardless of jurisdiction, so you do not need to work out which applies to you.
        </p>
        <ul>
          <li>To be told what personal information we hold about you, and to get a copy of it.</li>
          <li>To have inaccurate information corrected.</li>
          <li>To have information deleted, and to object to us processing it.</li>
          <li>To restrict or object to certain processing.</li>
          <li>To data portability where processing is automated and based on consent or contract.</li>
          <li>Not to be subject to a decision based solely on automated processing that produces legal or similarly significant effects.</li>
          <li>To withdraw consent at any time, without affecting the lawfulness of processing already carried out.</li>
          <li>To complain to your data protection authority.</li>
        </ul>
        <p>
          To exercise any of these, email{' '}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> with the subject line starting &ldquo;Privacy request&rdquo;. We
          will verify your identity before acting, and we will respond within the period required by applicable law &mdash;
          generally one month. We do not charge for this unless a request is manifestly unfounded or excessive.
        </p>
        <p>
          If we are processing your information on behalf of a hiring client, we will direct your request to that client and
          support them in responding. We will tell you who that client is.
        </p>
      </LegalSection>

      <LegalSection id="transfers" n="08" title="Cross-border transfers">
        <p>
          {BRAND.legalName} is established in the United States. The services we deliver cover the United States and Canada,
          and personal information may be processed in the United States, Canada and other jurisdictions where our providers
          operate.
        </p>
        <p>
          Where information is transferred outside the United States or the European Economic Area, we use an appropriate
          safeguard, such as Standard Contractual Clauses, and we assess the transfer. A copy of the safeguards we rely on can
          be requested by email.
        </p>
      </LegalSection>

      <LegalSection id="cookies" n="09" title="Cookies and analytics on this site">
        <p>
          This site does not set advertising cookies and does not embed third-party advertising or social tracking. The site is
          served as static files with no behavioural analytics.
        </p>
        <p>
          {HRBRIDGE.name}, which is a separate application at {HRBRIDGE.domain}, has its own cookie notice and privacy
          documentation covering the analytics it uses. Read that notice before using the software.
        </p>
      </LegalSection>

      <LegalSection id="children" n="10" title="Children">
        <p>
          These services are for businesses and for people of working age. We do not knowingly collect personal information
          from anyone under 16. If you believe a child has provided us with information, contact us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection id="changes" n="11" title="Changes to this policy">
        <p>
          We update this policy when our practices change. The &ldquo;last updated&rdquo; date at the top always reflects the
          current version. For material changes that affect how we use information you have already given us, we will notify
          you by email or through the service before the change takes effect.
        </p>
      </LegalSection>

      <LegalSection id="contact" n="12" title="How to contact us">
        <p>
          <b>{BRAND.legalName}</b>
          <br />
          {BRAND.address.line1}
          <br />
          {BRAND.address.line2}
          <br />
          {BRAND.address.country}
          <br />
          Email:{' '}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        </p>
        <p>
          Our UK representative, where required under UK data protection law, is{' '}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>. Our EU representative, where required under the GDPR, is{' '}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
