import { NextResponse } from 'next/server';
 
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_APIKEY || "";

export async function GET(
    req: Request
) {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global', {
            method: 'GET',
            headers: {accept: 'application/json', 'x-cg-demo-api-key': API_KEY}
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return NextResponse.json({ data });
        } catch (error) {
        console.error('Error fetching data from CoinGecko:', error);
        return NextResponse.json({ error: 'Failed to fetch token price' }, { status: 500 });
    }
}