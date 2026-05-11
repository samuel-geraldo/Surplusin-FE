export const viewportOnce = { once: true, amount: 0.24 };

export function createLandingVariants(reducedMotion) {
  const y = reducedMotion ? 0 : 18;
  const x = reducedMotion ? 0 : 24;
  const easeOut = [0.22, 1, 0.36, 1];

  return {
    heroContainer: {
      hidden: {},
      visible: {
        transition: {
          when: 'beforeChildren',
          staggerChildren: reducedMotion ? 0 : 0.1,
          delayChildren: reducedMotion ? 0 : 0.08,
        },
      },
    },
    heroBadge: {
      hidden: { opacity: 0, y: reducedMotion ? 0 : 10, scale: reducedMotion ? 1 : 0.96 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.48, ease: easeOut },
      },
    },
    heroTitleMask: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reducedMotion ? 0 : 0.08,
          delayChildren: reducedMotion ? 0 : 0.12,
        },
      },
    },
    heroTitleItem: {
      hidden: {
        opacity: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : '105%',
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.72, ease: easeOut },
      },
    },
    heroHighlight: {
      hidden: {
        opacity: 0,
        scale: reducedMotion ? 1 : 0.96,
        textShadow: '0 0 0 rgba(80, 200, 120, 0)',
      },
      visible: {
        opacity: 1,
        scale: 1,
        textShadow: reducedMotion ? '0 0 0 rgba(80, 200, 120, 0)' : '0 10px 32px rgba(80, 200, 120, 0.24)',
        transition: { delay: reducedMotion ? 0 : 0.22, duration: 0.48, ease: easeOut },
      },
    },
    heroDescription: {
      hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.58, ease: easeOut },
      },
    },
    heroCta: {
      hidden: { opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.97 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: easeOut },
      },
    },
    heroGlow: {
      hidden: { opacity: 0, scale: reducedMotion ? 1 : 0.96 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { delay: reducedMotion ? 0 : 0.02, duration: 0.75, ease: easeOut },
      },
    },
    heroImageReveal: {
      hidden: {
        opacity: 0,
        scale: reducedMotion ? 1 : 1.04,
        clipPath: reducedMotion ? 'inset(0% 0% 0% 0%)' : 'inset(9% 7% 12% 7% round 2.5rem)',
      },
      visible: {
        opacity: 1,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0% round 2.5rem)',
        transition: { delay: reducedMotion ? 0 : 0.35, duration: 0.88, ease: easeOut },
      },
    },
    reportCardEntrance: {
      hidden: {
        opacity: 0,
        x: '-50%',
        y: reducedMotion ? '-50%' : '-38%',
        scale: reducedMotion ? 1 : 0.94,
        rotateX: reducedMotion ? 0 : 5,
        rotateY: reducedMotion ? 0 : -4,
      },
      visible: {
        opacity: 1,
        x: '-50%',
        y: '-50%',
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        transition: {
          delay: reducedMotion ? 0 : 0.72,
          duration: reducedMotion ? 0 : 0.78,
          ease: easeOut,
        },
      },
    },
    reportCardFloat: reducedMotion
      ? {}
      : {
          y: [0, -6, 0],
          transition: { duration: 5.6, repeat: Infinity, ease: 'easeInOut' },
        },
    fadeUp: {
      hidden: { opacity: 0, y },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: easeOut },
      },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.55, ease: 'easeOut' },
      },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: reducedMotion ? 1 : 0.97 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: easeOut },
      },
    },
    staggerContainer: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reducedMotion ? 0 : 0.11,
          delayChildren: reducedMotion ? 0 : 0.05,
        },
      },
    },
    imageReveal: {
      hidden: {
        opacity: 0,
        scale: reducedMotion ? 1 : 1.03,
        clipPath: reducedMotion ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 10% 0%)',
      },
      visible: {
        opacity: 1,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        transition: { duration: 0.8, ease: easeOut },
      },
    },
    cardReveal: {
      hidden: { opacity: 0, y: reducedMotion ? 0 : 22, scale: reducedMotion ? 1 : 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.62, ease: easeOut },
      },
    },
    cardHover: reducedMotion
      ? {}
      : {
          y: -6,
          boxShadow: '0 22px 52px rgba(15, 23, 42, 0.12)',
          borderColor: 'rgba(80, 200, 120, 0.38)',
          transition: { duration: 0.24, ease: 'easeOut' },
        },
    fromLeft: {
      hidden: { opacity: 0, x: -x },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: easeOut },
      },
    },
    fromRight: {
      hidden: { opacity: 0, x },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: easeOut },
      },
    },
  };
}
