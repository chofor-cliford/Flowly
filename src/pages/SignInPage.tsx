import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="auth">
    <SignIn
      path={`${import.meta.env.VITE_CLERK_SIGN_IN_URL}`}
      routing="path"
      signUpUrl={`${import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL}`}
    />
  </div>
);

export default SignInPage;
