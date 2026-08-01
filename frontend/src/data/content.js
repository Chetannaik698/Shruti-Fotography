// Central content file — swap image URLs or copy here without touching components.

export const img = (id, w = 1600, q = 80) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`

export const navLinks = [
  { label: 'Home', href: '#home', isHash: true },
  { label: 'Portfolio', href: '#portfolio', isHash: true },
  { label: 'About', href: '#about', isHash: true },
  { label: 'Services', href: '#services', isHash: true },
  { label: 'Contact', href: '#contact', isHash: true },
  { label: 'Payment', href: '/payment', isHash: false },
]

export const heroImage = img('photo-1519741497674-611481863552', 2400, 80)

export const portfolioCategories = [
  'All',
  'Engagement/Wedding',
  'Pre_post Wedding',
  'Birthday and Party',
  'Stage functions',
  'Brahmopadesham',
  'Haldi',
  'Outdoor Fotography',
  'Candid Fotography',
  'Baby Shoot',
  'Maternity',
  'Portrait',
  'Fashion',
  'Corporate Shoots',
  'Family Shoot'
]

export const portfolioImages = [
  { id: 1, category: 'Engagement/Wedding', title: 'Golden Hour Vows', src: img('photo-1465495976277-4387d4b0b4c6'), tall: true },
  { id: 2, category: 'Portrait', title: 'Quiet Confidence', src: img('photo-1544005313-94ddf0286df2'), tall: false },
  { id: 3, category: 'Fashion', title: 'Studio Edge', src: img('photo-1524504388940-b1c1722653e1'), tall: true },
  { id: 4, category: 'Engagement/Wedding', title: 'First Dance', src: img('photo-1511285560929-80b456fea0bc'), tall: false },
  { id: 5, category: 'Stage functions', title: 'Champagne Toast', src: img('photo-1511795409834-ef04bbd61622'), tall: true },
  { id: 6, category: 'Pre_post Wedding', title: 'Coastal Promise', src: img('photo-1522673607200-164d1b6ce486'), tall: false },
  { id: 7, category: 'Portrait', title: 'Amber Light', src: img('photo-1489424731084-a5d8b219a5bb'), tall: true },
  { id: 8, category: 'Fashion', title: 'Monochrome', src: img('photo-1483985988355-763728e1935b'), tall: false },
  { id: 9, category: 'Engagement/Wedding', title: 'The Aisle', src: img('photo-1583939003579-730e3918a45a'), tall: true },
  { id: 10, category: 'Stage functions', title: 'City Lights Gala', src: img('photo-1511578314322-379afb476865'), tall: false },
  { id: 11, category: 'Pre_post Wedding', title: 'Sunset Walk', src: img('photo-1520854221256-17451cc331bf'), tall: true },
  { id: 12, category: 'Portrait', title: 'Editorial Calm', src: img('photo-1507003211169-0a1dd7228f2d'), tall: false },
]

export const stats = []

export const services = [
  { title: 'Wedding Fotography', desc: 'Cinematic coverage of every vow, glance and celebration, told in a timeless visual narrative.', icon: 'ring' },
  { title: 'Cinematic Videography', desc: 'Feature-film quality highlight films that relive your day in motion and sound.', icon: 'film' },
  { title: 'Drone Shoots', desc: 'Sweeping aerial perspectives that capture the scale and beauty of your venue.', icon: 'drone' },
  { title: 'Foto Frames', desc: 'Premium, museum-grade frames to showcase and preserve your favorite memories.', icon: 'frame' },
  { title: 'Lamination', desc: 'High-quality protective lamination for documents, posters, and professional prints.', icon: 'layers' },
  { title: 'Xerox Copier', desc: 'Fast, high-fidelity black-and-white or full color copy solutions for all document sizes.', icon: 'copy' },
  { title: 'Quality Printings', desc: 'Professional fotography and document print services with vibrant color accuracy.', icon: 'printer' },
  { title: 'ID Cards', desc: 'Custom identity card printing with premium finishes for schools and corporate teams.', icon: 'idcard' },
  { title: 'Mug Printing', desc: 'Vibrant, personalized custom mugs that make perfect gifts or corporate swag.', icon: 'coffee' },
  { title: 'Album Design', desc: 'Hand-crafted, archival albums that turn your favorite frames into heirlooms.', icon: 'book' },
]

export const whyChooseUs = [
  { title: 'Creative Vision', desc: 'A distinct visual language shaped over a decade behind the lens.', icon: 'eye' },
  { title: 'Premium Editing', desc: 'Every frame color-graded and retouched by hand, never automated.', icon: 'sliders' },
  { title: 'Fast Delivery', desc: 'Full galleries delivered within days, not months.', icon: 'zap' },
  { title: 'Experienced Team', desc: 'Photographers, editors and stylists who work as one unit.', icon: 'users' },
  { title: 'High Resolution', desc: 'Print-ready files, museum-grade quality on every delivery.', icon: 'aperture' },
  { title: 'Trusted by Hundreds', desc: 'A reputation built entirely on referrals and repeat clients.', icon: 'shield' },
]

export const testimonials = []

export const pricingPlans = [
  {
    name: 'Basic',
    price: '25,000',
    tagline: 'For intimate sessions',
    features: ['4-hour coverage', '1 photographer', '150 edited photos', 'Online gallery', 'Print release'],
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '75,000',
    tagline: 'Our most-booked package',
    features: ['8-hour coverage', '2 photographers', '400 edited photos', 'Cinematic highlight film', 'Pre-wedding shoot', 'Premium album'],
    highlighted: false,
  },
  {
    name: 'Luxury',
    price: '1,50,000',
    tagline: 'The complete experience',
    features: ['Full-day coverage', '3 photographers + videographer', 'Unlimited edited photos', 'Drone coverage', 'Same-week sneak peek', 'Heirloom album + prints', 'Dedicated producer'],
    highlighted: true,
  },
]

export const instagramImages = [
  img('photo-1519741497674-611481863552', 600, 70),
  img('photo-1465495976277-4387d4b0b4c6', 600, 70),
  img('photo-1524504388940-b1c1722653e1', 600, 70),
  img('photo-1511578314322-379afb476865', 600, 70),
  img('photo-1522673607200-164d1b6ce486', 600, 70),
  img('photo-1483985988355-763728e1935b', 600, 70),
]

export const faqs = [
  {
    q: 'What are your studio opening hours and timings?',
    a: 'Our studio is open Monday to Saturday from 9:15 AM to 7:00 PM, and on Sunday from 9:15 AM to 1:00 PM.',
  },
  {
    q: 'What services are available at Shruti Fotography?',
    a: 'We offer Wedding & Event Fotography, Cinematic Videography, Drone Shoots, Foto Frames, Lamination, Xerox Copier, Quality Printings, ID Cards, Custom Mug Printing, and Album Design.',
  },
  {
    q: 'Can I book a session or make payments online?',
    a: 'Yes, you can submit booking inquiries via our contact section and make advance or session payments online through our secure payment page.',
  },
]

export const contactInfo = {
  phone: '+91 81230 50660',
  landline: '08385-200660',
  email: 'shrutifotography@gmail.com',
  address: '399/1, Gudigar Galli, Main Road, Bhatkal - 561320',
  whatsapp: 'https://wa.me/918123050660',
  mapEmbed: 'https://maps.google.com/maps?q=13.9849817,74.5463878&z=15&output=embed',
}

export const studioLocation = {
  address: '399/1, Gudigar Galli, Main Road, Bhatkal - 561320',
  directionsUrl: 'https://maps.app.goo.gl/PLc3w3tmsDVD651J9',
  hours: [
    { day: 'Monday – Saturday', time: '9:15 AM – 7:00 PM' },
    { day: 'Sunday', time: '9:15 AM – 1:00 PM' },
  ],
}

export const socialLinks = [
  { platform: 'instagram', href: 'https://www.instagram.com/shrutifotography/' },
  { platform: 'facebook', href: 'https://www.facebook.com/shrutifotography/' },
]
