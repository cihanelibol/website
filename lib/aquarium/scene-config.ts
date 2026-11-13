export type FishSpecies = "clown" | "tang" | "gold" | "anthias" | "copperband";
export interface FishConfig {
  id: string; name: string; species: FishSpecies; x: number; y: number;
  size: number; speed: number; depth: number; mobile: boolean; school?: number;
}
export const FISH: readonly FishConfig[] = [
  { id: "misket", name: "Misket, palyaço balığı", species: "clown", x: .25, y: .47, size: 140, speed: 23, depth: 1, mobile: true },
  { id: "mavi", name: "Mavi, cerrah balığı", species: "tang", x: .43, y: .61, size: 160, speed: 28, depth: 1, mobile: true },
  { id: "limon", name: "Limon, sarı cerrah balığı", species: "gold", x: .10, y: .60, size: 105, speed: 20, depth: 1, mobile: true },
  { id: "boncuk", name: "Boncuk, palyaço balığı", species: "clown", x: .14, y: .43, size: 88, speed: 19, depth: .9, mobile: true },
  { id: "kelebek", name: "Bakır, kelebek balığı", species: "copperband", x: .49, y: .37, size: 132, speed: 21, depth: 1, mobile: true },
  { id: "mercan", name: "Mercan, anthias balığı", species: "anthias", x: .34, y: .52, size: 85, speed: 26, depth: .95, mobile: true, school: 1 },
  { id: "pembe", name: "Pembe, anthias balığı", species: "anthias", x: .43, y: .49, size: 67, speed: 25, depth: .85, mobile: true, school: 1 },
  { id: "inci", name: "İnci, sarı cerrah balığı", species: "gold", x: .54, y: .59, size: 78, speed: 18, depth: .9, mobile: true },
  { id: "atlas", name: "Atlas, cerrah balığı", species: "tang", x: .07, y: .35, size: 75, speed: 22, depth: .7, mobile: false },
  { id: "minik", name: "Minik, palyaço balığı", species: "clown", x: .62, y: .92, size: 72, speed: 18, depth: .85, mobile: false },
  ...Array.from({ length: 6 }, (_, i): FishConfig => ({
    id: `surucu-${i}`, name: `Sürüdeki ${i + 1}. anthias balığı`, species: "anthias",
    x: .32 + i * .047, y: .27 + (i % 3) * .035, size: 43 + i % 3 * 8,
    speed: 23 + i % 3, depth: .58 + i % 3 * .07, mobile: false, school: 1,
  })),
  { id: "gunes", name: "Güneş, sarı cerrah balığı", species: "gold", x: .88, y: .08, size: 66, speed: 19, depth: .65, mobile: false },
  { id: "derin", name: "Derin, cerrah balığı", species: "tang", x: .67, y: .09, size: 63, speed: 24, depth: .6, mobile: false },
];

export type PropKind = "plant" | "rock" | "coral" | "arch" | "fan" | "anemone";
export interface PropConfig {
  id: string; kind: PropKind; name: string; x: number; size: number; bottom: number;
  tilt: number; layer: "back" | "middle" | "front"; mobile: boolean;
}
export const PROPS: readonly PropConfig[] = [
  { id: "kelp-left", kind: "plant", name: "Uzun deniz bitkisi", x: 3, size: 320, bottom: 8, tilt: -9, layer: "middle", mobile: true },
  { id: "coral-pink", kind: "coral", name: "Pembe mercan", x: 20, size: 165, bottom: 8, tilt: -6, layer: "front", mobile: true },
  { id: "arch-center", kind: "arch", name: "Doğal resif kemeri", x: 35, size: 370, bottom: 10, tilt: 0, layer: "middle", mobile: true },
  { id: "fan-left", kind: "fan", name: "Mor yelpaze mercan", x: 12, size: 240, bottom: 16, tilt: -13, layer: "back", mobile: true },
  { id: "rock-left", kind: "rock", name: "Sol resif kayası", x: 9, size: 285, bottom: 5, tilt: -5, layer: "front", mobile: true },
  { id: "anemone-left", kind: "anemone", name: "Yeşil deniz anemonu", x: 27, size: 160, bottom: 3, tilt: 0, layer: "front", mobile: true },
  { id: "kelp-right", kind: "plant", name: "Sağ deniz bitkisi", x: 99, size: 360, bottom: 8, tilt: 10, layer: "middle", mobile: true },
  { id: "coral-right", kind: "coral", name: "Sağ pembe mercan", x: 89, size: 210, bottom: 9, tilt: 8, layer: "middle", mobile: true },
  { id: "anemone-right", kind: "anemone", name: "Sağ deniz anemonu", x: 78, size: 190, bottom: 3, tilt: -5, layer: "front", mobile: true },
  { id: "rock-right", kind: "rock", name: "Sağ resif kayası", x: 90, size: 360, bottom: 4, tilt: 4, layer: "front", mobile: true },
  { id: "fan-right", kind: "fan", name: "Sağ yelpaze mercan", x: 93, size: 300, bottom: 13, tilt: 9, layer: "back", mobile: true },
  { id: "grass-channel", kind: "plant", name: "Kum yolu bitkisi", x: 49, size: 125, bottom: 6, tilt: 8, layer: "middle", mobile: true },
  { id: "rock-back-left", kind: "rock", name: "Arka resif kayası", x: 14, size: 350, bottom: 15, tilt: -8, layer: "back", mobile: false },
  { id: "plant-back-left", kind: "plant", name: "Arka deniz çayırı", x: 8, size: 245, bottom: 19, tilt: 14, layer: "back", mobile: false },
  { id: "coral-back-left", kind: "coral", name: "Arka mercan kolonisi", x: 25, size: 130, bottom: 24, tilt: 7, layer: "back", mobile: false },
  { id: "plant-front-left", kind: "plant", name: "Ön deniz çayırı", x: -1, size: 230, bottom: 1, tilt: 11, layer: "front", mobile: false },
  { id: "coral-left-small", kind: "coral", name: "Küçük pembe mercan", x: 4, size: 110, bottom: 7, tilt: 12, layer: "front", mobile: false },
  { id: "anemone-arch", kind: "anemone", name: "Kemer yanı anemonu", x: 42, size: 125, bottom: 7, tilt: 4, layer: "front", mobile: false },
  { id: "rock-channel", kind: "rock", name: "Kum yolundaki taş", x: 59, size: 95, bottom: 4, tilt: -4, layer: "front", mobile: false },
  { id: "rock-back-right", kind: "rock", name: "Sağ arka resif", x: 87, size: 370, bottom: 14, tilt: 3, layer: "back", mobile: false },
  { id: "plant-back-right", kind: "plant", name: "Sağ arka deniz çayırı", x: 95, size: 285, bottom: 20, tilt: -8, layer: "back", mobile: false },
  { id: "coral-back-right", kind: "coral", name: "Sağ arka mercan", x: 80, size: 145, bottom: 19, tilt: -9, layer: "back", mobile: false },
  { id: "fan-center", kind: "fan", name: "Kemer arkasındaki yelpaze", x: 32, size: 170, bottom: 22, tilt: 6, layer: "back", mobile: false },
  { id: "anemone-edge", kind: "anemone", name: "Ön resif anemonu", x: 97, size: 165, bottom: 2, tilt: -7, layer: "front", mobile: false },
];
