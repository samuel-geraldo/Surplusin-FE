import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth/useAuthStore';
import {
  AUTH_ROLES,
  AUTH_STEPS,
  buildRegisterPayload,
  decodeJwtPayload,
  getRoleDestination,
} from './authConstants';
import { getAuthErrorMessage, loginUser, registerUser } from './authApi';
import { AuthShell } from './components/AuthShell';
import { ForgotPasswordStep } from './components/ForgotPasswordStep';
import { LoginStep } from './components/LoginStep';
import { ProfileCompletionStep } from './components/ProfileCompletionStep';
import { RegisterAccountStep } from './components/RegisterAccountStep';
import { RoleSelectionStep } from './components/RoleSelectionStep';

const Motion = motion;

const initialProfileData = {
  name: '',
  category: '',
  whatsapp: '',
  address: '',
  locationConfirmed: false,
};

export function AuthFlow() {
  const reducedMotion = useReducedMotion();
  const setSession = useAuthStore((state) => state.setSession);
  const [step, setStep] = useState(AUTH_STEPS.ROLE_SELECTION);
  const [selectedRole, setSelectedRole] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [authResult, setAuthResult] = useState(null);
  const [submitState, setSubmitState] = useState({
    type: 'idle',
    message: '',
  });

  const isSubmitting = submitState.type === 'submitting';
  const isWide = step === AUTH_STEPS.ROLE_SELECTION;

  const currentRole = useMemo(
    () => selectedRole ?? AUTH_ROLES.RETAILER,
    [selectedRole],
  );

  function resetError() {
    setSubmitState({ type: 'idle', message: '' });
  }

  function handleRoleSelect(role) {
    resetError();
    setSelectedRole(role);
    setAccountData((current) => ({ ...current, role }));
    setStep(AUTH_STEPS.REGISTER_ACCOUNT);
  }

  async function handleLogin(values) {
    setSubmitState({ type: 'submitting', message: '' });

    try {
      const response = await loginUser(values);
      const accessToken = response.token;
      const decodedUser = decodeJwtPayload(accessToken);
      const user = decodedUser ?? { role: AUTH_ROLES.USER };
      const destination = getRoleDestination(user.role);

      setSession({ user, accessToken });
      setAuthResult({ destination, user });
      setStep(AUTH_STEPS.AUTHENTICATED);
      setSubmitState({ type: 'idle', message: '' });
      toast.success(response.message ?? 'Login berhasil');
    } catch (error) {
      setSubmitState({
        type: 'error',
        message: getAuthErrorMessage(error, 'Email atau password salah'),
      });
    }
  }

  function handleAccountNext(values) {
    resetError();
    setAccountData(values);
    setStep(AUTH_STEPS.PROFILE_COMPLETION);
  }

  async function handleProfileSubmit(values) {
    setSubmitState({ type: 'submitting', message: '' });
    setProfileData(values);

    try {
      const payload = buildRegisterPayload(accountData, values);
      const response = await registerUser(payload);

      setRegisteredUser(response.user);
      setStep(AUTH_STEPS.REGISTERED);
      setSubmitState({ type: 'idle', message: '' });
      toast.success(response.message ?? 'Registrasi berhasil');
    } catch (error) {
      setSubmitState({
        type: 'error',
        message: getAuthErrorMessage(error, 'Registrasi gagal'),
      });
    }
  }

  function renderStep() {
    if (step === AUTH_STEPS.LOGIN) {
      return (
        <LoginStep
          onSubmit={handleLogin}
          onForgotPassword={() => {
            resetError();
            setStep(AUTH_STEPS.FORGOT_PASSWORD);
          }}
          onRegister={() => {
            resetError();
            setStep(AUTH_STEPS.ROLE_SELECTION);
          }}
          isSubmitting={isSubmitting}
          error={submitState.type === 'error' ? submitState.message : ''}
        />
      );
    }

    if (step === AUTH_STEPS.FORGOT_PASSWORD) {
      return (
        <ForgotPasswordStep
          onBackToLogin={() => {
            resetError();
            setStep(AUTH_STEPS.LOGIN);
          }}
        />
      );
    }

    if (step === AUTH_STEPS.REGISTER_ACCOUNT) {
      return (
        <RegisterAccountStep
          role={currentRole}
          initialValues={accountData}
          onBack={() => {
            resetError();
            setStep(AUTH_STEPS.ROLE_SELECTION);
          }}
          onNext={handleAccountNext}
        />
      );
    }

    if (step === AUTH_STEPS.PROFILE_COMPLETION) {
      return (
        <ProfileCompletionStep
          role={currentRole}
          initialValues={profileData}
          onBack={() => {
            resetError();
            setStep(AUTH_STEPS.REGISTER_ACCOUNT);
          }}
          onSubmit={handleProfileSubmit}
          isSubmitting={isSubmitting}
          error={submitState.type === 'error' ? submitState.message : ''}
        />
      );
    }

    if (step === AUTH_STEPS.REGISTERED) {
      return (
        <StatusCard
          title="Registrasi Berhasil"
          message={`${registeredUser?.name ?? 'Akun'} berhasil dibuat. Silakan login untuk menyimpan token sesi.`}
          actionLabel="Masuk"
          onAction={() => setStep(AUTH_STEPS.LOGIN)}
        />
      );
    }

    if (step === AUTH_STEPS.AUTHENTICATED) {
      return (
        <StatusCard
          title="Login Berhasil"
          message={`Sesi tersimpan. Tujuan berikutnya: ${authResult?.destination ?? 'role-completion'}.`}
          actionLabel="Kembali ke Login"
          onAction={() => setStep(AUTH_STEPS.LOGIN)}
        />
      );
    }

    return (
      <RoleSelectionStep
        onSelectRole={handleRoleSelect}
        onLogin={() => setStep(AUTH_STEPS.LOGIN)}
      />
    );
  }

  return (
    <AuthShell wide={isWide}>
      <AnimatePresence mode="wait" initial={false}>
        <Motion.div
          key={step}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {renderStep()}
        </Motion.div>
      </AnimatePresence>
    </AuthShell>
  );
}

function StatusCard({ title, message, actionLabel, onAction }) {
  return (
    <Motion.div
      className="mx-auto w-full max-w-[460px] rounded-[20px] bg-white p-8 text-center shadow-[0_0_2px_rgba(0,0,0,0.25)]"
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="text-h1 font-extrabold text-[#0f172a]">{title}</h1>
      <p className="mt-3 text-body2 text-[#64748b]">{message}</p>
      <button
        type="button"
        className="mt-6 h-[56px] w-full rounded-2xl bg-orange-normal px-6 text-body2 font-bold text-white transition-colors hover:bg-orange-normal-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-normal"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </Motion.div>
  );
}
