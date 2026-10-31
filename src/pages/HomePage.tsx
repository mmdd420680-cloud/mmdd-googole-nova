import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ui/ProductCard';
import { SeedProduct } from '../../server/data/initialData';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Crown,
  Star,
  Quote,
} from 'lucide-react';
import { AdvertisementPopup } from '../components/common/AdvertisementPopup';
import { useVisitorAnalytics } from '../hooks/useVisitorAnalytics';

interface HomePageProps {
  onNavigate: (view: string, params?: any) => void;
}

interface DynamicSlider {
  id: string;
  tag: string;
  headline: string;
  subheadline: string;
  buttonText: string;
  buttonLink: string;
  lifestyleImage: string;
  modelScript?: string;
  badge?: string;
  displayOrder: number;
}

interface DynamicBanner {
  id: string;
  placement: string;
  tag?: string;
  headline: string;
  subheadline?: string;
  buttonText: string;
  buttonLink: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  theme?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  useVisitorAnalytics('/');

  const [products, setProducts] = useState<SeedProduct[]>([]);
  const [cms, setCms] = useState<any>(null);
  const [sliders, setSliders] = useState<DynamicSlider[]>([]);
  const [banners, setBanners] = useState<DynamicBanner[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, cmsRes, sliderRes, bannerRes] = await Promise.all([
          fetch('/api/products?limit=20'),
          fetch('/api/cms/homepage'),
          fetch('/api/cms/sliders?activeOnly=true'),
          fetch('/api/cms/banners?activeOnly=true'),
        ]);

        const prodData = await prodRes.json();
        const cmsData = await cmsRes.json();
        const sliderData = await sliderRes.json();
        const bannerData = await bannerRes.json();

        if (prodData.success) setProducts(prodData.data);
        if (cmsData.success) setCms(cmsData.data);
        if (sliderData.success && sliderData.data?.length > 0) {
          setSliders(sliderData.data);
        }
        if (bannerData.success && bannerData.data?.length > 0) {
          setBanners(bannerData.data);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Slider Autoplay (5s rotation, pauses when hovered)
  useEffect(() => {
    if (sliders.length <= 1 || isSliderHovered) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliders.length, isSliderHovered]);

  const popularProducts = products.filter((p) => p.isPopular).slice(0, 10);
  const bestSellerProducts = products.filter((p) => p.isBestSeller).slice(0, 5);

  const categories = [
    { name: 'Electronics', slug: 'electronics', icon: <Smartphone className="w-5 h-5 text-gray-700" /> },
    { name: 'Fashion', slug: 'fashion', icon: <Shirt className="w-5 h-5 text-gray-700" /> },
    { name: 'Home & Living', slug: 'home-living', icon: <Home className="w-5 h-5 text-gray-700" /> },
    { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', icon: <Sparkles className="w-5 h-5 text-gray-700" /> },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', icon: <Dumbbell className="w-5 h-5 text-gray-700" /> },
    { name: 'Toys & Games', slug: 'toys-games', icon: <Gamepad2 className="w-5 h-5 text-gray-700" /> },
  ];

  const currentSlider = sliders.length > 0 ? sliders[currentSlideIndex] : null;
  const secondaryBanners = banners.filter((b) => b.placement === 'homepage-secondary');
  const promoBanner = banners.find((b) => b.placement === 'homepage-promotion');

  const handlePrevSlide = () => {
    if (sliders.length <= 1) return;
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : sliders.length - 1));
  };

  const handleNextSlide = () => {
    if (sliders.length <= 1) return;
    setCurrentSlideIndex((prev) => (prev + 1) % sliders.length);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO BANNER SECTION (Dynamic Carousel with Admin Control) */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div
          onMouseEnter={() => setIsSliderHovered(true)}
          onMouseLeave={() => setIsSliderHovered(false)}
          className="relative rounded-3xl bg-gradient-to-r from-[#edf4f0] via-[#f4f7f5] to-[#fbfaf8] border border-gray-100 overflow-hidden min-h-[500px] lg:min-h-[560px] flex items-center shadow-xs"
        >
          {/* Navigation arrow buttons (active when multiple sliders exist) */}
          {sliders.length > 1 && (
            <>
              <button
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 z-20 transition cursor-pointer hover:scale-105"
                aria-label="Previous slider"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 z-20 transition cursor-pointer hover:scale-105"
                aria-label="Next slider"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center p-8 sm:p-14 lg:p-16 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-6 z-10 space-y-6">
              <div className="flex items-center gap-2">
                <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                  {currentSlider?.tag || cms?.heroBanner?.tag || 'NEW ARRIVALS'}
                </span>
                {currentSlider?.badge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    {currentSlider.badge}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] whitespace-pre-line">
                {currentSlider?.headline || cms?.heroBanner?.headline || 'Upgrade Your\nLifestyle'}
              </h1>

              <p className="text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
                {currentSlider?.subheadline ||
                  cms?.heroBanner?.subheadline ||
                  'Discover premium quality products designed for a better, smarter and easier life.'}
              </p>

              <div>
                <button
                  onClick={() => {
                    const link = currentSlider?.buttonLink || cms?.heroBanner?.buttonLink || '/shop';
                    if (link.startsWith('/')) {
                      const dest = link.replace('/', '');
                      onNavigate(dest || 'shop');
                    } else {
                      window.location.href = link;
                    }
                  }}
                  className="px-8 py-3.5 rounded-full bg-[#0c3328] hover:bg-emerald-800 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-950/20 cursor-pointer"
                >
                  <span>{currentSlider?.buttonText || cms?.heroBanner?.buttonText || 'Shop Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Trust Badges below Hero Button */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-900/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 leading-tight">
                    Premium Quality Products
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 leading-tight">
                    Fast & Reliable Delivery
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 leading-tight">
                    Easy Return & Refund
                  </span>
                </div>
              </div>
            </div>

            {/* Right Lifestyle Photography & Script */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md lg:max-w-none aspect-[4/3] lg:aspect-[1/1] overflow-hidden rounded-2xl flex items-center justify-center">
                <img
                  src={
                    currentSlider?.lifestyleImage ||
                    cms?.heroBanner?.lifestyleImage ||
                    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80'
                  }
                  alt={currentSlider?.headline || 'ShopMax Hero Banner'}
                  className="w-full h-full object-cover object-top rounded-2xl shadow-xl transition-all duration-700"
                />

                {/* Script overlay matching "Good Things Take Time ♡" */}
                {(currentSlider?.modelScript || cms?.heroBanner?.modelScript) && (
                  <div className="absolute right-4 top-8 text-right font-serif italic text-white drop-shadow-md select-none whitespace-pre-line">
                    <div className="text-3xl sm:text-4xl text-amber-100 font-normal">
                      {(currentSlider?.modelScript || cms?.heroBanner?.modelScript || '').split('\n')[0]}
                    </div>
                    <div className="text-3xl sm:text-4xl text-white font-normal -mt-1">
                      {(currentSlider?.modelScript || cms?.heroBanner?.modelScript || '').split('\n')[1] || ''}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Carousel dots */}
          {sliders.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {sliders.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'w-7 h-2 bg-emerald-700 shadow-xs'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. CATEGORY SHORTCUTS (6 Circular Icon Tiles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => onNavigate('shop', { category: cat.slug })}
              className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100/80 group-hover:bg-emerald-50 group-hover:scale-105 transition flex items-center justify-center shadow-2xs mb-3 border border-gray-100">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-800 text-center group-hover:text-emerald-800 transition">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TWO SPLIT CAMPAIGN CARDS (Smart Tech / Fashion - Dynamic from Admin) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Dynamic or Fallback */}
          {(() => {
            const card1 = secondaryBanners[0] || {
              tag: cms?.splitCampaigns?.card1?.tag || 'Smart Tech',
              headline: cms?.splitCampaigns?.card1?.headline || 'Smart Tech\nSmarter You',
              subheadline: cms?.splitCampaigns?.card1?.subheadline || 'Latest gadgets. Unbeatable prices.',
              buttonText: cms?.splitCampaigns?.card1?.buttonText || 'Shop Now',
              buttonLink: cms?.splitCampaigns?.card1?.buttonLink || '/shop?category=electronics',
              imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
              backgroundColor: '#0c3328',
              theme: 'dark',
            };
            return (
              <div
                className="relative rounded-3xl text-white p-8 sm:p-10 overflow-hidden flex flex-col justify-between min-h-[300px] shadow-lg"
                style={{ backgroundColor: card1.backgroundColor || '#0c3328' }}
              >
                <div className="relative z-10 max-w-xs space-y-2">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                    {card1.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug whitespace-pre-line">
                    {card1.headline}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-200/80">
                    {card1.subheadline}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        const link = card1.buttonLink || '/shop';
                        if (link.startsWith('/')) {
                          onNavigate(link.replace('/', '') || 'shop');
                        } else {
                          window.location.href = link;
                        }
                      }}
                      className="px-6 py-2.5 rounded-full bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{card1.buttonText || 'Shop Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-end justify-end pointer-events-none p-4">
                  <img
                    src={card1.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'}
                    alt={card1.headline}
                    className="w-full max-h-56 object-contain"
                  />
                </div>
              </div>
            );
          })()}

          {/* Card 2: Dynamic or Fallback */}
          {(() => {
            const card2 = secondaryBanners[1] || {
              tag: cms?.splitCampaigns?.card2?.tag || 'Fashion',
              headline: cms?.splitCampaigns?.card2?.headline || 'Fashion\nThat Speaks You',
              subheadline: cms?.splitCampaigns?.card2?.subheadline || 'Trendy styles for every mood.',
              buttonText: cms?.splitCampaigns?.card2?.buttonText || 'Shop Now',
              buttonLink: cms?.splitCampaigns?.card2?.buttonLink || '/shop?category=fashion',
              imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
              backgroundColor: '#fbe7dc',
              theme: 'peach',
            };
            const isDark = card2.theme === 'dark' || card2.backgroundColor === '#0c261e';
            return (
              <div
                className={`relative rounded-3xl p-8 sm:p-10 overflow-hidden flex flex-col justify-between min-h-[300px] shadow-lg ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
                style={{ backgroundColor: card2.backgroundColor || '#fbe7dc' }}
              >
                <div className="relative z-10 max-w-xs space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                    {card2.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug whitespace-pre-line">
                    {card2.headline}
                  </h2>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                    {card2.subheadline}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        const link = card2.buttonLink || '/shop';
                        if (link.startsWith('/')) {
                          onNavigate(link.replace('/', '') || 'shop');
                        } else {
                          window.location.href = link;
                        }
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#0c3328] text-white font-bold text-xs hover:bg-emerald-900 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{card2.buttonText || 'Shop Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-end justify-end pointer-events-none">
                  <img
                    src={card2.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'}
                    alt={card2.headline}
                    className="w-full max-h-64 object-contain object-bottom"
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 4. OUR POPULAR PRODUCTS (2 rows x 5 columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Our Popular Products
            </h2>
            <span className="w-8 h-0.5 bg-emerald-700 hidden sm:inline-block" />
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={(slug) => onNavigate('product', { slug })}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. FULL-WIDTH PROMO CAMPAIGN BANNER (Dynamic from Admin or CMS) */}
      {(promoBanner || cms?.promotionalAds?.enabled !== false) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className="relative rounded-3xl text-white overflow-hidden p-8 sm:p-14 shadow-2xl flex items-center min-h-[320px]"
            style={{
              backgroundColor: promoBanner?.backgroundColor || cms?.promotionalAds?.backgroundColor || '#0c261e',
            }}
          >
            <div className="relative z-10 max-w-lg space-y-3">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                {promoBanner?.tag || cms?.promotionalAds?.tag || 'LIMITED TIME OFFER'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight whitespace-pre-line">
                {promoBanner?.headline || cms?.promotionalAds?.headline || 'UP TO 50% OFF'}
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/80">
                {promoBanner?.subheadline || cms?.promotionalAds?.subheadline || 'On Your Favorite Brands across Tech, Lifestyle & Apparel'}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    const link = promoBanner?.buttonLink || cms?.promotionalAds?.buttonLink || '/shop?discount=true';
                    if (link.startsWith('/')) {
                      onNavigate(link.replace('/', '') || 'shop');
                    } else {
                      window.location.href = link;
                    }
                  }}
                  className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{promoBanner?.buttonText || cms?.promotionalAds?.buttonText || 'Shop Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scenic electronics lineup image */}
            <div className="absolute right-0 top-0 bottom-0 w-3/5 hidden md:flex items-center justify-end p-6 pointer-events-none opacity-90">
              <img
                src={
                  promoBanner?.imageUrl ||
                  cms?.promotionalAds?.imageUrl ||
                  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'
                }
                alt="Limited time promo devices"
                className="max-h-64 object-contain rounded-xl"
              />
            </div>
          </div>
        </section>
      )}

      {/* 6. BEST SELLERS SECTION (Crown badge & 5 Products) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Best Sellers
            </h2>
            <span className="w-8 h-0.5 bg-emerald-700 hidden sm:inline-block" />
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {bestSellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={(slug) => onNavigate('product', { slug })}
            />
          ))}
        </div>
      </section>

      {/* 7. WHAT OUR CUSTOMERS SAY (Authentic Testimonials from Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            What Our Customers Say
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTestimonialIndex((prev) => (prev > 0 ? prev - 1 : 0))}
              className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 transition"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTestimonialIndex((prev) => (prev < 1 ? prev + 1 : 1))}
              className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 transition"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sarah Khan */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80"
                  alt="Sarah Khan"
                  className="w-12 h-12 rounded-full object-cover border border-emerald-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Sarah Khan</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified Buyer
                  </span>
                </div>
              </div>

              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed italic">
                "Amazing products and super fast delivery! I'm really happy with my purchase. Highly recommended!"
              </p>
            </div>
            <div className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-50">
              Mar 12, 2025
            </div>
          </div>

          {/* Rafiul Islam */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80"
                  alt="Rafiul Islam"
                  className="w-12 h-12 rounded-full object-cover border border-emerald-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Rafiul Islam</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified Buyer
                  </span>
                </div>
              </div>

              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed italic">
                "The quality is top-notch. Customer service is also excellent. Will definitely shop again!"
              </p>
            </div>
            <div className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-50">
              Mar 8, 2025
            </div>
          </div>

          {/* Tonia Akter */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80"
                  alt="Tonia Akter"
                  className="w-12 h-12 rounded-full object-cover border border-emerald-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Tonia Akter</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified Buyer
                  </span>
                </div>
              </div>

              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed italic">
                "Such a beautiful website with a great collection. Easy to order and delivery was on time."
              </p>
            </div>
            <div className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-50">
              Mar 5, 2025
            </div>
          </div>
        </div>
      </section>

      {/* 8. VISITOR PROMOTIONAL ADVERTISEMENT POPUP (Controlled via Admin) */}
      <AdvertisementPopup onNavigate={onNavigate} />
    </div>
  );
};
