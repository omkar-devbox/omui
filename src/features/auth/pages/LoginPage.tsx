
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Welcome Back
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Sign in to your OMUI account
        </p>
      </div>
      <LoginForm />
    </div>
  );
};
