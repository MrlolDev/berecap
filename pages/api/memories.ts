import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import sharp from 'sharp';

export const config = {
    api: {
        responseLimit: false,
    },
    maxDuration: 300,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let authorization_token = req.body.token;
    let headers = {
        "authorization": "Bearer " + authorization_token,
    }
    return axios.request({
        url: "https://mobile.bereal.com/api" + "/feeds/memories",
        method: "GET",
        headers: headers,
    }).then(
        (response) => {

            res.status(200).json(response.data);
        }
    ).catch(
        (error) => {
            res.status(400).json({ status: "error" });
        }
    )
}

async function fetchImage(url: string): Promise<Buffer | null> {
    try {

        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    } catch (error) {
        return null
    }
}

async function generateImage(primarySrc: string, secondarySrc: string): Promise<string> {
    try {
        // Fetch the secondary image which will serve as the background
        const backgroundBuffer = await fetchImage(secondarySrc);

        // Fetch the primary image
        const overlayBuffer = await fetchImage(primarySrc);
        if (!overlayBuffer || !backgroundBuffer) {
            return "";
        }

        // Composite the primary image over the background
        const compositeImage = await sharp(backgroundBuffer)
            .composite([{ input: overlayBuffer, gravity: 'northwest' }])
            .toBuffer();

        // Convert to base64
        const base64Image = compositeImage.toString('base64');
        return `data:image/webp;base64,${base64Image}`;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

