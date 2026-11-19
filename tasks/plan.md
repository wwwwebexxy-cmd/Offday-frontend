# Offday Collections Storefront Redesign

## Goal

Replace the inherited storefront presentation with the OFFDAY Collections design in the supplied Brand Kit, Home Page, Collection Pages, Layout & Components, Responsive & Files PDFs, and demo HTML. Keep product/catalog content API-driven so products created in the admin dashboard appear without frontend edits. Work locally in `D:\Offday-frontend` and `D:\Offday-backend`; do not push, provision cloud resources, or deploy.

## Requirements

- Match the supplied OFFDAY visual system: Manrope headings, DM Sans body, acid lime `#C6F135`, near-black `#111111`, off-white `#F1F0E9`, fixed proportions for the supplied outline logo, and AED prices with no decimal places.
- Build the home page in the specified sequence: delivery bar, two-row sticky header, campaign hero, moving text rail, four dynamic collection tiles, OFFDAY DROPS product row, story, manifesto, wide banner, newsletter and four-column footer.
- Build a shared collection template for OFFDAY DROPS, OFFDAY BASICS, OFFDAY ESSENTIALS and OFFDAY WINTER COLLECTIONS. Resolve collections from backend categories and display backend products, images, prices and stock; do not hardcode catalog cards.
- Preserve the existing admin, authentication, product detail, cart and checkout flows while replacing public storefront branding and navigation.
- Use the supplied logo and three product photos. Add three sample products and their images to the local new database, not to frontend constants.
- Match responsive behavior at the 850px and 480px breakpoints, including 4-to-2 category/product grids, 3-to-2 collection grids, mobile menu, visible quick add, stacked story section and compact footer.
- Connect search, bag/checkout and newsletter interactions to the existing application/backend where available. Add the supporting contact, shipping, returns, FAQs, privacy and terms routes called out by the PDFs; mark business-specific details that have not been supplied rather than inventing them.
- Respect reduced-motion preferences, accessible labels/focus states, image loading behavior and text contrast in the PDFs.

## Architecture decisions

- Keep the current Django/React system and existing admin APIs. The local MySQL database has no product or category rows, so the PDF's four collection names will be seeded as category records and products will use the existing product/variant/image schema.
- Build new public-facing Offday components and styles, leaving admin dashboard screens isolated from storefront styles.
- Use the homepage and product APIs for page content; route collection URLs by a slug derived from the backend category name. Store product details and badges in existing backend fields.
- Use a small backend newsletter subscription endpoint only if no existing endpoint can receive signups. No email provider or social profile URLs were supplied, so the UI must not claim that unconfigured delivery/accounts are connected.

## Phases and checkpoints

### Phase 1 — Brand shell
- [ ] Add the Offday font/color tokens and global layout wrapper.
- [ ] Replace the public header and footer while keeping admin routing and existing account/cart features reachable.
- [ ] Checkpoint: no inherited store identity remains in customer-facing flows; admin remains outside the public shell.

### Phase 2 — Dynamic storefront
- [ ] Implement the homepage sections in PDF order, using API category/product data and supplied imagery.
- [ ] Implement dynamic collection routes and shared product cards with backend image, AED price, stock and quick-add behavior.
- [ ] Checkpoint: all four collection routes render from backend data; product additions require no frontend code change.

### Phase 3 — Supporting interactions and pages
- [ ] Connect search and cart actions to existing routes/APIs.
- [ ] Add newsletter capture and its backend persistence if necessary.
- [ ] Add the six support/legal page routes with clearly marked business details still awaiting owner input.
- [ ] Checkpoint: navigation, search, bag, signup feedback and support links are usable.

### Phase 4 — Sample data and responsive verification
- [ ] Create the four collection categories and three sample products in the local database using the provided product images.
- [ ] Verify 1440px, 850px and 480px layouts against the responsive PDF and check keyboard/reduced-motion behavior.
- [ ] Run the frontend build and focused checks; run Django checks and verify API responses and database rows.
- [ ] Checkpoint: worktree diff is reviewed, sample catalog is API-backed, no deployment/push occurred.

## Risks and open information

- Social URLs, customer-contact email, and approved shipping/returns/privacy/legal language are not in the supplied material. Keep their presentation editable and identify the fields still needed before launch.
- The supplied photos include two images of the same graphic T-shirt and one plain oversized T-shirt. Use them as product/gallery assets without inventing claims about materials or real stock; sample stock values will be labelled as development data.
- The actual production admin URL/credentials have not been provided. Seed only the confirmed local `new_store_db`; do not access or change a production database.
