import React from "react";

const avatarColors = [
  "#6A5ACD", "#4B0082", "#32CD32", "#1E90FF", "#FF8C00",
  "#DC143C", "#20B2AA", "#FF1493", "#2F4F4F", "#008080",
  "#556B2F", "#8B008B", "#FF4500", "#4169E1", "#2E8B57",
  "#4682B4", "#9ACD32", "#00BFFF", "#FF6347", "#9932CC",
];

function getAvatarColor(letter: string) {
  if (!letter) return "#808080";
  const index = (letter.charCodeAt(0) - 65) % avatarColors.length;
  return avatarColors[index];
}

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
}

export default function Avatar({ name, src, size = 32 }: AvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const bgColor = getAvatarColor(initial);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: size * 0.45,
      }}
      className="rounded-full flex items-center justify-center text-white font-semibold"
    >
      {initial}
    </div>
  );
}
