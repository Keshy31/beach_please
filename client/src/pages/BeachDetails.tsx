import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Anchor, Waves, Flag, Fish, Shield, Coffee, Star } from "lucide-react";
import { Link } from "wouter";
import { Beach } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to translate feature status
const getFeatureStatus = (value: number | null): { status: string; color: string } => {
  if (value === 1) return { status: "Yes", color: "bg-green-100 text-green-800 hover:bg-green-200" };
  if (value === 2) return { status: "No", color: "bg-red-100 text-red-800 hover:bg-red-200" };
  return { status: "Unknown", color: "bg-gray-100 text-gray-800 hover:bg-gray-200" };
};

// Feature badge component
const FeatureBadge = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number | null;
}) => {
  const { status, color } = getFeatureStatus(value);
  return (
    <Badge variant="outline" className={`px-3 py-1 flex items-center gap-1 ${color}`}>
      <Icon size={14} />
      <span>{label}: {status}</span>
    </Badge>
  );
};

export default function BeachDetails() {
  const { id } = useParams<{ id: string }>();
  const beachId = parseInt(id);

  // Fetch beach details
  const { 
    data: beach, 
    isLoading, 
    isError, 
    error 
  } = useQuery<Beach>({ 
    queryKey: [`/api/beaches/${beachId}`],
    enabled: !isNaN(beachId),
  });

  if (isNaN(beachId)) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold text-red-500">Invalid Beach ID</h1>
        <p className="mt-4 text-gray-600">The beach ID provided is not valid.</p>
        <Link href="/">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <Skeleton className="h-8 w-48" />
        </div>
        
        {/* Hero skeleton */}
        <Skeleton className="h-80 w-full rounded-xl" />
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !beach) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold text-red-500">Error Loading Beach</h1>
        <p className="mt-4 text-gray-600">
          {error instanceof Error ? error.message : "Failed to load beach details."}
        </p>
        <Link href="/">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div className="flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" className="text-[hsl(var(--color-primary))]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Beaches
          </Button>
        </Link>
        <Badge className="text-sm bg-[hsl(var(--color-primary))]">
          <Star className="mr-1 h-3.5 w-3.5" /> 
          Rank #{beach.previousRank} • Rating: {beach.rating}
        </Badge>
      </div>

      {/* Hero image */}
      <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
        <img 
          src={beach.imageUrl} 
          alt={beach.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-4xl font-display font-bold">{beach.name}</h1>
          <p className="flex items-center text-gray-200">
            <MapPin className="h-4 w-4 mr-1" /> {beach.location}, {beach.province}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Beach description */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">About {beach.name}</h2>
            <p className="text-gray-700 leading-relaxed">
              {beach.description}
            </p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Beach Features</h2>
            <div className="flex flex-wrap gap-2">
              <FeatureBadge icon={Waves} label="Swimming" value={beach.isSwimming} />
              <FeatureBadge icon={Anchor} label="Surfing" value={beach.isSurfing} />
              <FeatureBadge icon={Flag} label="Blue Flag" value={beach.isBlueFlag} />
              <FeatureBadge icon={Fish} label="Fishing" value={beach.isFishing} />
              <FeatureBadge icon={Shield} label="Lifeguards" value={beach.hasLifeguards} />
              <FeatureBadge icon={Coffee} label="Facilities" value={beach.hasFacilities} />
            </div>
          </div>
        </div>

        {/* Location card */}
        <Card className="h-fit">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-xl font-bold">Location</h3>
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500 ml-2">Map view coming soon</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm"><strong>Region:</strong> {beach.province}</p>
              <p className="text-sm"><strong>Location:</strong> {beach.location}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}