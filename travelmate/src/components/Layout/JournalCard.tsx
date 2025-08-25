// src/components/JournalDayCard.tsx
interface Props {
  dayTitle: string;
  image: string;
  description: string;
}

export default function JournalDayCard({
  dayTitle,
  image,
  description,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      <img
        src={image}
        alt={dayTitle}
        className="w-40 h-32 rounded-lg object-cover"
      />
      <div>
        <h3 className="font-bold text-lg">{dayTitle}</h3>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}
