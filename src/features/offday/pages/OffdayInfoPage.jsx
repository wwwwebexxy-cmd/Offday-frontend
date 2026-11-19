import { Link, useParams } from "react-router-dom";
import "./offdayInfoPage.css";

const pages = {
    about: {
        title: "Less noise. More you.",
        eyebrow: "Our point of view",
        intro: "OFFDAY Collections is elevated everyday streetwear for the UAE: relaxed fits and considered essentials, made for the days you choose.",
        paragraphs: ["We keep the pieces easy to wear and the details considered. A little more room to move, a little less noise."],
    },
    contact: {
        title: "We’re here to help.",
        eyebrow: "Contact OFFDAY",
        intro: "For product and order questions, get in touch with the OFFDAY Collections team.",
        paragraphs: ["OFFDAY contact details are being prepared. Please add the approved customer service email or WhatsApp number before opening the store."],
    },
    shipping: {
        title: "Shipping & delivery",
        eyebrow: "Getting your order to you",
        intro: "Complimentary UAE delivery applies to orders over AED 100.",
        paragraphs: ["Delivery charges for other orders, delivery areas and estimated timelines still need to be confirmed by OFFDAY Collections."],
    },
    returns: {
        title: "Returns & exchanges",
        eyebrow: "A better fit",
        intro: "The OFFDAY returns and exchange policy is being finalised.",
        paragraphs: ["Please add the approved return window, item condition rules, exchange process and refund timing before accepting customer orders."],
    },
    faqs: {
        title: "A few useful answers.",
        eyebrow: "FAQs",
        intro: "We’re putting the practical details together. Here is what is confirmed so far.",
        questions: [
            ["Where do you deliver?", "The store is designed for UAE delivery. Delivery areas and timing need confirmation."],
            ["Is delivery complimentary?", "UAE delivery is complimentary on orders over AED 100."],
            ["How do I exchange or return an item?", "The approved returns and exchanges process is still being prepared."],
            ["How do I contact OFFDAY?", "The customer service email or WhatsApp number has not been provided yet."],
        ],
    },
    privacy: {
        title: "Privacy",
        eyebrow: "Your information",
        intro: "This page needs OFFDAY’s approved privacy wording before the store opens.",
        paragraphs: ["The newsletter form stores an email address only after the visitor confirms consent. Newsletter email delivery is not connected yet. Please confirm the final retention, access and deletion process before collecting signups publicly."],
    },
    terms: {
        title: "Terms & conditions",
        eyebrow: "Store terms",
        intro: "The terms for purchases, payments and fulfilment need OFFDAY’s approval before orders are accepted.",
        paragraphs: ["Please add the approved business, order, payment, cancellation and dispute terms before opening the store."],
    },
};

function OffdayInfoPage({ page }) {
    const { slug } = useParams();
    const currentPage = page || slug || "contact";
    const content = pages[currentPage] || pages.contact;
    const contactEmail = import.meta.env.VITE_OFFDAY_CONTACT_EMAIL;
    const whatsappNumber = String(import.meta.env.VITE_OFFDAY_WHATSAPP_NUMBER || "").replace(/\D/g, "");

    return (
        <main className="offday-info-page">
            <header className="offday-info-heading">
                <p className="offday-eyebrow">{content.eyebrow}</p>
                <h1>{content.title}</h1>
                <p>{content.intro}</p>
            </header>
            <section className="offday-info-content">
                {content.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {currentPage === "contact" && contactEmail && <a className="offday-button offday-button-dark" href={`mailto:${contactEmail}`}>Email OFFDAY</a>}
                {currentPage === "contact" && whatsappNumber && <a className="offday-button offday-button-dark" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">Message OFFDAY</a>}
                {content.questions && <div className="offday-faq-list">{content.questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>}
                {currentPage === "contact" && <Link className="offday-text-link" to="/shop">Browse collections <span aria-hidden="true">↗</span></Link>}
            </section>
        </main>
    );
}

export default OffdayInfoPage;
