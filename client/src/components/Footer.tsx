import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-ocean-dark text-white mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Beach Rank</h3>
            <p className="text-ocean-lighter text-sm">
              Helping you discover the best beaches in South Africa through community voting and fair rankings.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-ocean-lighter hover:text-white transition-colors">Top Beaches</a></li>
              <li><a href="#" className="text-ocean-lighter hover:text-white transition-colors">Blue Flag Beaches</a></li>
              <li><a href="#" className="text-ocean-lighter hover:text-white transition-colors">Beach Activities</a></li>
              <li><a href="#" className="text-ocean-lighter hover:text-white transition-colors">Travel Tips</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-ocean-lighter hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-ocean-lighter hover:text-white transition-colors">Our Mission</a></li>
              <li><a href="#" className="text-ocean-lighter hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-ocean-lighter hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-ocean-lighter hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-ocean-lighter hover:text-white transition-colors">Newsletter</a></li>
              <li>
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="text-ocean-lighter hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="text-ocean-lighter hover:text-white transition-colors"><i className="fab fa-facebook"></i></a>
                  <a href="#" className="text-ocean-lighter hover:text-white transition-colors"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="text-ocean-lighter hover:text-white transition-colors"><i className="fab fa-pinterest"></i></a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ocean pt-6 mt-8 text-center text-sm text-ocean-lighter">
          <p>© {new Date().getFullYear()} Beach Rank - South African Beaches Edition. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
