import dbConnect from "@/shared/lib/mongodb";
import { Testimonial } from "@/shared/models";
import { TestimonialsClient } from "@/features/testimonials";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminTestimonialsPage() {
  await dbConnect();
  const testimonials = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });

  return <TestimonialsClient initialItems={JSON.parse(JSON.stringify(testimonials))} />;
}
