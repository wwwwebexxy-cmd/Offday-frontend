import { Link } from "react-router-dom";
import { collectionSlug, getCollections } from "../features/offday/collections";
import Homepage_Query from "../features/home/queries/Homepage_Query";
import "./offdayFooter.css";

function OffdayFooter() {
    const { data: homepageData } = Homepage_Query();
    const collections = getCollections(homepageData?.categories);
    const instagramUrl = import.meta.env.VITE_OFFDAY_INSTAGRAM_URL;
    const facebookUrl = import.meta.env.VITE_OFFDAY_FACEBOOK_URL;

    return (
        <footer className="offday-footer">
            <div className="offday-footer-grid">
                <div className="offday-footer-brand">
                    <Link to="/" aria-label="OFFDAY Collections home">
                        <img src="/offday/offday-logo.png" alt="OFFDAY Collections" width="164" height="130" loading="lazy" />
                    </Link>
                    <p>Made for comfort. Designed for everyday. Streetwear for the days you choose.</p>
                </div>

                <div className="offday-footer-column">
                    <h2>COLLECTIONS</h2>
                    <ul>
                        {collections.map((collection) => (
                            <li key={collection.id ?? collectionSlug(collection.name)}>
                                <Link to={`/collections/${collectionSlug(collection.name)}`}>{collection.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="offday-footer-column">
                    <h2>HELP</h2>
                    <ul>
                        <li><Link to="/help/contact">Contact</Link></li>
                        <li><Link to="/help/shipping">Shipping &amp; delivery</Link></li>
                        <li><Link to="/help/returns">Returns &amp; exchanges</Link></li>
                        <li><Link to="/help/faqs">FAQs</Link></li>
                    </ul>
                </div>

                <div className="offday-footer-column">
                    <h2>FOLLOW ALONG</h2>
                    <ul>
                        {instagramUrl && <li><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a></li>}
                        {facebookUrl && <li><a href={facebookUrl} target="_blank" rel="noreferrer">Facebook</a></li>}
                        {!instagramUrl && !facebookUrl && <li><span className="offday-footer-pending">Social links coming soon</span></li>}
                    </ul>
                </div>
            </div>

            <div className="offday-footer-bottom">
                <span>© {new Date().getFullYear()} OFFDAY COLLECTIONS. All rights reserved.</span>
                <span>UAE · AED</span>
                <nav aria-label="Legal information">
                    <Link to="/help/privacy">Privacy</Link>
                    <Link to="/help/terms">Terms</Link>
                </nav>
            </div>
        </footer>
    );
}

export default OffdayFooter;
