import { describe, expect, it } from "vitest";
import { collectionSlug, getCollections } from "./collections";

describe("Offday collection resolution", () => {
    it("provides the four design collections while catalog data is loading", () => {
        expect(getCollections([]).map(({ slug }) => slug)).toEqual([
            "offday-drops",
            "offday-basics",
            "offday-essentials",
            "offday-winter-collections",
        ]);
    });

    it("orders backend collections by the approved storefront sequence", () => {
        const categories = [
            { id: 4, name: "OFFDAY WINTER COLLECTIONS", is_active: true },
            { id: 2, name: "OFFDAY BASICS", is_active: true },
            { id: 3, name: "OFFDAY ESSENTIALS", is_active: true },
            { id: 1, name: "OFFDAY DROPS", is_active: true },
            { id: 5, name: "OFFDAY ARCHIVE", is_active: true },
            { id: 6, name: "OFFDAY HIDDEN", is_active: false },
        ];

        expect(getCollections(categories).map(({ id }) => id)).toEqual([1, 2, 3, 4, 5]);
    });

    it("creates stable route slugs from category names", () => {
        expect(collectionSlug("OFFDAY WINTER COLLECTIONS")).toBe("offday-winter-collections");
        expect(collectionSlug("OFFDAY — Limited / Drop 01")).toBe("offday-limited-drop-01");
    });
});
