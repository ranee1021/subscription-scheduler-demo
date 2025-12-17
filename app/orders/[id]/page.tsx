export default function OrderDetailPage({
    params,
  }: {
    params: { id: string };
  }) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">정기배송 주문 상세</h1>
        <p className="mt-4 text-sm text-zinc-600">
          주문 ID: {params.id}
        </p>
      </div>
    );
  }  