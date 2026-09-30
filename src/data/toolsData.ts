/**
 * Complete directory of all QuickPixel Tools with SEO metadata,
 * deep educational content, structured FAQ items, and technical configurations.
 */

export interface ToolDef {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  category: 'compression' | 'conversion' | 'resizing' | 'pdf' | 'editing';
  defaultMode: 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'quality_reduce' | 'pdf';
  defaultFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'original';
  defaultQuality: number;
  defaultTargetSizeBytes?: number;
  acceptedFormats: string;
  iconName: string;
  shortDesc: string;
  benefits: string[];
  stepGuide: { step: string; title: string; desc: string }[];
  overviewHtml: string;
  whyUseHtml: string;
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export const TOOLS_DATA: ToolDef[] = [
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    metaTitle: 'Image Compressor Online – Compress Images Free | QuickPixel Tools',
    metaDescription: 'Compress JPG, PNG, and WebP images online without losing quality. Free, fast browser-side image compressor. No file size limits or registration.',
    h1: 'Free Online Image Compressor',
    subtitle: 'Reduce image file size by up to 85% while preserving visual clarity. Fast, private, and 100% processed in your browser.',
    category: 'compression',
    defaultMode: 'compress',
    defaultFormat: 'original',
    defaultQuality: 0.8,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'Minimize2',
    shortDesc: 'Compress JPG, PNG, and WebP images with custom quality and target sizes.',
    benefits: [
      'Up to 85% file size reduction without perceptible quality loss',
      'Processed in your web browser for instant speed and privacy',
      'Batch compress multiple photos simultaneously',
      'Target file size mode (200KB, 500KB, 1MB, or custom)',
    ],
    stepGuide: [
      { step: '1', title: 'Upload Images', desc: 'Drag and drop your JPG, PNG, WebP or HEIC photos into the upload box.' },
      { step: '2', title: 'Choose Quality or Target', desc: 'Adjust the compression slider, pick a preset (Web, Email, Social), or specify a target file size.' },
      { step: '3', title: 'Download Instantly', desc: 'Preview the before/after result and download individual images or all as a ZIP archive.' },
    ],
    overviewHtml: `
      <p>QuickPixel Tools Image Compressor allows you to drastically reduce image file sizes without compromising visual detail. Large image files slow down website loading times, consume mobile bandwidth, and exceed email attachment limits. Our browser-based compression engine uses advanced perceptual quantization to eliminate unnecessary data bytes while maintaining crisp edges and vibrant colors.</p>
      <p>Unlike traditional online tools that upload your private photos to remote servers, QuickPixel processes everything directly in your browser using modern WebAssembly and Canvas APIs. Your photos never leave your device.</p>
    `,
    whyUseHtml: `
      <p>Whether you are an e-commerce store owner seeking faster PageSpeed scores, a photographer emailing high-resolution proofs, or a job applicant uploading a resume headshot with strict file limits, image compression is indispensable:</p>
      <ul>
        <li><strong>Accelerate Web Performance:</strong> Faster page loads directly boost SEO rankings and user engagement.</li>
        <li><strong>Email Attachment Compliance:</strong> Never hit the frustrating 25MB email attachment limit again.</li>
        <li><strong>Storage Optimization:</strong> Save valuable gigabytes on your local drive and cloud backups.</li>
      </ul>
    `,
    faqs: [
      { question: 'What is an image compressor?', answer: 'An image compressor is a utility that removes redundant or imperceptible color and pixel data from an image file, resulting in a substantially smaller file size while keeping visual appearance almost identical.' },
      { question: 'How do I compress an image online?', answer: 'Simply drag and drop your image onto QuickPixel Tools, adjust the quality slider to your desired balance, and click Download. You can also specify an exact target size like 200KB or 500KB.' },
      { question: 'How can I reduce image size without losing quality?', answer: 'Our intelligent compression uses visual thresholding to preserve high-contrast edges and skin tones while eliminating imperceptible color variations. You can compress images by 60% to 80% with zero visible degradation.' },
      { question: 'Are my images uploaded to any server?', answer: 'No. QuickPixel Tools processes images entirely inside your browser using client-side HTML5 canvas APIs. Your files are never uploaded or permanently stored on any server.' },
      { question: 'Is there a limit on how many images I can compress?', answer: 'No, QuickPixel Tools is completely free to use with unlimited batch uploads.' },
    ],
    relatedSlugs: ['compress-jpg', 'compress-png', 'compress-webp', 'compress-image-to-200kb', 'image-resizer', 'image-to-pdf'],
  },
  {
    slug: 'compress-jpg',
    name: 'Compress JPG',
    metaTitle: 'Compress JPG Online – Free JPG Image Compressor | QuickPixel Tools',
    metaDescription: 'Compress JPG and JPEG photos online for free. Reduce JPG file size by up to 80% while maintaining sharp image quality. Instant browser-based processing.',
    h1: 'Compress JPG Images Online Free',
    subtitle: 'Reduce the file size of your JPG and JPEG photos without visible pixelation. Fast, private, and batch-enabled.',
    category: 'compression',
    defaultMode: 'compress',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.78,
    acceptedFormats: '.jpg,.jpeg',
    iconName: 'FileImage',
    shortDesc: 'Optimize JPEG photos for fast websites and email attachments.',
    benefits: [
      'Tailored quantization matrices for natural photos and gradients',
      'Preserves original color profile and dimensions',
      'Side-by-side before and after comparison slider',
      'Download single files or batch ZIP archive',
    ],
    stepGuide: [
      { step: '1', title: 'Select JPG Files', desc: 'Drop your .jpg or .jpeg images into the processing area.' },
      { step: '2', title: 'Set Compression Level', desc: 'Choose a preset like Website or Balanced, or fine-tune quality with the interactive slider.' },
      { step: '3', title: 'Download Optimized JPG', desc: 'Save your compressed JPG with significant kilobyte savings.' },
    ],
    overviewHtml: `
      <p>JPG (Joint Photographic Experts Group) is the most widespread format for photographs and digital cameras. Because JPG uses lossy discrete cosine transform compression, poorly optimized JPG files can easily balloon to 5MB–10MB each. QuickPixel Tools re-encodes JPG images using smart variable bitrate algorithms, trimming unseen color entropy without introducing artifacts.</p>
    `,
    whyUseHtml: `
      <p>Compressing JPG files is essential for web publishers, real estate portals, and social media managers. Reducing a 4MB photo to 350KB cuts page loading times from seconds to milliseconds, drastically cutting bounce rates on mobile networks.</p>
    `,
    faqs: [
      { question: 'What is the best compression level for JPG images?', answer: 'A quality level between 75% and 82% generally yields a 70% reduction in file size with virtually undetectable visual differences.' },
      { question: 'Can I compress multiple JPG files at once?', answer: 'Yes! QuickPixel Tools supports multi-file drag and drop so you can batch compress dozens of JPG images simultaneously.' },
      { question: 'Does JPG compression remove EXIF data?', answer: 'Our client-side canvas re-encoder naturally strips heavy camera metadata, making your images lighter and protecting your location privacy.' },
    ],
    relatedSlugs: ['image-compressor', 'jpg-to-png', 'jpg-to-webp', 'compress-image-to-200kb', 'image-resizer'],
  },
  {
    slug: 'compress-png',
    name: 'Compress PNG',
    metaTitle: 'Compress PNG Online – Free PNG Image Compressor | QuickPixel Tools',
    metaDescription: 'Compress PNG images online while preserving 100% transparency. Shrink PNG file size for logos, icons, and UI screenshots quickly and privately.',
    h1: 'Compress PNG Online with Transparency',
    subtitle: 'Reduce PNG file size without blurring sharp text, UI graphics, or losing transparent backgrounds.',
    category: 'compression',
    defaultMode: 'compress',
    defaultFormat: 'image/png',
    defaultQuality: 0.85,
    acceptedFormats: '.png',
    iconName: 'Image',
    shortDesc: 'Shrink transparent PNG files, logos, badges, and screenshots.',
    benefits: [
      'Full alpha-channel transparency preservation',
      'Eliminates redundant color palette entries and metadata',
      'Crisp edge retention ideal for logos and vector exports',
      'Batch processing with zero server uploads',
    ],
    stepGuide: [
      { step: '1', title: 'Drop PNG Images', desc: 'Upload transparent PNGs, logos, screenshots, or design assets.' },
      { step: '2', title: 'Adjust PNG Optimization', desc: 'Choose balanced compression or switch to WebP if you want even smaller transparent files.' },
      { step: '3', title: 'Save Optimized PNG', desc: 'Download your lightweight PNG files immediately.' },
    ],
    overviewHtml: `
      <p>PNG is renowned for lossless compression and crisp transparency, making it the industry standard for company logos, app icons, charts, and software screenshots. However, uncompressed 24-bit and 32-bit PNGs are notoriously heavy. QuickPixel Tools strips unneeded color table overhead and optimizes Deflate compression while keeping transparent pixels completely intact.</p>
    `,
    whyUseHtml: `
      <p>Using uncompressed PNG graphics on websites can degrade Google Core Web Vitals, specifically Largest Contentful Paint (LCP). Compressing your PNG logos and hero illustrations ensures lightning-fast page renders.</p>
    `,
    faqs: [
      { question: 'Will compressing my PNG remove the transparent background?', answer: 'No! When compressing in PNG mode or WebP mode, full alpha transparency is strictly maintained.' },
      { question: 'Why are PNG files usually larger than JPG?', answer: 'PNG uses lossless compression to preserve pixel-exact sharpness, whereas JPG discards subtle color nuances. QuickPixel lets you convert or compress without losing clarity.' },
    ],
    relatedSlugs: ['image-compressor', 'png-to-jpg', 'png-to-webp', 'compress-image-to-100kb', 'image-resizer'],
  },
  {
    slug: 'compress-webp',
    name: 'Compress WebP',
    metaTitle: 'Compress WebP Online – Free WebP Compressor | QuickPixel Tools',
    metaDescription: 'Compress WebP images online for free. Optimize next-gen WebP graphics for top Google PageSpeed insights. Fast, secure in-browser compression.',
    h1: 'Compress WebP Images Online',
    subtitle: 'Optimize Google WebP files for maximum compression efficiency and blazing-fast site speed.',
    category: 'compression',
    defaultMode: 'compress',
    defaultFormat: 'image/webp',
    defaultQuality: 0.8,
    acceptedFormats: '.webp',
    iconName: 'Zap',
    shortDesc: 'Fine-tune next-generation WebP files for stellar Core Web Vitals.',
    benefits: [
      'Modern predictive coding for ultra-compact file footprints',
      'Supports both lossy and lossless WebP streams',
      'Interactive before/after inspection',
      'Free unlimited usage directly in your browser',
    ],
    stepGuide: [
      { step: '1', title: 'Select WebP Files', desc: 'Choose your .webp images from your desktop or phone.' },
      { step: '2', title: 'Tweak WebP Quality', desc: 'Pick your preferred quality level or target kilobyte ceiling.' },
      { step: '3', title: 'Download WebP', desc: 'Save your ultra-optimized WebP asset instantly.' },
    ],
    overviewHtml: `
      <p>WebP is Google's modern image format designed specifically for the web, providing 26% smaller files than PNG and 25-34% smaller files than comparable JPGs. Even so, many WebP files produced by cameras and graphic design tools are exported with bloated settings. QuickPixel fine-tunes WebP quantization to give you maximum bandwidth savings.</p>
    `,
    whyUseHtml: `
      <p>Google Lighthouse and PageSpeed Insights explicitly recommend "Serve images in next-gen formats" and "Efficiently encode images". Compressing WebP images ensures your site hits green 90+ performance scores.</p>
    `,
    faqs: [
      { question: 'Do all modern browsers support WebP?', answer: 'Yes! Chrome, Safari, Firefox, Edge, and all modern mobile browsers fully support WebP.' },
      { question: 'Can I convert my JPG or PNG to WebP too?', answer: 'Yes, QuickPixel Tools includes dedicated JPG to WebP and PNG to WebP converters that run in your browser.' },
    ],
    relatedSlugs: ['image-compressor', 'webp-to-jpg', 'webp-to-png', 'jpg-to-webp', 'png-to-webp'],
  },
  {
    slug: 'compress-image-to-200kb',
    name: 'Compress to 200KB',
    metaTitle: 'Compress Image to 200KB Online Free | QuickPixel Tools',
    metaDescription: 'Compress image to 200KB or less online. Perfect for government forms, job portals, college admissions, and portal uploads with strict 200 KB size limits.',
    h1: 'Compress Image to Under 200KB Online',
    subtitle: 'Automatically reduce your photo file size to 200 KB or less while keeping text and faces crystal clear.',
    category: 'compression',
    defaultMode: 'compress',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.75,
    defaultTargetSizeBytes: 200 * 1024,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'Target',
    shortDesc: 'Automated iterative compression guaranteed to hit the strict 200 KB limit.',
    benefits: [
      'Automated multi-pass compression hits exact file size targets',
      'Ideal for passport forms, job application portals, and visa submissions',
      'No trial-and-error guessing with quality sliders',
      'Works seamlessly on mobile, iPhone, and desktop',
    ],
    stepGuide: [
      { step: '1', title: 'Upload Image', desc: 'Select any high-resolution photo from your camera or files.' },
      { step: '2', title: 'Auto-Target 200KB', desc: 'The engine automatically calculates the optimal compression ratio to stay under 200 KB.' },
      { step: '3', title: 'Download Verified File', desc: 'Receive your verified image under 200KB ready for immediate upload.' },
    ],
    overviewHtml: `
      <p>Many government portals, universities, civil service exams (UPSC, SSC), visa applications, and job boards impose an uncompromising maximum file limit of <strong>200 KB</strong>. Uploading even a 201 KB file will trigger an error. QuickPixel Tools eliminates manual trial-and-error by running a smart binary search compression algorithm that ensures your file lands comfortably under 200 KB with maximum preserved quality.</p>
    `,
    whyUseHtml: `
      <p>Manually adjusting sliders in desktop software often takes 5 to 10 attempts to hit a specific file size. QuickPixel Tools calculates the exact quantization parameters and dimension bounds automatically within 50 milliseconds.</p>
    `,
    faqs: [
      { question: 'How do I compress an image to 200KB?', answer: 'Simply upload your photo to this page. Our engine automatically sets the target limit to 200 KB and compresses the file until it falls cleanly under that ceiling.' },
      { question: 'Will the photo remain clear enough for identity verification?', answer: 'Yes! The algorithm prioritizes visual sharpness, facial landmarks, and text clarity so your photo easily passes government verification standards.' },
      { question: 'Can I compress to other sizes like 100KB or 500KB?', answer: 'Yes, you can pick any preset from our target size menu or choose our dedicated 100KB, 500KB, 1MB, or 2MB tools.' },
    ],
    relatedSlugs: ['compress-image-to-100kb', 'compress-image-to-500kb', 'compress-image-to-1mb', 'image-compressor', 'image-resizer'],
  },
  {
    slug: 'compress-image-to-100kb',
    name: 'Compress to 100KB',
    metaTitle: 'Compress Image to 100KB Online Free | QuickPixel Tools',
    metaDescription: 'Compress image to 100KB or less online. Fast and easy photo size reducer for signature images, passport photos, and portals with 100 KB limits.',
    h1: 'Compress Image to Under 100KB Online',
    subtitle: 'Quickly shrink photos and signatures to 100 KB or less without blurriness.',
    category: 'compression',
    defaultMode: 'compress',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.65,
    defaultTargetSizeBytes: 100 * 1024,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'Target',
    shortDesc: 'Shrink signatures, ID cards, and photos under 100 KB.',
    benefits: [
      'Iterative dimension & quality optimization for compact files',
      'Perfect for student registration, exam cards, and signatures',
      'Zero server upload keeps sensitive ID documents secure',
      'Works with JPG, PNG, and phone camera snapshots',
    ],
    stepGuide: [
      { step: '1', title: 'Upload Photo or Signature', desc: 'Select the file you need to shrink down to 100 KB.' },
      { step: '2', title: 'Target 100KB Applied', desc: 'Our engine applies smart downscaling if needed to fit under 100 KB.' },
      { step: '3', title: 'Download Image', desc: 'Verify the file size in the result card and download with one tap.' },
    ],
    overviewHtml: `
      <p>A 100 KB limit is standard for digital signatures, thumb impressions, and candidate photographs on online registration portals. Compressing high-megapixel smartphone photos down to 100 KB requires balancing both resolution downsampling and compression quality so the signature or portrait remains legible.</p>
    `,
    whyUseHtml: `
      <p>QuickPixel Tools handles both dimension scaling and JPEG quantization simultaneously, producing a clean, compliant image under 100 KB without distorted proportions.</p>
    `,
    faqs: [
      { question: 'How do I reduce photo size to 100KB on my mobile phone?', answer: 'Open QuickPixel Tools on your mobile browser, upload your photo from your camera roll, and our 100KB target will process it right on your phone without installing any apps.' },
      { question: 'Can I compress my signature to 100KB?', answer: 'Yes, signatures in JPG or PNG format are compressed cleanly with crisp pen strokes.' },
    ],
    relatedSlugs: ['compress-image-to-200kb', 'compress-image-to-500kb', 'image-compressor', 'image-resizer'],
  },
  {
    slug: 'compress-image-to-500kb',
    name: 'Compress to 500KB',
    metaTitle: 'Compress Image to 500KB Online Free | QuickPixel Tools',
    metaDescription: 'Compress images to 500KB or less online. Optimize high-res photos for web uploads, email newsletters, and content management systems.',
    h1: 'Compress Image to Under 500KB',
    subtitle: 'Optimize high-resolution photography down to 500 KB while retaining superb detail.',
    category: 'compression',
    defaultMode: 'compress',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.82,
    defaultTargetSizeBytes: 500 * 1024,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'Target',
    shortDesc: 'Great sweet spot for web publishing, banners, and blog posts.',
    benefits: [
      'Preserves high definition while staying under half a megabyte',
      'Ideal for blog featured images and Shopify hero banners',
      'Batch optimize multiple catalog photos',
      'Fast client-side rendering',
    ],
    stepGuide: [
      { step: '1', title: 'Drop Photos', desc: 'Upload your high-res photos or graphics.' },
      { step: '2', title: '500KB Target', desc: 'Engine optimizes quality to maximize fidelity under 500 KB.' },
      { step: '3', title: 'Download', desc: 'Download your web-ready image.' },
    ],
    overviewHtml: `
      <p>500 KB is the sweet spot for modern responsive web design. At 500 KB, images can maintain 1920px Full HD resolution with virtually zero artifacting while loading instantaneously over 4G and 5G cellular networks.</p>
    `,
    whyUseHtml: `
      <p>Keeping hero images under 500 KB prevents slow banner rendering, eliminates cumulative layout shifts (CLS), and ensures your web pages score well on Google audits.</p>
    `,
    faqs: [
      { question: 'Why is 500KB a popular target size?', answer: 'It delivers retina-ready clarity for web design without the performance penalty of multi-megabyte raw photos.' },
    ],
    relatedSlugs: ['compress-image-to-1mb', 'compress-image-to-200kb', 'image-compressor', 'image-resizer'],
  },
  {
    slug: 'compress-image-to-1mb',
    name: 'Compress to 1MB',
    metaTitle: 'Compress Image to 1MB Online Free | QuickPixel Tools',
    metaDescription: 'Compress large images to under 1MB online for free. Shrink 10MB+ DSLR and iPhone photos down to 1 MB easily and quickly.',
    h1: 'Compress Image to Under 1MB Online',
    subtitle: 'Tame multi-megabyte DSLR and iPhone camera images to under 1 MB with zero visible loss.',
    category: 'compression',
    defaultMode: 'compress',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.88,
    defaultTargetSizeBytes: 1024 * 1024,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'Target',
    shortDesc: 'Shrink 10MB+ photos to under 1MB for fast sharing and emailing.',
    benefits: [
      'Easily compress 12MB+ phone photos into manageable 1MB files',
      'Retains ultra-sharp photographic detail and dynamic range',
      'Safe, private in-browser compression',
      'One-click batch downloads',
    ],
    stepGuide: [
      { step: '1', title: 'Upload Heavy Photo', desc: 'Select multi-megabyte photos from your phone or camera.' },
      { step: '2', title: 'Auto 1MB Ceiling', desc: 'QuickPixel adjusts quantization to guarantee file size under 1 MB.' },
      { step: '3', title: 'Save File', desc: 'Download the lightweight, high-fidelity result.' },
    ],
    overviewHtml: `
      <p>Modern smartphone cameras (iPhone 48MP, Samsung 200MP) produce massive 8MB to 20MB files by default. Sharing these over messaging platforms or storing thousands in cloud buckets wastes bandwidth and storage. QuickPixel Tools compresses these behemoths to under 1 MB in seconds.</p>
    `,
    whyUseHtml: `
      <p>At 1 MB, photos look identical to originals on retina screens, 4K monitors, and photo prints, yet transfer 10x faster.</p>
    `,
    faqs: [
      { question: 'How much quality is lost when compressing to 1MB?', answer: 'For standard photos, virtually none. Human eyes cannot distinguish between an uncompressed 12MB photo and a properly quantized 1MB JPEG at standard viewing distances.' },
    ],
    relatedSlugs: ['compress-image-to-2mb', 'compress-image-to-500kb', 'image-compressor', 'heic-to-jpg'],
  },
  {
    slug: 'compress-image-to-2mb',
    name: 'Compress to 2MB',
    metaTitle: 'Compress Image to 2MB Online Free | QuickPixel Tools',
    metaDescription: 'Compress images to 2MB or less online. Satisfy file upload caps on job portals, real estate platforms, and cloud storage systems.',
    h1: 'Compress Image to Under 2MB',
    subtitle: 'Reduce large image files to satisfy strict 2 MB upload requirements.',
    category: 'compression',
    defaultMode: 'compress',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.9,
    defaultTargetSizeBytes: 2 * 1024 * 1024,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'Target',
    shortDesc: 'Ensure your photos fit 2MB upload limits on portals and forums.',
    benefits: [
      'Guarantees your file size remains strictly under 2 MB',
      'Maintains ultra-high resolution dimensions',
      'Supports batch files and ZIP download',
      'Private client-side execution',
    ],
    stepGuide: [
      { step: '1', title: 'Select Images', desc: 'Add images exceeding 2MB.' },
      { step: '2', title: 'Optimize to 2MB', desc: 'QuickPixel locks the target file size to 2 MB.' },
      { step: '3', title: 'Download Files', desc: 'Get your compliant photos ready to submit.' },
    ],
    overviewHtml: `
      <p>Many online forms and legacy servers enforce a rigid 2 MB post limit. QuickPixel Tools provides an instant solution to meet this requirement without degrading your photograph.</p>
    `,
    whyUseHtml: `<p>Avoid upload rejections on portals by ensuring your documents and photos are safely under the 2MB ceiling.</p>`,
    faqs: [
      { question: 'Can I compress multiple files to 2MB simultaneously?', answer: 'Yes, batch upload as many photos as you want and each will be compressed to under 2MB.' },
    ],
    relatedSlugs: ['compress-image-to-1mb', 'compress-image-to-500kb', 'image-compressor'],
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    metaTitle: 'Resize Image Online – Free Image Resizer | QuickPixel Tools',
    metaDescription: 'Resize images online for free. Change image dimensions by width, height, or percentage while maintaining aspect ratio. Fast, accurate, and private.',
    h1: 'Free Online Image Resizer',
    subtitle: 'Easily change photo dimensions in pixels or percentage with aspect ratio lock and social media presets.',
    category: 'resizing',
    defaultMode: 'resize',
    defaultFormat: 'original',
    defaultQuality: 0.9,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'Maximize2',
    shortDesc: 'Change pixel dimensions, scale percentages, or choose social media presets.',
    benefits: [
      'Change width and height with automatic aspect ratio lock',
      'Scale by exact percentages: 25%, 50%, 75%, 150%, 200%',
      'One-click presets: Instagram, YouTube, Full HD, Web Banner',
      'High-quality bicubic interpolation canvas rendering',
    ],
    stepGuide: [
      { step: '1', title: 'Upload Image to Resize', desc: 'Drop any photo or graphic into the resizer tool.' },
      { step: '2', title: 'Enter Dimensions or Preset', desc: 'Type your desired width/height or select a preset like 1920x1080.' },
      { step: '3', title: 'Download Resized Photo', desc: 'Download your resized image in original or modern formats.' },
    ],
    overviewHtml: `
      <p>QuickPixel Tools Image Resizer lets you change image pixel dimensions with precision. Resizing is critical when preparing profile pictures, social media banners, website sliders, and print media. Our tool uses high-quality canvas bicubic interpolation, ensuring that downscaled images remain sharp and upscaled images avoid harsh pixelation.</p>
    `,
    whyUseHtml: `
      <p>Displaying an oversized 4000x3000 image inside a 400x300 container wastes CPU rendering cycles and bandwidth. Resizing images to their exact display dimensions is one of the highest-impact performance improvements you can make.</p>
    `,
    faqs: [
      { question: 'How do I resize an image online for free?', answer: 'Upload your photo to QuickPixel Tools Image Resizer, enter your target width or height (or pick a preset), and click Download.' },
      { question: 'Will resizing change the aspect ratio?', answer: 'By default, the aspect ratio lock is enabled so the height adjusts automatically when you change width, preventing distortion. You can unlock it anytime for custom dimensions.' },
      { question: 'Can I resize photos for Instagram or YouTube?', answer: 'Yes! QuickPixel includes one-click presets for Instagram Square (1080x1080), Stories (1080x1920), YouTube Thumbnails (1280x720), and more.' },
    ],
    relatedSlugs: ['image-compressor', 'image-cropper', 'jpg-to-png', 'compress-image-to-200kb'],
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    metaTitle: 'JPG to PNG Converter – Convert Images Online Free | QuickPixel Tools',
    metaDescription: 'Convert JPG to PNG online for free. Transform JPEG images into lossless PNG format with crisp graphics and sharp text. Fast browser converter.',
    h1: 'JPG to PNG Converter Online Free',
    subtitle: 'Convert JPEG photos to high-quality PNG format instantly without installing software.',
    category: 'conversion',
    defaultMode: 'convert',
    defaultFormat: 'image/png',
    defaultQuality: 1.0,
    acceptedFormats: '.jpg,.jpeg',
    iconName: 'Repeat',
    shortDesc: 'Convert lossy JPG photos to lossless, universally compatible PNG format.',
    benefits: [
      'Lossless pixel reconstruction from JPEG source',
      'Batch convert multiple JPG files in a single pass',
      'No registration, watermarks, or file limits',
      'Processed completely on your computer or mobile device',
    ],
    stepGuide: [
      { step: '1', title: 'Upload JPG Files', desc: 'Select one or more .jpg or .jpeg images.' },
      { step: '2', title: 'Convert to PNG', desc: 'The converter instantly generates clean PNG bitmaps.' },
      { step: '3', title: 'Download PNGs', desc: 'Save your converted PNG files individually or as a ZIP archive.' },
    ],
    overviewHtml: `
      <p>JPG is ideal for photographs, but graphic design projects, presentations, and vector software often demand PNG format. QuickPixel Tools JPG to PNG converter creates high-fidelity PNG files that maintain crisp details and prevent generational compression loss during subsequent edits.</p>
    `,
    whyUseHtml: `
      <p>Whenever you need to bring photos into tools like Figma, Illustrator, or Canva without suffering further JPEG degradation, converting to PNG is recommended.</p>
    `,
    faqs: [
      { question: 'Does converting JPG to PNG make the background transparent?', answer: 'JPG files do not have transparency data (they have solid white or colored backgrounds). Converting to PNG preserves the exact image pixels. To make it transparent, you can edit it in your design software after conversion.' },
      { question: 'Why did the file size increase after converting JPG to PNG?', answer: 'PNG uses lossless compression while JPG is lossy. PNG stores precise RGB values for every pixel, so file sizes are naturally larger than compressed JPEGs.' },
    ],
    relatedSlugs: ['png-to-jpg', 'jpg-to-webp', 'image-compressor', 'image-resizer'],
  },
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG',
    metaTitle: 'PNG to JPG Converter – Free Online Image Converter | QuickPixel Tools',
    metaDescription: 'Convert PNG to JPG online for free. Drastically reduce file sizes by turning PNGs into compact JPEGs with clean white backgrounds. Fast and secure.',
    h1: 'PNG to JPG Converter Online Free',
    subtitle: 'Convert heavy PNG graphics to lightweight JPG photos with customizable compression quality.',
    category: 'conversion',
    defaultMode: 'convert',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.85,
    acceptedFormats: '.png',
    iconName: 'Repeat',
    shortDesc: 'Convert large PNG images into compact, web-friendly JPG files.',
    benefits: [
      'Cuts file size by up to 70% compared to heavy PNGs',
      'Automatic clean white background fill for transparent areas',
      'Batch conversion with one-click ZIP download',
      'Fast client-side processing keeps your images secure',
    ],
    stepGuide: [
      { step: '1', title: 'Upload PNG Files', desc: 'Drag and drop your .png screenshots, graphics, or photos.' },
      { step: '2', title: 'Set Quality Level', desc: 'Select your preferred JPG quality (80% recommended).' },
      { step: '3', title: 'Download JPG Files', desc: 'Download your lightweight JPGs immediately.' },
    ],
    overviewHtml: `
      <p>Screenshots and graphic exports saved as PNG can easily weigh 5MB to 10MB. Converting them to JPG is the fastest way to shrink them for sharing on Slack, Teams, WhatsApp, or email attachments. QuickPixel Tools automatically fills any transparent areas with a clean white canvas, ensuring no black background glitches.</p>
    `,
    whyUseHtml: `
      <p>Standardizing all user-uploaded screenshots and images into JPG format saves massive server storage space and accelerates web page loading.</p>
    `,
    faqs: [
      { question: 'What happens to transparent backgrounds when converting PNG to JPG?', answer: 'Since JPG does not support alpha transparency, transparent areas are smoothly filled with a clean white background.' },
      { question: 'How much smaller is a JPG compared to a PNG?', answer: 'Typically, a photographic PNG converted to JPG will be 60% to 80% smaller with almost identical visual fidelity.' },
    ],
    relatedSlugs: ['jpg-to-png', 'png-to-webp', 'image-compressor', 'compress-jpg'],
  },
  {
    slug: 'jpg-to-webp',
    name: 'JPG to WebP',
    metaTitle: 'JPG to WebP Converter – Convert Images Online Free | QuickPixel Tools',
    metaDescription: 'Convert JPG to WebP online for free. Transform JPEG images into Google modern WebP format for 30% smaller file sizes and superior web speed.',
    h1: 'JPG to WebP Converter Online',
    subtitle: 'Upgrade your JPEG images to next-gen WebP format for faster websites and better SEO rankings.',
    category: 'conversion',
    defaultMode: 'convert',
    defaultFormat: 'image/webp',
    defaultQuality: 0.82,
    acceptedFormats: '.jpg,.jpeg',
    iconName: 'Sparkles',
    shortDesc: 'Convert JPG to next-generation WebP for up to 35% smaller file sizes.',
    benefits: [
      'Achieve 25%–35% smaller file size than original JPG at identical quality',
      'Pass Google PageSpeed "Serve images in next-gen formats" audit',
      'Batch convert entire image galleries at once',
      'Direct browser-side encoding with zero lag',
    ],
    stepGuide: [
      { step: '1', title: 'Upload JPG Images', desc: 'Select JPG or JPEG files to convert.' },
      { step: '2', title: 'Adjust WebP Settings', desc: 'Keep the 82% quality preset for optimal balance.' },
      { step: '3', title: 'Download WebP', desc: 'Save your blazing-fast WebP images.' },
    ],
    overviewHtml: `
      <p>Google developed the WebP format specifically to make the web faster. Converting JPG to WebP shrinks file sizes by nearly a third while preserving sharp details and vibrant colors. QuickPixel Tools encodes WebP directly in modern browsers using hardware acceleration.</p>
    `,
    whyUseHtml: `
      <p>Upgrading your website images from JPG to WebP reduces bandwidth bills and noticeably boosts mobile user retention.</p>
    `,
    faqs: [
      { question: 'Why should I convert JPG to WebP?', answer: 'WebP provides superior compression technology compared to 30-year-old JPEG algorithms, resulting in 25-35% smaller files at identical visual quality.' },
    ],
    relatedSlugs: ['webp-to-jpg', 'png-to-webp', 'compress-webp', 'image-compressor'],
  },
  {
    slug: 'png-to-webp',
    name: 'PNG to WebP',
    metaTitle: 'PNG to WebP Converter – Convert Images Online Free | QuickPixel Tools',
    metaDescription: 'Convert PNG to WebP online for free. Maintain full transparency while slashing PNG file sizes by up to 50%. Fast browser-based conversion.',
    h1: 'PNG to WebP Converter Online',
    subtitle: 'Slash transparent PNG file sizes in half by converting to modern WebP with full alpha transparency.',
    category: 'conversion',
    defaultMode: 'convert',
    defaultFormat: 'image/webp',
    defaultQuality: 0.85,
    acceptedFormats: '.png',
    iconName: 'Sparkles',
    shortDesc: 'Convert PNG to transparent WebP, reducing file size by up to 60%.',
    benefits: [
      'Preserves 100% alpha transparency with vastly smaller footprints',
      'Cuts heavy transparent PNG graphics down by up to 60%',
      'Batch conversion support with ZIP download',
      'Fast client-side execution',
    ],
    stepGuide: [
      { step: '1', title: 'Upload PNGs', desc: 'Add transparent PNG logos, icons, or design graphics.' },
      { step: '2', title: 'Select WebP Output', desc: 'Choose your desired compression quality.' },
      { step: '3', title: 'Download WebP', desc: 'Download your super-lightweight transparent WebP files.' },
    ],
    overviewHtml: `
      <p>WebP supports 24-bit RGB with an 8-bit alpha channel just like PNG, but compresses it with modern intra-frame prediction algorithms. The result is transparent graphics that look indistinguishable from PNG at a fraction of the kilobyte weight.</p>
    `,
    whyUseHtml: `<p>Fix heavy PNG headers and icons dragging down your web pages by upgrading them to lightweight WebP.</p>`,
    faqs: [
      { question: 'Does WebP support transparent backgrounds like PNG?', answer: 'Yes! WebP provides full 8-bit alpha channel transparency support just like PNG, but with much higher compression efficiency.' },
    ],
    relatedSlugs: ['jpg-to-webp', 'webp-to-png', 'compress-png', 'image-compressor'],
  },
  {
    slug: 'webp-to-jpg',
    name: 'WebP to JPG',
    metaTitle: 'WebP to JPG Converter – Free Online Image Converter | QuickPixel Tools',
    metaDescription: 'Convert WebP to JPG online for free. Transform WebP images into universally compatible JPEG photos for older software, Word, and print.',
    h1: 'WebP to JPG Converter Online Free',
    subtitle: 'Convert WebP images to universally supported JPG format in seconds.',
    category: 'conversion',
    defaultMode: 'convert',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.88,
    acceptedFormats: '.webp',
    iconName: 'Repeat',
    shortDesc: 'Turn WebP files into universally recognized JPG photos.',
    benefits: [
      '100% compatible with older photo viewers, Word docs, and printing software',
      'Fast client-side decoding and re-encoding',
      'Batch convert multiple WebP files at once',
      'Clean background fill for any transparent WebP inputs',
    ],
    stepGuide: [
      { step: '1', title: 'Upload WebP Files', desc: 'Select downloaded WebP graphics or photos.' },
      { step: '2', title: 'Convert to JPG', desc: 'Engine instantly generates compatible JPEG bitmaps.' },
      { step: '3', title: 'Download JPGs', desc: 'Open your photos in any software or device without errors.' },
    ],
    overviewHtml: `
      <p>While WebP is great for browsers, many legacy desktop programs, photo editors, video editing suites, and email clients still cannot open .webp files. QuickPixel Tools WebP to JPG converter effortlessly turns downloaded WebP assets into universally readable JPEGs.</p>
    `,
    whyUseHtml: `<p>Never get stuck with an "Unsupported file format" error again when importing photos into presentations or print software.</p>`,
    faqs: [
      { question: 'Why do I need to convert WebP to JPG?', answer: 'Some desktop programs, legacy photo editors, and older devices cannot open WebP files. Converting to JPG ensures 100% compatibility everywhere.' },
    ],
    relatedSlugs: ['jpg-to-webp', 'webp-to-png', 'image-compressor'],
  },
  {
    slug: 'webp-to-png',
    name: 'WebP to PNG',
    metaTitle: 'WebP to PNG Converter – Free Online Image Converter | QuickPixel Tools',
    metaDescription: 'Convert WebP to PNG online for free. Convert WebP images to high-resolution PNG format with full transparency preservation. Fast and private.',
    h1: 'WebP to PNG Converter Online Free',
    subtitle: 'Convert WebP images into transparent PNG format for easy editing in Photoshop, Illustrator, and Canva.',
    category: 'conversion',
    defaultMode: 'convert',
    defaultFormat: 'image/png',
    defaultQuality: 1.0,
    acceptedFormats: '.webp',
    iconName: 'Repeat',
    shortDesc: 'Convert WebP into high-quality PNG with transparency intact.',
    benefits: [
      'Preserves transparent alpha layers flawlessly',
      'Ideal for importing WebP assets into Photoshop or Figma',
      'No quality loss during conversion',
      'Batch conversion support',
    ],
    stepGuide: [
      { step: '1', title: 'Select WebP Images', desc: 'Upload your .webp graphics.' },
      { step: '2', title: 'Convert to PNG', desc: 'Engine converts pixels to standard PNG bitmaps.' },
      { step: '3', title: 'Download PNG', desc: 'Download your pristine PNG file.' },
    ],
    overviewHtml: `
      <p>Need to edit a transparent WebP graphic in software that doesn't support WebP? QuickPixel Tools extracts the image and renders it into a standard PNG format with pixel-perfect transparency intact.</p>
    `,
    whyUseHtml: `<p>Effortlessly reuse web graphics across desktop illustration and vector design software.</p>`,
    faqs: [
      { question: 'Will transparency be preserved when converting WebP to PNG?', answer: 'Yes! QuickPixel Tools preserves the full alpha transparency layer from your WebP image.' },
    ],
    relatedSlugs: ['png-to-webp', 'webp-to-jpg', 'image-compressor'],
  },
  {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG',
    metaTitle: 'HEIC to JPG Converter – Convert iPhone Photos Online | QuickPixel Tools',
    metaDescription: 'Convert HEIC to JPG online for free. Transform Apple iPhone photos (.heic) into universally compatible JPEG format right in your browser. Fast and private.',
    h1: 'HEIC to JPG Converter Online Free',
    subtitle: 'Convert iPhone and iPad HEIC photos to standard JPG format without uploading to external servers.',
    category: 'conversion',
    defaultMode: 'convert',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.88,
    acceptedFormats: '.heic,.heif',
    iconName: 'Smartphone',
    shortDesc: 'Convert Apple iPhone HEIC pictures to universal JPG format.',
    benefits: [
      'Converts Apple High Efficiency Image Container (.heic) seamlessly',
      'Makes iPhone snapshots viewable on Windows, Android, and older Macs',
      'Batch convert dozens of iPhone photos simultaneously',
      'Maintains original photo resolution and vibrant colors',
    ],
    stepGuide: [
      { step: '1', title: 'Upload HEIC Photos', desc: 'Choose .heic or .heif files exported from your iPhone or iPad.' },
      { step: '2', title: 'Auto Convert to JPG', desc: 'Our in-browser converter decodes HEIC and renders crisp JPEGs.' },
      { step: '3', title: 'Download JPG Images', desc: 'Save your photos in universally compatible JPEG format.' },
    ],
    overviewHtml: `
      <p>Apple iOS devices capture photos in HEIC (High Efficiency Image Container) by default. While HEIC offers excellent compression, Windows PC users, web portals, and Android phones frequently reject HEIC files with error messages. QuickPixel Tools decodes HEIC directly in your browser and outputs standard, universal JPG files.</p>
    `,
    whyUseHtml: `
      <p>Never worry about sending an unopenable photo to a client or upload portal again. QuickPixel Tools makes HEIC conversion painless and instantaneous.</p>
    `,
    faqs: [
      { question: 'What is a HEIC file?', answer: 'HEIC is Apple proprietary photo container format used on iPhones running iOS 11 and later. It saves space on your device but is incompatible with many Windows and web systems.' },
      { question: 'Is it safe to convert private iPhone photos here?', answer: 'Yes! QuickPixel Tools processes photos locally in your browser. Your private camera roll images are never uploaded to any cloud server.' },
    ],
    relatedSlugs: ['jpg-to-png', 'compress-jpg', 'image-compressor', 'image-resizer'],
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    metaTitle: 'Image to PDF Converter – Convert Images to PDF Free | QuickPixel Tools',
    metaDescription: 'Convert JPG, PNG, and WebP images into a single PDF document online for free. Set page orientation, margins, and download high-quality PDFs instantly.',
    h1: 'Image to PDF Converter Online Free',
    subtitle: 'Combine photos, receipts, notes, and scans into a clean, professional PDF document in seconds.',
    category: 'pdf',
    defaultMode: 'pdf',
    defaultFormat: 'image/jpeg',
    defaultQuality: 0.85,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'FileText',
    shortDesc: 'Merge multiple JPG, PNG, and WebP images into a single polished PDF file.',
    benefits: [
      'Combine multiple image files into a single multipage PDF',
      'Configurable page orientation (Portrait, Landscape, or Auto)',
      'Preserves crisp clarity for receipts, invoices, and documents',
      'No watermark, no page limits, 100% free and client-side',
    ],
    stepGuide: [
      { step: '1', title: 'Upload Images', desc: 'Select the photos, receipts, or scans you want in your PDF.' },
      { step: '2', title: 'Customize PDF Options', desc: 'Choose page orientation (Auto, Portrait, Landscape) and compression.' },
      { step: '3', title: 'Download PDF', desc: 'Generate and download your combined PDF document instantly.' },
    ],
    overviewHtml: `
      <p>QuickPixel Tools Image to PDF converter turns digital photos, scanned paperwork, school assignments, and invoices into unified, standardized PDF documents. Everything is generated client-side using JavaScript, ensuring your financial receipts and personal records remain private on your computer.</p>
    `,
    whyUseHtml: `<p>Colleges, embassies, and accounting departments frequently require documents submitted in PDF rather than loose image files. Generate compliant PDFs in seconds.</p>`,
    faqs: [
      { question: 'How do I convert images to PDF for free?', answer: 'Upload one or multiple photos to QuickPixel Tools Image to PDF converter, choose your page orientation, and click "Generate & Download PDF".' },
      { question: 'Can I combine multiple pictures into one PDF file?', answer: 'Yes! You can upload multiple JPG, PNG, and WebP photos and they will be compiled into a single multi-page PDF document.' },
    ],
    relatedSlugs: ['image-compressor', 'image-resizer', 'jpg-to-png'],
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    metaTitle: 'Image Cropper – Crop Images Online Free | QuickPixel Tools',
    metaDescription: 'Crop JPG, PNG, and WebP images online for free. Cut photos with precision aspect ratios (1:1, 4:3, 16:9, or freeform). Fast, browser-based photo cropper.',
    h1: 'Free Online Image Cropper',
    subtitle: 'Easily crop photos to exact dimensions or popular aspect ratios with live visual preview.',
    category: 'editing',
    defaultMode: 'crop',
    defaultFormat: 'original',
    defaultQuality: 0.9,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'Crop',
    shortDesc: 'Trim photos with precision aspect ratios (Square 1:1, 16:9, 4:3, Freeform).',
    benefits: [
      'Standard aspect ratios: Square (1:1), Landscape (16:9), Photo (4:3), Freeform',
      'Live interactive draggable crop box with pixel coordinate readout',
      'High-resolution canvas export preserves original clarity',
      'Free, private, and works on desktop and mobile',
    ],
    stepGuide: [
      { step: '1', title: 'Upload Image to Crop', desc: 'Select the image you want to trim.' },
      { step: '2', title: 'Select Aspect Ratio & Crop Area', desc: 'Drag the handles to frame the exact portion of the image you want to keep.' },
      { step: '3', title: 'Download Cropped Image', desc: 'Download your neatly cropped photo in your preferred format.' },
    ],
    overviewHtml: `
      <p>Whether you need a square avatar for your LinkedIn profile, a 16:9 banner for a presentation, or want to eliminate unwanted background clutter from a photo, QuickPixel Tools Image Cropper provides a seamless, accurate cropping experience directly inside your browser.</p>
    `,
    whyUseHtml: `<p>Crop photos without opening heavyweight photo editors or uploading personal photos to suspicious cloud services.</p>`,
    faqs: [
      { question: 'Does cropping reduce photo quality?', answer: 'No, cropping simply discards pixels outside your selected frame. The cropped area maintains 100% of its original resolution.' },
      { question: 'Can I crop to a square 1:1 for profile pictures?', answer: 'Yes, select the 1:1 Square preset in the cropper settings for a perfect circle/square avatar.' },
    ],
    relatedSlugs: ['image-resizer', 'image-rotator', 'image-compressor'],
  },
  {
    slug: 'image-rotator',
    name: 'Image Rotator',
    metaTitle: 'Image Rotator – Rotate & Flip Photos Online | QuickPixel Tools',
    metaDescription: 'Rotate and flip images online for free. Turn photos 90 degrees, 180 degrees, flip horizontally or vertically. Fast, browser-based image rotator.',
    h1: 'Rotate & Flip Images Online Free',
    subtitle: 'Quickly fix upside-down or sideways photos with one-click 90° rotation and horizontal/vertical mirror flipping.',
    category: 'editing',
    defaultMode: 'rotate',
    defaultFormat: 'original',
    defaultQuality: 0.92,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'RotateCw',
    shortDesc: 'Rotate 90°, 180°, or mirror flip images horizontally and vertically.',
    benefits: [
      'One-tap 90° clockwise and counter-clockwise rotation',
      'Horizontal and vertical mirror flip',
      'Fixes incorrect camera EXIF orientation tags permanently',
      'Fast client-side rendering with zero quality loss',
    ],
    stepGuide: [
      { step: '1', title: 'Upload Photo', desc: 'Select sideways or upside-down images.' },
      { step: '2', title: 'Click Rotate or Flip', desc: 'Tap the rotate buttons to achieve the correct orientation.' },
      { step: '3', title: 'Download Oriented Image', desc: 'Save your properly oriented image.' },
    ],
    overviewHtml: `
      <p>Smartphone cameras often record orientation tags in EXIF metadata rather than physically rotating pixels. When uploaded to certain websites or printed, the photo may display sideways or upside-down. QuickPixel Tools physically transforms the canvas pixels so your image displays upright everywhere.</p>
    `,
    whyUseHtml: `<p>Permanently fix rotated photos so they render upright in every browser, application, and operating system.</p>`,
    faqs: [
      { question: 'Why do my phone photos open sideways on my computer?', answer: 'Some programs do not read the camera EXIF orientation tag. QuickPixel physically alters the canvas pixels so the photo is permanently right-side up.' },
    ],
    relatedSlugs: ['image-cropper', 'image-resizer', 'image-compressor'],
  },
  {
    slug: 'image-quality-reducer',
    name: 'Image Quality Reducer',
    metaTitle: 'Image Quality Reducer – Reduce Image Size & DPI | QuickPixel Tools',
    metaDescription: 'Reduce image quality and file size online for free. Adjust compression levels with precision slider control. Fast, private, and easy to use.',
    h1: 'Image Quality Reducer Online',
    subtitle: 'Fine-tune image compression quality and DPI to reduce file size with precision control.',
    category: 'compression',
    defaultMode: 'quality_reduce',
    defaultFormat: 'original',
    defaultQuality: 0.6,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.heic',
    iconName: 'Sliders',
    shortDesc: 'Dial in precise compression percentages to control image weight.',
    benefits: [
      'Fine-grained 1% to 100% quality slider',
      'Real-time file size and kilobyte savings calculation',
      'Side-by-side visual comparison',
      'Zero server uploads for complete confidentiality',
    ],
    stepGuide: [
      { step: '1', title: 'Upload Image', desc: 'Select any heavy image file.' },
      { step: '2', title: 'Lower Quality Level', desc: 'Slide the quality control to find the ideal compromise between file size and sharpness.' },
      { step: '3', title: 'Download Smaller File', desc: 'Save your streamlined image immediately.' },
    ],
    overviewHtml: `
      <p>QuickPixel Tools Image Quality Reducer provides an interactive slider to dial down the quantization bitrate of your photos. This allows you to explore the exact point where file size drops dramatically before visual quality noticeably degrades.</p>
    `,
    whyUseHtml: `<p>Gain complete control over visual fidelity versus kilobyte weight for mission-critical web optimization.</p>`,
    faqs: [
      { question: 'How does reducing image quality affect the file?', answer: 'It simplifies color transitions and high-frequency noise that the human eye barely notices, shedding up to 80% of the byte data.' },
    ],
    relatedSlugs: ['image-compressor', 'compress-image-to-200kb', 'image-resizer'],
  },
];

export const TOOL_CATEGORIES = [
  { id: 'all', name: 'All Tools' },
  { id: 'compression', name: 'Compression' },
  { id: 'conversion', name: 'Conversion' },
  { id: 'resizing', name: 'Resizing' },
  { id: 'pdf', name: 'PDF Tools' },
  { id: 'editing', name: 'Image Editing' },
];

export function getToolBySlug(slug: string): ToolDef | undefined {
  return TOOLS_DATA.find((t) => t.slug === slug);
}
