import { faqs } from "@/data/site";
export const metadata = { title: "FAQ | Kobby's Intertech Services" };
export default function FaqPage() { return <main><section className="page-hero"><p className="eyebrow">Frequently asked questions</p><h1>Helpful answers before you get started.</h1><p>If you need something more specific, our team is ready to help.</p></section><section className="section faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section></main>; }
