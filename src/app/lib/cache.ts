import localForage from "localforage";

export default class Cache {
  static instance: LocalForage;

  static {
    Cache.instance = localForage.createInstance({
      driver: localForage.INDEXEDDB,
      name: "godhandusa",
      version: 1.0,
    });
  }

  static async setItem(key: string, value: unknown, expiry: number) {
    const item = {
      value,
      expiry: expiry ? Date.now() + expiry * 1000 : null,
    };

    return Cache.instance.setItem(key, item);
  }

  static async getItem(key: string) {
    try {
      const item: { value: unknown; expiry: number } | null =
        await Cache.instance.getItem(key);

      if (!item) {
        return null;
      }

      if (item.expiry && Date.now() > item.expiry) {
        await Cache.removeItem(key);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  }

  static async removeItem(key: string) {
    return Cache.instance.removeItem(key);
  }
}
