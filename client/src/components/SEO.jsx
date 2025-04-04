import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for setting page metadata
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Comma-separated keywords
 * @param {string} props.canonicalUrl - Canonical URL
 * @param {string} props.ogImage - Open Graph image URL
 */
const SEO = ({ 
  title = 'TAMD Health',
  description = 'TAMD Health - Transforming healthcare with comprehensive medical services and patient care.',
  keywords = 'healthcare, doctors, medical, appointments, consultation',
  canonicalUrl,
  ogImage = '/tamd-logo.png'
}) => {
  const siteUrl = window.location.origin; // Get current site URL
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : window.location.href;
  const fullOgImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
    </Helmet>
  );
};

export default SEO; 