/**
 * 관리자 로그인 페이지
 *
 * shadcn/ui 컴포넌트를 사용하여 로그인 폼을 제공합니다.
 * 성공 시 /admin으로 리다이렉트되고, 실패 시 에러 메시지가 표시됩니다.
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '로그인 실패');
        return;
      }

      // 성공 시 /admin으로 리다이렉트
      router.push('/admin');
    } catch (err) {
      setError('요청 처리 중 오류가 발생했습니다.');
      console.error('[Login] 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-slate-950">
      <Card className="w-full max-w-md border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            관리자 로그인
          </CardTitle>
          <CardDescription className="text-center">
            코리아 둘레길 기록 블로그 관리자 전용
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 에러 메시지 */}
            {error && (
              <Alert
                variant="destructive"
                className="border-red-200 dark:border-red-900"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 패스워드 입력 */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                패스워드
              </label>
              <Input
                id="password"
                type="password"
                placeholder="패스워드를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="border-slate-300 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>

            {/* 안내 문구 */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              관리자 패스워드가 필요합니다
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
