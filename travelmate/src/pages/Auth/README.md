# Auth Pages

Authentication-related pages for TravelMate.

## Structure

- **Pages**
  - `Login.tsx`: Renders the login page and uses the `LoginForm` component.
  - `Register.tsx`: Renders the registration page and uses the `RegisterForm` component.
  - `VerifyEmail.tsx`: Renders the email verification page and uses the `VerifyEmailForm` component.
  - `ForgetPassword.tsx`: Renders the forgot password page and uses the `ForgetPasswordForm` component.
  - `ResetPassword.tsx`: Renders the reset password page and uses the `ResetPasswordForm` component.

- **Components** (in `components/`)
  - `LoginForm.tsx`: Contains the login form logic and UI.
  - `RegisterForm.tsx`: Contains the registration form logic and UI.
  - `VerifyEmailForm.tsx`: Contains the email verification logic and UI.
  - `ForgetPasswordForm.tsx`: Contains the forgot password form logic and UI (email input only).
  - `ResetPasswordForm.tsx`: Contains the reset password form logic and UI (new password and confirm password fields).

## Usage
- Each page imports its respective form component from the `components` directory for a clean separation of concerns.
- All authentication logic and UI are encapsulated in their respective form components for easier maintenance and reusability.

## How to add a new Auth form
1. Create a new form component in the `components/` directory.
2. Import and use it in the corresponding page file.

---

This structure improves code organization and makes it easier to maintain and extend authentication features.
