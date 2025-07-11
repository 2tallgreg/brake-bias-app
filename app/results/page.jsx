// app/results/page.jsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import VehicleHeader from '@/components/results/VehicleHeader';
import QuickStats from '@/components/results/QuickStats';
import PricingSection from '@/components/results/PricingSection';
import ProfessionalReviews from '@/components/results/ProfessionalReviews';
import RedditSentiment from '@/components/results/RedditSentiment';
import MarketSection from '@/components/results/MarketSection';
import LoadingScreen from '@/components/common/LoadingScreen';
import ErrorMessage from '@/components/common/ErrorMessage';
import ImageAndSummary from '@/components/results/ImageAndSummary';
import VideoReviews from '@/components/results/VideoReviews';

// This function now POSTs to the primary AI endpoint
const fetchBrakeBiasData = async (vehicleDetails) => {
    const response = await fetch(`/api/brake-bias-openai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleDetails),
    });

    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch data from the Brake Bias AI API.');
        } catch (e) {
            throw new Error(response.statusText || 'An unknown server error occurred.');
        }
    }
    return response.json();
};

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const vehicle = {
      year: searchParams.get('year'),
      make: searchParams.get('make'),
      model: searchParams.get('model'),
      submodel: searchParams.get('submodel') || '', // Ensure submodel is not null
      zipcode: searchParams.get('zipcode') || '', // Ensure zipcode is not null
    };

    if (vehicle.year && vehicle.make && vehicle.model) {
      setLoading(true);
      fetchBrakeBiasData(vehicle)
        .then(response => {
          setData(response);
          setError(null);
        })
        .catch(err => {
          console.error("Error in fetchBrakeBiasData:", err);
          setError(err.message || 'An unknown error occurred.');
          setData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
        setError("Missing vehicle information. Please start a new search.");
        setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return <LoadingScreen text="Analyzing the data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data) {
    return <ErrorMessage message="No data was returned for this vehicle." />;
  }

  // Map the new, unified data structure to the components
  return (
    <div className="results-page">
      <VehicleHeader
        yearMakeModel={data.yearMakeModel}
        tldr={data.tldr}
      />
      <div className="grid-container">
        <div className="main-content">
          <ImageAndSummary 
            imageUrl={data.wikimediaImageUrl}
            summary={data.summary}
          />
          <ProfessionalReviews reviews={data.reviews} />
          <RedditSentiment sentiment={data.ownerSentiment} />
          <VideoReviews videos={data.videoReviews} />
        </div>
        <aside className="sidebar">
          <QuickStats
             engine={data.engine}
             drivetrain={data.drivetrain}
             transmission={data.transmission}
          />
          <PricingSection 
            msrp={data.msrp}
            usedAvg={data.usedAvg}
          />
          <MarketSection listingsLink={data.autoTempestLink} />
        </aside>
      </div>
       <style jsx>{`
        .results-page {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 1.5rem;
        }
        .grid-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        @media (min-width: 1024px) {
            .grid-container {
                grid-template-columns: 2fr 1fr;
            }
        }
        .main-content, .sidebar {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
      `}</style>
    </div>
  );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<LoadingScreen text="Analyzing the data..." />}>
            <ResultsPageContent />
        </Suspense>
    )
}