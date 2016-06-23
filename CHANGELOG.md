# Showcase

* *[v0.11.1-rc1]*
  * [FIX]: Ensure the user does not get stuck on the password reset page
    after successfully resetting their password
  * [FIX]: Ensure users cannot submit the signup form without filling
    anything out

## v0.11.0 (June 21, 2016)
* *[v0.11.0-rc3]*
  * Add the industry CTR to the dashboard chart
* *[/v0.11.0-rc3]*

* *[v0.11.0-rc2]*
  * Initialize Intercom on page load for logged in user
  * Render CTR on the dashboard chart instead of clicks
  * Show CTR in the table on the dashboard
* *[/v0.11.0-rc2]*

* *[v0.11.0-rc1]*
  * [FIX]: Prevent failures that would occur if an API operation were to
    take a long time to complete
  * [FEATURE]: Add support for AdWords conversion tracking
  * [FEATURE]: Added redesigned stats page
  * [FEATURE]: Add Intercom tracking
* *[/v0.11.0-rc1]*

## v0.10.0 (June 9, 2016)
* *[v0.10.0-rc1]*
  * Added dynamic trial-length and impression number on plan info modal
* *[/v0.10.0-rc1]*

## v0.9.1 (June 9, 2016)
* *[v0.9.1-rc1]*
  *[FIX]: Fixed background position issue on pre-login screens
  *[FIX]: Fixed broken link to Terms of Service
* *[/v0.9.1-rc1]*

## v0.9.0 (June 8, 2016)
* *[v0.9.0-rc1]*
  * Add Hubspot tracking code
* *[/v0.9.0-rc1]*

## v0.8.0 (June 8, 2016)
* *[v0.8.0-rc1]*
  * Add proper page titles
* *[/v0.8.0-rc1]*

## v0.7.0 (June 7, 2016)
* *[v0.7.0-rc1]*
  * Change the autoadvance interval of the ad preview to 3 seconds
* *[/v0.7.0-rc1]*

## v0.6.0 (June 7, 2016)
* *[v0.6.0-rc1]*
  * [FEATURE]: Add support for autofilling the app search field if the
    user visited one of our landing pages
  * [FEATURE]: Add support for sending referreral codes on signup
* *[/v0.6.0-rc1]*

## v0.5.0 (June 6, 2016)
* *[v0.5.0-rc3]*
  * [FIX]: Final fix for FAQs link
* *[/v0.5.0-rc3]*

* *[v0.5.0-rc2]*
  * [FIX]: Updated FAQs link to open in new tab, fixed button width on billing
* *[/v0.5.0-rc2]*

* *[v0.5.0-rc1]*
  * [FIX]: Removed Views from analytics, replaced "Reach" with "Views".
  * [FIX]: Removed drop-down menu from the CampaignDetailBar
  * [FIX]: Created a Replace button for Delete.  Needs styling fix-ups.
  * [FIX]: Updated stats, alert messages and pricing table.
* *[/v0.5.0-rc1]*

## v0.4.0 (June 1, 2016)
* *[v0.4.0-rc1]*
  * [FEATURE]: Added persistent navigation
  * Updated styles for app based on the feedback
* *[/v0.4.0-rc1]*

## v0.3.0 (May 31, 2016)
* *[v0.3.0-rc1]*
  * [FIX]: Fixed x-axis label on 7 day charts (removed last label from far right)
  * [FEATURE]: Add the description to the creative preview
  * [FIX]: For for an issue that caused forms not to be cleared-out
    properly in the app
* *[/v0.3.0-rc1]*

## v0.2.0 (May 27, 2016)
* *[v0.2.0-rc1]*
  * [FEATURE]: Add a loading animation in the ad preview
  * [FIX]: Make sure the user can see their free trial length after
    signing up
  * [FIX]: Fix an issue where the name + description of a campaign could
    end up not being set
  * [FEATURE]: Add support for free trials that do not require a credit
    card
* *[/v0.2.0-rc1]*

## v0.1.0 (May 25, 2016)
* *[v0.1.0-rc10]*
  * Give new users a company
  * Setup default promotions in staging and production
* *[/v0.1.0-rc10]*

* *[v0.1.0-rc9]*
  * [FIX]: Fixed styles for pre-login screens, added logo
  * [FIX]: Added message for stats page when no stats available
  * [FEATURE]: Show categories on targeting screen
  * [FEATURE]: Added trial information modal
  * [FEATURE]: Hide some columns if looking at stats table on small screen
  * [FIX]: Added styles for braintree and preview modal
  * [FEATURE]: Added ad preview loading animation
  * Bumped up showcase-core version to 1.3.0
* *[/v0.1.0-rc9]*

* *[v0.1.0-rc8]*
  * [FIX]: Fixed resend confirmation page styles
  * [FIX]: Fixed tracking modal styles
  * [FEATURE]: Add CampaignDetailTable component
  * [FIX]: Added junit reporter + config to use it
  * Added error handling for data-loading on the campaign detail page
  * Added a 404 page
  * Updated DetailCharts and such for Dhaval
  * [FIX]: Fix for an issue that caused malformed campaigns to be
    created if the user already had a payment method
* *[/v0.1.0-rc8]*

* *[v0.1.0-rc7]*
  * [FEATURE]: Add ability to delete campaigns
  * [FEATURE]: Add ability to display instructions for setting-up
    install tracking
  * [FIX]: Make targeting selection work like it should on mobile
  * [FIX]: Allow users to login to resend their account confirmation
    email
* *[/v0.1.0-rc7]*

* *[v0.1.0-rc6]*
  * [FIX]: Allow users to create campaigns
* *[/v0.1.0-rc6]*

* *[v0.1.0-rc5]*
  * [FIX]: Make sure the redirect to the dashboard and other pages works
  * [FIX]: Fix for more S3 issues
* *[/v0.1.0-rc5]*

* *[v0.1.0-rc4]*
  * [FIX]: Fix for an issue that caused the user not to be able to log
    in
  * [FIX]: Make sure account links are not broken
  * [FIX]: Fix for another S3 deployement issue
* *[/v0.1.0-rc4]*

* *[v0.1.0-rc3]*
  * [FIX]: More S3 fixes
* *[/v0.1.0-rc3]*

* *[v0.1.0-rc2]*
  * [FIX]: Fix for an issue that caused the app not to deploy correctly
* *[/v0.1.0-rc2]*

* *[v0.1.0-rc1]*
  * [FEATURE]: Added ability to create an account
  * [FEATURE]: Added ability to manage an account
  * [FEATURE]: Added ability to create a campaign
  * [FEATURE]: Added ability to edit a campaign
  * [FEATURE]: Added initial stats page
* *[/v0.1.0-rc1]*
