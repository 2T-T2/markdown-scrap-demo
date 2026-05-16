/**
 * @typedef {import("../../types/MetaData").MetaData} MetaData
 */

/**
 * @returns {Promise<Record<string, MetaData>>>} ページのメタデータ
 */
export default async function fetchMetaData() {
    const response = await fetch(new URL("./../../data/metadata.json", import.meta.url));
    if (!response.ok) {
        if (response.status == 404) {
            return {};
        }
        return {
            "error": {
                "content": "",
                "froms": [],
                "links": [],
                "updated": 0,
                "created": 0
            }
        };
    }
    return response.json();
}
