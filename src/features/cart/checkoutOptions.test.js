import { describe, expect, it } from "vitest";
import {
    buildWhatsAppCheckoutMessage,
    buildWhatsAppCheckoutUrl,
    CHECKOUT_PAYMENT_METHOD,
    CHECKOUT_PAYMENT_OPTIONS,
    CHECKOUT_WHATSAPP_NUMBER,
} from "./checkoutOptions";

describe("WhatsApp-only checkout", () => {
    it("exposes WhatsApp as the only checkout method", () => {
        expect(CHECKOUT_PAYMENT_METHOD).toBe("WHATSAPP");
        expect(CHECKOUT_PAYMENT_OPTIONS.map((option) => option.value)).toEqual(["WHATSAPP"]);
    });

    it("uses the configured WhatsApp number and includes customer details", () => {
        const address = {
            full_name: "Azhar",
            phone: "+971 50 000 0000",
            address_line: "Al Nahda",
            city: "Dubai",
            emirate: "Dubai",
            postal_code: "00000",
            country: "UAE",
        };
        const items = [{
            product_name: "Drop Graphic Tee",
            quantity: 2,
            variant_size: 7,
            unit_type: "Size",
            size: "M",
            color: "Black",
            total_price: "25.50",
        }];

        const message = buildWhatsAppCheckoutMessage({
            orderId: 12,
            address,
            items,
            total: "25.50",
        });
        const whatsappNumber = "15550101010";
        const url = buildWhatsAppCheckoutUrl({ orderId: 12, address, items, total: "25.50", whatsappNumber });

        expect(url).toContain(`https://wa.me/${whatsappNumber}?text=`);
        expect(message).toContain("Azhar");
        expect(message).toContain("Al Nahda");
        expect(message).toContain("City/Emirate: Dubai, Dubai");
        expect(message).toContain("Postal code: 00000");
        expect(message).toContain("Size: M");
        expect(message).toContain("Color: Black");
        expect(message).toContain("AED 25.50");
        expect(decodeURIComponent(url)).toContain("Drop Graphic Tee");
    });

    it("builds a direct WhatsApp request without inventing an order number", () => {
        const url = buildWhatsAppCheckoutUrl({
            address: { full_name: "Azhar", city: "Dubai" },
            items: [{ product_name: "Drop Graphic Tee", quantity: 1, total_price: "10" }],
            total: "10",
            whatsappNumber: "15550101010",
        });

        const message = decodeURIComponent(url);
        expect(message).toContain("I would like to place this order via WhatsApp.");
        expect(message).not.toContain("ORD-000000");
    });

    it("does not create an order URL until the new store number is configured", () => {
        expect(() => buildWhatsAppCheckoutUrl({ items: [], total: 0, whatsappNumber: "" })).toThrow(/not configured/i);
    });
});
