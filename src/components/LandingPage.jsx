import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Shield, Sparkles, Send, Music, BookOpen, Users, Coffee, ArrowLeft } from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [view, setView] = useState('HOME');
  const [isLogin, setIsLogin] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Rotating words for the hero section
  const [wordIndex, setWordIndex] = useState(0);
  const words = ['bhai', 'bruh', 'jigri', 'veere', 'bantai', 'khaas'];

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll lock when modal is open
  useEffect(() => {
    if (showAuth) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showAuth]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isLogin ? 'http://localhost:5001/api/auth/login' : 'http://localhost:5001/api/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (!isLogin) {
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      } else {
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (response) => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5001/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google Login Failed');
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showAuth && window.google) {
      window.google.accounts.id.initialize({
        client_id: "1031277008483-tbtfg4rui66281ointja9gf8g8v878ho.apps.googleusercontent.com",
        callback: handleGoogleCallback
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSyncButton"),
        { 
          theme: "outline", 
          size: "large", 
          width: "320", 
          text: "continue_with",
          shape: "pill"
        }
      );
    }
  }, [showAuth]);

  const renderNav = () => (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(172,45,94,0.05)]">
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 max-w-screen-2xl mx-auto font-['Plus_Jakarta_Sans']">
        <div 
          className="text-2xl font-bold tracking-tighter text-pink-900 flex items-center gap-2 cursor-pointer"
          onClick={() => setView('HOME')}
        >
          <span className="material-symbols-outlined text-[#FFB300]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          Vibecheck
        </div>
        <div className="hidden md:flex items-center gap-10 text-xs font-semibold uppercase tracking-[0.2em]">
          <button onClick={() => setView('HOME')} className={`transition-all ${view === 'HOME' ? 'text-pink-700 border-b-2 border-pink-700' : 'text-zinc-500 hover:text-pink-600'}`}>The Curation</button>
          <button onClick={() => setView('EDITORIAL')} className={`transition-all ${view === 'EDITORIAL' ? 'text-pink-700 border-b-2 border-pink-700' : 'text-zinc-500 hover:text-pink-600'}`}>Editorial</button>
          <button onClick={() => setView('ABOUT')} className={`transition-all ${view === 'ABOUT' ? 'text-pink-700 border-b-2 border-pink-700' : 'text-zinc-500 hover:text-pink-600'}`}>About</button>
        </div>
        <button 
          onClick={() => setShowAuth(true)}
          className="bg-[#ac2d5e] hover:bg-[#9c1f52] text-white px-8 py-3 rounded-full font-bold transition-all shadow-md text-sm"
        >
          Get Started
        </button>
      </nav>
    </header>
  );

  const renderHome = () => (
    <div className="animate-fade-in jali-pattern">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden mandala-bg">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-15 scale-110 blur-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9n-J5wCZBcXGOstyMImL2JJKpIkgK66CM6jS9ykkH1RV25thvnlgst8Z0X4W-Q6S-XLiQF66vFb0Rz6pr7WzB8A0BMHbaZS0xwWIfYTkCwldBxe0VIKBlWzVTJyCmg8fh4EivzbWyBXfOUk7pOGRrd-PsacPQgmCWncisuDbI9NEfWpCRi7FtFW5uYEolSTDYlG9btEZBXeRXzMsPuKs-KjG570paGVh94_mosqJ_xGV4OdOB_l2fr7eOV6bVpunKlmd-rrtrf7au" alt="Hero bg" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffd9e4]/50 text-[#674b55] text-xs font-bold uppercase tracking-widest mb-8 border border-white/40">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            Dil Se Connected
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-4 md:gap-x-6 gap-y-2 mb-8">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-[#313335] leading-[1.1] animate-float">
              Vibe with your 
            </h1>
            <div className="relative h-20 md:h-32 min-w-[150px] md:min-w-[320px] flex items-center justify-start overflow-visible">
              <span 
                key={wordIndex}
                className="text-[#ac2d5e] italic text-6xl md:text-8xl font-black absolute inset-0 flex items-center justify-start animate-slide-left-to-right whitespace-nowrap"
              >
                {words[wordIndex]}.
              </span>
            </div>
          </div>

          <p className="text-xl md:text-2xl text-[#5e5f61] max-w-2xl mx-auto mb-12 font-medium">
            Predicting your <span className="text-[#FFB300] font-bold">Yaara's</span> mood before they even say a word. The ethereal way to stay connected.
          </p>
          <button 
            onClick={() => setShowAuth(true)}
            className="rose-glass-gradient text-[#fff7f7] text-lg px-10 py-5 rounded-full font-bold shadow-xl hover:scale-105 transition-transform active:scale-95 flex items-center gap-3 mx-auto"
          >
            Connect Your Bestie
            <span className="material-symbols-outlined">bolt</span>
          </button>
        </div>

        {/* Dashboard Glass Card */}
        <div className="relative z-10 mt-20 w-full max-w-5xl px-6">
          <div className="glass-card rounded-xl editorial-shadow p-8 md:p-12 border border-white/60 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 opacity-[0.03] pointer-events-none text-[#ac2d5e]">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor"></path></svg>
            </div>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-4 mb-8 text-left">
                  <div className="w-14 h-14 rounded-full rose-glass-gradient flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#ac2d5e]">Live Dashboard</h3>
                    <p className="text-xl font-bold">Current Vibe Score</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="bg-[#f4f3f5]/50 p-6 rounded-lg border border-white/20 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-[#5e5f61]">Aman's Vibe</span>
                      <span className="text-[#ac2d5e] font-bold">88% Chill</span>
                    </div>
                    <div className="w-full h-3 bg-[#e2e2e5] rounded-full overflow-hidden">
                      <div className="h-full rose-glass-gradient w-[88%]"></div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-white/40 p-5 rounded-lg text-center border border-white/20 shadow-sm">
                      <p className="text-[10px] uppercase tracking-widest text-[#5e5f61] font-extrabold mb-1">Predicted</p>
                      <p className="text-xl font-bold text-[#F4511E]">Chai-Ready</p>
                    </div>
                    <div className="flex-1 bg-white/40 p-5 rounded-lg text-center border border-white/20 shadow-sm">
                      <p className="text-[10px] uppercase tracking-widest text-[#5e5f61] font-extrabold mb-1">Energy</p>
                      <p className="text-xl font-bold">High</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FFB300] rounded-full flex items-center justify-center text-white shadow-lg z-20">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>coffee</span>
                </div>
                <img className="rounded-lg editorial-shadow w-full h-80 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEaVutivEkWWduvL4QxDvHqhTJNiN1NgnlPb9dFllFEY4--G8c2frVRUP5XsSFTeRCAkCaeZSJSVvInVUvO_W0KMPVx-Y_PojAI-zWvOBByCMkuUqUfDikTC40EIDbwMiXEuL550HUSZcr08_gd82W1kq_0nZ-78Z1UtsHLCUOWy1_yKWVHkhiJO17VOTUSKkuuIKNzK-soxE3oZxG8So0iJF7g2PM3eSavE9dxF0uoNwv3rJEA80CVoJOMklIDCiva_m0eZ5QZW06" alt="Vibe" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-32 px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          <div className="md:col-span-7 bg-[#f4f3f5] rounded-xl p-12 flex flex-col justify-between overflow-hidden relative group border border-[#eeedef]">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-[#ac2d5e] text-5xl mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>psychology_alt</span>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Emotional Intelligence</h2>
              <p className="text-lg text-[#5e5f61] max-w-md leading-relaxed font-medium">
                Our proprietary AI understands the rhythm of your friendship. It tracks subtle shifts in digital conversation to ensure you're always there for your <span className="font-bold text-[#ac2d5e] italic">Yaara</span>.
              </p>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[300px]">hub</span>
            </div>
          </div>
          <div className="md:col-span-5 rose-glass-gradient rounded-xl p-12 text-white flex flex-col justify-end editorial-shadow relative overflow-hidden">
            <span className="material-symbols-outlined text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>library_music</span>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Sufi & Sync</h2>
            <p className="text-white/80 leading-relaxed mb-8 font-medium">
              Real-time music curation that bridges the distance. From Coke Studio favorites to morning ragas.
            </p>
          </div>
          <div className="md:col-span-12 glass-card rounded-xl p-12 flex flex-col md:flex-row items-center gap-16 border border-[#ac2d5e]/5 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 jali-pattern opacity-40 pointer-events-none"></div>
            <div className="md:w-1/2 relative z-10">
              <span className="material-symbols-outlined text-[#FFB300] text-5xl mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Koshish 'Cheer Up'</h2>
              <p className="text-lg text-[#5e5f61] leading-relaxed mb-8 font-medium">
                A genuine <span className="text-[#ac2d5e] italic font-semibold">Koshish</span> to make them smile. From spontaneous Chai & Samosa dates to curated Guldasta deliveries.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[#ac2d5e] font-bold">
                  <span className="material-symbols-outlined text-[#FFB300]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <span>Premium Chai Tapri Curation</span>
                </div>
                <div className="flex items-center gap-4 text-[#ac2d5e] font-bold">
                  <span className="material-symbols-outlined text-[#FFB300]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <span>Express Snack-Box Delivery</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-6 relative z-10">
              <div className="relative">
                <div className="absolute -top-3 -left-3 bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#FFB300] shadow-sm">Hot Chai</div>
                <img className="rounded-lg editorial-shadow aspect-square object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDncfYUwdCFxlm3XyQuNCgnwsXfPd5dvUNXgZy-4fqkJikNTQeGAu9luGMhdnsB1GqIhg-VeaUkA5F4t39Ctj_P9-gWHmuJ-jAK1JhqD7CDJEIauaoQ5Xjs0bs66DzShHBIvsJG_bjlBhthV7M2cmMUFUpeTg5aCtKqdyOzLsqdWWv_hbbzQanIxITFMN3_Vt15LGf5UfxySW1O1y2e3VAJut_CZxYrknAf5qxaUAKLQvtwqkfDzcH7SwIuhg0uwxZQ-TZ94NISSYPg" alt="Chai" />
              </div>
              <div className="relative mt-8">
                <div className="absolute -bottom-3 -right-3 bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#F4511E] shadow-sm">Samosa Break</div>
                <img className="rounded-lg editorial-shadow aspect-square object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgKvttPafKiGC44HLx3JO7EOquWAOtsZ9umm4aN2mhpk07eyuZ6sLheFVpMdaRXX8kise93SR4DICseqz6YloMdqs8OUzQBzTzttou65F2Jzio0WKeRy0-VuSAmp1lxDKx3tRW0mGpAivzJQOFlztmvGfX7zn6iNEvEGfxEpO2KfJ6kjV-oDbtkYEYu05HQBC4y2e3ibMrTiKOD_uGoHIr5SNLGBCZdvWThY-oDmouFPXOvst4Nb-aYfBPNscn6oOvGQmshsSFS4Xl" alt="Samosa" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Canvas */}
      <section className="px-12 py-32 mandala-bg">
        <div className="max-w-4xl mx-auto rounded-xl bg-[#fbf9fa] p-16 text-center shadow-xl overflow-hidden relative border border-white/40">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-[#FFB300]">
            <span className="material-symbols-outlined text-[140px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-8 tracking-tighter">Ready to sync?</h2>
          <p className="text-xl text-[#5e5f61] mb-12 max-w-lg mx-auto font-medium">
              Join the waitlist for the most emotional connection tool ever built. <span className="text-[#ac2d5e] italic">Shubh Aarambh.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <input className="px-8 py-5 rounded-full bg-white border-none focus:ring-2 focus:ring-[#ac2d5e]/20 w-full max-w-xs shadow-inner font-medium text-sm outline-none" placeholder="Enter your email" type="email"/>
            <button onClick={() => setShowAuth(true)} className="rose-glass-gradient text-white px-10 py-5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">Notify Me</button>
          </div>
        </div>
      </section>
    </div>
  );

  const renderEditorial = () => (
    <main className="pt-32 px-6 md:px-12 max-w-[1440px] mx-auto animate-fade-in">
      {/* Hero Section: Featured Story */}
      <section className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-24 group">
        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJU1gU5jMWUHpfM1GdBthkWeRhsEDOjYcaF7hDpbgnjNZ9Oi7tGXroEXh_kFUU8ECodh1D3Gxl_30pzo8zecTC7hZ56IGRVaaKUX2RVYbmFnC9jNcDHle4JYxuHlavuaRTJcLv9-rUS3KE9bLm7YQDbehZHsbW4FCR9TZR7YLQB2iv_4kORuTHJUVPzi-LQ9VYL5rvVCCn87oIGPzSEYil7XvcaZL7NUDxKNiIxIqe_45V61t5ObXbsVTEpR0x4nQxj4Ah2ouvOGhq" alt="Editorial" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#313335]/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-12 w-full md:w-2/3 text-left">
          <span className="label-md uppercase tracking-[0.2em] text-white/80 mb-4 block font-semibold text-xs">Cover Story</span>
          <h1 className="text-5xl md:text-7xl font-bold italic text-white mb-6 leading-tight tracking-tighter">The Art of the Desi Bestie</h1>
          <p className="text-lg text-white/90 font-light max-w-xl mb-8 leading-relaxed">A deep dive into the unique, vibrant, and fiercely loyal bonds that define modern friendship in the diaspora.</p>
          <button className="bg-white text-[#ac2d5e] px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#fbf9fa] transition-all">Read Feature</button>
        </div>
      </section>

      {/* Editorial Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32 text-left">
        <div className="md:col-span-8 flex flex-col gap-8">
          <div className="bg-[#f4f3f5] rounded-xl overflow-hidden flex flex-col md:flex-row h-full group">
            <div className="w-full md:w-1/2 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOuOf5DkvYeJoSbTDn_boyr-t97hOtlo_nCHxwT2kVbO20cCZMA8dxxqJWZhS656bxTAsZXNoPvoKFVuwUrbaPQg8-NjrjW_4W7PgxtExM_qTE7az3BmTC3YxNEnCMIy-HWFh9fe_1e9S_5NmAr2aih0MyS4bBabn0ljfnokj_e6CL5cR8YSzMeJaEu87xBf3jLf6CBlnCq1rjzob7J8_zlHzMwoc3qrfeK01s2tz2b6wjTOx-1CaRVdBiWD_QkrdCpxzUnYJtcM7q" alt="Lifestyle" />
            </div>
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
              <span className="text-[#ac2d5e] font-bold text-xs uppercase tracking-widest mb-4">Lifestyle</span>
              <h2 className="text-3xl font-bold italic mb-4 leading-snug tracking-tight">Why Chai & Samosas are the Ultimate Love Language</h2>
              <p className="text-[#5e5f61] leading-relaxed mb-6 font-medium">More than just snacks, they are the rituals of connection and the warmth of home found in every sip.</p>
              <div className="mt-auto pt-6 border-t border-[#b1b2b4]/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#fd6c9c]"></div>
                <span className="text-sm font-medium">By Amara Sethi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-8">
          <div className="glass-card p-8 rounded-xl border border-white/40 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-6 tracking-tight">The Weekly Pulse</h3>
            <div className="space-y-8">
              {[
                { n: '01', t: 'Navigating Identity in the Digital Age', c: 'Culture • 5 min read' },
                { n: '02', t: 'The Modern Mehndi: Ritual Reimagined', c: 'Tradition • 8 min read' },
                { n: '03', t: 'Soundscapes of the Subcontinent', c: 'Music • 4 min read' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <span className="text-[#9c1f52] font-bold text-3xl italic opacity-50 group-hover:opacity-100 transition-opacity">{item.n}</span>
                  <div>
                    <h4 className="font-bold text-[15px] mb-1 leading-tight group-hover:text-[#ac2d5e] transition-colors">{item.t}</h4>
                    <p className="text-[10px] text-[#5e5f61] uppercase tracking-widest font-bold italic">{item.c}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-10 w-full py-4 rounded-full border border-[#ac2d5e]/20 text-[#ac2d5e] font-bold text-sm uppercase tracking-widest hover:bg-[#ac2d5e]/5 transition-colors">View All Stories</button>
          </div>
        </div>
      </div>

      {/* Visual Essay Section */}
      <section className="mb-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-left">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold italic mb-4 tracking-tighter">Captured Moments</h2>
            <p className="text-[#5e5f61] font-medium leading-relaxed">A visual exploration of the aesthetics that define our community, from the streets of Mumbai to the galleries of London.</p>
          </div>
          <div className="flex gap-4">
            <button className="p-4 rounded-full bg-[#f4f3f5] text-[#313335] hover:bg-[#fd6c9c] transition-colors shadow-sm"><ArrowLeft size={20} /></button>
            <button className="p-4 rounded-full bg-[#ac2d5e] text-white hover:bg-[#9c1f52] transition-colors shadow-xl shadow-[#ac2d5e]/20"><ArrowRight size={20} /></button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDArj3A33gWJsC2MUNYktZFvioSqq5zEMU5F64RvC2DyEHPBJIsGbVBVP8Uui8PWFrb1nu-cF6MQZscs8bTSjAb8NmuGX4dhb3HXXQnQyxoQ5ftoyhbFI9SVSxL_zw1GDXdfS2xfUUTkmgZh1OezJjkmclATDq8OT5D2Wy8EGmKysptLJCZrA2oH4Sw9RRE4-MqCxy-DCdPGi5eonW4_FgHJ9P3eDPhygchy3JqER78aw5aN_GFwWYSuLMJhtM_CvfyATxPQQWfquwy",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBgzYHwFVvzrwFwk7N0MIjScakPen2T6ZyHTDSgFWTxmSCKdGEgi_iZEOai9jWoG9MemjN9GLUdeQzmNk03XPF6OkT8BmzFvdPH0szWCVJ1YQfnjdK2G-67M2sqlSFOhe85g9DAZigFxI8uTntbkjMcg6TC47nTcfmBG0P9dE55qHoMpqTDnzMx3_A_8h0JOQ1iorcD57BDFdJSlBA6THUIRa7zrc4DfutkPO0APYwp9VSd9GkrNj1qDDtw7XFB2nYPMQujAfcObvD-",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBx4ZIQ0yrhanilylA9XO7-CJG6ec1PCN_6jWRxtyNqCgtwysQQnsQz9TnJAKcW_TKcF1SejO3IwPVeyqVN2uhEh01_IGifitZNi4ugR1bwP3aspb42uBh0WtZ8ptZhhrDVey166S9X-u1TVqx8QUFhVU8F8IG9tt8zYqG9gZUtBbjlG4GCUn0QAGY1EjztgrLKB91RIDhCYQfgWbasqTDHxkXvEiM42DmFzj-ji0XCWMR9_yfNWEilV97QtOBk7HwUEZoE5MzTNLYR",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBaVjMAAeLjrmSCKs8QNa43T95DK9VlT1LYJ7diPGahbhZ6RBtI2UcyEAO0GX1bkgbS5MPq2fykwLLLwdtRsaeBdoBE__mFseQLolWcNBWJRZuLd042C6L3AnXMOMZ-th3BShUre__6sPCBmx1dkpW0LFqOVqHZ0cCzjxQgaFPfUc6qEOvxDwl4Uj4yMRe9YSe1D3BUSrjE-T14vOxkS9qeNANVJ4dW5eNyBU_oVIVJXrhaE0nmxjc7crMZ4bb9gEOeEYTNuFvEJlu8"
          ].map((src, i) => (
            <div key={i} className={`aspect-[3/4] rounded-lg overflow-hidden group shadow-md ${i % 2 === 1 ? 'md:mt-12' : ''}`}>
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={src} alt="Captured Moment" />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#fd6c9c]/20 rounded-xl p-12 md:p-24 text-center mb-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#ac2d5e]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f5cdf9]/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-[#ac2d5e] font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">Join the Circle</span>
          <h2 className="text-4xl md:text-5xl font-bold italic mb-8 leading-tight tracking-tighter">Stories delivered to your inbox, curated with soul.</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input className="flex-1 px-8 py-5 rounded-full bg-white/60 backdrop-blur-md border-none focus:ring-2 focus:ring-[#ac2d5e]/20 placeholder:text-zinc-400 font-medium text-sm outline-none" placeholder="Your email address" type="email"/>
            <button className="rose-glass-gradient text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:shadow-xl transition-all active:scale-95 text-xs">Subscribe</button>
          </div>
          <p className="mt-8 text-[10px] text-[#5e5f61] uppercase tracking-[0.2em] font-bold italic">No spam. Only the good stuff. Promise.</p>
        </div>
      </section>
    </main>
  );

  const renderAbout = () => (
    <main className="pt-32 animate-fade-in text-left">
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32 text-left">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <span className="label-md uppercase tracking-[0.2em] text-[#ac2d5e] font-bold text-xs">The Vision</span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-[-0.04em] leading-[0.95] text-[#313335]">
                Humanity in <br/><span className="rose-gradient-text italic">Digital Harmony.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#5e5f61] max-w-xl font-medium leading-relaxed tracking-tight">
                Redefining digital closeness through emotional intelligence and cultural warmth.
            </p>
          </div>
          <div className="flex-1 w-full h-[500px] rounded-xl overflow-hidden shadow-2xl relative border-8 border-white">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlR00FDwIz8haCmn16J2i7Y8I4-tII-TAIOeF2GOXxFYWGcNHT5S-h5ocr5cYfi0vXGPWr1gjXAo5VtKAHddmSbwyoEpYmwMNiw_OG9-1_5EzZ7bM9XkA6D-pCE7gbRNDQh7QDvpO5kitp43YZkJ37OFOX0PVzd7k0Gme5ejfcsGuA1T10uUVkhB6FMRoevAOKF0827J87Qe4ADIEnQ--aTfnrPDpsIgTczEG7Plvfrvm-3G2wcTjZlH0gfmOIjlyGc3nUS0PhN7QL" alt="About Vision" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#ac2d5e]/20 to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f3f5] py-32 jali-pattern">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-[#313335]">The Mission</h2>
              <p className="text-lg text-[#5e5f61] max-w-2xl leading-relaxed font-medium">
                  We believe that technology should amplify the warmth of a real conversation, not dilute it. Our platform is built to foster depth in a world of surfaces.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
            <div className="md:col-span-4 bg-white p-10 rounded-lg flex flex-col justify-between h-[300px] shadow-sm">
                <span className="material-symbols-outlined text-4xl text-[#ac2d5e]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Emotional Safety</h3>
                  <p className="text-[#5e5f61] text-sm font-medium">Spaces designed for vulnerability.</p>
                </div>
            </div>
            <div className="md:col-span-8 bg-gradient-to-br from-[#ac2d5e] to-[#fd6c9c] p-10 rounded-lg flex flex-col justify-between h-[300px] text-white">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_3</span>
                <h2 className="text-3xl font-black mb-4">Cultural Resonance</h2>
            </div>
          </div>
        </div>
      </section>
    </main>
  );

  return (
    <div className="min-h-screen bg-[#fbf9fa] selection:bg-[#fd6c9c] selection:text-white">
      {renderNav()}
      <main>
        {view === 'HOME' && renderHome()}
        {view === 'EDITORIAL' && renderEditorial()}
        {view === 'ABOUT' && renderAbout()}
      </main>

      <footer className="w-full rounded-t-[3rem] mt-20 bg-zinc-50 font-['Plus_Jakarta_Sans'] text-sm tracking-wide border-t border-zinc-100">
        <div className="flex flex-col md:flex-row justify-between items-center px-16 py-12 gap-8 max-w-screen-2xl mx-auto">
          <div className="font-bold text-xl text-pink-900 flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
            <span className="material-symbols-outlined text-[#FFB300]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
            Vibecheck
          </div>
          <div className="flex gap-10">
            <span className="text-zinc-400 uppercase tracking-widest text-[10px] font-bold hover:text-pink-500 cursor-pointer" onClick={() => setView('ABOUT')}>About</span>
            <span className="text-zinc-400 uppercase tracking-widest text-[10px] font-bold hover:text-pink-500 cursor-pointer" onClick={() => setView('EDITORIAL')}>Editorial</span>
          </div>
          <div className="text-pink-800/60 font-medium">
            © 2026 Vibecheck. Made with <span className="text-[#ac2d5e] italic">Dil</span>.
          </div>
        </div>
      </footer>

      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in p-4 overflow-y-auto" onClick={() => setShowAuth(false)}>
          <div 
            className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl animate-scale-up max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Content: Atmospheric/Brand */}
            <div className="md:w-5/12 bg-[#ac2d5e] p-12 text-white flex flex-col justify-between relative group">
              <div className="absolute inset-0 mandala-bg opacity-10 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter mb-12">
                  <span className="material-symbols-outlined text-[#FFB300]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
                  Vibecheck
                </div>
                <h3 className="text-4xl font-extrabold leading-tight tracking-tighter mb-6">
                  {isLogin ? "Welcome back to your circle." : "Join the most intentional community."}
                </h3>
                <p className="text-white/80 font-medium text-lg">
                  {isLogin 
                    ? "Your besties are waiting for your vibe. Step back into the sync." 
                    : "Experience friendship through emotional intelligence and cultural warmth."}
                </p>
              </div>
              <div className="relative z-10 pt-12">
                <div className="flex -space-x-4 mb-4">
                  {[1, 2, 3, 4].map(i => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-[#ac2d5e] object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-[#ac2d5e] bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] font-black">+14k</div>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Joined by Desis globally</p>
              </div>
            </div>

            {/* Right Content: Login/Signup Form */}
            <div className="md:w-7/12 p-10 md:p-14 flex flex-col justify-center bg-white relative overflow-y-auto">
              <button 
                onClick={() => setShowAuth(false)}
                className="absolute top-8 right-8 text-zinc-300 hover:text-zinc-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="max-w-sm mx-auto w-full">
                <div className="mb-10 text-left">
                  <h2 className="text-3xl font-black tracking-tighter text-[#313335] mb-2">
                    {isLogin ? "Sign In" : "Create Account"}
                  </h2>
                  <p className="text-[#5e5f61] font-medium text-sm">
                    {isLogin ? "Enter your details to sync back in." : "Fill in the details to start your journey."}
                  </p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-xs font-bold border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {!isLogin && (
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#5e5f61] mb-2 block">Username</label>
                      <input name="username" type="text" placeholder="e.g. jigar_tukda" value={formData.username} onChange={handleChange} required className="w-full px-6 py-4 rounded-xl bg-zinc-50 border border-zinc-100 outline-none text-sm font-medium focus:ring-2 focus:ring-[#ac2d5e]/10 focus:border-[#ac2d5e]/20" />
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#5e5f61] mb-2 block">Email Address</label>
                    <input name="email" type="email" placeholder="you@vibecheck.social" value={formData.email} onChange={handleChange} required className="w-full px-6 py-4 rounded-xl bg-zinc-50 border border-zinc-100 outline-none text-sm font-medium focus:ring-2 focus:ring-[#ac2d5e]/10 focus:border-[#ac2d5e]/20" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#5e5f61] mb-2 block">Password</label>
                    <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength="6" className="w-full px-6 py-4 rounded-xl bg-zinc-50 border border-zinc-100 outline-none text-sm font-medium focus:ring-2 focus:ring-[#ac2d5e]/10 focus:border-[#ac2d5e]/20" />
                  </div>
                  
                  {isLogin && (
                    <div className="text-right">
                      <button type="button" className="text-[10px] font-black uppercase tracking-widest text-[#ac2d5e] hover:underline">Forgot password?</button>
                    </div>
                  )}

                  <button type="submit" className="rose-glass-gradient text-white w-full py-5 rounded-xl font-black shadow-lg mt-4 text-sm uppercase tracking-[0.2em] transform transition-transform hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}>
                    {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </button>
                </form>

                <div className="relative my-8 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
                  <span className="relative px-4 bg-white text-[10px] font-black uppercase tracking-widest text-zinc-300">or continue with</span>
                </div>

                <div className="flex justify-center">
                  <div id="googleSyncButton"></div>
                </div>

                <p className="mt-10 text-center text-xs text-zinc-400 font-medium">
                  {isLogin ? "New to the circle?" : "Already part of the tribe?"}
                  <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="ml-2 text-[#ac2d5e] font-black uppercase tracking-widest text-[10px] hover:underline">
                    {isLogin ? "Join now" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
