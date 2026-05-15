import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import { loginSchema } from '../authSchemas';
import { AuthCard } from './AuthCard';
import { AuthDivider } from './AuthDivider';
import { GoogleAuthButton } from './GoogleAuthButton';

export function LoginStep({
  role,
  onSubmit,
  onForgotPassword,
  onRegister,
  isSubmitting,
  error,
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <AuthCard className="mx-auto max-w-[460px] px-8 py-8 sm:px-8">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="text-center">
          <h1 className="text-[30px] font-extrabold tracking-normal text-black">
            Selamat Datang
          </h1>
        </div>

        {error && (
          <p className="rounded-xl bg-red-light p-3 text-body2 text-red-dark">
            {error}
          </p>
        )}

        <Input
          placeholder="Masukkan alamat email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          error={errors.email?.message}
          className="h-[56px] rounded-lg px-4 text-body2"
          {...register('email')}
        />
        <Input
          type="password"
          placeholder="Masukkan kata sandi"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          error={errors.password?.message}
          className="h-[56px] rounded-lg px-4 text-body2"
          {...register('password')}
        />

        <div className="text-right">
          <button
            type="button"
            className="text-body2 font-bold text-[#059669] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-normal"
            onClick={onForgotPassword}
          >
            Lupa sandi?
          </button>
        </div>

        <Button
          type="submit"
          variant="secondary"
          disabled={isSubmitting}
          className="h-[56px] w-full rounded-xl text-body2"
        >
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </Button>

        <AuthDivider />
        <GoogleAuthButton role={role} className="h-[56px]">
          Masuk dengan Google
        </GoogleAuthButton>

        <p className="text-center text-body2 text-[#64748b]">
          Belum punya akun?{' '}
          <button
            type="button"
            className="font-bold text-[#059669] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-normal"
            onClick={onRegister}
          >
            Daftar
          </button>
        </p>
      </form>
    </AuthCard>
  );
}
