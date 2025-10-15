export function serializeFirestoreData(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (obj.toDate) return obj.toDate().toISOString();

  if (Array.isArray(obj)) return obj.map(serializeFirestoreData);

  if (typeof obj === "object") {
    const result: any = {};
    for (const key in obj) {
      result[key] = serializeFirestoreData(obj[key]);
    }
    return result;
  }

  return obj;
}
