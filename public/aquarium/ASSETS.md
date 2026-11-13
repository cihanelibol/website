# Aquarium photographic assets

Generated with the built-in `image_gen` tool on 2026-11-13. These are AI-generated photorealistic cutouts, not stock photographs or photographs of the store's animals/products.

Production files are the six sibling WebP assets. The generated alpha is preserved; output images were resized and WebP encoded with sharp at quality 85, alphaQuality 100. Fish have a maximum 480×360 bounding box, props 640×800. No background was removed with code. Source PNGs remain in the generator's output directory; the selected web assets live in this repository.

## Final prompt set

### clownfish.webp

Use case: photorealistic-natural. Asset type: an individual isolated photographic cutout for an interactive premium aquarium website, not a complete scene. Realistic natural animal/material texture, optical photographic detail, believable anatomy, soft light from upper left, compatible with a dark teal underwater scene. Genuinely transparent alpha background, no solid backdrop, no checkerboard baked into pixels, no shadow plane, no typography, no watermark, no cartoon, no illustration, no stylized 3D render. Entire subject fully visible with small clean transparent margin. One real-looking ocellaris clownfish, strict side profile, swimming horizontally and facing RIGHT, tail to LEFT. Orange natural scales and three black-edged white bands, translucent fins with visible fine fin rays, realistic small glossy black eye, closed mouth. A single fish only. Landscape framing, fish fills 85% of canvas width; tail entirely within leftmost 30% of the fish silhouette.

### blue-tang.webp

Use case: photorealistic-natural. Asset type: an individual isolated photographic cutout for an interactive premium aquarium website, not a complete scene. Realistic natural animal/material texture, optical photographic detail, believable anatomy, soft light from upper left, compatible with a dark teal underwater scene. Genuinely transparent alpha background, no solid backdrop, no checkerboard baked into pixels, no shadow plane, no typography, no watermark, no cartoon, no illustration, no stylized 3D render. Entire subject fully visible with small clean transparent margin. One real-looking regal blue tang (Paracanthurus hepatus), strict side profile swimming horizontally and facing RIGHT, yellow tail to LEFT. Natural cobalt blue skin, black palette-shaped marking, yellow caudal fin, fine fin rays, anatomically correct small glossy eye. A single fish only. Landscape framing, full fish fills 85% of canvas width; tail entirely within leftmost 30% of fish silhouette.

### yellow-tang.webp

Use case: photorealistic-natural. Asset type: an individual isolated photographic cutout for an interactive premium aquarium website, not a complete scene. Realistic natural animal/material texture, optical photographic detail, believable anatomy, soft light from upper left, compatible with a dark teal underwater scene. Genuinely transparent alpha background, no solid backdrop, no checkerboard baked into pixels, no shadow plane, no typography, no watermark, no cartoon, no illustration, no stylized 3D render. Entire subject fully visible with small clean transparent margin. One real-looking yellow tang (Zebrasoma flavescens), strict side profile, swimming horizontally and facing RIGHT, tail to LEFT. Real thin lemon-yellow disc-shaped body, extended delicate dorsal and anal fins, subtle visible rays, small eye and natural narrow snout. A single fish only. Landscape framing, whole fish fills 85% canvas width; tail entirely within leftmost 30% of silhouette.

### aquatic-plant.webp

Use case: photorealistic-natural. Asset type: an individual isolated photographic cutout for an interactive premium aquarium website, not a complete scene. Realistic natural animal/material texture, optical photographic detail, believable anatomy, soft light from upper left, compatible with a dark teal underwater scene. Genuinely transparent alpha background, no solid backdrop, no checkerboard baked into pixels, no shadow plane, no typography, no watermark, no cartoon, no illustration, no stylized 3D render. Entire subject fully visible with small clean transparent margin. One photographic tuft of living long narrow ribbon-leaf marine seagrass, 9 to 12 individual olive emerald green blades with translucent tips, natural slight curves and varied heights, anchored together at a small natural root base. Front view at aquarium eye level. Tall portrait composition, entire plant and root base visible. No rocks, fish, pot, sand bed or surroundings.

### pink-coral.webp

Use case: photorealistic-natural. Asset type: an individual isolated photographic cutout for an interactive premium aquarium website, not a complete scene. Realistic natural animal/material texture, optical photographic detail, believable anatomy, soft light from upper left, compatible with a dark teal underwater scene. Genuinely transparent alpha background, no solid backdrop, no checkerboard baked into pixels, no shadow plane, no typography, no watermark, no cartoon, no illustration, no stylized 3D render. Entire subject fully visible with small clean transparent margin. One photographic small branching pink-orange stony coral colony, realistic intricate irregular antler-like branches with tiny coral polyp texture, warm pale tips, subdued salmon and dusty rose tones, attached to its own small rough limestone base. Front view at aquarium eye level, upright portrait composition. Single coral only, no fish, plants, surroundings or sand bed.

### reef-rock.webp

Use case: photorealistic-natural. Asset type: an individual isolated photographic cutout for an interactive premium aquarium website, not a complete scene. Realistic natural animal/material texture, optical photographic detail, believable anatomy, soft light from upper left, compatible with a dark teal underwater scene. Genuinely transparent alpha background, no solid backdrop, no checkerboard baked into pixels, no shadow plane, no typography, no watermark, no cartoon, no illustration, no stylized 3D render. Entire subject fully visible with small clean transparent margin. One photographic low wide irregular aquarium reef limestone rock, highly detailed porous rough surface, naturally weathered grey-beige and olive stone with subtle dark green algae in crevices. A beautiful organic asymmetric rock with small holes and fissures, broader than tall, viewed at aquarium eye level with top surface slightly visible. Single rock only, no plants, coral, fish, sand bed or surroundings.

## Alpha refinement

Yellow tang and aquatic plant received a built-in image edit using their generated PNG as the edit target:

Use case: background-extraction. Edit only the alpha matte/background of this image. Preserve the exact photographic [yellow tang fish, colors, anatomy, orientation and fine fins / seagrass plant, leaf positions, leaf texture and root base]. Remove ALL the broad blurry colored glow/halo around the subject. The empty space must be fully transparent with alpha zero, including the spaces between fins/leaves. Keep a precise clean edge following the actual physical silhouette; only a tiny antialiased fringe. No outer glow, no colored fog, no background, no shadow, no checkerboard. Do not add anything. Preserve realistic internal texture.

## Rendering

Fish reuse the same cached image in two masked layers for independent tail motion. Props are independent images with individual interactions. The image files are pre-sized and pre-compressed, so the Next Image component uses `unoptimized` to serve these exact alpha-preserving files without a second transform.
