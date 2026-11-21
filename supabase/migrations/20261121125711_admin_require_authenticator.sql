-- Defense in depth: existing read policies must also require a verified second factor.
-- Service-role backend access remains protected by requireAdmin's AAL2 check.
create policy require_mfa_contacts on public.contacts
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');
create policy require_mfa_contact_replies on public.contact_replies
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');
