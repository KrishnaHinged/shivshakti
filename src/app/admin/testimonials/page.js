import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import TestimonialsClient from "@/components/admin/TestimonialsClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminTestimonialsPage() {
  await dbConnect();
  const testimonials = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });

  return <TestimonialsClient initialItems={JSON.parse(JSON.stringify(testimonials))} />;
}
