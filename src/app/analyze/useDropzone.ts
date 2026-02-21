"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

type UseDropzoneOptions = {
  onDrop: (files: File[]) => void;
  accept?: string[];
};

export function useDropzone({ onDrop, accept }: UseDropzoneOptions) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onDrop(files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onDrop(files);
  };

  const getRootProps = () => ({
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onClick: () => inputRef.current?.click(),
  });

  const getInputProps = () => ({
    ref: inputRef,
    type: "file" as const,
    accept: accept?.join(","),
    onChange: handleInputChange,
    style: { display: "none" } as React.CSSProperties,
  });

  return { getRootProps, getInputProps, isDragActive };
}
