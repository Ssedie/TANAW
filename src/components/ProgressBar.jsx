// src/components/ProgressBar.jsx
export default function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-300 rounded-full h-3">
      <div
        className="bg-green-600 h-3 rounded-full"
        style={{ width: `${Math.min(100, percentage)}%` }}
      />
    </div>
  );
}
