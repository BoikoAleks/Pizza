"use client";

import { Api } from "@/shared/services/api-client";

import React from "react";
import { Container } from "./container";
import { cn } from "@/shared/lib/utils";
import { X } from "lucide-react";
import { IStory } from "@/shared/services/stories";
import ReactStories from "react-insta-stories";

interface Props {
  className?: string;
}

export const Stories: React.FC<Props> = ({ className }) => {
  const [stories, setStories] = React.useState<IStory[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedStory, setSelectedStory] = React.useState<IStory>();
  const [modalSize, setModalSize] = React.useState<{ width: number; height: number } | null>(null);

  /* Запит до сторіс */
  React.useEffect(() => {
    async function fetchStories() {
      const data = await Api.stories.getAll();
      setStories(data);
    }

    fetchStories();
  }, []);

  /* Відкриття сторіс */
  const onClickStory = (story: IStory) => {
    setSelectedStory(story);

    if (story.items.length > 0) {
      // preload first image to get natural dimensions
      const img = new Image();
      img.onload = () => {
        const maxW = window.innerWidth * 0.95;
        const maxH = window.innerHeight * 0.95;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        const ratio = Math.min(maxW / w, maxH / h, 1);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
        setModalSize({ width: w, height: h });
        setOpen(true);
      };
      img.src = story.items[0].sourceUrl;
    }
  };

  // Lock scroll while modal is open
  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
    return;
  }, [open]);

  return (
    /* Розмітка */
    <>
      <Container
        className={cn(
          "flex items-center justify-between gap-2 my-10",
          className
        )}
      >
        {stories.length === 0 &&
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-[200px] h-[250px] bg-gray-200 rounded-md animate-pulse"
            />
          ))}

        {stories.map((story) => (
          <img
            key={story.id}
            onClick={() => onClickStory(story)}
            className="rounded-md cursor-pointer"
            height={250}
            width={200}
            src={story.previewImageUrl}
          />
        ))}

        {open && (
          <div className="fixed left-0 top-0 w-full h-full bg-black/80 flex items-center justify-center z-50">
            <div
              className="relative bg-transparent"
              style={{ width: modalSize?.width ?? 520, height: modalSize?.height ?? 800 }}
            >
              <button
                className="absolute top-2 right-2 z-50 p-1"
                onClick={() => {
                  setOpen(false);
                  setModalSize(null);
                }}
                aria-label="Close stories"
              >
                <X className="w-8 h-8 text-white/80" />
              </button>

              <ReactStories
                onAllStoriesEnd={() => {
                  setOpen(false);
                  setModalSize(null);
                }}
                stories={
                  selectedStory?.items.map((item) => ({ url: item.sourceUrl })) || []
                }
                defaultInterval={3000}
                width={modalSize?.width ?? 520}
                height={modalSize?.height ?? 800}
              />
            </div>
          </div>
        )}
      </Container>
    </>
  );
};
