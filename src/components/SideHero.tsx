import { ReactNode } from "react";

interface SideHeroProps {
    title: ReactNode; // Main big text
    subtitle: string; // Subtext paragraph
    backgroundText?: string; // Massive faded text in background (e.g., "NOMINI")
}

const SideHero = ({
    title,
    subtitle,
    backgroundText = "NOMINI"
}: SideHeroProps) => {
    return (
        <div className="relative w-full h-full bg-zinc-950 flex flex-col justify-center p-12 md:p-16 lg:p-24 overflow-hidden">

            {/* Main Content: Pure and Centered Vertically */}
            <div className="relative z-10 flex flex-col gap-8">
                {/* Subtle Orange Accent Line - The "Steam/Orange" touch */}
                <div className="w-16 h-1.5 bg-orange-600"></div>

                <div className="opacity-100">
                    {title}
                </div>

                <p className="text-2xl text-zinc-400 font-montserrat font-light tracking-wide max-w-md leading-relaxed">
                    {subtitle}
                </p>
            </div>

            {/* Background Texture - Extremely subtle noise or gradient */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle at 100% 100%, rgba(234, 88, 12, 0.15) 0%, transparent 50%)"
                }}>
            </div>

            {/* Massive Background Text - Architectural element */}
            <div className="absolute -right-16 bottom-0 text-[35vh] font-black text-white opacity-[0.02] pointer-events-none select-none leading-none tracking-tighter">
                {backgroundText}
            </div>
        </div>
    );
};

export default SideHero;
