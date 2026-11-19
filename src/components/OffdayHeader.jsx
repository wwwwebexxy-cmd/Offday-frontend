import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiSearch, FiShoppingBag, FiX } from "react-icons/fi";
import Homepage_Query from "../features/home/queries/Homepage_Query";
import Cart_query from "../features/cart/queries/Cart_query";
import { collectionSlug, getCollections } from "../features/offday/collections";
import "./offdayHeader.css";

function OffdayHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const { data: homepageData } = Homepage_Query();
    const { data: cart = {} } = Cart_query();
    const collections = useMemo(() => getCollections(homepageData?.categories), [homepageData?.categories]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        setMenuOpen(false);
        setSearchOpen(false);
    }, [location.pathname, location.search]);

    const submitSearch = (event) => {
        event.preventDefault();
        const query = searchValue.trim();
        if (!query) return;
        navigate(`/shop?search=${encodeURIComponent(query)}`);
    };

    return (
        <header className="offday-header">
            <div className="offday-delivery-bar">
                Complimentary UAE delivery on orders over AED 100 <span aria-hidden="true">·</span> New season, new perspective
            </div>

            <div className="offday-header-main">
                <button
                    className="offday-header-icon offday-menu-toggle"
                    type="button"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
                </button>

                <button
                    className="offday-header-search-toggle"
                    type="button"
                    aria-label={searchOpen ? "Close search" : "Open search"}
                    aria-expanded={searchOpen}
                    onClick={() => setSearchOpen((open) => !open)}
                >
                    <FiSearch aria-hidden="true" />
                    <span>SEARCH</span>
                </button>

                <Link className="offday-header-logo" to="/" aria-label="OFFDAY Collections home">
                    <img src="/offday/offday-logo.png" alt="OFFDAY Collections" width="98" height="78" />
                </Link>

                <Link className="offday-header-bag" to="/checkout" aria-label={`Bag, ${cart.total_items ?? 0} items`}>
                    <FiShoppingBag aria-hidden="true" />
                    <span className="offday-bag-label">BAG</span>
                    <span className="offday-bag-count" aria-hidden="true">{cart.total_items ?? 0}</span>
                </Link>

                {searchOpen && (
                    <form className="offday-search-panel" role="search" onSubmit={submitSearch}>
                        <label className="offday-visually-hidden" htmlFor="offday-site-search">Search products</label>
                        <input
                            id="offday-site-search"
                            autoFocus
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Search the collection"
                        />
                        <button type="submit" aria-label="Search"><FiSearch aria-hidden="true" /></button>
                    </form>
                )}
            </div>

            <nav className="offday-desktop-nav" aria-label="Collections">
                {collections.map((collection) => (
                    <NavLink key={collection.id ?? collectionSlug(collection.name)} to={`/collections/${collectionSlug(collection.name)}`}>
                        {collection.name}
                    </NavLink>
                ))}
            </nav>

            {menuOpen && (
                <nav className="offday-mobile-menu" aria-label="Main menu">
                    {collections.map((collection) => (
                        <NavLink key={collection.id ?? collectionSlug(collection.name)} to={`/collections/${collectionSlug(collection.name)}`}>
                            <span>{collection.name}</span><span aria-hidden="true">↗</span>
                        </NavLink>
                    ))}
                    <Link to="/shop">Shop all</Link>
                    <Link to="/about">Our story</Link>
                    <Link to="/help/contact">Contact</Link>
                    <Link to="/profile">My account</Link>
                    <Link to="/wishlist">Wishlist</Link>
                </nav>
            )}
        </header>
    );
}

export default OffdayHeader;
