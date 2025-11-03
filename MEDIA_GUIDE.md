# How to Add Pictures and Videos to Your Website

## 📸 Adding Pictures

### Method 1: Local Images (Recommended for development)
1. Create an `Images` folder in `/frontend/public/` if it doesn't exist
2. Add your image files (jpg, png, webp) to `/frontend/public/Images/`
3. Reference them in your code like this:

```jsx
<img 
  src="/Images/your-image.jpg" 
  alt="Description of image"
  className="w-full h-full object-cover"
/>
```

### Method 2: External Image URLs
```jsx
<img 
  src="https://example.com/your-image.jpg" 
  alt="Description" 
  className="w-full h-full object-cover"
/>
```

## 🎥 Adding Videos

### Method 1: Local Videos
1. Add video files to `/frontend/public/Videos/`
2. Use HTML5 video tag:

```jsx
<video 
  controls 
  className="w-full h-full"
  poster="/Images/video-thumbnail.jpg"
>
  <source src="/Videos/your-video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

### Method 2: YouTube/External Videos
```jsx
<iframe 
  width="100%" 
  height="315" 
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="YouTube video player"
  frameBorder="0"
  allowFullScreen
></iframe>
```

## 🎯 Example: Replacing a Placeholder

To replace the "Featured Videos" placeholder in Home.jsx:

1. **Find this section** (around line 95):
```jsx
<div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-64 flex items-center justify-center">
  <div className="text-center text-gray-500">
    <div className="text-4xl mb-2">🎬</div>
    <div className="font-medium">Featured Videos</div>
    <div className="text-sm">Launch footage & project highlights</div>
  </div>
</div>
```

2. **Replace with actual video**:
```jsx
<div className="rounded-2xl h-64 overflow-hidden">
  <video 
    controls 
    className="w-full h-full object-cover"
    poster="/Images/launch-thumbnail.jpg"
  >
    <source src="/Videos/launch-2024.mp4" type="video/mp4" />
  </video>
</div>
```

## 📁 File Structure Example
```
frontend/
  public/
    Images/
      team-photo.jpg
      launch-day.jpg
      cubesat-prototype.png
      workshop-scene.jpg
    Videos/
      rocket-launch.mp4
      cubesat-demo.mp4
```

## 💡 Tips
- Keep image files under 2MB for faster loading
- Use WebP format for better compression
- Add descriptive alt text for accessibility
- Use aspect-ratio classes for consistent layouts: `aspect-video`, `aspect-square`
- For galleries, consider using a lightbox library