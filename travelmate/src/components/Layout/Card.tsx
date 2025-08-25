// src/components/DestinationCard.tsx
interface Props {
  image: string;
  name: string;
  subtitle: string;
}

export default function Card({ image, name, subtitle }: Props) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white">
      <img src={image} alt={name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}
