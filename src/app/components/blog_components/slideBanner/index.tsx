"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { setupAPIClient } from '@/services/api';

interface PublicationProps {
  id: string;
  title: string;
  image_url: string | null;
  status: string;
  text_publication: string;
  clicks: number;
  redirect_url: string;
  publish_at_start: string | number | Date;
  publish_at_end: string | number | Date;
  is_popup: boolean;
  created_at: string | number | Date;
  text_button: string;
}

interface SliderProps {
  position: string;
  local: string;
  banners?: PublicationProps[];
  intervalTime?: number;
}

export function SlideBanner({ position, local, banners, intervalTime }: SliderProps) {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [internalBanners, setInternalBanners] = useState<PublicationProps[]>(banners || []);
  const [internalInterval, setInternalInterval] = useState(intervalTime || 5000);

  useEffect(() => {
    if (banners) return;

    const fetchBanners = async () => {
      try {
        const apiClient = setupAPIClient();
        const [bannersResponse, intervalResponse] = await Promise.all([
          apiClient.get(`/marketing_publication/blog_publications/slides?position=${position}&local=${local}`),
          apiClient.get(`/marketing_publication/interval_banner/page_banner?local_site=${local}`)
        ]);

        setInternalBanners(bannersResponse.data);
        setInternalInterval(intervalResponse.data?.interval_banner || 5000);
      } catch (error) {
        console.error('Erro ao buscar banners:', error);
      }
    };

    fetchBanners();
  }, [position, local, banners]);

  useEffect(() => {
    if (internalBanners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === internalBanners.length - 1 ? 0 : prev + 1));
    }, internalInterval);

    return () => clearInterval(interval);
  }, [internalBanners, internalInterval]);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? internalBanners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === internalBanners.length - 1 ? 0 : prev + 1));
  };

  const click_publication = async (id: string) => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.patch(`/marketing_publication/${id}/clicks`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
      {internalBanners.map((banner, index) => (
        <Link
          key={banner.id}
          href={banner.redirect_url}
          target='_blank'
          onClick={() => click_publication(banner.id)}
        >
          <Image
            src={`${API_URL}/files/${banner.image_url}`}
            alt={banner.title}
            width={1200}
            height={800}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ${index === currentSlide ? "translate-x-0" : "translate-x-full"
              }`}
          />
        </Link>
      ))}

      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800 text-[#FFFFFF] p-2 rounded-full hover:bg-gray-600"
        onClick={handlePrevSlide}
      >
        <FiArrowLeft />
      </button>
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800 text-[#FFFFFF] p-2 rounded-full hover:bg-gray-600"
        onClick={handleNextSlide}
      >
        <FiArrowRight />
      </button>

      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-35 text-[#FFFFFF] p-4 text-center">
        {internalBanners[currentSlide]?.text_publication && (
          <>
            <p className="text-lg font-medium">{internalBanners[currentSlide].text_publication}</p>
            <Link
              href={internalBanners[currentSlide].redirect_url || "#"}
              target="_blank"
              className="text-sm inline-block mt-2 px-4 py-2 bg-red-500 hover:bg-red-700 rounded text-[#FFFFFF]"
            >
              {internalBanners[currentSlide].text_button}
            </Link>
          </>
        )}

        <div className="mt-5 justify-center flex space-x-2">
          {internalBanners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-110" : "bg-gray-400 opacity-80"
                }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}