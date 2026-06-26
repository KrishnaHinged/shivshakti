import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      default: "Shivshakti Elevator Components Pvt. Ltd.",
    },
    tagline: { type: String, default: "Touch The Sky With Shivshakti" },
    subTagline: { type: String, default: "Work With Honesty" },
    emails: {
      type: [String],
      default: ["sales.shivshakti22@gmail.com", "sales.shivshakti16@gmail.com"],
    },
    phones: {
      type: [String],
      default: ["+91 9737171100", "+91 6352699700"],
    },
    whatsapp: { type: String, default: "+91 6352699700" },
    addresses: {
      type: [
        {
          branchName: String,
          addressLine: String,
          cityState: String,
          phone: String,
          email: String,
          badge: String,
        },
      ],
      default: [
        {
          branchName: "Surat Head Office",
          addressLine:
            "Plot No. 2, Hi-Tech Park, Siddharth Nagar Canal Road, Opp. Navin Florin, Vadod-Bhestan",
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
          addressLine:
            "House No 11-A, 12-A Shyam Bhawan, Kanpur Road, Sarojini Nagar",
          cityState: "Lucknow - 226008, UP, INDIA",
          phone: "+91 6353 547 898",
          email: "sales.shivshaktilucknow@gmail.com",
          badge: "Branch Office",
        },
      ],
    },
    gst: { type: String, default: "24ACMFS0685B1Z7" },
    iec: { type: String, default: "5214013353" },
    banker: { type: String, default: "HDFC Bank" },
    socialLinks: {
      facebook: {
        type: String,
        default:
          "https://www.facebook.com/profile.php?id=100050285328348",
      },
      instagram: {
        type: String,
        default: "https://instagram.com/shiv_shakti_industries16",
      },
      whatsapp: {
        type: String,
        default: "https://api.whatsapp.com/send/?phone=6352699700",
      },
    },
    googleMapsEmbed: {
      type: String,
      default:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7443.070126532547!2d72.83616664773402!3d21.13109450000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0504afffd4eed%3A0xb9561cce79e13eaf!2sShiv%20Shakti%20Elevator%20Components%20Pvt%20Ltd",
    },
    logoUrl: { type: String, default: "/images/logo.png" },
    faviconUrl: { type: String, default: "/favicon.ico" },
    footerDescription: {
      type: String,
      default:
        "Manufacturer of premium elevator cabins, automatic doors, car frames and components. Headquartered in Surat, Gujarat with branches in Indore and Lucknow.",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);
