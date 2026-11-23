import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { addToCart_Post } from "../../single product/api/AddToCart_Api";
import { hasAuthSession } from "../../auth/authUtils";
import { getProductDetailsPath } from "../../../utils/productUrl";
import { getImageUrl } from "../../../utils/imageUrl";
import showToast from "../../../utils/toast";
import ProductMessageRail from "../../home/components/ProductMessageRail";
import "./offdayProductCard.css";

function getVariant(product) {
    const variants = Array.isArray(product?.variants) ? product.variants : [];
    const matchingDefault = variants.find((variant) => String(variant.id) === String(product?.default_variant_id));
    return matchingDefault || variants[0] || (product?.default_variant_id ? { id: product.default_variant_id } : null);
}

function getVariantUnit(product, variant) {
    const units = variant?.sizes || variant?.units || [];
    return units.find((unit) => String(unit.id) === String(product?.default_variant_unit_id)) || units[0] || null;
}

function getProductImage(product, variant) {
    const primary = variant?.images?.find((image) => image.is_primary)?.image;
    return product?.product_image || primary || variant?.images?.[0]?.image || product?.image || null;
}

function getProductPrice(product, variant, unit) {
    return product?.discounted_price
        ?? product?.current_price
        ?? product?.starting_price
        ?? unit?.discounted_price
        ?? unit?.price
        ?? variant?.discounted_price
        ?? variant?.price
        ?? null;
}

function getProductStock(product, variant, unit) {
    if (typeof product?.in_stock === "boolean") return product.in_stock;
    const stock = unit?.stock ?? variant?.stock ?? product?.stock;
    return stock === undefined || stock === null ? true : Number(stock) > 0;
}

function OffdayProductCard({ product }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const variant = useMemo(() => getVariant(product), [product]);
    const unit = useMemo(() => getVariantUnit(product, variant), [product, variant]);
    const image = getProductImage(product, variant);
    const price = getProductPrice(product, variant, unit);
    const inStock = getProductStock(product, variant, unit);
    const badge = product?.marketing_highlights?.[0]?.text || product?.key_features?.[0] || "";
    const details = product?.subcategory?.name || product?.description?.split(/[.\n]/)[0] || "Everyday fit";
    const productPath = getProductDetailsPath(product);

    const quickAdd = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!inStock) return;
        if (!hasAuthSession()) {
            showToast.info("Please log in to add this to your bag");
            navigate("/login");
            return;
        }
        if (!variant?.id || (variant.price_type === "multiple" && !unit?.id)) {
            navigate(productPath);
            return;
        }

        try {
            await addToCart_Post({ variant: variant.id, variant_size: unit?.id ?? null });
            await queryClient.invalidateQueries({ queryKey: ["cart"] });
            showToast.success("Added to your bag");
        } catch (error) {
            showToast.error(error?.response?.data?.detail || "Could not add this item to your bag");
        }
    };

    return (
        <article className="offday-product-card">
            <div className="offday-product-media">
                <Link className="offday-product-image" to={productPath} aria-label={`View ${product.name}`}>
                    {badge && <span className="offday-product-badge">{badge}</span>}
                    {image ? (
                        <img src={getImageUrl(image)} alt={product.name} loading="lazy" decoding="async" />
                    ) : (
                        <span className="offday-product-image-empty" aria-hidden="true">OFFDAY</span>
                    )}
                </Link>
                <button
                    className="offday-quick-add"
                    type="button"
                    onClick={quickAdd}
                    disabled={!inStock}
                >
                    {inStock ? "QUICK ADD +" : "OUT OF STOCK"}
                </button>
            </div>
            <div className="offday-product-copy">
                <div className="offday-product-name-row">
                    <Link className="offday-product-name" to={productPath}>{product.name}</Link>
                    <span className="offday-product-price">{price === null ? "Price on request" : `AED ${Math.round(Number(price))}`}</span>
                </div>
                <ProductMessageRail messages={product.product_messages} />
                <p>{details}</p>
            </div>
        </article>
    );
}

export default OffdayProductCard;
