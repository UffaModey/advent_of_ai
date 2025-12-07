Create a .tsx file with the code below. Make it th root of the project:

import React, { useState, useEffect } from 'react';

const GameXWebsite = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isGoTopVisible, setIsGoTopVisible] = useState(false);

  // Handle navigation toggle
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Handle scroll for go-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 800) {
        setIsGoTopVisible(true);
      } else {
        setIsGoTopVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Custom styles (CSS variables and complex styles that can't be easily converted to Tailwind)
  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Sonsie+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Oswald:wght@300;400;500;600;700&display=swap');

    :root {
      --raisin-black-1: hsl(234, 14%, 14%);
      --raisin-black-2: hsl(231, 12%, 12%);
      --raisin-black-3: hsl(228, 12%, 17%);
      --eerie-black: hsl(240, 11%, 9%);
      --light-gray: hsl(0, 0%, 80%);
      --platinum: hsl(0, 4%, 91%);
      --xiketic: hsl(275, 24%, 10%);
      --orange: hsl(31, 100%, 51%);
      --white: hsl(0, 0%, 100%);
      --onyx: hsl(240, 5%, 26%);
      --polygon-1: polygon(90% 0, 100% 34%, 100% 100%, 10% 100%, 0 66%, 0 0);
      --polygon-2: polygon(0 0, 100% 0%, 82% 100%, 0% 100%);
      --polygon-3: polygon(0 0, 100% 0%, 100% 100%, 18% 100%);
      --polygon-4: polygon(96% 0, 100% 36%, 100% 100%, 4% 100%, 0 66%, 0 0);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Poppins', sans-serif; overflow-x: hidden; background: var(--eerie-black); }
    body.nav-open { overflow-y: hidden; }
    a { text-decoration: none; color: inherit; }
    button { background: none; border: none; cursor: pointer; font: inherit; }
    input { font: inherit; width: 100%; border: none; }

    .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 12px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: var(--raisin-black-2); }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 10px; }

    /* Custom button styles */
    .btn-custom {
      color: var(--white);
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 13px 34px;
      clip-path: var(--polygon-1);
      transition: all 0.15s ease-in-out;
    }

    .btn-primary-custom {
      background-color: var(--orange);
    }
    .btn-primary-custom:hover {
      background: var(--raisin-black-1);
    }

    .btn-secondary-custom {
      background: var(--white);
      color: var(--orange);
    }
    .btn-secondary-custom:hover {
      background: var(--raisin-black-1);
      color: var(--white);
    }

    .btn-link-custom:hover {
      color: var(--orange);
    }

    /* Header styles */
    .header-custom {
      background-color: var(--raisin-black-1);
      box-shadow: 0 3px 7px hsla(0, 0%, 0%, 0.5);
    }

    /* Navigation styles */
    .navbar-custom {
      background: var(--raisin-black-2);
      box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.5);
      transition: all 0.25s ease-out;
    }

    .navbar-link-custom {
      color: var(--white);
      font-size: 15px;
      font-weight: 500;
      border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
      transition: all 0.15s ease-in-out;
    }
    .navbar-link-custom:hover {
      color: var(--orange);
    }

    /* Hero section */
    .hero-custom {
      background: url('https://i.postimg.cc/XqXRdnV1/hero-banner.jpg') no-repeat center;
      background-size: cover;
      min-height: 100vh;
      position: relative;
    }

    .hero-title-custom {
      font-family: 'Sonsie One', sans-serif;
      font-size: clamp(54px, 8vw, 150px);
      color: var(--white);
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .hero-subtitle-custom {
      color: var(--white);
      font-family: 'Oswald', sans-serif;
      font-size: 18px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 12px;
      text-shadow: 0 7px hsla(0, 0%, 0%, 0.4);
      margin-bottom: 15px;
    }

    /* Section wrapper */
    .section-wrapper-custom {
      background: url('https://i.postimg.cc/VvvgBg2R/section-wrapper-bg.jpg') no-repeat center;
      background-size: cover;
    }

    /* About section */
    .about-custom {
      background: url('https://i.postimg.cc/8zmyG7dL/about-img-shadow.png') no-repeat center;
      background-size: 100%;
      padding: 120px 0 60px;
    }

    .about-content-custom {
      background: var(--raisin-black-1);
      color: var(--white);
      padding: 40px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 4px hsla(0, 0%, 0%, 0.2);
    }

    .about-subtitle-custom {
      color: var(--orange);
      font-family: 'Oswald', sans-serif;
      font-size: 15px;
      font-weight: 500;
      text-transform: uppercase;
      margin-bottom: 15px;
    }

    .about-title-custom {
      font-family: 'Oswald', sans-serif;
      font-size: 34px;
      line-height: 1.2;
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    .about-title-strong {
      color: var(--orange);
    }

    /* Tournament section */
    .tournament-custom {
      padding: 60px 0;
      color: var(--white);
      text-align: center;
    }

    .tournament-subtitle-custom {
      color: var(--orange);
      font-family: 'Oswald', sans-serif;
      font-weight: 500;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .tournament-title-custom {
      font-family: 'Oswald', sans-serif;
      font-size: 30px;
      text-transform: uppercase;
      line-height: 1.2;
      margin-bottom: 20px;
    }

    .tournament-prize-data {
      background: var(--orange);
      color: var(--raisin-black-1);
      font-family: 'Oswald', sans-serif;
      font-size: 26px;
      padding: 8px 42px;
      border-radius: 50px;
      cursor: pointer;
      display: inline-block;
    }

    .tournament-winners-custom {
      background: var(--raisin-black-3);
      padding: 40px 30px;
      border-radius: 4px;
      box-shadow: 0 2px 4px hsla(0, 0%, 0%, 0.2);
    }

    .winner-card-title {
      background: var(--orange);
      font-size: 13px;
      text-transform: uppercase;
      padding: 6px 10px;
      border-radius: 4px;
      display: inline-block;
    }

    /* Gallery styles */
    .gallery-custom {
      padding: 60px 0;
    }

    .gallery-list-custom {
      display: flex;
      gap: 15px;
      overflow-x: auto;
      padding-bottom: 15px;
      scroll-snap-type: x mandatory;
      padding: 0 15px 15px;
    }

    .gallery-item-custom {
      min-width: 95%;
      scroll-snap-align: center;
      border-radius: 4px;
      box-shadow: 0 2px 4px hsla(0, 0%, 0%, 0.2);
    }

    /* Team section */
    .team-custom {
      padding: 60px 0;
    }

    .section-title-custom {
      position: relative;
      text-align: center;
      margin-bottom: 80px;
      font-size: 34px;
      color: var(--white);
      line-height: 1.2;
      text-transform: uppercase;
      font-family: 'Oswald', sans-serif;
    }

    .section-title-custom::before,
    .section-title-custom::after {
      content: '';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      height: 5px;
      width: 120px;
      background: var(--orange);
      border-radius: 0 0 5px 5px;
    }

    .section-title-custom::before {
      bottom: -23px;
      height: 4px;
      width: 30px;
    }

    .team-member-custom {
      border-radius: 50%;
      border: 3px solid var(--raisin-black-3);
      transition: all 0.15s ease-in-out;
      position: relative;
      overflow: hidden;
    }

    .team-member-custom:hover {
      border-color: var(--orange);
    }

    .team-member-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--orange);
      font-size: 50px;
      opacity: 0;
      transition: all 0.15s ease-in-out;
    }

    .team-member-custom:hover .team-member-icon {
      opacity: 1;
    }

    /* Gears section */
    .gears-custom {
      padding: 60px 0;
    }

    .gears-card-custom {
      margin-bottom: 50px;
    }

    .gears-card-banner {
      position: relative;
      background: url('https://i.postimg.cc/JhHdWL8j/gears-card-bg.png') no-repeat center;
      background-size: contain;
      width: 100%;
      aspect-ratio: 2 / 1.7;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
    }

    .share-btn-custom {
      position: absolute;
      top: 25%;
      right: 8%;
      font-size: 20px;
      border: 2px solid var(--onyx);
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: var(--orange);
      transition: all 0.15s ease-in-out;
    }

    .share-btn-custom:hover {
      border-color: var(--orange);
    }

    .card-time-wrapper-custom {
      position: absolute;
      top: 2%;
      right: 5%;
      font-family: 'Oswald', sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--orange);
    }

    .gears-card-content {
      color: var(--white);
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: uppercase;
    }

    .gears-card-title {
      font-family: 'Oswald', sans-serif;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .gears-card-subtitle {
      color: var(--light-gray);
      font-size: 15px;
    }

    .gears-card-prize {
      font-family: 'Oswald', sans-serif;
      font-size: 22px;
      font-weight: 700;
    }

    .gears-card-btn {
      background: var(--orange);
      color: var(--white);
      padding: 18px 20px;
      clip-path: polygon(75% 0, 100% 25%, 100% 100%, 25% 100%, 0 75%, 0 0);
    }

    /* Newsletter section */
    .newsletter-custom {
      padding: 60px 0 120px;
    }

    .newsletter-card-custom {
      background: url('https://i.postimg.cc/43KzBDHM/newsletter-bg.jpg') no-repeat center;
      background-size: cover;
      padding: 50px 25px;
      border-radius: 12px;
      text-align: center;
    }

    .newsletter-title-custom {
      font-size: 30px;
      color: var(--white);
      font-family: 'Oswald', sans-serif;
      text-transform: uppercase;
    }

    .newsletter-input-custom {
      background: hsla(0, 0%, 0%, 0.2);
      color: var(--white);
      border: 1px solid var(--white);
      font-size: 13px;
      padding: 17px 25px;
      margin-bottom: 15px;
      width: 100%;
    }

    .newsletter-input-custom:focus {
      background: hsla(0, 0%, 0%, 0.4);
      outline: none;
    }

    .newsletter-input-custom::placeholder {
      color: inherit;
      font-size: 14px;
    }

    /* Footer styles */
    .footer-top-custom {
      background: url('https://i.postimg.cc/VkDjmjCj/footer-bg.jpg') no-repeat center;
      background-size: cover;
      padding: 60px 0;
    }

    .footer-brand-wrapper-custom {
      position: relative;
      padding-bottom: 30px;
      border-bottom: 1px solid hsl(229, 14%, 8%);
      margin-bottom: 50px;
    }

    .footer-brand-wrapper-custom::after {
      content: "";
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 1px;
      background: hsla(0, 0%, 0%, 0.2);
    }

    .footer-menu-link-custom {
      color: var(--platinum);
      font-family: 'Oswald', sans-serif;
      font-size: 22px;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 5px 10px;
      transition: all 0.15s ease-in-out;
    }

    .footer-menu-link-custom:hover {
      color: var(--orange);
    }

    .footer-input-wrapper-custom {
      position: relative;
      max-width: 260px;
      margin: 0 auto;
    }

    .footer-input-custom {
      background: var(--xiketic);
      color: var(--white);
      font-size: 13px;
      padding: 17px 25px;
      clip-path: polygon(93% 0, 100% 30%, 100% 100%, 7% 100%, 0 63%, 0 0);
    }

    .footer-input-custom::placeholder {
      font-size: 14px;
    }

    .footer-input-custom:focus {
      outline: none;
    }

    .footer-input-btn {
      position: absolute;
      top: 0;
      right: 0;
      padding: 17px;
      clip-path: polygon(70% 0, 100% 30%, 100% 100%, 30% 100%, 0 63%, 0 0);
    }

    .footer-input-btn:hover {
      background: var(--white);
      color: var(--orange);
    }

    .quicklink-item-custom {
      color: var(--light-gray);
      font-family: 'Oswald', sans-serif;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 5px 10px;
      transition: all 0.15s ease-in-out;
    }

    .quicklink-item-custom:hover {
      color: var(--orange);
    }

    .footer-social-link-custom {
      background: var(--xiketic);
      color: var(--light-gray);
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border-radius: 50%;
      transition: all 0.15s ease-in-out;
    }

    .footer-social-link-custom:hover {
      color: var(--orange);
    }

    .footer-bottom-custom {
      padding: 25px 0;
      background: var(--xiketic);
      text-align: center;
    }

    .copyright-custom {
      color: var(--light-gray);
      font-family: 'Oswald', sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      margin-bottom: 15px;
    }

    .copyright-link {
      color: var(--orange);
      display: inline;
    }

    /* Go-top button */
    .go-top-custom {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 15px;
      clip-path: polygon(70% 0, 100% 30%, 100% 100%, 30% 100%, 0 70%, 0 0);
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      transition: all 0.15s ease-in-out;
      z-index: 1000;
    }

    .go-top-custom.active {
      visibility: visible;
      opacity: 1;
      pointer-events: all;
    }

    .go-top-custom:hover {
      background: var(--white);
      color: var(--orange);
    }

    /* Responsive styles */
    @media (min-width: 768px) {
      .hero-subtitle-custom {
        font-size: 25px;
        letter-spacing: 30px;
      }

      .gallery-item-custom {
        min-width: 70%;
      }

      .gears-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
      }
    }

    @media (min-width: 1024px) {
      .gears-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .navbar-custom {
        position: static;
        background: none;
        box-shadow: none;
        visibility: visible;
        opacity: 1;
        transform: none;
      }

      .nav-toggle-btn {
        display: none;
      }
    }

    @media (min-width: 1200px) {
      .hero-title-custom {
        font-size: 150px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className={`min-h-screen ${isNavOpen ? 'nav-open' : ''}`}>
        {/* Overlay */}
        {isNavOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-10"
            onClick={toggleNav}
          />
        )}

        {/* Header */}
        <header className="header-custom fixed top-0 left-0 w-full z-40 py-2">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <a href="#" className="logo">
              <img src="https://i.postimg.cc/h4y5jGhT/logo-1.png" alt="GameX Logo" className="h-8" />
            </a>

            <button 
              className="nav-toggle-btn text-white text-4xl p-1 lg:hidden"
              onClick={toggleNav}
            >
              ☰
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex">
              <ul className="flex items-center space-x-8">
                <li><a href="#hero" className="navbar-link-custom block py-4 px-4">Home</a></li>
                <li><a href="#" className="navbar-link-custom block py-4 px-4">Login</a></li>
                <li><a href="#tournament" className="navbar-link-custom block py-4 px-4">Tournament</a></li>
                <li><a href="#team" className="navbar-link-custom block py-4 px-4">Team</a></li>
                <li><a href="#gears" className="navbar-link-custom block py-4 px-4">Gears</a></li>
                <li><a href="#contact" className="navbar-link-custom block py-4 px-4">Contact</a></li>
              </ul>
            </nav>

            {/* Mobile Navigation */}
            <nav className={`navbar-custom fixed top-0 w-full max-w-xs h-full z-20 transition-all duration-300 ${
              isNavOpen ? 'right-0 visible' : '-right-full invisible'
            } lg:hidden`}>
              <div className="flex justify-between items-center p-6">
                <a href="#" className="logo">
                  <img src="https://i.postimg.cc/h4y5jGhT/logo-1.png" alt="GameX Logo" className="h-8" />
                </a>
                <button 
                  className="text-orange-500 text-2xl p-2"
                  onClick={toggleNav}
                >
                  ✕
                </button>
              </div>

              <ul className="border-t border-white border-opacity-10 mb-8">
                <li><a href="#hero" className="navbar-link-custom block py-3 px-6" onClick={toggleNav}>Home</a></li>
                <li><a href="#" className="navbar-link-custom block py-3 px-6" onClick={toggleNav}>Login</a></li>
                <li><a href="#tournament" className="navbar-link-custom block py-3 px-6" onClick={toggleNav}>Tournament</a></li>
                <li><a href="#team" className="navbar-link-custom block py-3 px-6" onClick={toggleNav}>Team</a></li>
                <li><a href="#gears" className="navbar-link-custom block py-3 px-6" onClick={toggleNav}>Gears</a></li>
                <li><a href="#contact" className="navbar-link-custom block py-3 px-6" onClick={toggleNav}>Contact</a></li>
              </ul>

              <ul className="flex justify-center items-center space-x-4">
                <li><a href="#" className="text-orange-500 text-lg">📘</a></li>
                <li><a href="#" className="text-orange-500 text-lg">📷</a></li>
                <li><a href="#" className="text-orange-500 text-lg">🐙</a></li>
                <li><a href="#" className="text-orange-500 text-lg">📺</a></li>
              </ul>
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <button className="text-white text-lg p-3 hover:text-orange-500 transition-colors">
                🔍
              </button>
              <button className="btn-sign-in flex items-center bg-gray-800 text-gray-300 text-xs font-medium uppercase tracking-wide py-1 px-1 border-r-4 border-orange-500 shadow-md ml-4 transition-colors hover:text-orange-500">
                <div className="bg-gray-700 p-1.5 mr-1 shadow-inner">
                  🚪
                </div>
                <span className="px-2">Login</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section id="hero" className="hero-custom flex items-center justify-center text-center mt-16">
            <div className="container mx-auto px-4">
              <p className="hero-subtitle-custom">The Season 8</p>
              <h1 className="hero-title-custom">Steam</h1>
              
              <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
                <button className="btn-custom btn-primary-custom">
                  <span>Watch Live</span>
                  <span className="text-2xl">▶</span>
                </button>
                <button className="btn-custom btn-link-custom">Dream Making</button>
              </div>
            </div>
          </section>

          <div className="section-wrapper-custom">
            {/* About Section */}
            <section id="about" className="about-custom">
              <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <figure className="relative mb-10 lg:mb-0">
                    <img src="https://i.postimg.cc/Kc3gLCHW/about-img.png" alt="M Shape" className="w-full" />
                    <img src="https://i.postimg.cc/MKyM3Vxb/character-1.png" alt="Game Character" className="hidden md:block absolute top-28 -left-32 w-32 -z-10" />
                    <img src="https://i.postimg.cc/NfwLXFTy/character-2.png" alt="Game Character" className="hidden md:block absolute top-20 right-48 w-36 -z-10" />
                    <img src="https://i.postimg.cc/15cXrScv/character-3.png" alt="Game Character" className="hidden md:block absolute top-0 -right-28 -z-10" />
                  </figure>

                  <div className="about-content-custom">
                    <p className="about-subtitle-custom">Find Team Member</p>
                    <h2 className="about-title-custom">Experience just for gamers <span className="about-title-strong">offer</span></h2>
                    <p className="text-gray-300 text-sm leading-relaxed mb-5 text-justify">
                      In a world where gaming transcends mere entertainment, we invite you to immerse yourself in a vibrant universe tailored specifically for those who crave adventure, challenge, and camaraderie
                    </p>
                    <p className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                      <span className="text-orange-500 text-2xl">➡</span>
                      <span>Will sharpen your brain and focus</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tournament Section */}
            <section id="tournament" className="tournament-custom">
              <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-12 items-center">
                  <div className="tournament-content">
                    <p className="tournament-subtitle-custom">Check out our next</p>
                    <h2 className="tournament-title-custom">Gaming Tournaments!</h2>
                    <p className="text-gray-300 text-sm leading-relaxed mb-8">
                      Join our electrifying events that bring together players from around the world to compete in a variety of games, showcasing their skills and strategy in high-stakes environments
                    </p>
                    <button className="btn-custom btn-primary-custom mx-auto lg:mx-0">Join with us</button>
                  </div>

                  <div className="tournament-prize text-center">
                    <h2 className="tournament-title-custom mb-5">Prize Tool</h2>
                    <div className="tournament-prize-data mb-8">$80,000</div>
                    <figure>
                      <img src="https://i.postimg.cc/Zn6QyVNM/prize-img.png" alt="Prize image" className="mx-auto" />
                    </figure>
                  </div>

                  <div className="tournament-winners-custom text-center">
                    <h2 className="tournament-title-custom mb-6">Last Winners</h2>
                    <ul className="flex flex-wrap justify-center items-center gap-5">
                      <li>
                        <div className="winner-card">
                          <figure className="max-w-20 mx-auto mb-4">
                            <img src="https://i.postimg.cc/CxxvFFct/winner-img-1.png" alt="Winner image" className="w-full" />
                          </figure>
                          <h3 className="winner-card-title">1st Place</h3>
                        </div>
                      </li>
                      <li>
                        <div className="winner-card">
                          <figure className="max-w-20 mx-auto mb-4">
                            <img src="https://i.postimg.cc/d1jdkC19/winner-img-2.png" alt="Winner image" className="w-full" />
                          </figure>
                          <h3 className="winner-card-title">2nd Place</h3>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery Section */}
            <section className="gallery-custom">
              <div className="container mx-auto">
                <ul className="gallery-list-custom custom-scrollbar">
                  <li>
                    <figure className="gallery-item-custom">
                      <img src="https://i.postimg.cc/Z5zdcjdL/gallery-img-1.jpg" alt="Gallery image 1" className="w-full" />
                    </figure>
                  </li>
                  <li>
                    <figure className="gallery-item-custom">
                      <img src="https://i.postimg.cc/RZ1nbf1x/gallery-img-2.jpg" alt="Gallery image 2" className="w-full" />
                    </figure>
                  </li>
                  <li>
                    <figure className="gallery-item-custom">
                      <img src="https://i.postimg.cc/N0grhMb9/gallery-img-3.jpg" alt="Gallery image 3" className="w-full" />
                    </figure>
                  </li>
                  <li>
                    <figure className="gallery-item-custom">
                      <img src="https://i.postimg.cc/BvMPJ0wh/gallery-img-4.jpg" alt="Gallery image 4" className="w-full" />
                    </figure>
                  </li>
                </ul>
              </div>
            </section>

            {/* Team Section */}
            <section id="team" className="team-custom">
              <div className="container mx-auto px-4">
                <h2 className="section-title-custom">Active Team Members</h2>

                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-16">
                  {[
                    'https://i.postimg.cc/tgCt3DKM/team-member-1.png',
                    'https://i.postimg.cc/0jmpk4Sb/team-member-2.png',
                    'https://i.postimg.cc/FzZHVg5T/team-member-3.png',
                    'https://i.postimg.cc/LXxWknQz/team-member-4.png',
                    'https://i.postimg.cc/MHXF9qgg/team-member-5.png',
                    'https://i.postimg.cc/Rh8b82Bh/team-member-6.png',
                    'https://i.postimg.cc/MZr4vfQw/team-member-7.png',
                    'https://i.postimg.cc/hPk50Fs3/team-member-8.png',
                    'https://i.postimg.cc/kgWh1jhM/team-member-9.png',
                    'https://i.postimg.cc/N0YCW1W6/team-member-10.png',
                    'https://i.postimg.cc/tg5vysjL/team-member-11.png',
                    'https://i.postimg.cc/PxV6p0Ny/team-member-12.png',
                    'https://i.postimg.cc/SQ5Ty0BN/team-member-13.png',
                    'https://i.postimg.cc/W1mX6dhh/team-member-14.png'
                  ].map((src, index) => (
                    <li key={index}>
                      <a href="#" className="team-member-custom block">
                        <figure>
                          <img src={src} alt="Team Member Image" className="w-full" />
                        </figure>
                        <span className="team-member-icon">🔗</span>
                      </a>
                    </li>
                  ))}
                </ul>

                <button className="btn-custom btn-primary-custom mx-auto">View All Members</button>
              </div>
            </section>

            {/* Gears Section */}
            <section id="gears" className="gears-custom">
              <div className="container mx-auto px-4">
                <h2 className="section-title-custom">Check our Gears</h2>

                <div className="gears-grid">
                  {[
                    { img: 'https://i.postimg.cc/28YGXW3d/gears-img-1.png', title: 'Headphone', price: '$18' },
                    { img: 'https://i.postimg.cc/ZqjzCmg2/gears-img-2.png', title: 'Controller', price: '$29' },
                    { img: 'https://i.postimg.cc/2yQsNf40/gears-img-3.png', title: 'Gaming Mask', price: '$45' }
                  ].map((gear, index) => (
                    <div key={index} className="gears-card-custom">
                      <div className="gears-card-banner">
                        <a href="#" className="w-full flex justify-center">
                          <img src={gear.img} alt={gear.title} className="w-2/5" />
                        </a>
                        <button className="share-btn-custom">🔗</button>
                        <div className="card-time-wrapper-custom">
                          <span>⏰</span>
                          <span>In 4 days</span>
                        </div>
                      </div>

                      <div className="gears-card-content">
                        <div>
                          <h3 className="gears-card-title">{gear.title}</h3>
                          <p className="gears-card-subtitle">e-sports</p>
                        </div>
                        <div className="gears-card-prize">{gear.price}</div>
                      </div>

                      <div className="flex justify-between items-center gap-3">
                        <button className="btn-custom btn-primary-custom flex-1 text-lg">
                          <span>➕</span>
                          <span>Add to Cart</span>
                        </button>
                        <button className="gears-card-btn">
                          <span>❤</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-custom">
              <div className="container mx-auto px-4">
                <div className="newsletter-card-custom">
                  <div className="mb-8">
                    <figure className="w-max mx-auto mb-3">
                      <img src="https://i.postimg.cc/Dz1WMn5S/newsletter-img.png" alt="Newsletter image" />
                    </figure>
                    <h2 className="newsletter-title-custom">Subscribe to the newsletter</h2>
                  </div>

                  <div className="max-w-md mx-auto">
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      placeholder="Your Email Address" 
                      className="newsletter-input-custom w-full"
                    />
                    <button 
                      onClick={() => alert('Newsletter subscription functionality would be implemented here')}
                      className="btn-custom btn-secondary-custom mx-auto"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer>
          <div className="footer-top-custom">
            <div className="container mx-auto px-4">
              <div className="footer-brand-wrapper-custom">
                <a href="#" className="logo block w-max mx-auto mb-12">
                  <img src="https://i.postimg.cc/h4y5jGhT/logo-1.png" alt="GameX Logo" />
                </a>

                <div className="flex flex-col lg:flex-row justify-between items-center">
                  <ul className="flex flex-wrap justify-center items-center gap-x-10 gap-y-1 mb-5 lg:mb-0">
                    <li><a href="#hero" className="footer-menu-link-custom">Home</a></li>
                    <li><a href="#about" className="footer-menu-link-custom">About</a></li>
                    <li><a href="#tournament" className="footer-menu-link-custom">Tournament</a></li>
                    <li><a href="#team" className="footer-menu-link-custom">Team</a></li>
                    <li><a href="#gears" className="footer-menu-link-custom">Gears</a></li>
                    <li><a href="#contact" className="footer-menu-link-custom">Contact</a></li>
                  </ul>

                  <div className="footer-input-wrapper-custom">
                    <input 
                      type="text" 
                      name="message" 
                      required 
                      placeholder="Find Here Now" 
                      className="footer-input-custom"
                    />
                    <button className="btn-custom btn-primary-custom footer-input-btn">
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-center">
                <ul className="flex flex-wrap justify-center items-center gap-1 mb-5 lg:mb-0">
                  <li><a href="#" className="quicklink-item-custom">FAQ</a></li>
                  <li><a href="#" className="quicklink-item-custom">Help Center</a></li>
                  <li><a href="#" className="quicklink-item-custom">Terms of use</a></li>
                  <li><a href="#" className="quicklink-item-custom">Privacy</a></li>
                </ul>

                <ul className="flex justify-center items-center gap-3">
                  <li><a href="#" className="footer-social-link-custom">💬</a></li>
                  <li><a href="#" className="footer-social-link-custom">📺</a></li>
                  <li><a href="#" className="footer-social-link-custom">🎮</a></li>
                  <li><a href="#" className="footer-social-link-custom">📺</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom-custom">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
              <p className="copyright-custom">
                Copyright &copy; 2025 <a href="#" className="copyright-link">ULTRA CODE</a>. All rights reserved
              </p>

              <figure className="w-max max-w-full mx-auto lg:mx-0">
                <img src="https://i.postimg.cc/432bbz4J/footer-bottom-img.png" alt="Online Payment Companies Logo" />
              </figure>
            </div>
          </div>
        </footer>

        {/* Go Top Button */}
        <button 
          className={`go-top-custom btn-custom btn-primary-custom ${isGoTopVisible ? 'active' : ''}`}
          onClick={scrollToTop}
        >
          <span>⬆</span>
        </button>
      </div>
    </>
  );
};

export default GameXWebsite;
