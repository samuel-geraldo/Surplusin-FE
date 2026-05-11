import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import { registerAccountSchema } from '../authSchemas';
import { AuthCard } from './AuthCard';
import { AuthDivider } from './AuthDivider';
import { GoogleAuthButton } from './GoogleAuthButton';

export function RegisterAccountStep({
  role,
  initialValues,
  onBack,
  onNext,
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(registerAccountSchema),
    defaultValues: {
      email: initialValues?.email ?? '',
      password: initialValues?.password ?? '',
      age: initialValues?.age ?? 1,
      role,
    },
  });

  return (
    <div className="space-y-4">
      <AuthCard className="mx-auto max-w-[460px] px-8 py-8 sm:px-8">
      <form className="space-y-5" onSubmit={handleSubmit(onNext)}>
        <div className="text-center">
          <h1 className="text-[24px] font-extrabold leading-tight tracking-normal text-black">
            {role === 'retailer'
              ? 'Informasi Akun Retailer'
              : 'Informasi Akun Penerima'}
          </h1>
        </div>

        <GoogleAuthButton className="h-[56px] rounded-lg text-body2">
          Daftar dengan Google
        </GoogleAuthButton>
        <AuthDivider />

        <input type="hidden" {...register('role')} />
        <input type="hidden" {...register('age')} />
        <Input
          placeholder="Masukkan alamat email"
          autoComplete="email"
          error={errors.email?.message}
          className="h-[56px] rounded-lg px-4 text-body2"
          {...register('email')}
        />
        <Input
          type="password"
          placeholder="Masukkan kata sandi"
          autoComplete="new-password"
          error={errors.password?.message}
          className="h-[56px] rounded-lg px-4 text-body2"
          {...register('password')}
        />

        <div className="grid grid-cols-[1fr_1.4fr] items-center gap-4 pt-5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-[38px] rounded-xl bg-transparent px-0 text-label font-medium shadow-none hover:bg-transparent"
            onClick={onBack}
          >
            Kembali
          </Button>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="h-[56px] rounded-xl text-body2"
          >
            Lanjut
          </Button>
        </div>
      </form>
      </AuthCard>
      <ProgressDots activeIndex={1} />
    </div>
  );
}

function ProgressDots({ activeIndex }) {
  return (
    <div className="flex justify-center gap-2" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={
            index === activeIndex
              ? 'size-2 rounded-full bg-green-normal'
              : 'size-2 rounded-full bg-[#b7b7b7]'
          }
        />
      ))}
    </div>
  );
}
