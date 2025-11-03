# 📁 WHERE TO PUT YOUR MEDIA FILES

## 🎯 **EXACT LOCATIONS:**

### **📸 Pictures go here:**
```
/home/nick-b/Rockerty website real/TEAM-WEBSITE/frontend/public/Images/
```

### **🎥 Videos go here:**
```
/home/nick-b/Rockerty website real/TEAM-WEBSITE/frontend/public/Videos/
```

## 📋 **STEP-BY-STEP:**

### **For Pictures:**
1. Save your jpg/png files to: `/frontend/public/Images/`
2. Name them something like:
   - `team-photo.jpg`
   - `rocket-launch.jpg`  
   - `cubesat-project.png`
   - `workshop-scene.jpg`

### **For Videos:**
1. Save your mp4 files to: `/frontend/public/Videos/`
2. Name them something like:
   - `launch-2024.mp4`
   - `cubesat-demo.mp4`
   - `workshop-highlights.mp4`

## 💡 **HOW TO USE THEM:**

### **In your code, reference them like this:**

**Pictures:**
```jsx
<img src="/Images/your-photo.jpg" alt="Description" />
```

**Videos:**
```jsx
<video controls>
  <source src="/Videos/your-video.mp4" type="video/mp4" />
</video>
```

## 🚀 **READY TO USE:**
- Folders created ✅
- Just drag & drop your files into these folders
- Reference them in code using the `/Images/` and `/Videos/` paths