import { Helmet } from 'react-helmet-async';

interface FAQ {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  faqs: FAQ[];
}

const StructuredData = ({ faqs }: StructuredDataProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Consult-Chrono",
    "description": "Service de téléconsultation médicale permettant d'obtenir un arrêt maladie en ligne, légal et sécurisé.",
    "url": "https://www.consult-chrono.fr",
    "logo": "https://www.consult-chrono.fr/logo-big.png",
    "image": "https://www.consult-chrono.fr/logo-big.png",
    "email": "contact@consult-chrono.fr",
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "availableLanguage": "French",
    "priceRange": "14€",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "323"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;

