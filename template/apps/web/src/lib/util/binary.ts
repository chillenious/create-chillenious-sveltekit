export const bufferOrBinaryToBase64 = (obj: any) => {
    if (!obj || !obj.data) return null;

    try {
        // If data has a buffer property (Node.js Buffer-like)
        if (obj.data.buffer) {
            // Convert the buffer object to an array of bytes
            const bufferValues = Object.values(obj.data.buffer);
            // Filter out non-numeric values and convert to bytes
            const bytes = bufferValues.filter((val) => typeof val === 'number');
            // Convert bytes to base64
            return btoa(bytes.map((byte) => String.fromCharCode(byte)).join(''));
        }

        // Handle MongoDB BSON Binary format
        if (obj.data.$binary && obj.data.$binary.base64) {
            return obj.data.$binary.base64;
        }

        return null;
    } catch (e) {
        console.error('Error converting buffer to base64:', e);
        return null;
    }
};
