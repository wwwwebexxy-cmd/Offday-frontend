import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const configuredSiteUrl = String(import.meta.env.VITE_OFFDAY_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "");
const DEFAULT_TITLE = "OFFDAY Collections — Made for Comfort";
const DEFAULT_DESCRIPTION = "Elevated everyday streetwear and considered essentials from OFFDAY Collections.";
const SHARE_IMAGE_PATH = "/offday/offday-logo.png";

const routeMeta = [
    { match: /^\/$/, title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
    { match: /^\/(shop|products)\/?$/, title: "Shop | OFFDAY Collections", description: "Explore relaxed fits and considered everyday essentials from OFFDAY Collections." },
    { match: /^\/collections\//, title: "Collections | OFFDAY Collections", description: "Explore the OFFDAY DROPS, BASICS, ESSENTIALS and WINTER collections." },
    { match: /^\/about\/?$/, title: "Our story | OFFDAY Collections", description: "Meet OFFDAY Collections: elevated everyday streetwear for the UAE." },
    { match: /^\/contact\/?$|^\/help\//, title: "Help | OFFDAY Collections", description: "Find OFFDAY Collections contact, delivery, returns and store information." },
    { match: /^\/offers\/?$/, title: "Offers | OFFDAY Collections", description: "Explore current offers from OFFDAY Collections." },
    { match: /^\/single\//, title: "Product details | OFFDAY Collections", description: "View product information, price and availability from OFFDAY Collections." },
];

function setMeta(attribute, value, content) {
    let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
}

function SeoHead() {
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname || "/";
        const metadata = routeMeta.find((route) => route.match.test(pathname)) || {
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
        };
        const siteUrl = configuredSiteUrl || window.location.origin;
        const canonicalUrl = `${siteUrl}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
        const shareImage = `${siteUrl}${SHARE_IMAGE_PATH}`;

        document.title = metadata.title;
        setMeta("name", "description", metadata.description);
        setMeta("property", "og:title", metadata.title);
        setMeta("property", "og:description", metadata.description);
        setMeta("property", "og:url", canonicalUrl);
        setMeta("property", "og:image", shareImage);
        setMeta("name", "twitter:title", metadata.title);
        setMeta("name", "twitter:description", metadata.description);
        setMeta("name", "twitter:image", shareImage);

        let canonical = document.head.querySelector("link[rel=canonical]");
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;
    }, [location.pathname]);

    return null;
}

export default SeoHead;
