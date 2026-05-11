import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./components/LanguageContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Capabilities from "./components/Capabilities";
import Portfolio from "./components/Portfolio";
import Industries from "./components/Industries";
import Testimonials from "./components/Testimonials";
import Certifications from "./components/Certifications";
import Leadership from "./components/Leadership";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppFAB from "./components/WhatsAppFAB";
import ProjectDetail from "./pages/ProjectDetail";
import { useReveal } from "./hooks/useReveal";

const ScrollToHash = () => {
    const { hash, pathname } = useLocation();
    useEffect(() => {
        if (hash) {
            const id = hash.replace("#", "");
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 80);
        } else {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [hash, pathname]);
    return null;
};

const Home = () => {
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
                <Testimonials />
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
                <BrowserRouter>
                    <ScrollToHash />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects/:slug" element={<ProjectDetail />} />
                    </Routes>
                    <WhatsAppFAB />
                </BrowserRouter>
            </LanguageProvider>
        </div>
    );
}

export default App;
