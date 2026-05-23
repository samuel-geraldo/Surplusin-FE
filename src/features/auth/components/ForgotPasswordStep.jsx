import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { AuthCard } from './AuthCard';

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Wajib diisi').email('Email tidak valid'),
});

export function ForgotPasswordStep({ onBackToLogin }) {
  const {
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function handleRecoveryRequest(values) {
    const subject = encodeURIComponent('Permintaan Pemulihan Akun SurplusIn');
    const body = encodeURIComponent(
      `Halo Tim SurplusIn,\n\nSaya ingin mengajukan pemulihan akun.\n\nEmail akun: ${values.email}\n\nTerima kasih.`,
    );

    window.location.assign(`mailto:support@surplusin.id?subject=${subject}&body=${body}`);
  }

  return (
    <AuthCard>
      <form className="space-y-5" onSubmit={handleSubmit(handleRecoveryRequest)}>
        <div className="text-center">
          <h1 className="text-h1 font-extrabold tracking-normal text-[#0f172a]">
            Pemulihan Akun
          </h1>
          <p className="mt-3 text-body2 text-[#64748b]">
            Masukkan email Anda untuk mengirim permintaan pemulihan akun.
          </p>
        </div>

        {isSubmitSuccessful && (
          <p className="rounded-xl bg-[#eefaf2] p-3 text-body2 text-[#047857]">
            Aplikasi email terbuka dengan format permintaan pemulihan. Kirim
            email tersebut agar tim SurplusIn dapat memproses verifikasi akun.
          </p>
        )}

        <Input
          label="Email"
          placeholder="Masukkan alamat email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="secondary"
          className="h-[56px] w-full rounded-2xl text-body2"
        >
          Kirim Permintaan Pemulihan
        </Button>

        <button
          type="button"
          className="mx-auto block text-body2 font-bold text-[#059669] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-normal"
          onClick={onBackToLogin}
        >
          Kembali ke Halaman Login
        </button>

        <div className="rounded-2xl bg-[#eefaf2] p-4 text-center">
          <p className="text-body2 font-bold text-[#0f172a]">
            Butuh bantuan lebih lanjut?
          </p>
          <p className="text-label text-[#64748b]">
            Hubungi tim support kami di support@surplusin.id
          </p>
        </div>
      </form>
    </AuthCard>
  );
}

