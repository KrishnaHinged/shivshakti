const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
try {
  require("dotenv").config({ path: ".env" });
} catch (e) {
  // dotenv may not be installed; using node --env-file flag or existing env vars
}

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const SettingSchema = new mongoose.Schema({
  companyName: String,
  tagline: String,
  subTagline: String,
  emails: [String],
  phones: [String],
  whatsapp: String,
  addresses: [
    {
      branchName: String,
      addressLine: String,
      cityState: String,
      phone: String,
      email: String,
      badge: String,
    },
  ],
  gst: String,
  iec: String,
  banker: String,
  socialLinks: { facebook: String, instagram: String, whatsapp: String },
  googleMapsEmbed: String,
  logoUrl: String,
  faviconUrl: String,
  footerDescription: String,
});

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
});

const ProductSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: String,
  description: String,
  shortDescription: String,
  images: [String],
  featuredImage: String,
  badge: String,
  badgeColor: String,
  specs: { type: Map, of: String },
  status: { type: String, default: "active" },
  featured: Boolean,
});

const TestimonialSchema = new mongoose.Schema({
  name: String,
  role: String,
  rating: Number,
  review: String,
  image: String,
  status: { type: String, default: "published" },
  displayOrder: Number,
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in your environment variables (.env)");
  process.exit(1);
}

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for seeding...");

  // 1. Seed admin
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash("admin12345", 10);
    await Admin.create({
      email: "admin@shivshakti.com",
      password: hashedPassword,
    });
    console.log("Seeded default admin account: admin@shivshakti.com / admin12345");
  } else {
    console.log("Admin accounts already exist. Skipping admin seed.");
  }

  // 2. Seed Settings
  const settingsCount = await Setting.countDocuments();
  if (settingsCount === 0) {
    await Setting.create({
      companyName: "Shivshakti Elevator Components Pvt. Ltd.",
      tagline: "Touch The Sky With Shivshakti",
      subTagline: "Work With Honesty",
      emails: ["sales.shivshakti22@gmail.com", "sales.shivshakti16@gmail.com"],
      phones: ["+91 9737171100", "+91 6352699700"],
      whatsapp: "+91 6352699700",
      addresses: [
        {
          branchName: "Surat Head Office",
          addressLine: "Plot No. 2, Hi-Tech Park, Siddharth Nagar Canal Road, Opp. Navin Florin, Vadod-Bhestan",
          cityState: "Surat - 395023, Gujarat, INDIA",
          phone: "+91 9737171100 / +91 6352699700",
          email: "sales.shivshakti22@gmail.com",
          badge: "Head Office",
        },
        {
          branchName: "Indore Branch",
          addressLine: "B 146 New Loha Mandi, Niranjanpur Devas Naka",
          cityState: "Indore - 452010, MP, INDIA",
          phone: "+91 9909801225",
          email: "sales.shivshaktiindore01@gmail.com",
          badge: "Branch Office",
        },
        {
          branchName: "Lucknow Branch",
          addressLine: "House No 11-A, 12-A Shyam Bhawan, Kanpur Road, Sarojini Nagar",
          cityState: "Lucknow - 226008, UP, INDIA",
          phone: "+91 6353 547 898",
          email: "sales.shivshaktilucknow@gmail.com",
          badge: "Branch Office",
        },
      ],
      gst: "24ACMFS0685B1Z7",
      iec: "5214013353",
      banker: "HDFC Bank",
      socialLinks: {
        facebook: "https://www.facebook.com/profile.php?id=100050285328348",
        instagram: "https://instagram.com/shiv_shakti_industries16",
        whatsapp: "https://api.whatsapp.com/send/?phone=6352699700",
      },
      googleMapsEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=72.8289%2C21.1261%2C72.8389%2C21.1361&layer=mapnik&marker=21.131094%2C72.833979",
      logoUrl: "/images/logo.png",
      faviconUrl: "/favicon.ico",
      footerDescription: "Manufacturer of premium elevator cabins, automatic doors, car frames and components. Headquartered in Surat, Gujarat with branches in Indore and Lucknow.",
    });
    console.log("Seeded default settings.");
  } else {
    console.log("Settings already exist. Skipping settings seed.");
  }

  // 3. Seed Categories
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany([
      { name: "In-House", slug: "in-house" },
      { name: "Trading", slug: "trading" },
      { name: "Authorized Dealer", slug: "authorized" },
    ]);
    console.log("Seeded default categories.");
  } else {
    console.log("Categories already exist. Skipping categories seed.");
  }

  // 4. Seed Products
  const productsCount = await Product.countDocuments();
  if (productsCount === 0) {
    const productsData = [
      {
        title: "Manual Door",
        slug: "manual-door",
        category: "in-house",
        badge: "In-House Made",
        badgeColor: "brand-blue",
        featuredImage: "/images/products/manual-door.png",
        images: ["/images/products/manual-door.png"],
        shortDescription: "Precision-engineered manual elevator doors manufactured in-house at our Surat facility. Available in SS and MS variants with premium finishing.",
        description: "Our manual elevator doors are manufactured with premium structural integrity, offering seamless operation, durability, and customization. Options include stainless steel hairline, gold mirror, and powder-coated mild steel.",
        specs: {
          type: "Manual Sliding / Swing",
          material: "Stainless Steel / MS",
          finish: "Hairline / Mirror / Powder Coat",
        },
        featured: true,
      },
      {
        title: "Automatic Door",
        slug: "automatic-door",
        category: "in-house",
        badge: "In-House Made",
        badgeColor: "brand-blue",
        featuredImage: "/images/products/automatic-door.png",
        images: ["/images/products/automatic-door.png"],
        shortDescription: "Our flagship in-house automatic elevator doors with precision motor control, smooth operation, and premium surface finishes for luxury installations.",
        description: "Designed using advanced controller technology, these automatic doors offer silent opening, closing, and reliable safety measures. Ideal for commercial projects and luxury residential buildings.",
        specs: {
          type: "Auto Sliding (Centre / Side Opening)",
          material: "Stainless Steel",
          finish: "Hairline / Satin / Mirror",
        },
        featured: true,
      },
      {
        title: "SS / MS Cabin",
        slug: "ss-ms-cabin",
        category: "in-house",
        badge: "In-House Made",
        badgeColor: "brand-blue",
        featuredImage: "/images/products/ss-cabin.png",
        images: ["/images/products/ss-cabin.png"],
        shortDescription: "Fully customizable elevator cabins in Stainless Steel and Mild Steel with premium interior finishing options. Manufactured at our 40,000 sq ft Surat facility.",
        description: "Shivshakti cabins set the standard for luxury. Engineered with acoustic insulation, premium lighting layouts, ceiling designs, and customized wall panels in multiple architectural finishes.",
        specs: {
          type: "Passenger / Goods / Hospital",
          material: "SS 304 / MS",
          finish: "Multiple Panel Options Available",
        },
        featured: true,
      },
      {
        title: "Elevator Car Frame",
        slug: "car-frame",
        category: "in-house",
        badge: "In-House Made",
        badgeColor: "brand-blue",
        featuredImage: "/images/products/car-frame.png",
        images: ["/images/products/car-frame.png"],
        shortDescription: "Structural elevator car frames engineered for maximum load capacity and safety. Built with precision-cut steel and fully compatible with all major drive systems.",
        description: "Engineered specifically to minimize vibration and cabin sway. We use structural steel members welded under strict quality conditions to ensure maximum lifespan.",
        specs: {
          type: "Standard / Heavy Duty",
          material: "Structural Steel",
          finish: "Powder Coated",
        },
        featured: true,
      },
      {
        title: "Geared / Gearless Machine",
        slug: "geared-gearless",
        category: "trading",
        badge: "Trading",
        badgeColor: "brand-blue",
        featuredImage: "/images/products/machine.png",
        images: ["/images/products/machine.png"],
        shortDescription: "Premium geared and gearless traction machines sourced from top-tier manufacturers. Ideal for high-rise residential and commercial elevator installations.",
        description: "Highly efficient drives designed to reduce energy consumption while maintaining smooth velocity profiles. Sourced directly from global OEM providers.",
        specs: {
          type: "Geared / Gearless Traction",
          capacity: "Up to 2000 kg",
          speed: "Up to 2.5 m/s",
        },
        featured: false,
      },
      {
        title: "LOP / COP Panels",
        slug: "lop-cop",
        category: "trading",
        badge: "Trading",
        badgeColor: "brand-blue",
        featuredImage: "/images/products/lop-cop.png",
        images: ["/images/products/lop-cop.png"],
        shortDescription: "Landing Operation Panels and Car Operation Panels with modern digital displays, tactile buttons, and multiple finish options for luxury elevator interiors.",
        description: "Improve elevator usability with premium touch buttons, voice announcers, and LCD/TFT displays. Built with stainless steel casing.",
        specs: {
          type: "LOP (Landing) / COP (Car)",
          display: "Digital / LED",
          finish: "SS / Powder Coated",
        },
        featured: false,
      },
      {
        title: "T-Guide Rail & Bracket",
        slug: "t-guide-rail",
        category: "trading",
        badge: "Trading",
        badgeColor: "brand-blue",
        featuredImage: "/images/products/guide-rail.png",
        images: ["/images/products/guide-rail.png"],
        shortDescription: "Precision-machined T-guide rails and mounting brackets for smooth elevator travel. Available in multiple sizes for passenger and goods lifts.",
        description: "Manufactured under strict thickness control. Minimizes friction during elevator operations, leading to silent and steady carriage transitions.",
        specs: {
          type: "T-Guide Rail + Bracket",
          material: "High-grade Steel",
          sizes: "9kg / 13kg / 18kg / 22.5kg",
        },
        featured: false,
      },
      {
        title: "Usha Martin Wire Rope",
        slug: "usha-martin",
        category: "authorized",
        badge: "Authorized Dealer",
        badgeColor: "brand-orange",
        featuredImage: "/images/products/wire-rope.png",
        images: ["/images/products/wire-rope.png"],
        shortDescription: "Authorized dealer for Usha Martin — World's No. 1 wire rope brand. Premium elevator wire ropes with superior tensile strength, flexibility, and fatigue resistance.",
        description: "Shivshakti is a certified direct dealer of Usha Martin wire ropes. These ropes are design-optimized for traction, boasting superior fatigue limits and minimal rope stretch.",
        specs: {
          brand: "Usha Martin",
          type: "Traction / Suspension Wire Rope",
          certification: "World No. 1 Brand",
        },
        featured: true,
      },
    ];
    await Product.insertMany(productsData);
    console.log("Seeded default products.");
  } else {
    console.log("Products already exist. Skipping products seed.");
  }

  // 5. Seed Testimonials
  const testimonialsCount = await Testimonial.countDocuments();
  if (testimonialsCount === 0) {
    const testimonialsData = [
      {
        name: "Shadman Sheikh",
        role: "Managing Director",
        rating: 5,
        review: "Wonderful experience. They manufacture premium finishing doors, cabins and other elevator components. Mr. Chetan is doing a great job. The finishing of the products and the team of Shivshakti is mind blowing. Keep growing.",
        image: "",
        displayOrder: 0,
      },
      {
        name: "Kautuk Patel",
        role: "Designer",
        rating: 5,
        review: "One-roof solutions for all elevator products. Also authorized dealer for the world's No. 1 wire rope brand. Nice experience.",
        image: "",
        displayOrder: 1,
      },
      {
        name: "Dilip Barad",
        role: "Industry Professional",
        rating: 5,
        review: "The best quality product is delivered on time. Very nice work culture. Customer satisfaction, safety, and advanced technology are the main identity of Shivshakti.",
        image: "",
        displayOrder: 2,
      },
      {
        name: "Keyur Sharma",
        role: "Local Guide",
        rating: 5,
        review: "Manufacturing best quality products of elevator cabin, auto door, frame, IFD door and wire rope. Cabin delivered within 7 days. Auto door and frame dispatched same day of order.",
        image: "",
        displayOrder: 3,
      },
      {
        name: "Divyaraj Parmar",
        role: "Local Guide",
        rating: 5,
        review: "Everything is under one roof for elevator needs. Impressed by their own Shivshakti make auto doors. Great product quality and service.",
        image: "",
        displayOrder: 4,
      },
      {
        name: "Dinesh Batavia",
        role: "Local Guide",
        rating: 5,
        review: "Good manufacturer of elevators for all purposes. The unit has the latest equipment to produce quality products. Management is also good.",
        image: "",
        displayOrder: 5,
      },
    ];
    await Testimonial.insertMany(testimonialsData);
    console.log("Seeded default testimonials.");
  } else {
    console.log("Testimonials already exist. Skipping testimonials seed.");
  }

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
