import Contact from "@/components/sections/Contact/Contact";
import PageHero from "@/components/kg/PageHero";

export default function ContactPage() {
    return (
        <main className="kg kg-main">
            <PageHero
                label="Contact"
                title={<>Get in<br /><span style={{ color: "#F4B400" }}>touch.</span></>}
                lede="The KG Runners team in Ravulapalem is happy to help with anything about the Konaseema Half Marathon."
            />
            <Contact />
        </main>
    );
}
