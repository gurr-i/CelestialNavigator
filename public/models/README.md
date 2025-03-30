# 3D Models for Celestial Navigator

This directory contains 3D models for spacecraft and other celestial objects displayed in the Celestial Navigator application.

## Required Models

The application looks for the following models:

1. `iss.glb` - International Space Station model
2. `jwst.glb` - James Webb Space Telescope model
3. `voyager.glb` - Voyager spacecraft model (optional)

## Where to Find Models

You can find high-quality 3D models from these sources:

- [NASA 3D Resources](https://nasa3d.arc.nasa.gov/models) - Official NASA 3D models
- [Sketchfab](https://sketchfab.com/search?q=space+telescopes&type=models) - Search for space models
- [Thingiverse](https://www.thingiverse.com/search?q=space+station) - 3D printable models that can be converted

## Recommended Models

For the ISS:

- [International Space Station](https://sketchfab.com/3d-models/international-space-station-16-890594167611495c9f86f2d645a33f90) by NASA

For the JWST:

- [James Webb Space Telescope](https://sketchfab.com/3d-models/james-webb-space-telescope-fa27aaa168ad41a6ae31d38a35a8248f) by NASA

## Converting Models

If you have models in other formats like .3ds, .obj, or .dae, you can convert them to .glb format using:

1. [Blender](https://www.blender.org/) - Free 3D modeling software that can import and export various formats
2. [Online 3D Converter](https://www.online-convert.com/3d-model-converter) - Web-based conversion tool

## Optimizing Models for Web

For best performance:

- Keep file sizes under 5MB
- Reduce polygon count to 50k-100k maximum
- Compress textures
- Remove unnecessary parts or details

## Fallback Behavior

If the models aren't found, the application will display placeholder models built from basic geometric shapes.
