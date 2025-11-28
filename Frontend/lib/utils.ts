export function cn(...inputs: any[]) {
  return inputs
    .flatMap((part) => {
      if (!part) return [];
      if (typeof part === "string") return [part];
      if (Array.isArray(part)) return part;
      if (typeof part === "object") return Object.keys(part).filter((k) => (part as any)[k]);
      return [String(part)];
    })
    .join(" ")
    .trim();
}

export default cn;
