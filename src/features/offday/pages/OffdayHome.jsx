import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Homepage_Query from "../../home/queries/Homepage_Query";
import HeroSideBanner_Query from "../../home/queries/HeroSideBanner_Query";
import PromoBanners_Query from "../../home/queries/PromoBanners_Query";
import Product_Query from "../../sale/queries/Product_Query";
import client from "../../../lib/ApiClient";
import showToast from "../../../utils/toast";
import { getImageUrl } from "../../../utils/imageUrl";
import { collectionSlug, getCollections } from "../collections";
import OffdayProductCard from "../components/OffdayProductCard";
import "./offdayHome.css";

function OffdayHome() {
    const { data: homepageData = {}, isLoading, isError, error, refetch } = Homepage_Query({ staleTime: 0 });
    const { data: heroSideBanners = [] } = HeroSideBanner_Query({ staleTime: 0 });
    const { data: promoBanners = [] } = PromoBanners_Query({ staleTime: 0 });
    const collections = useMemo(() => getCollections(homepageData.categories), [homepageData.categories]);
    const drops = collections.find((collection) => collectionSlug(collection.name) === "offday-drops");
    const featuredFilter = drops?.id ? { category: drops.id, page_size: 4, sort: "new" } : {};
    const { data: productPage, isLoading: productsLoading } = Product_Query(featuredFilter, { enabled: Boolean(drops?.id), staleTime: 0 });
    const products = productPage?.results || [];
    const heroBanners = useMemo(
        () => (Array.isArray(homepageData.hero_banners)
            ? homepageData.hero_banners.filter((banner) => banner?.image)
            : []),
        [homepageData.hero_banners],
    );
    const [heroIndex, setHeroIndex] = useState(0);
    const [heroAutoplay, setHeroAutoplay] = useState(true);
    const heroBanner = heroBanners[heroIndex] || heroBanners[0] || null;
    const heroImage = heroBanner?.image ? getImageUrl(heroBanner.image) : "";
    const storyBanner = Array.isArray(heroSideBanners)
        ? heroSideBanners.find((banner) => banner?.image)
        : null;
    const storyImage = storyBanner?.image ? getImageUrl(storyBanner.image) : "";
    const wideBanner = Array.isArray(promoBanners)
        ? promoBanners.find((banner) => banner?.image)
        : null;
    const wideBannerImage = wideBanner?.image ? getImageUrl(wideBanner.image) : "";
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (heroIndex >= heroBanners.length) setHeroIndex(0);
    }, [heroBanners.length, heroIndex]);

    useEffect(() => {
        if (heroBanners.length <= 1 || !heroAutoplay || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
        const timer = window.setTimeout(() => {
            setHeroIndex((currentIndex) => (currentIndex + 1) % heroBanners.length);
        }, 6000);
        return () => window.clearTimeout(timer);
    }, [heroBanners.length, heroAutoplay, heroIndex]);

    const submitNewsletter = async (event) => {
        event.preventDefault();
        if (!consent) {
            showToast.info("Please confirm you would like to receive OFFDAY updates");
            return;
        }
        setSubmitting(true);
        try {
            await client.post("newsletter/", { email, consent });
            setSubmitted(true);
            setEmail("");
            showToast.success("Thanks for signing up");
        } catch (requestError) {
            showToast.error(requestError?.response?.data?.detail || "We could not save your signup. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return <main className="offday-home-loading" aria-busy="true" aria-label="Loading OFFDAY Collections"><div className="offday-home-loading-hero" /><div className="offday-home-loading-block" /></main>;
    }

    if (isError) {
        return <main className="offday-home-error" role="alert"><h1>We could not load the collection.</h1><p>{error?.response?.data?.detail || "Please try again in a moment."}</p><button type="button" onClick={() => refetch()}>Try again</button></main>;
    }

    return (
        <main className="offday-home">
            <section className="offday-hero" aria-label="Homepage hero images" aria-roledescription="carousel">
                {heroImage && <img key={heroBanner?.id ?? heroIndex} className="offday-hero-image" src={heroImage} alt={heroBanner?.title || heroBanner?.subtitle || "OFFDAY streetwear, worn for everyday"} fetchPriority="high" />}
                <div className="offday-hero-copy">
                    <p className="offday-eyebrow">{heroBanner?.subtitle || "Elevated everyday streetwear"}</p>
                    <h1 id="offday-hero-title">{heroBanner?.title || "MADE FOR\nYOUR OFFDAY."}</h1>
                    <p>{heroBanner?.description || "Relaxed fits. Considered essentials.\nMade for the days you choose."}</p>
                    <Link className="offday-button offday-button-lime" to="/collections/offday-drops">{heroBanner?.button_text || "Explore the collection"}</Link>
                </div>
                {heroBanners.length > 1 && (
                    <div className="offday-hero-controls" role="group" aria-label="Hero image controls">
                        <button className="offday-hero-arrow" type="button" aria-label="Previous hero image" onClick={() => setHeroIndex((heroIndex - 1 + heroBanners.length) % heroBanners.length)}>‹</button>
                        <div className="offday-hero-dots" aria-label={`Hero image ${heroIndex + 1} of ${heroBanners.length}`}>
                            {heroBanners.map((banner, index) => (
                                <button
                                    className={`offday-hero-dot${index === heroIndex ? " is-active" : ""}`}
                                    key={banner.id ?? index}
                                    type="button"
                                    aria-label={`Show hero image ${index + 1}`}
                                    aria-current={index === heroIndex ? "true" : undefined}
                                    onClick={() => setHeroIndex(index)}
                                />
                            ))}
                        </div>
                        <button className="offday-hero-arrow" type="button" aria-label="Next hero image" onClick={() => setHeroIndex((heroIndex + 1) % heroBanners.length)}>›</button>
                        <button className="offday-hero-autoplay" type="button" aria-label={heroAutoplay ? "Pause hero slideshow" : "Play hero slideshow"} aria-pressed={!heroAutoplay} onClick={() => setHeroAutoplay((playing) => !playing)}>{heroAutoplay ? "Pause" : "Play"}</button>
                    </div>
                )}
            </section>

            <div className="offday-marquee" aria-label="Oversized fits, heavyweight basics, everyday streetwear, drop 001">
                <div className="offday-marquee-track" aria-hidden="true">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <span key={index}>OVERSIZED FITS <b>✳</b> HEAVYWEIGHT BASICS <b>✳</b> EVERYDAY STREETWEAR <b>✳</b> DROP 001 <b>✳</b></span>
                    ))}
                </div>
            </div>

            <section className="offday-section offday-collections-section" aria-labelledby="offday-collections-title">
                <div className="offday-section-heading">
                    <div><p className="offday-eyebrow">Find your offday</p><h2 id="offday-collections-title">Shop the collections</h2></div>
                    <Link className="offday-text-link" to="/shop">View all <span aria-hidden="true">↗</span></Link>
                </div>
                <div className="offday-collection-grid">
                    {collections.slice(0, 4).map((collection) => {
                        const slug = collectionSlug(collection.name);
                        const image = collection.image ? getImageUrl(collection.image) : "";
                        return (
                            <Link className="offday-collection-card" to={`/collections/${slug}`} key={collection.id ?? slug}>
                                {image && <img src={image} alt="" loading="lazy" decoding="async" />}
                                <span className="offday-collection-kicker">OFFDAY</span>
                                <span className="offday-collection-title">{collection.name.replace(/^OFFDAY\s*/i, "")}</span>
                                <span className="offday-collection-arrow" aria-hidden="true">↗</span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="offday-section offday-drops-section" aria-labelledby="offday-drops-title">
                <div className="offday-section-heading">
                    <div><p className="offday-eyebrow">Just landed</p><h2 id="offday-drops-title">OFFDAY DROPS</h2></div>
                    <Link className="offday-text-link" to="/collections/offday-drops">Shop all drops <span aria-hidden="true">↗</span></Link>
                </div>
                {productsLoading ? (
                    <div className="offday-product-grid offday-home-products" aria-busy="true">{Array.from({ length: 4 }).map((_, index) => <div className="offday-product-skeleton" key={index} />)}</div>
                ) : products.length ? (
                    <div className="offday-product-grid offday-home-products">{products.slice(0, 4).map((product) => <OffdayProductCard key={product.id} product={product} />)}</div>
                ) : (
                    <p className="offday-empty-products">New pieces are on the way. Check back soon.</p>
                )}
            </section>

            <section className="offday-story" aria-labelledby="offday-story-title">
                <div className="offday-story-image">{storyImage && <img src={storyImage} alt="OFFDAY story section" loading="lazy" decoding="async" />}</div>
                <div className="offday-story-copy">
                    <p className="offday-eyebrow">A different kind of everyday</p>
                    <h2 id="offday-story-title">Less noise.<br />More you.</h2>
                    <p>We believe in what you wear should feel as good as it looks. Relaxed fits, considered details and room to move at your own pace.</p>
                    <Link className="offday-button offday-button-dark" to="/about">Discover OFFDAY</Link>
                </div>
            </section>

            <section className="offday-manifesto" aria-labelledby="offday-manifesto-title">
                <p className="offday-eyebrow">A different kind of everyday</p>
                <h2 id="offday-manifesto-title">YOUR TIME.<br />YOUR TERMS.</h2>
                <p>For the hours, plans and places that are yours alone.</p>
            </section>

            <section className="offday-wide-banner" aria-labelledby="offday-wide-title">
                {wideBannerImage && <img src={wideBannerImage} alt="OFFDAY campaign banner" loading="lazy" decoding="async" />}
                <div className="offday-wide-banner-copy"><p className="offday-eyebrow">Wear it your way</p><h2 id="offday-wide-title">OWN YOUR OFFDAY.</h2><Link className="offday-button offday-button-lime" to="/shop">Shop the edit</Link></div>
            </section>

            <section className="offday-newsletter" aria-labelledby="offday-newsletter-title">
                <p className="offday-eyebrow">A little note from us</p>
                <h2 id="offday-newsletter-title">Good things, occasionally.</h2>
                <p>New drops, considered pieces and a note when it matters.</p>
                {submitted ? (
                    <p className="offday-newsletter-success" role="status">Your address is saved for OFFDAY updates. Email delivery is not connected yet.</p>
                ) : (
                    <form className="offday-newsletter-form" onSubmit={submitNewsletter}>
                        <label className="offday-visually-hidden" htmlFor="offday-newsletter-email">Your email address</label>
                        <input id="offday-newsletter-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" />
                        <button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Sign up"}</button>
                        <label className="offday-newsletter-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /> I agree to receive occasional OFFDAY updates.</label>
                    </form>
                )}
            </section>
        </main>
    );
}

export default OffdayHome;
