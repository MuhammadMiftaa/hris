import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function useScrollSpy(
  sectionIds: string[],
  offset: number = 100
): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || "");
  const activeIdRef = useRef(activeId);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      let currentId = activeIdRef.current;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentId = id;
          }
        }
      }

      // Check for bottom of page
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
      ) {
        currentId = sectionIds[sectionIds.length - 1];
      }

      if (currentId !== activeIdRef.current) {
        activeIdRef.current = currentId;
        setActiveId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}

export function DashboardPillNav({
  sectionIds = ["pengajuan", "kehadiran", "statistik", "cuti", "pending"],
}: {
  sectionIds?: string[];
}) {
  const activeSection = useScrollSpy(sectionIds, 150);

  const sections = [
    { id: "pengajuan", label: "Pengajuan" },
    { id: "kehadiran", label: "Kehadiran" },
    { id: "statistik", label: "Statistik" },
    { id: "cuti", label: "Saldo Cuti" },
    { id: "pending", label: "Pending" },
  ];

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[0px] z-10 bg-(--background)/90 backdrop-blur-md border-b border-(--border) py-2 px-4 flex gap-1.5 overflow-x-auto md:hidden -mx-4 mb-4 scrollbar-hide">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => handleNavClick(s.id)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
            activeSection === s.id
              ? "bg-[#d4537e] text-white border-[#d4537e]"
              : "bg-(--card) text-(--muted-foreground) border-(--border) hover:bg-(--muted)"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
