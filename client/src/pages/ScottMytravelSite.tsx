import { ArrowLeftIcon, ShareIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type TravelLog, type TravelImage } from "@shared/schema";

export const ScottMytravelSite = (): JSX.Element => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch travel logs
  const { data: travelLogs, isLoading: logsLoading } = useQuery<TravelLog[]>({
    queryKey: ['/api/travel-logs'],
  });

  // Fetch images for the first travel log
  const travelLogId = travelLogs?.[0]?.id;
  const { data: images, isLoading: imagesLoading } = useQuery<TravelImage[]>({
    queryKey: [`/api/travel-logs/${travelLogId}/images`],
    enabled: !!travelLogId,
  });

  // Seed database mutation
  const seedMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/seed', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to seed database');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel-logs'] });
      queryClient.invalidateQueries({ queryKey: [`/api/travel-logs/${travelLogId}/images`] });
    },
  });

  // Auto-seed if no data exists
  useEffect(() => {
    if (!logsLoading && (!travelLogs || travelLogs.length === 0)) {
      seedMutation.mutate();
    }
  }, [travelLogs, logsLoading]);

  const currentTravelLog = travelLogs?.[0];
  const sortedImages = images?.sort((a, b) => a.orderIndex - b.orderIndex) || [];
  
  // Debug current state
  console.log('Current travel log:', currentTravelLog);
  console.log('All images:', images);
  console.log('Sorted images:', sortedImages);
  console.log('Current index:', currentImageIndex);
  console.log('Current image:', sortedImages[currentImageIndex]);

  // Function to get image style with filters
  const getImageStyle = (imageUrl: string) => {
    const baseImageUrl = imageUrl.split('?')[0];
    const urlParams = new URLSearchParams(imageUrl.split('?')[1] || '');
    const filter = urlParams.get('filter');
    
    let additionalStyles = {};
    
    switch (filter) {
      case 'warm':
        additionalStyles = {
          filter: 'sepia(0.3) saturate(1.2) hue-rotate(10deg)'
        };
        break;
      case 'cool':
        additionalStyles = {
          filter: 'saturate(1.1) hue-rotate(200deg) contrast(1.1)'
        };
        break;
      case 'bright':
        additionalStyles = {
          filter: 'brightness(1.2) contrast(1.1) saturate(1.3)'
        };
        break;
      default:
        additionalStyles = {};
    }
    
    return {
      backgroundImage: `url(${baseImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ...additionalStyles
    };
  };

  const handleImageTap = () => {
    console.log('Image tapped! Current index:', currentImageIndex, 'Images length:', sortedImages.length);
    if (sortedImages.length > 0) {
      const newIndex = (currentImageIndex + 1) % sortedImages.length;
      console.log('Setting new index:', newIndex);
      setCurrentImageIndex(newIndex);
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (sortedImages.length === 0) return;
      
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        handleImageTap();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sortedImages.length]);

  const isLoading = logsLoading || imagesLoading || seedMutation.isPending;

  // Generate slider indicators based on current image
  const sliderIndicators = sortedImages.map((_, index) => ({
    active: index === currentImageIndex,
    className: index === currentImageIndex ? "bg-[#484848]" : "bg-[#d9d9d9] opacity-50"
  }));

  if (isLoading) {
    return (
      <div className="bg-[#263240] flex flex-row justify-center w-full min-h-screen items-center">
        <div className="text-white [font-family:'Inconsolata',Helvetica] font-normal text-lg">
          Loading travel log...
        </div>
      </div>
    );
  }

  // Data for the checkpoints and budget section
  const checkpointItems = [
    "Manila – A sensory overload. Budget tip: Skip taxis, use Grab or jeepneys (₱15 a ride).",
    "Palawan – Worth every penny. Budget ~₱2,500/day for island hopping and food.",
    "Local eats – Taho for breakfast (₱20), carinderia meals (~₱100). Cheap and so good.",
  ];

  // Data for the tips section
  const tipItems = [
    'Time is fluid. If someone says "2 PM," expect 3 or 4.',
    "Cash is king. ATMs aren't always reliable.",
    "Learn a few Tagalog phrases—locals love it",
    "I left with a full stomach, a lighter wallet, and a deep love for the beautiful mess that is the Philippines. Would I go back? Absolutely.",
  ];

  return (
    <div className="bg-[#263240] flex flex-row justify-center w-full">
      <div className="bg-[#263240] w-[393px] h-[1731px] relative">
        {/* Hero image section */}
        <div 
          className="absolute w-[393px] h-[637px] top-0 left-0 overflow-hidden cursor-pointer transition-all duration-500"
          onClick={handleImageTap}
          style={getImageStyle(sortedImages[currentImageIndex]?.imageUrl || '/figmaAssets/image-9.png')}
        >
          {/* Story overlay */}
          <div className="absolute bottom-20 left-4 right-4 bg-black/50 rounded-lg p-3 backdrop-blur-sm">
            <div className="[font-family:'Inconsolata',Helvetica] font-normal text-white text-sm tracking-[0] leading-[18px]">
              {sortedImages[currentImageIndex]?.story || 'Loading story...'}
            </div>
          </div>

          <div className="relative w-[399px] h-[26px] top-[611px]">
            <div className="absolute w-[232px] h-4 top-0 left-[85px]">
              <div className="absolute w-[230px] h-4 top-0 left-0 [font-family:'Inconsolata',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-[22.4px] whitespace-nowrap">
                tap for next image! ({currentImageIndex + 1}/{sortedImages.length})
              </div>
            </div>

            <div className="absolute w-[399px] h-[21px] top-[5px] left-0">
              <div className="relative h-[21px]">
                <div className="absolute w-[393px] h-[21px] top-0 left-0 bg-[linear-gradient(180deg,rgba(217,217,217,0)_0%,rgba(0,0,0,0.3)_92%)]" />

                {/* Image slider indicators */}
                <div className="flex absolute top-[18px] left-0 w-full">
                  {sliderIndicators.map((indicator, index) => (
                    <div
                      key={`indicator-${index}`}
                      className={`w-[98px] h-[3px] transition-all duration-300 ${indicator.className}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <Card className="absolute w-[349px] h-[866px] top-[673px] left-[22px] bg-transparent border-0 shadow-none">
          <CardContent className="p-0">
            <div className="flex flex-col w-[349px] items-start gap-2.5">
              {/* Return to homescreen button */}
              <Button
                variant="ghost"
                className="h-[31px] p-0 gap-3 text-[#f9e897] hover:text-[#f9e897] hover:bg-[#263240]/10"
              >
                <ArrowLeftIcon className="w-6 h-6" />
                <span className="[font-family:'Inconsolata',Helvetica] font-normal text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
                  return to homescreen
                </span>
              </Button>

              {/* Header section */}
              <div className="relative w-[355px] h-[77px] mr-[-6.00px]">
                <div className="absolute w-[269px] top-[29px] left-0 [font-family:'Tungsten-Medium',Helvetica] font-medium text-[#dedede] text-[40px] tracking-[0] leading-[normal]">
                  {currentTravelLog?.destination || 'PHILIPPINES'}
                </div>

                <div className="absolute w-[75px] top-0 left-0 [font-family:'Tungsten-Medium',Helvetica] font-medium text-white text-2xl tracking-[0] leading-[normal]">
                  {currentTravelLog?.title || 'TRAVEL LOG'}
                </div>

                <div className="absolute top-0 left-[282px] [font-family:'Tungsten-Medium',Helvetica] font-medium text-white text-2xl text-right tracking-[0] leading-[normal]">
                  {currentTravelLog?.date || 'JUNE 2023'}
                </div>
              </div>

              {/* Highlights section */}
              <div className="relative self-stretch [font-family:'Inconsolata',Helvetica] font-bold text-white text-xl tracking-[0] leading-7">
                ✨ Some Highlights:
              </div>

              <div className="relative self-stretch [font-family:'Inconsolata',Helvetica] font-normal text-white text-base tracking-[0] leading-[22.4px]">
                {currentTravelLog?.description || 'Just got back from the Philippines, and wow—what a ride. The heat, the chaos, the food. I went with a plan, but the country had other ideas.'}
              </div>

              <Separator className="w-5 h-5 bg-[#263240] border-0" />

              {/* Checkpoints & Budget section */}
              <div className="relative w-[349px] [font-family:'Inconsolata',Helvetica] font-bold text-white text-xl tracking-[0] leading-7">
                📍💰 Checkpoints &amp; Budget:
              </div>

              <div className="h-[200px] flex flex-col w-[349px] items-start gap-3">
                {checkpointItems.map((item, index) => (
                  <div
                    key={`checkpoint-${index}`}
                    className="relative self-stretch [font-family:'Inconsolata',Helvetica] font-normal text-white text-base tracking-[0] leading-[22.4px]"
                  >
                    <span className="[font-family:'Inconsolata',Helvetica] font-normal text-white text-base tracking-[0] leading-[22.4px]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="w-5 h-5 bg-[#263240] border-0" />

              {/* Tips section */}
              <div className="relative w-[349px] [font-family:'Inconsolata',Helvetica] font-bold text-white text-xl tracking-[0] leading-7">
                💡 Tips:
              </div>

              <div className="h-64 flex flex-col w-[349px] items-start gap-3">
                {tipItems.map((item, index) => (
                  <div
                    key={`tip-${index}`}
                    className="relative self-stretch [font-family:'Inconsolata',Helvetica] font-normal text-white text-base tracking-[0] leading-[22.4px]"
                  >
                    <span className="[font-family:'Inconsolata',Helvetica] font-normal text-white text-base tracking-[0] leading-[22.4px]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ShareIcon button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute w-[18px] h-[18px] top-[7px] right-0 p-0"
            >
              <ShareIcon className="w-[18px] h-[18px]" />
            </Button>
          </CardContent>
        </Card>

        {/* Footer section */}
        <div className="absolute w-[393px] h-[52px] top-[1679px] left-0 bg-[#263240] flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-[23px] h-[23px] bg-[url(/figmaAssets/vector.svg)] bg-[100%_100%]" />
            <div className="[font-family:'Inconsolata',Helvetica] font-normal text-[#f9e897] text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
              create your journeylog
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};