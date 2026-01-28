import React from "react";

const avatarColors: string[] = [
  "#6A5ACD", "#4B0082", "#32CD32", "#1E90FF", "#FF8C00",
  "#DC143C", "#20B2AA", "#FF1493", "#2F4F4F", "#008080",
  "#556B2F", "#8B008B", "#FF4500", "#4169E1", "#2E8B57",
  "#4682B4", "#9ACD32", "#00BFFF", "#FF6347", "#9932CC",
  "#3CB371", "#6495ED", "#D2691E", "#8A2BE2", "#B22222", "#008B8B"
];

function getAvatarColor(letter: string): string {
  if (!letter) return "#808080"; // fallback abu-abu kalau kosong
  const index = (letter.toUpperCase().charCodeAt(0) - 65) % avatarColors.length;
  return avatarColors[index];
}

interface AvatarProps {
  name?: string; // optional
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name = "?", size = 25 }) => {
  const initial = name.charAt(0).toUpperCase() || "?";
  const bgColor = getAvatarColor(initial);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: size * 0.45,
      }}
    >
      {initial}
    </div>
  );
};

export default Avatar;
