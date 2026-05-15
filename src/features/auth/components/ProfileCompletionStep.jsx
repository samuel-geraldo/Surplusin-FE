import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select } from '@/components/ui';
import { AUTH_ROLES, PROFILE_CATEGORY_OPTIONS } from '../authConstants';
import { profileSchema } from '../authSchemas';
import { AuthCard } from './AuthCard';
import { LocationPicker } from './LocationPicker';

export function ProfileCompletionStep({
  role,
  initialValues,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}) {
  const isRetailer = role === AUTH_ROLES.RETAILER;
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      category: initialValues?.category ?? '',
      whatsapp: initialValues?.whatsapp ?? '',
      address: initialValues?.address ?? '',
      latitude: initialValues?.latitude,
      longitude: initialValues?.longitude,
      locationConfirmed: initialValues?.locationConfirmed ?? false,
    },
  });
  const confirmed = useWatch({ control, name: 'locationConfirmed' });

  return (
    <div className="space-y-4">
      <AuthCard className="mx-auto max-w-[550px] px-7 py-8 sm:px-7">
        <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
          <div className="text-left">
            <h1 className="text-[24px] font-extrabold tracking-normal text-black">
              {isRetailer
                ? 'Lengkapi Profil Toko/Usaha'
                : 'Lengkapi Profil Instansi'}
            </h1>
            <p className="mt-2 text-body2 text-[#64748b]">
              Beritahu kami lebih lanjut tentang lokasi dan operasional Anda.
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-red-light p-3 text-body2 text-red-dark">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder={
                isRetailer ? 'Masukkan nama toko' : 'Masukkan nama instansi'
              }
              error={errors.name?.message}
              className="h-[56px] rounded-lg px-4 text-body2"
              {...register('name')}
            />
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  options={PROFILE_CATEGORY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pilih Kategori"
                  triggerClassName="h-[56px] rounded-lg text-body2"
                />
              )}
            />
          </div>

          <Input
            placeholder="Masukkan nomor whatsapp"
            inputMode="tel"
            error={errors.whatsapp?.message}
            className="h-[56px] rounded-lg px-4 text-body2"
            {...register('whatsapp')}
          />

          <LocationPicker
            register={register}
            confirmed={confirmed}
            setValue={setValue}
          />

          <div className="grid grid-cols-[1fr_1.8fr] items-center gap-4 pt-1">
            <Button
              type="button"
              variant="ghost"
              className="h-[56px] rounded-xl bg-white px-5 text-body2 font-medium shadow-none hover:bg-white active:bg-green-light-active"
              onClick={onBack}
            >
              Kembali
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              className="h-[56px] rounded-xl text-body2"
            >
              {isSubmitting ? 'Memproses...' : 'Selesaikan Pendaftaran'}
            </Button>
          </div>
        </form>
      </AuthCard>
      <ProgressDots activeIndex={2} />
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
