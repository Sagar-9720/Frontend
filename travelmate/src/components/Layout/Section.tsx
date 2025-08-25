// src/components/SectionTitle.tsx
interface Props {
  title: string;
}

export default function SectionTitle({ title }: Props) {
  return <h2 className="text-2xl font-bold my-8 text-center">{title}</h2>;
}
