import classNames from "classnames";
import { useCallback, useRef, useState } from "react";

import { AspectRatioBox } from "@web-speed-hackathon-2026/client/src/components/foundation/AspectRatioBox";
import { FontAwesomeIcon } from "@web-speed-hackathon-2026/client/src/components/foundation/FontAwesomeIcon";

interface Props {
  src: string;
}

/**
 * クリックすると再生・一時停止を切り替えます。
 */
export const PausableMovie = ({ src }: Props) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captureFrame = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
    }
  }, []);

  // 画像読み込み完了時: prefers-reduced-motion のとき最初のフレームで静止
  const handleLoad = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      captureFrame();
      setIsPlaying(false);
    }
  }, [captureFrame]);

  const handleClick = useCallback(() => {
    setIsPlaying((prev) => {
      if (prev) {
        // 一時停止: 現在のフレームを canvas にキャプチャ
        captureFrame();
      }
      return !prev;
    });
  }, [captureFrame]);

  return (
    <AspectRatioBox aspectHeight={1} aspectWidth={1}>
      <button
        aria-label="動画プレイヤー"
        className="group relative block h-full w-full"
        onClick={handleClick}
        type="button"
      >
        {/* GIF をブラウザネイティブで表示 (fetchBinary 不要) */}
        <img
          ref={imgRef}
          src={src}
          alt=""
          className={classNames("w-full h-full object-cover", { hidden: !isPlaying })}
          loading="lazy"
          onLoad={handleLoad}
        />
        {/* 一時停止中は canvas にキャプチャしたフレームを表示 */}
        <canvas
          ref={canvasRef}
          className={classNames("w-full h-full object-cover", { hidden: isPlaying })}
        />
        <div
          className={classNames(
            "absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16 text-cax-surface-raised text-3xl bg-cax-overlay/50 rounded-full -translate-x-1/2 -translate-y-1/2",
            {
              "opacity-0 group-hover:opacity-100": isPlaying,
            },
          )}
        >
          <FontAwesomeIcon iconType={isPlaying ? "pause" : "play"} styleType="solid" />
        </div>
      </button>
    </AspectRatioBox>
  );
};
