import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Luxury Tiara / Crown Emblem Icon
 * Handcrafted multi-layered royal crown with pearls and delicate filigree.
 */
export const LuxuryCrownIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Soft gradient fill for boutique richness */}
    <defs>
      <linearGradient id="crownGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF5E84" />
        <stop offset="1" stopColor="#E0486D" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Tiara base band */}
    <rect x="3.5" y="17.5" width="17" height="2.5" rx="1.25" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.4" />
    {/* Crown arches */}
    <path
      d="M4.5 17.5L5.5 8.5L9.5 13L12 5.5L14.5 13L18.5 8.5L19.5 17.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Pearls / Jewels on crown tips */}
    <circle cx="5.5" cy="7" r="1.5" fill="currentColor" />
    <circle cx="12" cy="4" r="1.8" fill="currentColor" />
    <circle cx="18.5" cy="7" r="1.5" fill="currentColor" />
    {/* Center royal starburst */}
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

/**
 * 100% Breathable Organic Cotton Icon
 */
export const OrganicCottonIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M12 21C12 21 8 18 8 13.5C8 11.5 9.5 10 11.5 10C12 10 12 10.5 12 10.5C12 10.5 12 10 12.5 10C14.5 10 16 11.5 16 13.5C16 18 12 21 12 21Z"
      fill="currentColor"
      fillOpacity="0.12"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 14C5.343 14 4 12.657 4 11C4 9.4 5.2 8.1 6.8 8C7 5.8 8.8 4 11 4C12.5 4 13.8 4.8 14.5 6C15.2 5.4 16.1 5 17 5C19.2 5 21 6.8 21 9C21 9.4 20.9 9.8 20.8 10.1C21.5 10.9 22 11.9 22 13C22 15.2 20.2 17 18 17"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Islandwide Cash on Delivery (COD) Icon
 */
export const CodDeliveryIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Express delivery truck */}
    <path
      d="M2 6.5C2 5.67 2.67 5 3.5 5H14.5C15.33 5 16 5.67 16 6.5V14H2V6.5Z"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M16 8.5H19.2C19.7 8.5 20.2 8.8 20.4 9.3L21.8 12.1C22 12.4 22 12.7 22 13V15.5C22 16.33 21.33 17 20.5 17H16V8.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Wheels */}
    <circle cx="6.5" cy="17.5" r="2" fill="white" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="17.5" cy="17.5" r="2" fill="white" stroke="currentColor" strokeWidth="1.4" />
    {/* COD Cash Badge */}
    <rect x="4.5" y="8" width="7" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1 1" />
  </svg>
);

/**
 * 30-Day Hassle-Free Exchange Seal Icon
 */
export const ExchangeSealIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C15.3 3 18.18 4.79 19.74 7.45"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path d="M21 3V7.5H16.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Center 30 text / badge */}
    <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M10 11.5L11.5 13L14 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 100% Safe & Secure Payments Icon
 */
export const SecureShieldIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M12 3L4 6.5V11.5C4 16.5 7.4 20.8 12 22C16.6 20.8 20 16.5 20 11.5V6.5L12 3Z"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Center Padlock */}
    <rect x="9" y="11" width="6" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M10.5 11V9.5C10.5 8.7 11.2 8 12 8C12.8 8 13.5 8.7 13.5 9.5V11" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

/**
 * Dedicated Concierge WhatsApp Support Icon
 */
export const ConciergeSupportIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12C21 13.9 20.4 15.65 19.38 17.1L20.5 21L16.45 19.95C15.1 20.62 13.6 21 12 21C7.03 21 3 16.97 3 12Z"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M9.5 9.5C9.5 9.5 10 11 11.5 12.5C13 14 14.5 14.5 14.5 14.5L15.5 13.5C15.8 13.2 16.2 13.1 16.6 13.3L18.5 14.2C19 14.4 19.2 15 19 15.5C18.6 16.5 17.5 17.5 16 17.5C13 17.5 10 15 8 13C6 11 5.5 8.5 6.5 7C7 6.8 7.6 7 7.8 7.5L8.7 9.4C8.9 9.8 8.8 10.2 8.5 10.5L9.5 9.5Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Loved By 10,000+ Sri Lankan Parents Icon
 */
export const LovedByParentsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill="currentColor"
      fillOpacity="0.14"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Micro baby smile inside heart */}
    <path d="M9 10C9 10 10.5 12 12 12C13.5 12 15 10 15 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
