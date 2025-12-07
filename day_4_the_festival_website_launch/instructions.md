❄️ GOOSE PROJECT INSTRUCTIONS — WINTER FESTIVAL WEBSITE

Project Name: Winter Festival Website
Goal: Build a simple, beginner-friendly one-page festival website using the text in content.txt and the design style inspired by landing_page.md, and prepare it for Netlify deployment.

📌 1. Project Overview

Create a clean, responsive, visually appealing one-page website for the Winter Festival.
This project must:

Use all text content from content.txt throughout the page

Follow the layout, styling, and section structure inspired by the template prompt in landing_page.md

Be easy for a beginner to understand

Use modern HTML + CSS (or Tailwind CSS if needed)

Be fully deployable to Netlify

Place all code in a simple folder structure, no frameworks required

Support mobile responsiveness and clean styling

📌 2. Files Already Provided

content.txt — contains ALL written text for the website (use exactly as provided)

landing_page.md — contains the inspiration/template for the look & design

photos/ — contains Unsplash photos to use in the gallery or background sections

Use these files directly inside the website.

📌 3. What Goose Should Build

Generate a complete one-page website project with the following structure:

/festival-website
  /assets
     /css
        styles.css
     /images
        (copy all images from ./photos)
  index.html
  README.md
  netlify.toml

📌 4. Index Page Requirements
✔️ General

Use semantic HTML

Apply fully responsive layout and typography

Use a light, winter-themed color palette (cool blues, whites, soft gradients)

Add gentle hover animations for buttons/images

Include optional gentle CSS snowfall background effect (no JS required)

✔️ Sections to Include

Hero Section

Large festival title

Subtitle

CTA button (“Join the Celebration”)

Background can use one of the images (e.g., snow scene)

About the Festival

Pull text from content.txt

Festival Highlights

Fortune Teller’s Tent

Storyteller’s Booth

Hot Cocoa Championship

Use icons or images where appropriate

Photo Gallery

Display all images from /photos

Simple grid layout

Countdown Section

Use placeholder countdown (no real JS needed)

Testimonials

Styled quote boxes

Location & Hours

Footer

Social links

Copyright text

📌 5. Design Requirements

Base styling on the design inspiration from landing_page.md

Use:

Clean, modern typography

Large headings

Soft shadows

Rounded sections

Smooth spacing

Ensure the overall aesthetic feels like a winter landing page

📌 6. Netlify Deployment Requirements

Generate the following:

netlify.toml
[build]
  publish = "."

README.md

Include:

Simple explanation of project

Steps to deploy to Netlify (drag & drop or GitHub → Netlify)

Screenshot placeholders

📌 7. Final Output

Goose should output:

A complete folder containing:

index.html

/assets/css/styles.css

/assets/images/* (copied from photos)

README.md

netlify.toml

The website should render beautifully locally and be ready for Netlify deployment.