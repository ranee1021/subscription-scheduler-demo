import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="w-full max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            정기배송 스케줄링 데모
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            첫 배송일을 기준으로 배송/결제 스케줄을 생성
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              주문 목록 보기
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors font-medium border border-gray-300"
            >
              주문하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
