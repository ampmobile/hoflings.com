import React from 'react';
import { LegalPage, LegalSection } from '../components/Legal.jsx';
import { BRAND, HRBRIDGE } from '../data/content.js';

export default function Terms() {
  return (
    <LegalPage
      crumb="Terms"
      kicker="Legal"
      title="Terms of service."
      lede="The agreement between you and Hoflings Ltd. If you are contracting with us, the signed service agreement governs and these terms sit underneath it."
      updated="12 November 2026"
    >
      <LegalSection id="agreement" n="01" title="The agreement">
        <p>
          These Terms of Service (the &ldquo;Terms&rdquo;) govern your use of {BRAND.domain} and any services provided by{' '}
          {BRAND.legalName} (&ldquo;Hoflings&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) unless a separate written agreement
          applies.
        </p>
        <p>
          Where you have signed a service agreement, statement of work, order form or data processing agreement with us, that
          document is the agreement between us and governs the services. These Terms apply to it as the default rules, except
          where the signed document says otherwise. Where these Terms conflict with a signed document, the signed document
          wins.
        </p>
        <p>
          By using this site you accept these Terms. If you do not accept them, do not use the site.
        </p>
      </LegalSection>

      <LegalSection id="services" n="02" title="What we provide">
        <p>
          Hoflings provides AI-assisted recruiting, onboarding and human resources services to transportation, shipping,
          freight and delivery operators in the United States and Canada. {HRBRIDGE.name} is our software product, operated
          by {BRAND.legalName} and published at {HRBRIDGE.domain}.
        </p>
        <p>
          Our services include, depending on the engagement: candidate sourcing, screening and assessment, voice and written
          screening, qualification file assembly, onboarding and compliance documentation, payroll and benefits setup support,
          credential tracking and expiry management, and related advisory.
        </p>
        <p>
          We provide services; we do not employ the drivers, workers or staff you hire. Employment decisions, offers,
          discipline and termination remain your responsibility as the hiring employer or client. Nothing in our services is
          legal advice, and nothing we publish is a substitute for advice from your own counsel.
        </p>
      </LegalSection>

      <LegalSection id="ai-automation" n="03" title="AI, automation and human review">
        <p>
          Our services use artificial intelligence to screen applications, conduct voice and written screening, score evidence
          and assemble records. We apply the following commitments:
        </p>
        <ul>
          <li>
            <b>A human reviews the outcome.</b> We do not make a hiring decision, or any other decision with legal or
            similarly significant effect, solely by automated means. Every candidate outcome is presented to a person with the
            reasoning and evidence attached.
          </li>
          <li>
            <b>The reasoning is shown.</b> Where a screening result is adverse or affects a candidate&rsquo;s chances, the
            underlying reason is provided so it can be explained, challenged and corrected.
          </li>
          <li>
            <b>Criteria are job-related.</b> Screening questions are derived from the requirements of the role and from
            documented legal requirements, and are reviewed for disparate impact.
          </li>
          <li>
            <b>Accuracy limits are acknowledged.</b> Automated voice and language screening is imperfect. We do not use it as
            the sole basis for disqualifying an applicant, and we correct errors when they are identified.
          </li>
          <li>
            <b>Humans are available.</b> You can reach a person at {BRAND.email} at any time, including to challenge a
            result.
          </li>
        </ul>
        <p>
          The hiring client remains responsible for the decisions it makes, for the fairness of its own criteria and for
          compliance with employment and anti-discrimination law applicable to it.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" n="04" title="Your obligations">
        <p>When you use this site or our services, you agree that:</p>
        <ul>
          <li>You are at least 18 years old and authorised to enter into a binding agreement.</li>
          <li>
            Information you give us is accurate and complete, and you will tell us promptly if it changes. We rely on it to
            make compliance determinations and to build qualification files.
          </li>
          <li>
            You will not use the site or the services to discriminate on any basis prohibited by law, to screen on a
            characteristic unrelated to the role, or to submit information you know to be false.
          </li>
          <li>You will keep your account credentials confidential and tell us if they are compromised.</li>
          <li>You will comply with applicable law, including employment, privacy, safety and transport regulation.</li>
          <li>
            You will not attempt to disrupt, probe or gain unauthorised access to the site or services, and you will not
            reverse engineer the software except where that restriction is prohibited by law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="fees" n="05" title="Fees and payment">
        <p>
          Fees, invoicing terms and payment timing are set out in your signed agreement, order form or statement of work.
          Except where the signed document says otherwise, fees are exclusive of applicable taxes and are payable within the
          stated period. Late amounts may accrue interest at the rate permitted by law.
        </p>
        <p>
          Recurring fees are billed in advance. Either party may terminate for material breach that is not cured within thirty
          days of written notice. On termination, fees for services performed up to the termination date are payable.
        </p>
        <p>
          Refunds are governed by the cancellation terms in your agreement. Where a service has been performed and the
          underlying cost has been incurred, we may decline a refund. Nothing here limits rights you have under a signed
          agreement or under applicable law.
        </p>
      </LegalSection>

      <LegalSection id="client-data" n="06" title="Your data and your record">
        <p>
          You retain all right, title and interest in the candidate, credential and employment data you provide to us and in
          the records we produce for you. We use it only to perform the services.
        </p>
        <ul>
          <li>
            <b>The record belongs to you.</b> You can export it in a structured, commonly used format at any time, and you
            can take it with you if you leave.
          </li>
          <li>
            <b>You set the retention rules.</b> We delete or anonymise data when the retention period you specify ends, or
            when a statutory period expires, whichever applies.
          </li>
          <li>
            <b>We act as a processor.</b> Where we process candidate or employee personal information on your instructions,
            our data processing terms apply, and you act as the controller.
          </li>
          <li>
            <b>No training on your records.</b> We do not use your candidate or employee data to train general-purpose models.
          </li>
        </ul>
        <p>
          Our handling of personal information is described in the <a href="/privacy.html">Privacy Policy</a>.
        </p>
      </LegalSection>

      <LegalSection id="ip" n="07" title="Intellectual property">
        <p>
          We own the {BRAND.name} brand, the {HRBRIDGE.name} software, the platform, the source code, the screening models,
          the question libraries and all associated documentation, together with any modifications, feedback we incorporate or
          derivative works. We own or license all underlying intellectual property, including our AI models, screening
          methodology and workflow templates.
        </p>
        <p>
          We grant you a limited, non-exclusive, non-transferable, revocable licence to use the services for your internal
          business purposes during the term, and a right to use our deliverables in the course of your own business.
        </p>
        <p>
          You keep all rights in content you provide. You grant us the licence needed to host, process and transmit it in order
          to deliver the services.
        </p>
      </LegalSection>

      <LegalSection id="third-party" n="08" title="Third-party services and links">
        <p>
          Our services incorporate third-party providers for telephony, messaging, identity and background verification,
          right-to-work and credential verification, e-signature, hosting and analytics. Their processing of your data is
          subject to their own terms and our data processing agreements with them, and we remain responsible for our own
          obligations.
        </p>
        <p>
          This site links to third-party sites, including {HRBRIDGE.domain}, regulatory publications and industry reporting.
          We do not control those sites and are not responsible for their content, accuracy or practices. A link is not an
          endorsement.
        </p>
      </LegalSection>

      <LegalSection id="liability" n="09" title="Disclaimers and liability">
        <p>
          The services are provided on a professional-effort basis. Except as expressly stated, we disclaim all implied
          warranties, including merchantability, fitness for a particular purpose and non-infringement, to the fullest extent
          permitted by law.
        </p>
        <p>
          We do not warrant that use of the services will produce a particular hiring outcome, a particular turnover figure, a
          particular cost saving, or compliance with a specific regulation. The information published on this site is
          general industry information and is not legal, regulatory or employment advice. Regulations change; verify the
          current text against the source we link before you rely on it.
        </p>
        <p>
          To the fullest extent permitted by law, neither party is liable for indirect, incidental, special, consequential or
          punitive damages, or for lost profits, revenue or opportunity, arising out of these Terms or the services. Our total
          aggregate liability is limited to the fees paid or payable by you in the twelve months preceding the event giving
          rise to the claim.
        </p>
        <p>
          Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, for fraud or
          fraudulent misrepresentation, for anything else that cannot lawfully be excluded, or for obligations under your
          signed agreement.
        </p>
      </LegalSection>

      <LegalSection id="indemnity" n="10" title="Indemnity">
        <p>
          Each party agrees to indemnify the other against third-party claims to the extent they arise from that party&rsquo;s
          own breach of these Terms, its negligence, its violation of law, or its infringement of the other party&rsquo;s
          intellectual property rights. The indemnity in your signed agreement, if any, governs instead.
        </p>
      </LegalSection>

      <LegalSection id="termination" n="11" title="Termination and suspension">
        <p>
          We may suspend or terminate access immediately where use of the services would breach law, infringe the rights of
          others, compromise the security of the platform or the personal data of others, or where the engagement has ended.
          Where time permits, we will tell you why.
        </p>
        <p>
          On termination, we will make your data available for export for the period stated in your agreement or, in the
          absence of a stated period, for thirty days, and then delete it in accordance with the retention terms.
        </p>
      </LegalSection>

      <LegalSection id="law" n="12" title="Governing law and disputes">
        <p>
          These Terms are governed by the laws of the State of New Jersey, United States, without regard to conflict-of-law
          principles. The courts of New Jersey have exclusive jurisdiction, unless your signed agreement provides otherwise.
        </p>
        <p>
          Before starting proceedings, the parties will attempt in good faith to resolve the dispute by discussion between
          people with authority to settle it. We do not operate a binding arbitration scheme for consumer customers where
          applicable consumer law requires the right to bring claims in court.
        </p>
      </LegalSection>

      <LegalSection id="general" n="13" title="General">
        <p>
          These Terms are the entire agreement on their subject and supersede prior discussions. If a provision is found
          unenforceable, it is severed to the minimum extent and the remainder continues in effect. A waiver on one occasion is
          not a waiver on another. You may not assign your rights without our written consent; we may assign these Terms as
          part of a merger, reorganisation or sale of substantially all of our assets, on notice to you.
        </p>
        <p>
          If you are a consumer resident in the United Kingdom or the European Economic Area, statutory consumer rights apply in
          addition to these Terms and are not limited by the liability provisions above.
        </p>
      </LegalSection>

      <LegalSection id="changes" n="14" title="Changes to these Terms">
        <p>
          We may update these Terms. The &ldquo;last updated&rdquo; date at the top reflects the current version. Where a change
          materially affects your rights, we will notify you by email or through the service before it takes effect. Continuing to
          use the services after the effective date means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" n="15" title="How to contact us">
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
          Questions about these Terms can be sent to that address. To start a commercial conversation, use the{' '}
          <a href="/contact.html">contact page</a> or book a walkthrough.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
