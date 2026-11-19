import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Homepage_Query from "../../home/queries/Homepage_Query";
import Product_Query from "../../sale/queries/Product_Query";
import { collectionSlug, getCollections } from "../collections";
import OffdayProductCard from "../components/OffdayProductCard";
import "./offdayCatalog.css";

const copy = {
    "offday-drops": { eyebrow: "Just landed.", description: "Fresh pieces, released in small drops. When they are gone, they are gone." },
    "offday-basics": { eyebrow: "Everyday staples.", description: "The simple, comfortable pieces you will reach for again and again." },
    "offday-essentials": { eyebrow: "Made for every day.", description: "Versatile, easy layers that work from slow mornings to late plans." },
    "offday-winter-collections": { eyebrow: "Layer up.", description: "Warm, relaxed layers for cooler days and evenings out." },
};

function OffdayCatalogPage() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const { data: homepageData = {}, isLoading: categoriesLoading } = Homepage_Query();
    const collections = useMemo(() => getCollections(homepageData.categories), [homepageData.categories]);
    const collection = slug ? collections.find((item) => collectionSlug(item.name) === slug) : null;
    const search = searchParams.get("search")?.trim() || "";
    const offer = searchParams.get("offer") === "true";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const filter = useMemo(() => ({
        ...(collection?.id ? { category: collection.id } : {}),
        ...(search ? { search } : {}),
        ...(offer ? { offer: true } : {}),
        page,
        page_size: 12,
    }), [collection?.id, search, offer, page]);
    const { data: productPage, isLoading, isError, error } = Product_Query(filter, { enabled: !categoriesLoading && (!slug || Boolean(collection?.id)) });
    const products = productPage?.results || [];
    const productCount = Number(productPage?.count ?? products.length);
    const title = collection?.name || (search ? "Search results" : offer ? "OFFDAY offers" : "Shop all collections");
    const description = copy[collection ? collectionSlug(collection.name) : ""]?.description
        || (search ? `Showing pieces for “${search}”.` : "Explore relaxed fits and considered everyday essentials.");

    if (categoriesLoading || (slug && !collection && categoriesLoading)) {
        return <main className="offday-catalog-loading" aria-busy="true"><div className="offday-catalog-banner-skeleton" /><div className="offday-catalog-grid-skeleton" /></main>;
    }

    if (slug && !collection) {
        return <main className="offday-catalog-state"><p className="offday-eyebrow">Collection unavailable</p><h1>We could not find that collection.</h1><Link className="offday-button offday-button-dark" to="/shop">Browse all pieces</Link></main>;
    }

    return (
        <main className="offday-catalog-page">
            <header className="offday-collection-banner">
                <p className="offday-eyebrow">{copy[collection ? collectionSlug(collection.name) : ""]?.eyebrow || "OFFDAY COLLECTIONS"}</p>
                <h1>{title}</h1>
                <p>{description}</p>
            </header>

            {!collection && !search && !offer && (
                <nav className="offday-catalog-collections" aria-label="Shop collections">
                    {collections.map((item) => <Link key={item.id ?? collectionSlug(item.name)} to={`/collections/${collectionSlug(item.name)}`}>{item.name}</Link>)}
                </nav>
            )}

            <section className="offday-catalog-results" aria-labelledby="offday-catalog-results-title">
                <div className="offday-catalog-count-row"><h2 id="offday-catalog-results-title">{isLoading ? "Loading pieces" : `${productCount} ${productCount === 1 ? "piece" : "pieces"}`}</h2></div>
                {isLoading ? (
                    <div className="offday-product-grid offday-collection-products" aria-busy="true">{Array.from({ length: 6 }).map((_, index) => <div className="offday-product-skeleton" key={index} />)}</div>
                ) : isError ? (
                    <div className="offday-catalog-state" role="alert"><p>{error?.response?.data?.detail || "We could not load these pieces."}</p></div>
                ) : products.length ? (
                    <div className="offday-product-grid offday-collection-products">{products.map((product) => <OffdayProductCard key={product.id} product={product} />)}</div>
                ) : (
                    <p className="offday-empty-products">No pieces are listed here yet. Check back soon.</p>
                )}

                {Number(productPage?.count || 0) > 12 && (
                    <div className="offday-catalog-pagination">
                        {page > 1 && <Link to={`?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) })}`}>Previous</Link>}
                        <span>Page {page}</span>
                        {page * 12 < Number(productPage.count) && <Link to={`?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) })}`}>Next</Link>}
                    </div>
                )}
            </section>
        </main>
    );
}

export default OffdayCatalogPage;
