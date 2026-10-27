/**
 * Centralized Demo Mode Configuration
 * 
 * Honyaki Authentic Sushi Valencia - Concept Demonstration Project
 * 
 * When DEMO_MODE is true (default):
 * - All transaction-related actions (Add to Cart, Place Order, Checkout, 
 *   Reservations, Catering Inquiries, Payment Confirmations, Service Requests)
 *   are restricted and trigger the DemoModeModal.
 * - Local storage order/reservation mutation is blocked.
 * - Backend Supabase mutations for orders, reservations, and catering are blocked.
 * - Normal browsing (menu, dish descriptions, prices, location, maps, contact details)
 *   remains fully accessible and interactive.
 * 
 * To switch to authorized live production mode later:
 * Set VITE_DEMO_MODE=false in your .env file:
 *   VITE_DEMO_MODE=false
 */

// Default to true for presentation safety unless explicitly set to 'false'
export const IS_DEMO_MODE: boolean =
  import.meta.env.VITE_DEMO_MODE !== 'false' &&
  import.meta.env.VITE_DEMO_MODE !== false;

export const DEMO_STRINGS = {
  title: 'Demo Website Only',
  message:
    'Thank you for your interest! This website is currently a demonstration project created to showcase a proposed website for Honyaki Authentic Sushi Valencia. It is not yet the restaurant\'s official website and is not currently accepting real orders, payments, reservations, or service requests.',
  footerNotice:
    'No transaction will be processed. Please contact the restaurant directly for actual orders and inquiries.',
  buttonText: 'Got It',
  restaurantPhone: '0954 298 2417',
  restaurantEmail: 'honyakiitamaesushi2016@gmail.com',
  restaurantAddress: '3rd Floor, ASV Townhouse, Sayre Highway, Barangay Bagontaas, Valencia City, Bukidnon',
};

export const DEMO_DISCLAIMER_CONFIG = {
  storageKey: 'honyaki_demo_disclaimer_acknowledged',
  title: 'Demo Website Notice',
  welcome: 'Welcome to the Honyaki Authentic Sushi Valencia website demo!',
  paragraph1:
    'This website is an unofficial demonstration project created to showcase a proposed website design and functionality for Honyaki Authentic Sushi Valencia.',
  paragraph2:
    "Please note that this is NOT the restaurant's official website. It is currently for demonstration purposes only and does not accept real orders, payments, reservations, or service requests.",
  paragraph3:
    'You are welcome to explore the website and its features. However, no real transactions will be processed through this demo.',
  footerReminder:
    'For actual orders, reservations, and inquiries, please contact Honyaki Authentic Sushi Valencia directly.',
  buttonText: 'I Understand — Explore Website',
  restaurantPhone: '0954 298 2417',
  restaurantAddress: '3rd Floor, ASV Townhouse, Sayre Highway, Barangay Bagontaas, Valencia City, Bukidnon',
};
