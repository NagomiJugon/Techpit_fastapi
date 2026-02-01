import { ReactNode } from "react";

// Docker環境でのバックエンド通信: コンテナ内のブラウザからみると、demo-appコンテナは demo-app:8000 でアクセス可能
// ただし、ブラウザからみえる場合はlocalhost:8000でも接続できます
export const API_URL = (() => {
  // 環境変数があれば優先
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // ブラウザの現在地とは関係なく、ホスト:8000でアクセス
  return 'http://localhost:8000';
})();

export type LayoutProps = {
    children: ReactNode;
};

export enum ActionTypes {
    fetch = 'FETCHING',
    success = 'FETCH_SUCCESS',
    error = 'FETCH_ERROR'
};

export enum RequestStates {
    idle = 'IDLE',
    loading = 'LOADING',
    success = 'SUCCESS',
    error = 'ERROR'
};
