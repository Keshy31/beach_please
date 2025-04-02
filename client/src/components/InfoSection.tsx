import { Card, CardContent } from "@/components/ui/card";

export default function InfoSection() {
  return (
    <section id="about" className="mt-12 bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h2 className="text-2xl font-display font-bold text-ocean-dark mb-4">About South African Beaches Ranking</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2">How It Works</h3>
          <p className="text-gray-700 mb-4">
            Our beach ranking system uses the ELO rating method, the same system used in chess rankings. 
            Every time you vote in a beach matchup, both beaches' ratings are updated based on the outcome.
          </p>
          <p className="text-gray-700 mb-4">
            Beaches that win against highly-rated opponents gain more points. This creates a fair and 
            dynamic ranking that reflects the collective preferences of all voters.
          </p>
          <h3 className="text-lg font-bold mb-2">Explore South Africa's Coastline</h3>
          <p className="text-gray-700">
            South Africa boasts over 2,500km of diverse coastline, from the warm Indian Ocean waters 
            of KwaZulu-Natal to the dramatic shorelines of the Western Cape. With 44 Blue Flag beaches, 
            South Africa offers world-class beach destinations.
          </p>
        </div>
        <div className="bg-ocean-lighter/20 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Featured Beach Regions</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-ocean flex items-center justify-center text-white mr-3">
                <i className="fas fa-umbrella-beach text-xs"></i>
              </span>
              <div>
                <h4 className="font-medium">KwaZulu-Natal</h4>
                <p className="text-sm text-gray-600">
                  Warm waters, golden sands, and tropical climate perfect for swimming year-round.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-ocean flex items-center justify-center text-white mr-3">
                <i className="fas fa-umbrella-beach text-xs"></i>
              </span>
              <div>
                <h4 className="font-medium">Western Cape</h4>
                <p className="text-sm text-gray-600">
                  Dramatic mountain backdrops, crystal clear waters, and pristine white sand beaches.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-ocean flex items-center justify-center text-white mr-3">
                <i className="fas fa-umbrella-beach text-xs"></i>
              </span>
              <div>
                <h4 className="font-medium">Eastern Cape</h4>
                <p className="text-sm text-gray-600">
                  Wild coastlines, untouched beaches, and magnificent surfing spots.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
