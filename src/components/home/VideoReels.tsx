"use client";

import { useState, useRef, useEffect } from "react";
import { X, Play, ShoppingCart, ChevronLeft, ChevronRight, Volume2, VolumeX, AlertCircle } from "lucide-react";
import Link from "next/link";

interface VideoReel {
  title: string;
  productName: string;
  price: string;
  videoThumbnail: string;
  videoUrl?: string;
}

export default function VideoReels({ reels }: { reels: VideoReel[] }) {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [playbackError, setPlaybackError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (activeVideo !== null) {
      setPlaybackError(false);
      setIsVideoLoading(true);
      
      // Delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(err => {
            console.log("Autoplay failed, waiting for user interaction:", err);
            // This is expected if user hasn't interacted with DOM yet
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeVideo]);

  const openVideo = (idx: number) => {
    setActiveVideo(idx);
    document.body.style.overflow = "hidden";
  };

  const closeVideo = () => {
    setActiveVideo(null);
    document.body.style.overflow = "auto";
  };

  const nextVideo = () => {
    if (activeVideo !== null && activeVideo < reels.length - 1) {
      setActiveVideo(activeVideo + 1);
    }
  };

  const prevVideo = () => {
    if (activeVideo !== null && activeVideo > 0) {
      setActiveVideo(activeVideo - 1);
    }
  };

  const isYouTube = (url?: string) => url?.includes("youtube.com") || url?.includes("youtu.be");
  const isVimeo = (url?: string) => url?.includes("vimeo.com");

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (isYouTube(url)) {
      const id = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop();
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`;
    }
    if (isVimeo(url)) {
      const id = url.split("/").pop();
      return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1`;
    }
    return url;
  };

  if (!reels || reels.length === 0) return null;

  return (
    <section className="py-24 bg-stone-50 relative overflow-hidden min-h-[700px] border-y border-stone-200">
      {/* High-Tech Clinical Effects */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Soft Science Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="font-headline text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Molecular Motion</span>
            <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] italic text-stone-900">Shop By <span className="text-primary">Videos</span></h2>
            <p className="text-stone-500 mt-8 font-medium max-w-md">Watch our elite athletes and clinical experts deploy the science of transformation in real-time.</p>
          </div>
        </div>
        
        <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-12 -mx-4 px-4 snap-x snap-mandatory">
          {reels.map((reel, idx) => (
            <div 
              key={idx} 
              onClick={() => openVideo(idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="min-w-[280px] md:min-w-[340px] h-[520px] md:h-[600px] relative rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/5 shadow-2xl snap-center transition-all duration-700 hover:scale-[1.02] hover:shadow-primary/10"
            >
              {hoveredIndex === idx && reel.videoUrl && !isYouTube(reel.videoUrl) && !isVimeo(reel.videoUrl) ? (
                <video 
                  src={reel.videoUrl} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover animate-in fade-in duration-500"
                />
              ) : (
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms] ease-out" 
                  src={reel.videoThumbnail || "/placeholder.png"} 
                  alt={reel.title} 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-primary/10 backdrop-blur-3xl border border-primary/30 rounded-full flex items-center justify-center scale-90 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Play className="w-8 h-8 text-primary fill-primary" />
                 </div>
              </div>

              {/* Product Info Overlay */}
              <div className="absolute bottom-8 left-8 right-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                 <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">{reel.title}</p>
                    <h4 className="font-headline font-bold text-sm uppercase mb-4 truncate text-white">{reel.productName}</h4>
                    <div className="flex justify-between items-center">
                       <span className="font-headline font-black text-xl italic tracking-tighter text-white">₹{reel.price}</span>
                       <div className="bg-primary text-black p-3 rounded-full shadow-lg group-hover:rotate-12 transition-transform">
                          <ShoppingCart className="w-4 h-4 stroke-[3]" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reel Modal Player */}
      {activeVideo !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="absolute inset-0" onClick={closeVideo}></div>
          
          {/* Controls */}
          <button onClick={closeVideo} className="absolute top-8 right-8 z-[10000] p-4 bg-white/10 hover:bg-primary hover:text-black rounded-full transition-all text-white">
            <X className="w-8 h-8" />
          </button>

          <div className="relative z-[10000] flex items-center gap-4 md:gap-12 px-4 w-full justify-center">
            {/* Prev Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); prevVideo(); }}
              disabled={activeVideo === 0}
              className={`p-6 bg-white/5 rounded-full hover:bg-white/10 transition-all hidden lg:block ${activeVideo === 0 ? 'opacity-10 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft className="w-10 h-10 text-white" />
            </button>

            {/* Reel Container */}
            <div className="relative w-full max-w-[420px] aspect-[9/16] bg-black rounded-[3.5rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 group/modal">
               {reels[activeVideo].videoUrl ? (
                 <>
                   {isVideoLoading && (
                     <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-xl">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                     </div>
                   )}
                   
                   {isYouTube(reels[activeVideo].videoUrl) || isVimeo(reels[activeVideo].videoUrl) ? (
                     <iframe 
                      src={getEmbedUrl(reels[activeVideo].videoUrl)}
                      className="w-full h-full border-none"
                      allow="autoplay; fullscreen; picture-in-picture"
                      onLoad={() => setIsVideoLoading(false)}
                     />
                   ) : (
                     <video 
                       ref={videoRef}
                       onLoadedData={() => setIsVideoLoading(false)}
                       onCanPlay={() => setIsVideoLoading(false)}
                       onError={() => { setIsVideoLoading(false); setPlaybackError(true); }}
                       key={reels[activeVideo].videoUrl}
                       className="w-full h-full object-cover"
                       autoPlay
                       loop
                       muted={isMuted}
                       playsInline
                       onClick={() => videoRef.current?.play()}
                     >
                        <source src={reels[activeVideo].videoUrl} type="video/mp4" />
                        <source src={reels[activeVideo].videoUrl} type="video/webm" />
                        Your browser does not support the video tag.
                     </video>
                   )}

                   {playbackError && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80 px-8 text-center">
                        <AlertCircle className="w-12 h-12 text-error mb-4" />
                        <p className="text-white font-headline font-bold uppercase text-sm mb-2">Protocol Playback Error</p>
                        <p className="text-stone-400 text-[10px] uppercase tracking-widest">Invalid video asset or format. Ensure the URL is a direct MP4 or YouTube link.</p>
                     </div>
                   )}
                 </>
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center text-stone-500">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                       <Play className="w-10 h-10 opacity-10" />
                    </div>
                    <p className="font-headline font-bold uppercase text-sm tracking-widest text-stone-400">Protocol Stream Offline</p>
                    <p className="text-[10px] mt-4 opacity-40 uppercase tracking-[0.3em] max-w-[200px]">Link a direct video asset in the CMS to activate</p>
                 </div>
               )}

               {/* Overlay Content */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>
               
               {/* Sound Toggle */}
               {!isYouTube(reels[activeVideo].videoUrl) && !isVimeo(reels[activeVideo].videoUrl) && (
                 <button 
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                  className="absolute top-10 right-10 p-4 bg-black/60 backdrop-blur-xl rounded-full text-white pointer-events-auto hover:scale-110 transition-transform border border-white/10"
                 >
                   {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                 </button>
               )}

               {/* Bottom Info & CTA */}
               <div className="absolute bottom-12 left-10 right-10 pointer-events-auto">
                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-[12px] border border-primary/30 rotate-3">WCS</div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none mb-2">Clinical Deployment</p>
                          <h4 className="font-headline font-bold text-sm uppercase text-white truncate max-w-[180px]">{reels[activeVideo].productName}</h4>
                        </div>
                     </div>
                     
                     <div className="flex justify-between items-center">
                        <div>
                           <p className="text-[9px] font-black uppercase text-stone-500 tracking-widest mb-1">Acquisition cost</p>
                           <p className="text-3xl font-black text-white italic tracking-tighter">₹{reels[activeVideo].price}</p>
                        </div>
                        <Link 
                          href={`/product/all`}
                          className="bg-primary text-black px-8 py-4 rounded-2xl font-headline font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)]"
                        >
                           Deploy Protocol
                        </Link>
                     </div>
                  </div>
               </div>
            </div>

            {/* Next Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); nextVideo(); }}
              disabled={activeVideo === reels.length - 1}
              className={`p-6 bg-white/5 rounded-full hover:bg-white/10 transition-all hidden lg:block ${activeVideo === reels.length - 1 ? 'opacity-10 cursor-not-allowed' : ''}`}
            >
              <ChevronRight className="w-10 h-10 text-white" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
