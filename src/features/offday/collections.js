export const DEFAULT_COLLECTIONS = [
    { name: "OFFDAY DROPS", slug: "offday-drops" },
    { name: "OFFDAY BASICS", slug: "offday-basics" },
    { name: "OFFDAY ESSENTIALS", slug: "offday-essentials" },
    { name: "OFFDAY WINTER COLLECTIONS", slug: "offday-winter-collections" },
];

export function collectionSlug(name = "") {
    return String(name)
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export function getCollections(categories) {
    const active = Array.isArray(categories)
        ? categories.filter((category) => category?.is_active !== false && /^OFFDAY\b/i.test(category?.name || ""))
        : [];

    if (!active.length) return DEFAULT_COLLECTIONS;

    const ordered = DEFAULT_COLLECTIONS.map((preferred) =>
        active.find((category) => collectionSlug(category.name) === preferred.slug),
    ).filter(Boolean);
    const knownSlugs = new Set(ordered.map((category) => collectionSlug(category.name)));
    return [...ordered, ...active.filter((category) => !knownSlugs.has(collectionSlug(category.name)))];
}
