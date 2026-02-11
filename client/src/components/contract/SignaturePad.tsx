import React, { useRef, useEffect, useState } from "react";

type SignaturePadProps = {
  width?: number;
  height?: number;
  onChange?: (dataUrl: string) => void;
  className?: string;
};

const SignaturePad: React.FC<SignaturePadProps> = ({ width = 500, height = 150, onChange, className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.strokeStyle = "#111";
        context.lineWidth = 2;
        context.lineCap = "round";
        context.lineJoin = "round";
        setCtx(context);
      }
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    } else {
      const me = e as React.MouseEvent;
      return { x: me.clientX - rect.left, y: me.clientY - rect.top };
    }
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const { x, y } = getPos(e);
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx?.lineTo(x, y);
    ctx?.stroke();
    if (onChange && canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/png"));
    }
  };

  const end = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    isDrawingRef.current = false;
    ctx?.closePath();
    if (onChange && canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clear = () => {
    if (!canvasRef.current || !ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange?.(canvasRef.current.toDataURL("image/png"));
  };

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border rounded bg-white touch-none"
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={end}
      />
      <div className="mt-2 flex gap-2">
        <button type="button" className="px-3 py-1 text-sm border rounded" onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
