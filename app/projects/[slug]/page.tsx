"use client";

import React from 'react';
import PageHeader from "@/components/page-header";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay,Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";



const images = [
  "/images/project_images/project-details-img-01.png",
  "/images/project_images/project-details-img-02.png",
  "/images/project_images/project-details-img-03.png",
    "/images/project_images/project-details-img-01.png",
  "/images/project_images/project-details-img-02.png",
  "/images/project_images/project-details-img-03.png"
  // Add more images as needed
];


interface ProjectPageProps {
  params: Usable<{
    slug: string;
  }>;
}

export default function ProjectPage({params} : ProjectPageProps){
  
    const { slug } = React.use(params);
  
  
  return (
    



    <>
 <PageHeader
        title= {slug}
        imageUrl="/images/cannon.png"
      />

    <div>
      <h1 className="text-2xl font-bold">Project: {slug}</h1>
      {/* Render detailed project */}
    </div>

  <div className="w-full  mx-auto flex justify-center items-center min-h-[400px]">
      <Swiper
        // modules={[Pagination, EffectCoverflow]}
          modules={[Pagination,Autoplay]}
            autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}

        // effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={3} // Show 3 images at a time on desktop
        spaceBetween={150}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        loop = {true}
        // coverflowEffect={{
        //   rotate: 0,
        //   stretch: 0,
        //   depth: 120,
        //   modifier: 2.5,
        //   slideShadows: true,
        // }}
        pagination={{
          el: ".custom-swiper-pagination",
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className}"></span>`,
        }}
        className="w-full"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx} className="bg-background">
            <div className="flex justify-center items-center ">
              <img
                src={src}
                alt={`Project ${idx + 1}`}
                className="  w-auto max-w-full  object-contain  bg-background  "
                style={{ maxHeight: "500px" , backgroundColor:"#18181b" }}
              />
            </div>
          </SwiperSlide>
        ))}
        {/* Custom Pagination Bar */}
        <div className="custom-swiper-pagination flex justify-center gap-2 mt-6"></div>
      </Swiper>
    </div>
    </>
  );
}
