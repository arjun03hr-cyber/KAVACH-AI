import { useCallback, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useEffect, useState } from 'react';

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(() => ({
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: { value: '#0F172A' } },
    fpsLimit: 60,
    particles: {
      color: { value: ['#3B82F6', '#22D3EE', '#8B5CF6'] },
      links: {
        color: '#3B82F6',
        distance: 150,
        enable: true,
        opacity: 0.12,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
      },
      number: {
        density: { enable: true, area: 1000 },
        value: 60,
      },
      opacity: { value: { min: 0.1, max: 0.4 } },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.3 } },
      },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;
  return <Particles id="tsparticles" options={options} />;
}
