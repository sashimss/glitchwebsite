// components/ui/page-header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageHeaderProps {
    title: string;
    imageUrl: string;
}

export default function PageHeader({ title, imageUrl }: PageHeaderProps) {
    const pathname = usePathname();

    const segments = pathname
        .split("/")
        .filter((seg) => seg !== "");

  const breadcrumbs = [
  { label: "Home", href: "/" },
  ...segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = seg.replace(/-/g, " "); // avoid any uppercasing
    return { label, href };
  }),
];

    return (
        <div className="relative w-full h-[320px] md:h-[600px] overflow-hidden text-white">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 bg-[url('/images/page-header-bg.png')] bg-cover bg-center opacity-20" />

            {/* Optional dark overlay */}
            <div className="absolute inset-0 bg-black/50 z-0" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center gap-4">
                {/* Breadcrumbs */}
                <div className="text-sm text-neutral-300 flex items-center gap-2 flex-wrap">
                    {breadcrumbs.map((crumb, idx) => (
                        <span key={idx} className="flex items-center gap-2 uppercase">
                            <Link href={crumb.href} className="hover:text-white transition">
                                {crumb.label}
                            </Link>
                            {idx < breadcrumbs.length - 1 && <span className="text-green-400">&gt;</span>}
                        </span>
                    ))}
                </div>

               
               
                {/* Title + Image in Row */}
                <div className="flex items-center justify-between flex-wrap gap-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-wider uppercase">
                        {title}
                    </h1>
                    

                    <div className="relative w-120 h-120 bg-gradient-to-b from-green-700 to-green-0 rounded-full opacity-100">

                    </div>
                    <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-visible shrink-0">
                        {/* Green Glow */}
                        <div className="absolute inset-0 rounded-full bg-green-400 opacity-60 blur-2xl scale-125 z-0" />

                        {/* Image */}
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-green-400 bg-black/20 backdrop-blur z-10">
                            <Image
                                src={imageUrl}
                                alt={`${title} image`}
                                width={144}
                                height={144}
                                className="object-contain p-2"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
