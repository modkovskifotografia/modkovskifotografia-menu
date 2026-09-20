'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { brandConfig } from '@/lib/config';
import {
  Instagram,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw
} from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

interface SlotItem {
  id: number;
  type: 'video' | 'image';
  src: string;
  fallbackSrc: string;
  poster?: string;
  signedUrl?: string;
  isSupabase?: boolean;
  fileName?: string;
}

const defaultSupabaseUrl =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) ||
  'https://leemiyktgclhnrtxtjex.supabase.co';

const getInitialSlotSrc = (id: number) =>
  `${defaultSupabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/portfolio/${id}.mp4`;

const initialSlots: SlotItem[] = [
  {
    id: 1,
    type: 'video',
    src: 'https://youtube.com/shorts/kRgbwZ1eCCE?feature=share',
    fallbackSrc: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-the-forest-40871-large.mp4',
    poster: 'https://img.youtube.com/vi/kRgbwZ1eCCE/hqdefault.jpg',
    fileName: '1.mp4'
  },
  {
    id: 2,
    type: 'video',
    src: 'https://youtube.com/shorts/rGvfYD5-I2M?feature=share',
    fallbackSrc: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-standing-together-40872-large.mp4',
    poster: 'https://img.youtube.com/vi/rGvfYD5-I2M/hqdefault.jpg',
    fileName: '2.mp4'
  },
  {
    id: 3,
    type: 'video',
    src: 'https://youtube.com/shorts/Yx80qmx-Pj8?feature=share',
    fallbackSrc: 'https://assets.mixkit.co/videos/preview/mixkit-bride-adjusting-her-wedding-dress-40874-large.mp4',
    poster: 'https://img.youtube.com/vi/Yx80qmx-Pj8/hqdefault.jpg',
    fileName: '3.mp4'
  },
  {
    id: 4,
    type: 'video',
    src: 'https://youtube.com/shorts/wgCDxQGmy4c?feature=share',
    fallbackSrc: 'https://assets.mixkit.co/videos/preview/mixkit-putting-on-the-wedding-ring-40019-large.mp4',
    poster: 'https://img.youtube.com/vi/wgCDxQGmy4c/hqdefault.jpg',
    fileName: '4.mp4'
  },
  {
    id: 5,
    type: 'video',
    src: 'https://youtube.com/shorts/pPOhwNM2qoU?feature=share',
    fallbackSrc: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-42289-large.mp4',
    poster: 'https://img.youtube.com/vi/pPOhwNM2qoU/hqdefault.jpg',
    fileName: '5.mp4'
  },
  {
    id: 6,
    type: 'video',
    src: 'https://youtube.com/shorts/d9Qis33n4Mk?feature=share',
    fallbackSrc: 'https://assets.mixkit.co/videos/preview/mixkit-groom-kissing-the-bride-on-the-forehead-42291-large.mp4',
    poster: 'https://img.youtube.com/vi/d9Qis33n4Mk/hqdefault.jpg',
    fileName: '6.mp4'
  }
];

function formatTime(seconds: number) {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function getEmbedUrl(url: string): { type: 'youtube' | 'drive'; embedUrl: string; videoId?: string } | null {
  if (!url) return null;
  const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
  if (ytMatch && ytMatch[2].length === 11) {
    const videoId = ytMatch[2];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1`
    };
  }
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
    };
  }
  return null;
}

function ReelVideoCard({
  slot,
  index
}: {
  slot: SlotItem;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const hideMobileControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [videoError, setVideoError] = useState<string | null>(null);
  const [prevSlotSrc, setPrevSlotSrc] = useState(slot.src);
  const [currentSrc, setCurrentSrc] = useState(slot.src);
  const [triedSignedUrl, setTriedSignedUrl] = useState(false);

  const embedInfo = getEmbedUrl(currentSrc);

  if (slot.src !== prevSlotSrc) {
    setPrevSlotSrc(slot.src);
    setCurrentSrc(slot.src);
    setVideoError(null);
    setTriedSignedUrl(false);
  }

  // Envia comando de reprodução contínua automática para o YouTube
  useEffect(() => {
    if (embedInfo?.type === 'youtube') {
      const sendPlay = () => {
        try {
          iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
          iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } catch {}
      };
      sendPlay();
      const t1 = setTimeout(sendPlay, 600);
      const t2 = setTimeout(sendPlay, 1800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [embedInfo, currentSrc]);

  // Inicia reprodução contínua automática no vídeo nativo
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [currentSrc, slot.id]);

  useEffect(() => {
    return () => {
      if (hideMobileControlsTimerRef.current) {
        clearTimeout(hideMobileControlsTimerRef.current);
      }
    };
  }, []);

  const triggerMobileControls = () => {
    setShowMobileControls(true);
    if (hideMobileControlsTimerRef.current) {
      clearTimeout(hideMobileControlsTimerRef.current);
    }
    hideMobileControlsTimerRef.current = setTimeout(() => {
      setShowMobileControls(false);
    }, 4500);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerMobileControls();
    if (embedInfo?.type === 'youtube' && iframeRef.current?.contentWindow) {
      if (isMuted) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
        setIsMuted(false);
      } else {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
        setIsMuted(true);
      }
      return;
    }

    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isScrubbing) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const seekToPosition = (clientX: number) => {
    if (!progressBarRef.current || !videoRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newRatio = clickX / rect.width;
    const newTime = newRatio * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    triggerMobileControls();
    setIsScrubbing(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    seekToPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isScrubbing) {
      e.stopPropagation();
      seekToPosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isScrubbing) {
      e.stopPropagation();
      setIsScrubbing(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const skipTime = (seconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerMobileControls();
    if (videoRef.current && duration) {
      const targetTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleVideoError = () => {
    // Se temos uma Signed URL e ainda não testamos, tenta alternar automaticamente
    if (slot.signedUrl && currentSrc !== slot.signedUrl && !triedSignedUrl) {
      setTriedSignedUrl(true);
      setCurrentSrc(slot.signedUrl);
      return;
    }

    // Se a mídia remota falhar, alterna automaticamente para o vídeo demonstrativo
    if (currentSrc !== slot.fallbackSrc) {
      setCurrentSrc(slot.fallbackSrc);
      setVideoError(null);
      return;
    }

    setVideoError('error');
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl shadow-lg bg-brand-beige-dark group cursor-pointer select-none"
      onClick={toggleMute}
      onMouseEnter={() => setShowMobileControls(true)}
      onMouseLeave={() => setShowMobileControls(false)}
      onTouchStart={triggerMobileControls}
    >
      {embedInfo ? (
        <div className="relative w-full h-full overflow-hidden bg-black">
          <iframe
            ref={iframeRef}
            src={embedInfo.embedUrl}
            title={`Vídeo ${slot.id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 pointer-events-auto object-cover scale-[1.03]"
          />
          {/* Botão de Som flutuante */}
          <button
            onClick={toggleMute}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-transform hover:scale-110 active:scale-95 z-20 shadow-md"
            title={isMuted ? 'Ativar Som' : 'Desativar Som'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      ) : (
        <>
          <video
            key={currentSrc}
            ref={videoRef}
            src={currentSrc}
            poster={slot.poster}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            onPlay={() => setIsPlaying(true)}
            onPause={() => {
              // Garante reprodução contínua mesmo se algo tentar pausar
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            }}
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onDurationChange={handleLoadedMetadata}
            onLoadedData={() => {
              setVideoError(null);
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            }}
            onError={handleVideoError}
          >
            <source src={currentSrc} type={currentSrc.toLowerCase().includes('.mov') ? 'video/quicktime' : 'video/mp4'} />
            <source src={currentSrc} />
          </video>

          {/* Overlay sutil */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />

          {/* Se houver erro crítico após todas as tentativas */}
          {videoError ? (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center p-5 bg-black/70 text-center z-20 text-white backdrop-blur-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setCurrentSrc(slot.fallbackSrc);
                  setVideoError(null);
                }}
                className="text-xs bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-full transition-colors flex items-center gap-2"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Recarregar vídeo</span>
              </button>
            </div>
          ) : (
            <>
              {/* Botão de Som rápido no topo direito */}
              <button
                onClick={toggleMute}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 transition-transform hover:scale-110 active:scale-95 z-10"
                title={isMuted ? 'Ativar Som' : 'Desativar Som'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </>
          )}

          {/* BARRA DE CONTROLE E MINUTAGEM DO VÍDEO (Hover no Desktop / Clique no Mobile) */}
          <div
            className={`absolute inset-x-0 bottom-0 z-20 pt-10 pb-3.5 px-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-all duration-300 ${
              showMobileControls ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra de Progresso Interativa (Scrubber / Timeline) */}
            <div
              ref={progressBarRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full py-2 cursor-pointer group/bar touch-none"
              title="Arraste ou clique para avançar ou voltar o vídeo"
            >
              <div className="relative w-full h-1.5 group-hover/bar:h-2.5 bg-white/30 backdrop-blur-xs rounded-full overflow-hidden transition-all duration-200">
                {/* Preenchimento do progresso */}
                <div
                  className="h-full bg-brand-terracotta transition-[width] duration-75 ease-linear rounded-full relative"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                />
              </div>
              {/* Marcador / Ponto indicador de posição */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg border border-brand-wine/50 pointer-events-none transition-transform duration-150 group-hover/bar:scale-110"
                style={{
                  left: `calc(${Math.min(98, Math.max(2, progressPercent))}% - 7px)`,
                  top: '16px',
                }}
              />
            </div>

            {/* Controles de Reprodução e Minutagem */}
            <div className="flex items-center justify-between mt-1 text-white">
              {/* Botões de Ação: Voltar 5s, Avançar 5s */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => skipTime(-5, e)}
                  className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 text-white/90 hover:text-white transition-colors flex items-center justify-center text-[10px]"
                  title="Voltar 5 segundos"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono font-bold ml-0.5">-5s</span>
                </button>

                <button
                  onClick={(e) => skipTime(5, e)}
                  className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 text-white/90 hover:text-white transition-colors flex items-center justify-center text-[10px]"
                  title="Avançar 5 segundos"
                >
                  <span className="text-[9px] font-mono font-bold mr-0.5">+5s</span>
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Minutagem (Tempo Atual / Duração Total) */}
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-tight text-white/90 bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                <span className="text-brand-terracotta-light font-bold">
                  {formatTime(currentTime)}
                </span>
                <span className="text-white/40">/</span>
                <span className="text-white/70">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Borda decorativa refinada */}
      <div className="absolute inset-0 ring-1 ring-black/5 rounded-2xl pointer-events-none" />
    </motion.div>
  );
}

interface PortfolioProps {
  eyebrow?: string;
  title?: string;
  limitSlots?: number;
  showViewMoreButton?: boolean;
}

export default function Portfolio({
  eyebrow = brandConfig.portfolio.eyebrow,
  title = brandConfig.portfolio.title,
  limitSlots,
  showViewMoreButton = false,
}: PortfolioProps = {}) {
  const [slots, setSlots] = useState<SlotItem[]>(initialSlots);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/supabase-status')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;

        if (data?.connected && data.details?.filesList && data.details.bucket) {
          const bucket = data.details.bucket;
          const supabase = getSupabase();
          if (supabase) {
            const updatedSlots = initialSlots.map((slot) => {
              if (slot.src && (slot.src.includes('youtube') || slot.src.includes('youtu.be') || slot.src.includes('drive.google'))) {
                return slot;
              }
              const slotIdStr = String(slot.id);
              const slotIdPadded = String(slot.id).padStart(2, '0');
              const matchedName = data.details?.filesList?.find((fn: string) => {
                const lower = fn.toLowerCase();
                return (
                  lower.startsWith(`${slotIdStr}.`) ||
                  lower.startsWith(`${slotIdPadded}.`) ||
                  lower.includes(`video${slotIdStr}`) ||
                  lower.includes(`reel${slotIdStr}`)
                );
              });

              if (matchedName) {
                const { data: pub } = supabase.storage.from(bucket).getPublicUrl(matchedName);
                return {
                  ...slot,
                  src: pub?.publicUrl || slot.src,
                  isSupabase: true,
                  fileName: matchedName
                };
              }
              return slot;
            });
            setSlots(updatedSlots);
          }
        }
      })
      .catch((e) => {
        console.warn('Verificação em segundo plano do Supabase:', e);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 md:py-28 lg:py-36 bg-brand-cream w-full" id="portfolio">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20">
          <div className="max-w-xl">
            {eyebrow && (
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-4">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl font-light text-brand-text tracking-tight font-serif">
                {title}
              </h2>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0"
          >
            <a
              href={brandConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-wine hover:text-brand-wine-dark text-xs font-semibold tracking-wider uppercase transition-colors duration-300 border-b border-brand-wine/20 pb-1"
              id="portfolio-instagram-link"
            >
              <Instagram className="w-4 h-4" />
              <span>Acompanhe no Instagram</span>
            </a>
          </motion.div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
          {(limitSlots ? slots.slice(0, limitSlots) : slots).map((slot, index) =>
            slot.type === 'video' ? (
              <ReelVideoCard
                key={slot.id}
                slot={slot}
                index={index}
              />
            ) : (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl shadow-lg bg-brand-beige-dark group"
              >
                <Image
                  src={slot.src}
                  alt={`Registro por Modkovski Fotografia ${slot.id}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== slot.fallbackSrc) {
                      target.src = slot.fallbackSrc;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-brand-wine/5 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-20 pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-black/5 rounded-2xl pointer-events-none" />
              </motion.div>
            )
          )}
        </div>

        {/* Botão Veja mais do meu trabalho para /portfolio */}
        {showViewMoreButton && (
          <div className="mt-12 md:mt-16 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-wine text-white text-xs font-semibold uppercase tracking-widest hover:bg-brand-wine-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              id="portfolio-view-more-work"
            >
              <span>veja mais do meu trabalho</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}



