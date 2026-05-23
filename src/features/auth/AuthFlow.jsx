import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
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
import {
  createRoleProfile,
  getAuthErrorMessage,
  hasRoleProfile,
  loginUser,
  registerUser,
} from './authApi';
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
  latitude: undefined,
  longitude: undefined,
  locationConfirmed: false,
};

function getGoogleCallbackData(searchParams) {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const getParam = (key) => searchParams.get(key) ?? hashParams.get(key);
  const token = getParam('token');

  if (!token) {
    return null;
  }

  const decodedUser = decodeJwtPayload(token);
  const backendRole = decodedUser?.role ?? getParam('role');
  const role =
    backendRole === 'penerima' ? AUTH_ROLES.RECIPIENT : AUTH_ROLES.RETAILER;
  const user = {
    ...decodedUser,
    email: getParam('email') ?? decodedUser?.email,
    role: backendRole,
  };

  return {
    token,
    user,
    accountData: {
      email: user.email ?? '',
      role,
      backendRole,
      userId: decodedUser?.id,
      isGoogleProfile: true,
    },
  };
}

export function AuthFlow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const setSession = useAuthStore((state) => state.setSession);
  const storedAccessToken = useAuthStore((state) => state.accessToken);
  const storedUser = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const googleCallbackData = useMemo(
    () => getGoogleCallbackData(searchParams),
    [searchParams],
  );
  const [step, setStep] = useState(() =>
    googleCallbackData
      ? AUTH_STEPS.PROFILE_COMPLETION
      : AUTH_STEPS.ROLE_SELECTION,
  );
  const [selectedRole, setSelectedRole] = useState(
    () => googleCallbackData?.accountData.role ?? null,
  );
  const [accountData, setAccountData] = useState(
    () => googleCallbackData?.accountData ?? null,
  );
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

  useEffect(() => {
    if (!googleCallbackData) {
      return;
    }

    let cancelled = false;

    async function resolveGoogleCallback() {
      setSession({
        user: googleCallbackData.user,
        accessToken: googleCallbackData.token,
      });
      window.history.replaceState(null, '', window.location.pathname);

      const profileExists = await hasRoleProfile(googleCallbackData.user.role);

      if (cancelled) {
        return;
      }

      if (profileExists) {
        const destination = getRoleDestination(googleCallbackData.user.role);
        setAuthResult({ destination, user: googleCallbackData.user });
        setStep(AUTH_STEPS.AUTHENTICATED);
        toast.success('Login berhasil');
        navigate(destination, { replace: true });
      }
    }

    resolveGoogleCallback();

    return () => {
      cancelled = true;
    };
  }, [googleCallbackData, navigate, setSession]);

  useEffect(() => {
    if (!isHydrated || googleCallbackData || !storedAccessToken) {
      return;
    }

    navigate(getRoleDestination(storedUser?.role), { replace: true });
  }, [googleCallbackData, isHydrated, navigate, storedAccessToken, storedUser?.role]);

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
      const user = decodedUser ?? { role: currentRole };
      const destination = getRoleDestination(user.role);

      setSession({ user, accessToken });
      setAuthResult({ destination, user });
      setStep(AUTH_STEPS.AUTHENTICATED);
      setSubmitState({ type: 'idle', message: '' });
      toast.success(response.message ?? 'Login berhasil');
      navigate(destination, { replace: true });
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
      let user = null;
      let response = null;

      if (accountData?.isGoogleProfile) {
        response = await createRoleProfile({
          role: accountData.backendRole,
          userId: accountData.userId,
          profileData: values,
        });
        user = {
          id: accountData.userId,
          email: accountData.email,
          role: accountData.backendRole,
        };
      } else {
        response = await registerUser(payload);
        const sessionResponse = await loginUser({
          email: accountData.email,
          password: accountData.password,
        });
        const accessToken = sessionResponse.token;
        user = decodeJwtPayload(accessToken) ?? response.user;

        setSession({ user, accessToken });

        await createRoleProfile({
          role: user.role,
          userId: user.id,
          profileData: values,
        });
      }

      const destination = getRoleDestination(user?.role ?? accountData?.role);

      setRegisteredUser(user ?? response.user ?? response);
      setSubmitState({ type: 'idle', message: '' });
      toast.success(response.message ?? 'Registrasi berhasil');
      navigate(destination, { replace: true });
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
          role={currentRole}
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
        <Navigate
          to={getRoleDestination(registeredUser?.role ?? accountData?.role)}
          replace
        />
      );
    }

    if (step === AUTH_STEPS.AUTHENTICATED) {
      return (
        <Navigate
          to={authResult?.destination ?? getRoleDestination(currentRole)}
          replace
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
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={reducedMotion ? undefined : { opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
        >
          {renderStep()}
        </Motion.div>
      </AnimatePresence>
    </AuthShell>
  );
}
