import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui';
import penerimaImage from '@/assets/auth/penerima.png';
import penyalurImage from '@/assets/auth/penyalur.png';
import { AUTH_ROLES, ROLE_OPTIONS } from '../authConstants';
import { AuthCard } from './AuthCard';

const Motion = motion;

const roleImages = {
  [AUTH_ROLES.RETAILER]: penyalurImage,
  [AUTH_ROLES.RECIPIENT]: penerimaImage,
};

export function RoleSelectionStep({ onSelectRole, onLogin }) {
  const reducedMotion = useReducedMotion();

  return (
    <div>
      <Motion.div
        className="text-center"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
      >
        <h1 className="text-[40px] font-extrabold leading-tight tracking-normal text-black">
          Pilih Peran Anda
        </h1>
        <p className="mx-auto mt-3 max-w-[520px] text-body2 font-normal text-[#64748b]">
          Bergabunglah dalam misi kami untuk mempercepat sirkulasi pangan dan
          mengurangi limbah.
        </p>
      </Motion.div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:gap-[82px]">
        {ROLE_OPTIONS.map((role, index) => (
          <Motion.div
            key={role.value}
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{
              delay: reducedMotion ? 0 : 0.08 + index * 0.08,
              duration: 0.36,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={
              reducedMotion
                ? undefined
                : {
                    y: -6,
                    boxShadow: '0 18px 38px rgba(15,23,42,0.12)',
                  }
            }
            className="h-full rounded-xl"
          >
          <AuthCard className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl p-0">
            <div className="mx-2.5 mt-2.5 h-[165px] overflow-hidden rounded-t-xl bg-[#eefaf2]">
              <Motion.img
                src={roleImages[role.value]}
                alt=""
                className="h-full w-full object-cover"
                aria-hidden="true"
                whileHover={reducedMotion ? undefined : { scale: 1.035 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 px-2.5 py-3">
              <h2 className="flex items-center gap-3 text-[24px] font-extrabold leading-tight text-black">
                <RoleIcon role={role.value} />
                {role.label}
              </h2>
              <p className="text-body2 text-[#0f172a]">{role.description}</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mx-2.5 mb-2.5 h-[48px] w-[calc(100%-1.25rem)] rounded-xl text-body2"
              onClick={() => onSelectRole(role.value)}
            >
              {role.cta}
            </Button>
          </AuthCard>
          </Motion.div>
        ))}
      </div>

      <Motion.div
        className="mt-8"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: 1 }}
        transition={{ delay: 0.32, duration: 0.25 }}
      >
        <ProgressDots activeIndex={0} />
      </Motion.div>

      <Motion.p
        className="mt-8 text-center text-body2 text-black"
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.25 }}
      >
        Sudah punya akun?{' '}
        <button
          type="button"
          className="font-bold text-[#059669] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-normal"
          onClick={onLogin}
        >
          Masuk
        </button>
      </Motion.p>
    </div>
  );
}

function RoleIcon({ role }) {
  if (role === AUTH_ROLES.RETAILER) {
    return (
      <svg
        className="size-7 shrink-0 text-[#3b9b5b]"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5 6h22l2 7H3l2-7Z" />
        <path d="M5 14h22v12h-4v-7h-5v7H5V14Zm4 4v4h6v-4H9Z" />
      </svg>
    );
  }

  return (
    <svg
      className="size-7 shrink-0 text-[#ff3f3f]"
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 27S5 20.3 5 12.2C5 8.6 7.7 6 11.2 6c2 0 3.8 1 4.8 2.6C17 7 18.8 6 20.8 6 24.3 6 27 8.6 27 12.2 27 20.3 16 27 16 27Z" />
    </svg>
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
