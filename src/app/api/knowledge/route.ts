import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = 'https://script.google.com/macros/s/AKfycbxY4y46rFKTDrEkoiuW9Yt5e8xIDazntJKmiK2RWccaSb4Lgxe5XsGmTe1cLSaRbl-3/exec';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);

    const response = await axios.get(`${API_URL}?${params.toString()}`);

    // APIレスポンスの構造を確認
    if (response.data && typeof response.data === 'object') {
      return NextResponse.json(response.data);
    } else {
      // データが期待した形式でない場合
      console.error('Unexpected API response structure:', response.data);
      return NextResponse.json({
        success: false,
        data: [],
        error: 'データの形式が不正です'
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      data: [],
      error: 'データの取得に失敗しました'
    }, {
      status: 500
    });
  }
}