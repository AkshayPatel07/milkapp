# SMS / OTP delivery

OTP verification works via `app/api/auth/otp/*` routes and stores OTP hashes in `app_otp_requests`.

Delivery is configurable:

- `APP_OTP_DEV_MODE=true` returns `dev_otp` in the API response (dev-only).
- `APP_SMS_PROVIDER=console` logs OTP to the server console.
- `APP_SMS_PROVIDER=twilio` sends OTP via Twilio.
- `APP_SMS_PROVIDER=2factor` sends OTP via 2Factor (AUTOGEN + VERIFY).

## Twilio env vars

- `APP_SMS_PROVIDER=twilio`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM` (E.164 sender) **or** `TWILIO_MESSAGING_SERVICE_SID`
- Optional: `APP_OTP_SMS_TEMPLATE` (supports `{otp}` and `{minutes}`)

## 2Factor env vars

- `APP_SMS_PROVIDER=2factor`
- `TWOFACTOR_API_KEY`
- Optional: `TWOFACTOR_OTP_TEMPLATE` (DLT template name for AUTOGEN)
- Optional: `TWOFACTOR_MODE=autogen|custom` (default `autogen`; `custom` sends your OTP via SMS and verifies locally)
- Optional: `TWOFACTOR_BASE_URL` (defaults to `https://2factor.in/API/V1`)
- Optional: `APP_OTP_LENGTH` (default `6`, min `4`, max `8`)
- Optional: `APP_OTP_EXPIRES_MINUTES` (default `5`, min `1`, max `30`)
