import Card from "./Card";

export interface GridItem {
  image: string;
  name: string;
  subtitle: string;
}

interface GridProps {
  items: GridItem[];
}

export default function Grid({ items }: GridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
      {items.map((item, i) => (
        <Card key={i} {...item} />
      ))}
    </div>
  );
}
