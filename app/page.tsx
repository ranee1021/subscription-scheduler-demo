import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="w-full max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
            정기배송 · 식단표 데모
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8 text-center">
            첫 배송일을 기준으로 스케줄을 만들고, 단계별 식단표를 캘린더로 확인해보세요.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/orders"
              className="group rounded-xl border border-gray-200 bg-gray-50 p-5 hover:border-gray-300 hover:bg-white transition-colors flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  주문 목록
                </h2>
                <p className="text-sm text-gray-600">
                  생성된 주문과 배송/결제 스케줄을 확인합니다.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-gray-900">
                주문 목록 보기
                <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>

            <Link
              href="/products"
              className="group rounded-xl border border-gray-200 bg-gray-50 p-5 hover:border-gray-300 hover:bg-white transition-colors flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  상품 · 주문 데모
                </h2>
                <p className="text-sm text-gray-600">
                  초기/중기 정기배송 상품을 선택해서 주문을 생성합니다.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-gray-900">
                주문하기
                <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>

            <Link
              href="/meal-plan"
              className="group rounded-xl border border-emerald-200 bg-emerald-50 p-5 hover:border-emerald-300 hover:bg-white transition-colors flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-emerald-900 mb-1">
                  식단표 캘린더 데모
                </h2>
                <p className="text-sm text-emerald-800">
                  {"\""}초기{"\""}, {"\""}중기{"\""} 단계를 탭으로 전환하며
                  12월 한 달 식단을 캘린더로 확인합니다.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-emerald-900">
                식단표 바로가기
                <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
