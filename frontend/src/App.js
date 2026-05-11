import React from "react";
import "./App.css";
import { LanguageProvider } from "./components/LanguageContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Capabilities from "./components/Capabilities";
import Portfolio from "./components/Portfolio";
import Industries from "./components/Industries";
import Certifications from "./components/Certifications";
import Leadership from "./components/Leadership";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useReveal } from "./hooks/useReveal";

const Page = () => {
    useReveal();
    return (
        <>
            <Header />
            <main>
                <Hero />
                <About />
                <Services />
                <Capabilities />
                <Portfolio />
                <Industries />
                <Certifications />
                <Leadership />
                <Contact />
            </main>
            <Footer />
        </>
    );
};

function App() {
    return (
        <div className="App">
            <LanguageProvider>
                <Page />
            </LanguageProvider>
        </div>
    );
}

export default App;
